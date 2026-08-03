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
  }
);

export const saveProgress = createServerFn({ method: "POST" })
  .inputValidator(
    (d: { actividad: string; nota: number; intentos?: number; detalle?: string }) => d
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
  return { session, actividades: progress[session.usuario] ?? {} };
});

export const getPanelData = createServerFn({ method: "GET" }).handler(async () => {
  const store = await import("./server/store");
  const { getCookie } = await import("@tanstack/react-start/server");
  const session = store.verifySession(getCookie(COOKIE));
  if (!session || session.rol !== "docente") return null;
  const users = store.readJson<import("./server/store").User[]>("users.json", []);
  const progress = store.readJson<import("./server/store").ProgressMap>("progress.json", {});
  return {
    docente: session.nombre,
    estudiantes: users
      .filter((u) => u.rol === "estudiante")
      .map((u) => ({
        usuario: u.usuario,
        nombre: u.nombre,
        actividades: progress[u.usuario] ?? {},
      })),
  };
});
