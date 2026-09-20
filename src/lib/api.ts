import { createServerFn } from "@tanstack/react-start";

const COOKIE = "ava_session";
const COOKIE_OPTS = {
  httpOnly: true,
  sameSite: "lax" as const,
  path: "/",
  maxAge: 60 * 60 * 24 * 30,
};

export type SessionInfo = {
  usuario: string;
  nombre: string;
  rol: "estudiante" | "docente";
} | null;

export const login = createServerFn({ method: "POST" })
  .inputValidator((d: { usuario: string; clave: string }) => d)
  .handler(async ({ data }) => {
    const store = await import("./server/store");
    const { setCookie } = await import("@tanstack/react-start/server");
    const user = store.findUser(data.usuario);
    if (!user || !store.verifyPassword(data.clave, user)) {
      return { ok: false as const };
    }
    const session = { usuario: user.usuario, nombre: user.nombre, rol: user.rol };
    setCookie(COOKIE, store.signSession(session), COOKIE_OPTS);
    return { ok: true as const, ...session };
  });

export const logout = createServerFn({ method: "POST" }).handler(async () => {
  const { deleteCookie } = await import("@tanstack/react-start/server");
  deleteCookie(COOKIE, { path: "/" });
  return { ok: true };
});

export const getSession = createServerFn({ method: "GET" }).handler(
  async (): Promise<SessionInfo> => {
    const store = await import("./server/store");
    const { getCookie } = await import("@tanstack/react-start/server");
    return store.verifySession(getCookie(COOKIE));
  },
);

export const saveProgress = createServerFn({ method: "POST" })
  .inputValidator(
    (d: { actividad: string; nota: number; intentos?: number; detalle?: string }) => d,
  )
  .handler(async ({ data }) => {
    const store = await import("./server/store");
    const { getCookie } = await import("@tanstack/react-start/server");
    const session = store.verifySession(getCookie(COOKIE));
    if (!session || session.rol !== "estudiante") return { ok: false };

    const progress = store.readJson<import("./server/store").ProgressMap>("progress.json", {});
    const mine = progress[session.usuario] ?? {};
    const prev = mine[data.actividad];
    mine[data.actividad] = {
      nota: Math.max(prev?.nota ?? 0, Math.round(data.nota)),
      intentos: (prev?.intentos ?? 0) + 1,
      detalle: data.detalle ?? prev?.detalle,
      fecha: new Date().toISOString(),
    };
    progress[session.usuario] = mine;
    store.writeJson("progress.json", progress);
    return { ok: true };
  });

export const getMyProgress = createServerFn({ method: "GET" }).handler(async () => {
  const store = await import("./server/store");
  const { getCookie } = await import("@tanstack/react-start/server");
  const session = store.verifySession(getCookie(COOKIE));
  if (!session) return null;
  const progress = store.readJson<import("./server/store").ProgressMap>("progress.json", {});
  const diagnosticos = store.readJson<Record<string, Partial<Record<"pre" | "post", unknown>>>>(
    "diagnosticos.json",
    {},
  );
  const mine = diagnosticos[session.usuario] ?? {};
  return {
    session,
    actividades: progress[session.usuario] ?? {},
    presentado: { pre: Boolean(mine.pre), post: Boolean(mine.post) },
  };
});

/* ---------- Prueba diagnóstica ---------- */

export type Momento = "pre" | "post";

export type RespuestaValor = string | number | Record<string, string | number>;

export type DiagnosticoIntento = {
  fecha: string;
  respuestas: Record<string, RespuestaValor>;
  abiertas: { i19: string; i24: string };
  evaluacion: import("./diagnostico-data").Evaluacion;
  intentosExtra: number;
};

type DiagnosticoMap = Record<string, Partial<Record<Momento, DiagnosticoIntento>>>;

export const saveDiagnostico = createServerFn({ method: "POST" })
  .inputValidator(
    (d: {
      momento: Momento;
      respuestas: Record<string, RespuestaValor>;
      abiertas: { i19: string; i24: string };
    }) => d,
  )
  .handler(async ({ data }) => {
    const store = await import("./server/store");
    const { evaluar } = await import("./diagnostico-data");
    const { getCookie } = await import("@tanstack/react-start/server");
    const session = store.verifySession(getCookie(COOKIE));
    if (!session || session.rol !== "estudiante") {
      return { ok: false as const, motivo: "sin-sesion" as const };
    }
    const momento: Momento = data.momento === "post" ? "post" : "pre";
    const all = store.readJson<DiagnosticoMap>("diagnosticos.json", {});
    const mine = all[session.usuario] ?? {};
    const previo = mine[momento];
    if (previo) {
      // El primer intento es el válido metodológicamente; los demás solo se cuentan.
      previo.intentosExtra += 1;
      all[session.usuario] = mine;
      store.writeJson("diagnosticos.json", all);
      return { ok: true as const, yaExistia: true as const };
    }
    mine[momento] = {
      fecha: new Date().toISOString(),
      respuestas: data.respuestas,
      abiertas: {
        i19: String(data.abiertas.i19 ?? "").slice(0, 1000),
        i24: String(data.abiertas.i24 ?? "").slice(0, 1000),
      },
      evaluacion: evaluar(data.respuestas),
      intentosExtra: 0,
    };
    all[session.usuario] = mine;
    store.writeJson("diagnosticos.json", all);
    return { ok: true as const, yaExistia: false as const };
  });

