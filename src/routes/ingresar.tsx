import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { BuMascot } from "@/components/BuMascot";
import { login } from "@/lib/api";

export const Route = createFileRoute("/ingresar")({
  head: () => ({
    meta: [
      { title: "Ingresar — Exploradores de Datos" },
      { name: "description", content: "Entra con tu usuario y clave para guardar tu progreso." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState("");
  const [clave, setClave] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!usuario || !clave || loading) return;
    setLoading(true);
    setError(false);
    try {
      const res = await login({ data: { usuario, clave } });
      if (res.ok) {
        navigate({ to: res.rol === "docente" ? "/panel" : "/juegos" });
      } else {
        setError(true);
      }
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="bg-paper min-h-screen">
      <header className="mx-auto max-w-5xl px-6 pt-6">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-institutional-deep hover:text-coral transition-colors"
        >
          ← Volver al inicio
        </Link>
      </header>

      <section className="mx-auto max-w-md px-6 py-10">
        <div className="text-center">
          <BuMascot eager className="w-32 h-auto mx-auto drop-shadow-xl animate-float" />
          <h1 className="mt-4 text-3xl md:text-4xl font-display font-bold text-institutional-deep">
            ¡Hola, explorador!
          </h1>
          <p className="mt-2 text-muted-foreground">
            Escribe tu usuario y tu clave para empezar la aventura y guardar tu progreso.
          </p>
        </div>

        <form onSubmit={submit} className="card-soft p-6 md:p-8 mt-6 space-y-4">
          <div>
            <label
              htmlFor="usuario"
              className="block text-xs font-bold uppercase tracking-widest text-turquoise mb-1"
            >
              👤 Mi usuario
            </label>
            <input
              id="usuario"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              autoComplete="username"
              autoCapitalize="none"
              className="w-full min-h-12 rounded-2xl border-2 border-institutional/15 bg-white px-4 text-lg font-semibold text-institutional-deep focus:border-coral focus:outline-none transition-colors"
              placeholder="Ej: Aguilarj301t"
            />
          </div>
          <div>
            <label
              htmlFor="clave"
              className="block text-xs font-bold uppercase tracking-widest text-turquoise mb-1"
            >
              🔑 Mi clave secreta
            </label>
            <input
              id="clave"
              type="password"
              value={clave}
              onChange={(e) => setClave(e.target.value)}
              autoComplete="current-password"
              className="w-full min-h-12 rounded-2xl border-2 border-institutional/15 bg-white px-4 text-lg font-semibold text-institutional-deep focus:border-coral focus:outline-none transition-colors"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="text-sm font-semibold text-coral animate-bounce-in">
              🙈 Usuario o clave incorrectos. Revisa con tu profe e intenta otra vez.
            </p>
          )}

          <button
            type="submit"
            disabled={loading || !usuario || !clave}
            className="btn-primary w-full text-lg disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Entrando…" : "🚀 ¡Entrar!"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-muted-foreground">
          ¿No tienes usuario? Pídeselo a tu profesor(a). 🦉
        </p>

        <div className="mt-6 pt-4 border-t border-border/60 text-center text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5 font-semibold text-institutional">
            <span>👩‍🏫</span> Acceso Docente: Usa tu usuario y clave para ingresar al Panel de Control.
          </span>
        </div>
      </section>
    </main>
  );
}
