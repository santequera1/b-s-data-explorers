import { createFileRoute, Link, redirect, useRouter } from "@tanstack/react-router";
import { getPanelData, logout, type DiagnosticoIntento, type Momento } from "@/lib/api";
import type { ActivityRecord } from "@/lib/server/store";
import { DIMENSIONES, ITEMS, type Dimension } from "@/lib/diagnostico-data";

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
  { id: "diag-lectura", label: "Diag. Lectura", icon: "🧭" },
  { id: "tutor-tutor_reto_1", label: "IA · Reto 1", icon: "💡" },
  { id: "tutor-tutor_reto_2", label: "IA · Reto 2", icon: "🤖" },
  { id: "tutor-tutor_reto_3", label: "IA · Reto 3", icon: "🌱" },
  { id: "eval-formativa-lectura", label: "Examen Lectura", icon: "📝" },
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
      (n): n is number => n !== undefined,
    );
    const promedio = notas.length
      ? Math.round(notas.reduce((s, n) => s + n, 0) / notas.length)
      : null;
    return {
      ...e,
      completadas,
      promedio,
      pct: Math.round((completadas / ACTIVIDADES.length) * 100),
    };
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
          La nota de cada actividad es la mejor obtenida por el estudiante (0–100, descuenta errores
          durante el juego). Las respuestas de la encuesta TIC se consultan en Google Forms.
        </p>
      </section>

      <SeccionDiagnostico estudiantes={data.estudiantes} />
    </main>
  );
}

/* ---------- Sección: Prueba diagnóstica ---------- */

type EstudianteConDiagnostico = {
  usuario: string;
  nombre: string;
  diagnostico: Partial<Record<Momento, DiagnosticoIntento>>;
};

function pct(ok: number, total: number) {
  return total === 0 ? 0 : Math.round((ok / total) * 100);
}

function CeldaMomento({ intento }: { intento?: DiagnosticoIntento }) {
  if (!intento) return <span className="text-muted-foreground/40">—</span>;
  const t = intento.evaluacion.total;
  const p = pct(t.ok, t.total);
  return (
    <div>
      <span
        className={`inline-block rounded-full px-2.5 py-0.5 font-bold text-xs ${
          p >= 80
            ? "bg-turquoise/20 text-institutional-deep"
            : p >= 60
              ? "bg-gold/30 text-institutional-deep"
              : "bg-coral/15 text-coral"
        }`}
      >
        {p}%
      </span>
      <div className="text-[10px] text-muted-foreground mt-0.5">
        {(["d1", "d2", "d3"] as Dimension[])
          .map((d) => {
            const dim = intento.evaluacion.porDimension[d];
            return `${d.toUpperCase()} ${pct(dim.ok, dim.total)}`;
          })
          .join(" · ")}
      </div>
    </div>
  );
}

