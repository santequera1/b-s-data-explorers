// Utilidades de servidor: almacenamiento JSON en disco, hash de claves y
// firma de sesiones. Este módulo solo debe importarse dentro de handlers de
// server functions (con import dinámico) — nunca desde código de cliente.
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const DATA_DIR = path.join(process.cwd(), "data");

function ensureDir() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
}

export function readJson<T>(name: string, fallback: T): T {
  ensureDir();
  const file = path.join(DATA_DIR, name);
  try {
    return JSON.parse(fs.readFileSync(file, "utf-8")) as T;
  } catch {
    return fallback;
  }
}

export function writeJson(name: string, value: unknown) {
  ensureDir();
  const file = path.join(DATA_DIR, name);
  const tmp = file + ".tmp";
  fs.writeFileSync(tmp, JSON.stringify(value, null, 2), "utf-8");
  fs.renameSync(tmp, file);
}

/* ---------- Tipos ---------- */

export type User = {
  usuario: string;
  nombre: string;
  rol: "estudiante" | "docente";
  salt: string;
  hash: string;
  activo?: boolean;
  creadoEn?: string;
};

export type ActivityRecord = {
  nota: number;
  notaManual?: number;
  intentos: number;
  detalle?: string;
  observacionDocente?: string;
  fecha: string;
  fechaCalificacion?: string;
};

export type ProgressMap = Record<string, Record<string, ActivityRecord>>;

export type Session = { usuario: string; nombre: string; rol: "estudiante" | "docente" };

export type EstadoAsistencia = "presente" | "ausente" | "excusa" | "retardo";

export type RegistroEstudianteAsistencia = {
  estado: EstadoAsistencia;
  observacion?: string;
  hora?: string;
};

export type AsistenciaDia = {
  fecha: string;
  tema?: string;
  registros: Record<string, RegistroEstudianteAsistencia>;
};

export type AsistenciaMap = Record<string, AsistenciaDia>;

/* ---------- Claves y sesiones ---------- */

function getSecret(): Buffer {
  ensureDir();
  const file = path.join(DATA_DIR, "secret.key");
  if (!fs.existsSync(file)) {
    fs.writeFileSync(file, crypto.randomBytes(32).toString("hex"), "utf-8");
  }
  return Buffer.from(fs.readFileSync(file, "utf-8").trim(), "hex");
}

export function hashPassword(clave: string, salt: string): string {
  return crypto.scryptSync(clave, salt, 32).toString("hex");
}

export function verifyPassword(clave: string, user: User): boolean {
  if (user.activo === false) return false;
  const h = hashPassword(clave, user.salt);
  const a = Buffer.from(h, "hex");
  const b = Buffer.from(user.hash, "hex");
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

export function signSession(s: Session): string {
  const payload = Buffer.from(JSON.stringify(s), "utf-8").toString("base64url");
  const mac = crypto.createHmac("sha256", getSecret()).update(payload).digest("base64url");
  return `${payload}.${mac}`;
}

export function verifySession(token: string | undefined): Session | null {
  if (!token) return null;
  const [payload, mac] = token.split(".");
  if (!payload || !mac) return null;
  const expected = crypto.createHmac("sha256", getSecret()).update(payload).digest("base64url");
  const a = Buffer.from(mac);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  try {
    return JSON.parse(Buffer.from(payload, "base64url").toString("utf-8")) as Session;
  } catch {
    return null;
  }
}

export function findUser(usuario: string): User | undefined {
  const users = readJson<User[]>("users.json", []);
  const key = usuario.trim().toLowerCase();
  return users.find((u) => u.usuario.toLowerCase() === key);
}

export function listUsers(): User[] {
  return readJson<User[]>("users.json", []);
}

export function createUser(
  usuario: string,
  nombre: string,
  clave: string,
  rol: "estudiante" | "docente" = "estudiante",
): User {
  const users = listUsers();
  const key = usuario.trim().toLowerCase();
  if (users.some((u) => u.usuario.toLowerCase() === key)) {
    throw new Error(`El usuario "${usuario}" ya existe.`);
  }
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = hashPassword(clave, salt);
  const newUser: User = {
    usuario: usuario.trim(),
    nombre: nombre.trim(),
    rol,
    salt,
    hash,
    activo: true,
    creadoEn: new Date().toISOString(),
  };
  users.push(newUser);
  writeJson("users.json", users);
  return newUser;
}

export function updateUser(
  usuario: string,
  updates: { nombre?: string; clave?: string; activo?: boolean },
): User {
  const users = listUsers();
  const key = usuario.trim().toLowerCase();
  const idx = users.findIndex((u) => u.usuario.toLowerCase() === key);
  if (idx === -1) {
    throw new Error(`Usuario "${usuario}" no encontrado.`);
  }
  const user = { ...users[idx] };
  if (updates.nombre !== undefined && updates.nombre.trim()) {
    user.nombre = updates.nombre.trim();
  }
  if (updates.activo !== undefined) {
    user.activo = updates.activo;
  }
  if (updates.clave !== undefined && updates.clave.trim()) {
    user.salt = crypto.randomBytes(16).toString("hex");
    user.hash = hashPassword(updates.clave.trim(), user.salt);
  }
  users[idx] = user;
  writeJson("users.json", users);
  return user;
}

export function deleteUser(usuario: string): boolean {
  const users = listUsers();
  const key = usuario.trim().toLowerCase();
  const idx = users.findIndex((u) => u.usuario.toLowerCase() === key);
  if (idx === -1) return false;
  if (users[idx].rol === "docente") {
    throw new Error("No se puede eliminar la cuenta principal de docente.");
  }
  users.splice(idx, 1);
  writeJson("users.json", users);
  return true;
}

/* ---------- Control de Asistencia ---------- */

export function saveAttendance(
  fecha: string,
  registros: Record<string, RegistroEstudianteAsistencia>,
  tema?: string,
): AsistenciaDia {
  const all = readJson<AsistenciaMap>("asistencia.json", {});
  const existing = all[fecha] || { fecha, registros: {} };
  all[fecha] = {
    fecha,
    tema: tema !== undefined ? tema : existing.tema,
    registros: {
      ...existing.registros,
      ...registros,
    },
  };
  writeJson("asistencia.json", all);
  return all[fecha];
}

export function getAttendanceDay(fecha: string): AsistenciaDia | null {
  const all = readJson<AsistenciaMap>("asistencia.json", {});
  return all[fecha] ?? null;
}

export function getAllAttendance(): AsistenciaMap {
  return readJson<AsistenciaMap>("asistencia.json", {});
}

/* ---------- Calificaciones Docentes ---------- */

export function setActivityGrade(
  usuario: string,
  actividadId: string,
  notaManual: number,
  observacionDocente?: string,
): ActivityRecord {
  const progress = readJson<ProgressMap>("progress.json", {});
  const mine = progress[usuario] ?? {};
  const prev = mine[actividadId];
  const notaValida = Math.round(Math.min(100, Math.max(0, notaManual)));
  const updated: ActivityRecord = {
    nota: prev?.nota ?? notaValida,
    notaManual: notaValida,
    intentos: prev?.intentos ?? 1,
    detalle: prev?.detalle,
    observacionDocente:
      observacionDocente !== undefined ? observacionDocente : prev?.observacionDocente,
    fecha: prev?.fecha ?? new Date().toISOString(),
    fechaCalificacion: new Date().toISOString(),
  };
  mine[actividadId] = updated;
  progress[usuario] = mine;
  writeJson("progress.json", progress);
  return updated;
}

