import { createFileRoute, Link } from "@tanstack/react-router";
import { AutomatedQuiz } from "@/components/AutomatedQuiz";
import { DIAGNOSTICO_INICIAL_PREGUNTAS } from "@/lib/lectura-data";

export const Route = createFileRoute("/diagnostico-lectura")({
  head: () => ({
    meta: [
      { title: "Diagnóstico Inicial · Comprensión Lectora con IA — I.E. Ciudad de Tunja" },
      {
        name: "description",
        content:
          "Evaluación diagnóstica automatizada de comprensión lectora (niveles literal, inferencial y crítico) para grado 3° de primaria.",
      },
    ],
  }),
  component: DiagnosticoLecturaPage,
});

function DiagnosticoLecturaPage() {
  return (
    <main className="bg-paper min-h-screen pb-16">
      <header className="mx-auto max-w-5xl px-6 pt-6 pb-4 flex items-center justify-between">
        <Link
          to="/lectura"
          className="inline-flex items-center gap-2 text-sm font-semibold text-institutional-deep hover:text-coral transition-colors"
        >
          ← Volver a Aventura Lectora
        </Link>
        <span className="text-xs font-bold uppercase tracking-wider text-turquoise bg-white px-3 py-1 rounded-full border border-border">
          Fase 1 · Diagnóstico Inicial
        </span>
      </header>

      <section className="mx-auto max-w-4xl px-6 pt-2 pb-6 text-center">
        <div className="text-xs font-bold tracking-widest uppercase text-coral">
          I.E. Ciudad de Tunja · Grado 3°
        </div>
        <h1 className="mt-2 text-3xl md:text-5xl font-display font-bold text-institutional-deep">
          ¡Descubre tu Nivel Lector! 🧭
        </h1>
        <p className="mt-2 text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
          Responde estas 10 preguntas interactivas. El sistema calificará inmediatamente tus
          respuestas y te asignará la versión de lectura ideal para tu ritmo de aprendizaje.
        </p>
      </section>

      <section className="px-4 md:px-6">
        <AutomatedQuiz modo="diagnostico" preguntas={DIAGNOSTICO_INICIAL_PREGUNTAS} />
      </section>
    </main>
  );
}