function SeccionDiagnostico({ estudiantes }: { estudiantes: EstudianteConDiagnostico[] }) {
  const presentaronPre = estudiantes.filter((e) => e.diagnostico.pre);
  const presentaronPost = estudiantes.filter((e) => e.diagnostico.post);

  const itemsEvaluables = ITEMS.filter((i) => !i.abierta);

  function aciertoPorItem(momento: Momento) {
    const presentes = estudiantes.filter((e) => e.diagnostico[momento]);
    return itemsEvaluables.map((item) => {
      const ok = presentes.filter((e) => e.diagnostico[momento]!.evaluacion.porItem[item.n]).length;
      return {
        n: item.n,
        dim: item.dim,
        pct: presentes.length ? Math.round((ok / presentes.length) * 100) : null,
      };
    });
  }

  const itemsPre = aciertoPorItem("pre");
  const itemsPost = aciertoPorItem("post");

  function exportarDiagnosticoCSV() {
    const head = [
      "Estudiante",
      "Usuario",
      ...(["pre", "post"] as Momento[]).flatMap((m) => [
        `${m} fecha`,
        `${m} total %`,
        `${m} D1 %`,
        `${m} D2 %`,
        `${m} D3 %`,
        ...itemsEvaluables.map((i) => `${m} item ${i.n}`),
        `${m} resp. 19`,
        `${m} resp. 24`,
      ]),
    ];
    const rows = estudiantes.map((e) => [
      e.nombre,
      e.usuario,
      ...(["pre", "post"] as Momento[]).flatMap((m) => {
        const d = e.diagnostico[m];
        if (!d) return ["", "", "", "", "", ...itemsEvaluables.map(() => ""), "", ""];
        return [
          d.fecha.slice(0, 10),
          pct(d.evaluacion.total.ok, d.evaluacion.total.total),
          ...(["d1", "d2", "d3"] as Dimension[]).map((dim) =>
            pct(d.evaluacion.porDimension[dim].ok, d.evaluacion.porDimension[dim].total),
          ),
          ...itemsEvaluables.map((i) => (d.evaluacion.porItem[i.n] ? 1 : 0)),
          d.abiertas.i19,
          d.abiertas.i24,
        ];
      }),
    ]);
    const csv = [head, ...rows]
      .map((r) => r.map((c) => `"${String(c).replaceAll('"', '""')}"`).join(";"))
      .join("\n");
    const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `diagnostico-exploradores-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  return (
    <section className="mx-auto max-w-7xl px-6 pb-16">
      <div className="flex items-end justify-between flex-wrap gap-3 mb-4">
        <div>
          <p className="text-sm font-semibold tracking-widest uppercase text-turquoise">
            Prueba diagnóstica · «¡Exploradores de Datos!»
          </p>
          <h2 className="mt-1 text-2xl md:text-3xl font-display font-bold text-institutional-deep">
            Resultados pre-test y post-test
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Presentaron: <strong>{presentaronPre.length}</strong> la prueba inicial ·{" "}
            <strong>{presentaronPost.length}</strong> la prueba final. Enlace para compartir la
            prueba final:{" "}
            <code className="bg-institutional/10 rounded px-1.5 py-0.5 text-xs">
              /prueba-diagnostica?momento=post
            </code>
          </p>
        </div>
        <button onClick={exportarDiagnosticoCSV} className="btn-primary">
          📥 Exportar diagnóstico (CSV)
        </button>
      </div>

      <div className="card-soft overflow-x-auto">
        <table className="w-full text-sm min-w-[680px]">
          <thead>
            <tr className="bg-institutional text-white">
              <th className="text-left px-4 py-3 font-display">Estudiante</th>
              <th className="px-3 py-3 text-center font-display">🧭 Prueba inicial</th>
              <th className="px-3 py-3 text-center font-display">🏁 Prueba final</th>
              <th className="px-3 py-3 text-center font-display">Δ Avance</th>
              <th className="px-3 py-3 text-center font-display">Respuestas abiertas</th>
            </tr>
          </thead>
          <tbody>
            {estudiantes.map((e, i) => {
              const pre = e.diagnostico.pre;
              const post = e.diagnostico.post;
              const delta =
                pre && post
                  ? pct(post.evaluacion.total.ok, post.evaluacion.total.total) -
                    pct(pre.evaluacion.total.ok, pre.evaluacion.total.total)
                  : null;
              return (
                <tr key={e.usuario} className={i % 2 ? "bg-cream/60" : "bg-white"}>
                  <td className="px-4 py-2.5">
                    <div className="font-semibold text-institutional-deep leading-tight">
                      {e.nombre}
                    </div>
                    <div className="text-xs text-muted-foreground">{e.usuario}</div>
                  </td>
                  <td className="px-3 py-2.5 text-center">
                    <CeldaMomento intento={pre} />
                  </td>
                  <td className="px-3 py-2.5 text-center">
                    <CeldaMomento intento={post} />
                  </td>
                  <td className="px-3 py-2.5 text-center font-display font-bold">
                    {delta === null ? (
                      <span className="text-muted-foreground/40">—</span>
                    ) : (
                      <span className={delta >= 0 ? "text-turquoise" : "text-coral"}>
                        {delta > 0 ? "+" : ""}
                        {delta}
                      </span>
                    )}
                  </td>
                  <td className="px-3 py-2.5 text-center">
                    {pre || post ? (
                      <details className="text-left">
                        <summary className="cursor-pointer text-xs font-bold text-coral text-center">
                          Ver ✍️
                        </summary>
                        <div className="mt-2 space-y-2 text-xs text-institutional-deep max-w-56">
                          {(["pre", "post"] as Momento[]).map((m) => {
                            const d = e.diagnostico[m];
                            if (!d) return null;
                            return (
                              <div key={m} className="bg-cream rounded-lg p-2">
                                <div className="font-bold uppercase text-[10px] text-turquoise">
                                  {m === "pre" ? "Inicial" : "Final"}
                                </div>
                                <p>
                                  <strong>19 (ruletas):</strong> {d.abiertas.i19 || "—"}
                                </p>
                                <p>
                                  <strong>24 (aprendizaje):</strong> {d.abiertas.i24 || "—"}
                                </p>
                              </div>
                            );
                          })}
                        </div>
                      </details>
                    ) : (
                      <span className="text-muted-foreground/40">—</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Análisis por ítem */}
      {presentaronPre.length > 0 && (
        <div className="card-soft mt-6 p-5 overflow-x-auto">
          <h3 className="font-display font-bold text-lg text-institutional-deep mb-1">
            📊 Porcentaje de acierto por ítem
          </h3>
          <p className="text-xs text-muted-foreground mb-3">
            D1 = {DIMENSIONES.d1} · D2 = {DIMENSIONES.d2} · D3 = {DIMENSIONES.d3}. Los ítems 19 y 24
            son abiertos (valoración con rúbrica).
          </p>
          <table className="text-xs min-w-[640px]">
            <thead>
              <tr>
                <th className="text-left pr-3 py-1 font-semibold text-muted-foreground">Ítem</th>
                {itemsPre.map((it) => (
                  <th
                    key={it.n}
                    className="px-1.5 py-1 text-center font-bold text-institutional-deep"
                  >
                    {it.n}
                    <div className="text-[9px] font-semibold text-turquoise">
                      {it.dim.toUpperCase()}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="pr-3 py-1 font-semibold text-muted-foreground">Inicial</td>
                {itemsPre.map((it) => (
                  <td key={it.n} className="px-1.5 py-1 text-center">
                    <CeldaPct v={it.pct} />
                  </td>
                ))}
              </tr>
              {presentaronPost.length > 0 && (
                <tr>
                  <td className="pr-3 py-1 font-semibold text-muted-foreground">Final</td>
                  {itemsPost.map((it) => (
                    <td key={it.n} className="px-1.5 py-1 text-center">
                      <CeldaPct v={it.pct} />
                    </td>
                  ))}
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

function CeldaPct({ v }: { v: number | null }) {
  if (v === null) return <span className="text-muted-foreground/40">—</span>;
  return (
    <span
      className={`inline-block min-w-8 rounded px-1 py-0.5 font-bold ${
        v >= 80
          ? "bg-turquoise/20 text-institutional-deep"
          : v >= 50
            ? "bg-gold/30 text-institutional-deep"
            : "bg-coral/15 text-coral"
      }`}
    >
      {v}
    </span>
  );
}
