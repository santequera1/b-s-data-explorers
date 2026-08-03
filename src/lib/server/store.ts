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
};

export type ActivityRecord = {
  nota: number;
  intentos: number;
  detalle?: string;
  fecha: string;
};

export type ProgressMap = Record<string, Record<string, ActivityRecord>>;

export type Session = { usuario: string; nombre: string; rol: "estudiante" | "docente" };

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