export const getMyDiagnostico = createServerFn({ method: "GET" }).handler(async () => {
  const store = await import("./server/store");
  const { getCookie } = await import("@tanstack/react-start/server");
  const session = store.verifySession(getCookie(COOKIE));
  if (!session) return null;
  const all = store.readJson<DiagnosticoMap>("diagnosticos.json", {});
  const mine = all[session.usuario] ?? {};
  return {
    session,
    presentado: { pre: Boolean(mine.pre), post: Boolean(mine.post) },
  };
});

export const getPanelData = createServerFn({ method: "GET" }).handler(async () => {
  const store = await import("./server/store");
  const { getCookie } = await import("@tanstack/react-start/server");
  const session = store.verifySession(getCookie(COOKIE));
  if (!session || session.rol !== "docente") return null;
  const users = store.readJson<import("./server/store").User[]>("users.json", []);
  const progress = store.readJson<import("./server/store").ProgressMap>("progress.json", {});
  const diagnosticos = store.readJson<DiagnosticoMap>("diagnosticos.json", {});
  const diagLectura = store.readJson<Record<string, any>>("diagnostico_lectura.json", {});
  const asistencia = store.getAllAttendance();

  return {
    docente: session.nombre,
    estudiantes: users
      .filter((u) => u.rol === "estudiante")
      .map((u) => ({
        usuario: u.usuario,
        nombre: u.nombre,
        activo: u.activo !== false,
        creadoEn: u.creadoEn,
        actividades: progress[u.usuario] ?? {},
        diagnostico: diagnosticos[u.usuario] ?? {},
        diagnosticoLectura: diagLectura[u.usuario] ?? null,
      })),
    asistencia,
  };
});

/* ---------- Módulo Comprensión Lectora e IA ---------- */

export const consultarTutorIA = createServerFn({ method: "POST" })
  .inputValidator((d: { retoId: string; respuesta: string; pistasUsadas?: number }) => d)
  .handler(async ({ data }) => {
    const { evaluarRespuestaConIA } = await import("./ia-tutor");
    const feedback = await evaluarRespuestaConIA(
      data.retoId,
      data.respuesta,
      data.pistasUsadas ?? 0,
    );

    const store = await import("./server/store");
    const { getCookie } = await import("@tanstack/react-start/server");
    const session = store.verifySession(getCookie(COOKIE));
    if (session && session.rol === "estudiante") {
      const progress = store.readJson<import("./server/store").ProgressMap>("progress.json", {});
      const mine = progress[session.usuario] ?? {};
      const key = `tutor-${data.retoId}`;
      const prev = mine[key];
      mine[key] = {
        nota: Math.max(prev?.nota ?? 0, feedback.puntos),
        intentos: (prev?.intentos ?? 0) + 1,
        detalle: `${feedback.nivelLogro} - ${feedback.correcto ? "Superado" : "En andamiaje"}`,
        fecha: new Date().toISOString(),
      };
      progress[session.usuario] = mine;
      store.writeJson("progress.json", progress);
    }
    return feedback;
  });

export const saveDiagnosticoLectura = createServerFn({ method: "POST" })
  .inputValidator(
    (d: {
      respuestas: Record<string, string>;
      desglose: {
        literal: number;
        inferencial: number;
        critico: number;
        total: number;
        porcentaje: number;
      };
      nivelAsignado: "explorador" | "aventurero" | "maestro";
    }) => d,
  )
  .handler(async ({ data }) => {
    const store = await import("./server/store");
    const { getCookie } = await import("@tanstack/react-start/server");
    const session = store.verifySession(getCookie(COOKIE));
    const usuario = session?.usuario || "invitado";
    const diagLectura = store.readJson<Record<string, unknown>>("diagnostico_lectura.json", {});
    diagLectura[usuario] = {
      fecha: new Date().toISOString(),
      nombre: session?.nombre || "Estudiante",
      ...data,
    };
    store.writeJson("diagnostico_lectura.json", diagLectura);

    if (session && session.rol === "estudiante") {
      const progress = store.readJson<import("./server/store").ProgressMap>("progress.json", {});
      const mine = progress[session.usuario] ?? {};
      mine["diag-lectura"] = {
        nota: data.desglose.porcentaje,
        intentos: (mine["diag-lectura"]?.intentos ?? 0) + 1,
        detalle: `Nivel asignado: ${data.nivelAsignado.toUpperCase()} (${data.desglose.total}/10)`,
        fecha: new Date().toISOString(),
      };
      progress[session.usuario] = mine;
      store.writeJson("progress.json", progress);
    }
    return { ok: true, nivelAsignado: data.nivelAsignado };
  });

