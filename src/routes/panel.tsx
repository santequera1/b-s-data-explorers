import { createFileRoute, Link, redirect, useRouter } from "@tanstack/react-router";
import { getPanelData, logout } from "@/lib/api";
import type { ActivityRecord } from "@/lib/server/store";

export const Route = createFileRoute("/panel")({
  loader: async () => {
    const data = await getPanelData();
    if (!data) throw redirect({ to: "/ingresar" });
    return data;
  },
  head: () => ({
    meta: [{ title: "Panel Docente — Exploradores de Datos" }],
  }),
  component: PanelPage,
});

const ACTIVIDADES: { id: string; label: string; icon: string }[] = [
  { id: "modulo-1", label: "M1 · Datos", icon: "🥭" },
  { id: "modulo-2", label: "M2 · Gráficos", icon: "🏪" },
  { id: "modulo-3", label: "M3 · Moda", icon: "🧃" },
  { id: "reto-moneda", label: "Azar · Moneda", icon: "🪙" },
  { id: "reto-ruleta", label: "Azar · Ruleta", icon: "🎡" },
];

function fechaCorta(iso?: string) {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleDateString("es-CO", { day: "2-digit", month: "short" });
}

function PanelPage() {
  const data = Route.useLoaderData();
  const router = useRouter();

  const filas = data.estudiantes.map((e) => {
    const completadas = ACTIVIDADES.filter((a) => e.actividades[a.id]).length;
    const notas = ACTIVIDADES.map((a) => e.actividades[a.id]?.nota).filter(
      (n): n is number => n !== undefined
    );
    const promedio = notas.length
      ? Math.round(notas.reduce((s, n) => s + n, 0) / notas.length)
      : null;
    return { ...e, completadas, promedio, pct: Math.round((completadas / ACTIVIDADES.length) * 100) };
  });

  const totalActivos = filas.filter((f) => f.completadas > 0).length;

  function exportarCSV() {
    const head = [
      "Estudiante",
      "Usuario",
      ...ACTIVIDADES.map((a) => `${a.label} (nota)`),
      ...ACTIVIDADES.map((a) => `${a.label} (intentos)`),
      "Actividades completadas",
      "Progreso %",
      "Promedio",
    ];
    const rows = filas.map((f) => [
      f.nombre,
      f.usuario,
      ...ACTIVIDADES.map((a) => f.actividades[a.id]?.nota ?? ""),
      ...ACTIVIDADES.map((a) => f.actividades[a.id]?.intentos ?? ""),
      f.completadas,
      f.pct,
      f.promedio ?? "",
    ]);
    const csv = [head, ...rows]
      .map((r) => r.map((c) => `"${String(c).replaceAll('"', '""')}"`).join(";"))
      .join("\n");
    const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `calificaciones-exploradores-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  async function salir() {
    await logout();
    router.navigate({ to: "/" });
  }

  return (
    <main className="bg-paper min-h-screen">
      <header className="mx-auto max-w-7xl px-6 pt-6 pb-4 flex items-center justify-between gap-3 flex-wrap">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-institutional-deep hover:text-coral transition-colors"
        >
          ← Inicio
        </Link>
        <div className="flex items-center gap-3">
          <span className="rounded-full bg-white border-2 border-institutional/15 px-4 py-1.5 text-sm font-bold text-institutional-deep">
            👩‍🏫 {data.docente}
          </span>
          <button
            onClick={salir}
            className="text-xs font-semibold text-muted-foreground hover:text-coral transition-colors"
          >
            Salir
          </button>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 pb-6">
        <p className="text-sm font-semibold tracking-widest uppercase text-turquoise">
          Panel docente · Calificaciones
        </p>
        <h1 className="mt-1 text-3xl md:text-4xl font-display font-bold text-institutional-deep">
          Seguimiento del grupo 3°
        </h1>

        <div className="mt-5 grid gap-4 sm:grid-cols-3 max-w-2xl">
          <div className="card-soft p-4 text-center">
            <div className="font-display font-bold text-3xl text-institutional">{filas.length}</div>
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Estudiantes
            </div>
          </div>
          <div className="card-soft p-4 text-center">
            <div className="font-display font-bold text-3xl text-turquoise">{totalActivos}</div>
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Han jugado
            </div>
          </div>
          <div className="card-soft p-4 text-center">
            <div className="font-display font-bold text-3xl text-coral">
              {filas.filter((f) => f.pct === 100).length}
            </div>
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Completaron todo
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <button onClick={exportarCSV} className="btn-primary">
            📥 Exportar a Excel (CSV)
          </button>
          <a
            href="https://docs.google.com/forms/d/e/1FAIpQLSefcumlUjoAoY45Lf92d0Buz4w21pqjUsX_XtIhjuYI1uFaeA/viewform"
            target="_blank"
            rel="noreferrer"
            className="btn-secondary"
          >
            📱 Encuesta TIC (Google Forms)
          </a>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-16">
        <div className="card-soft overflow-x-auto">
          <table className="w-full text-sm min-w-[760px]">
            <thead>
              <tr className="bg-institutional text-white">
                <th className="text-left px-4 py-3 font-display">Estudiante</th>
                {ACTIVIDADES.map((a) => (
                  <th key={a.id} className="px-2 py-3 text-center font-display whitespace-nowrap">
                    {a.icon} {a.label}
                  </th>
                ))}
                <th className="px-3 py-3 text-center font-display">Progreso</th>
                <th className="px-3 py-3 text-center font-display">Prom.</th>
              </tr>
            </thead>
            <tbody>
              {filas.map((f, i) => (
                <tr key={f.usuario} className={i % 2 ? "bg-cream/60" : "bg-white"}>
                  <td className="px-4 py-2.5">
                    <div className="font-semibold text-institutional-deep leading-tight">
                      {f.nombre}
                    </div>
                    <div className="text-xs text-muted-foreground">{f.usuario}</div>
                  </td>
                  {ACTIVIDADES.map((a) => {
                    const rec: ActivityRecord | undefined = f.actividades[a.id];
                    return (
                      <td key={a.id} className="px-2 py-2.5 text-center">
                        {rec ? (
                          <div>
                            <span
                              className={`inline-block rounded-full px-2.5 py-0.5 font-bold text-xs ${
                                rec.nota >= 80
                                  ? "bg-turquoise/20 text-institutional-deep"
                                  : rec.nota >= 60
                                    ? "bg-gold/30 text-institutional-deep"
                                    : "bg-coral/15 text-coral"
                              }`}
                            >
                              {rec.nota}
                            </span>
                            <div className="text-[10px] text-muted-foreground mt-0.5">
                              {rec.intentos} {rec.intentos === 1 ? "intento" : "intentos"} ·{" "}
                              {fechaCorta(rec.fecha)}
                            </div>
                          </div>
                        ) : (
                          <span className="text-muted-foreground/40">—</span>
                        )}
                      </td>
                    );
                  })}
                  <td className="px-3 py-2.5">
                    <div className="flex items-center gap-2 justify-center">
                      <div className="w-16 h-2.5 rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-turquoise to-coral"
                          style={{ width: `${f.pct}%` }}
                        />
                      </div>
                      <span className="text-xs font-bold text-institutional-deep w-9">
                        {f.pct}%
                      </span>
                    </div>
                  </td>
                  <td className="px-3 py-2.5 text-center font-display font-bold text-institutional-deep">
                    {f.promedio ?? "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          La nota de cada actividad es la mejor obtenida por el estudiante (0–100, descuenta
          errores durante el juego). Las respuestas de la encuesta TIC se consultan en Google
          Forms.
        </p>
      </section>
    </main>
  );
}
