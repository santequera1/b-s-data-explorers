import { createFileRoute, Link } from "@tanstack/react-router";
import { AutomatedQuiz } from "@/components/AutomatedQuiz";
import { DIAGNOSTICO_INICIAL_PREGUNTAS } from "@/lib/lectura-data";

export const Route = createFileRoute("/evaluacion-formativa")({
  head: () => ({
    meta: [
      { title: "Evaluación Formativa Automatizada · Comprensión Lectora — I.E. Ciudad de Tunja" },
      {
        name: "description",
        content:
          "Evaluación formativa automatizada de comprensión lectora con reporte inmediato de dimensiones literal, inferencial y crítica.",
      },
    ],
  }),
  component: EvaluacionFormativaPage,
});

function EvaluacionFormativaPage() {
  return (
    <main className="bg-paper min-h-screen pb-16">
      <header className="mx-auto max-w-5xl px-6 pt-6 pb-4 flex items-center justify-between">
        <Link
          to="/lectura"
          className="inline-flex items-center gap-2 text-sm font-semibold text-institutional-deep hover:text-coral transition-colors"
        >
          ← Volver a Aventura Lectora
        </Link>
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 font-display">
          Fase 4 · Evaluación Formativa
        </span>
      </header>

      <section className="mx-auto max-w-4xl px-6 pt-2 pb-6 text-center">
        <div className="text-xs font-bold tracking-widest uppercase text-coral">
          I.E. Ciudad de Tunja · Grado 3°
        </div>
        <h1 className="mt-2 text-3xl md:text-5xl font-display font-bold text-institutional-deep">
          Evaluación Formativa de Comprensión 📝
        </h1>
        <p className="mt-2 text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
          Demuestra todo lo que aprendiste tras leer la historia y reflexionar con la tutora IA.
          Obtendrás tu informe pedagógico inmediato y tu certificado de logro.
        </p>
      </section>

      <section className="px-4 md:px-6">
        <AutomatedQuiz modo="formativa" preguntas={DIAGNOSTICO_INICIAL_PREGUNTAS} />
      </section>
    </main>
  );
}