export const saveEvaluacionLectura = createServerFn({ method: "POST" })
  .inputValidator(
    (d: {
      nota: number;
      desglose: {
        literal: number;
        inferencial: number;
        critico: number;
        total: number;
      };
      respuestas: Record<string, string>;
    }) => d,
  )
  .handler(async ({ data }) => {
    const store = await import("./server/store");
    const { getCookie } = await import("@tanstack/react-start/server");
    const session = store.verifySession(getCookie(COOKIE));
    if (session && session.rol === "estudiante") {
      const progress = store.readJson<import("./server/store").ProgressMap>("progress.json", {});
      const mine = progress[session.usuario] ?? {};
      mine["eval-formativa-lectura"] = {
        nota: data.nota,
        intentos: (mine["eval-formativa-lectura"]?.intentos ?? 0) + 1,
        detalle: `L: ${data.desglose.literal}/4 · I: ${data.desglose.inferencial}/4 · C: ${data.desglose.critico}/2`,
        fecha: new Date().toISOString(),
      };
      progress[session.usuario] = mine;
      store.writeJson("progress.json", progress);
    }
    return { ok: true };
  });

/* ---------- Administración de Estudiantes (Docente) ---------- */

export const crearEstudiante = createServerFn({ method: "POST" })
  .inputValidator((d: { nombre: string; usuario: string; clave: string }) => d)
  .handler(async ({ data }) => {
    const store = await import("./server/store");
    const { getCookie } = await import("@tanstack/react-start/server");
    const session = store.verifySession(getCookie(COOKIE));
    if (!session || session.rol !== "docente") {
      return { ok: false, error: "No autorizado. Se requiere sesión docente." };
    }
    try {
      const user = store.createUser(data.usuario, data.nombre, data.clave, "estudiante");
      return { ok: true, usuario: user.usuario, nombre: user.nombre };
    } catch (e: any) {
      return { ok: false, error: e.message || "Error al crear estudiante." };
    }
  });

export const actualizarEstudiante = createServerFn({ method: "POST" })
  .inputValidator(
    (d: { usuario: string; nombre?: string; clave?: string; activo?: boolean }) => d,
  )
  .handler(async ({ data }) => {
    const store = await import("./server/store");
    const { getCookie } = await import("@tanstack/react-start/server");
    const session = store.verifySession(getCookie(COOKIE));
    if (!session || session.rol !== "docente") {
      return { ok: false, error: "No autorizado. Se requiere sesión docente." };
    }
    try {
      const user = store.updateUser(data.usuario, {
        nombre: data.nombre,
        clave: data.clave,
        activo: data.activo,
      });
      return { ok: true, usuario: user.usuario, nombre: user.nombre, activo: user.activo };
    } catch (e: any) {
      return { ok: false, error: e.message || "Error al actualizar estudiante." };
    }
  });

export const eliminarEstudiante = createServerFn({ method: "POST" })
  .inputValidator((d: { usuario: string }) => d)
  .handler(async ({ data }) => {
    const store = await import("./server/store");
    const { getCookie } = await import("@tanstack/react-start/server");
    const session = store.verifySession(getCookie(COOKIE));
    if (!session || session.rol !== "docente") {
      return { ok: false, error: "No autorizado. Se requiere sesión docente." };
    }
    try {
      const ok = store.deleteUser(data.usuario);
      return { ok };
    } catch (e: any) {
      return { ok: false, error: e.message || "Error al eliminar estudiante." };
    }
  });

/* ---------- Control de Asistencia (Docente) ---------- */

export const guardarAsistenciaDia = createServerFn({ method: "POST" })
  .inputValidator(
    (d: {
      fecha: string;
      tema?: string;
      registros: Record<
        string,
        {
          estado: import("./server/store").EstadoAsistencia;
          observacion?: string;
        }
      >;
    }) => d,
  )
  .handler(async ({ data }) => {
    const store = await import("./server/store");
    const { getCookie } = await import("@tanstack/react-start/server");
    const session = store.verifySession(getCookie(COOKIE));
    if (!session || session.rol !== "docente") {
      return { ok: false, error: "No autorizado. Se requiere sesión docente." };
    }
    try {
      const res = store.saveAttendance(data.fecha, data.registros, data.tema);
      return { ok: true, dia: res };
    } catch (e: any) {
      return { ok: false, error: e.message || "Error al guardar asistencia." };
    }
  });

/* ---------- Calificación Manual / Observaciones (Docente) ---------- */

export const asignarCalificacionDocente = createServerFn({ method: "POST" })
  .inputValidator(
    (d: {
      usuario: string;
      actividadId: string;
      nota: number;
      observacion?: string;
    }) => d,
  )
  .handler(async ({ data }) => {
    const store = await import("./server/store");
    const { getCookie } = await import("@tanstack/react-start/server");
    const session = store.verifySession(getCookie(COOKIE));
    if (!session || session.rol !== "docente") {
      return { ok: false, error: "No autorizado. Se requiere sesión docente." };
    }
    try {
      const res = store.setActivityGrade(
        data.usuario,
        data.actividadId,
        data.nota,
        data.observacion,
      );
      return { ok: true, registro: res };
    } catch (e: any) {
      return { ok: false, error: e.message || "Error al asignar calificación." };
    }
  });

