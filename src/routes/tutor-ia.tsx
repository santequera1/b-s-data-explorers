import { createFileRoute, Link } from "@tanstack/react-router";
import { ReadingTutorChat } from "@/components/ReadingTutorChat";

export const Route = createFileRoute("/tutor-ia")({
  head: () => ({
    meta: [
      { title: "Tutoría Socrática con IA · Bú te guía — I.E. Ciudad de Tunja" },
      {
        name: "description",
        content:
          "Práctica guiada de comprensión lectora con tutor inteligente de IA: preguntas socráticas y pistas progresivas para grado 3°.",
      },
    ],
  }),
  component: TutorIAPage,
});

function TutorIAPage() {
  return (
    <main className="bg-paper min-h-screen pb-16">
      <header className="mx-auto max-w-5xl px-6 pt-6 pb-4 flex items-center justify-between">
        <Link
          to="/lectura"
          className="inline-flex items-center gap-2 text-sm font-semibold text-institutional-deep hover:text-coral transition-colors"
        >
          ← Volver a Aventura Lectora
        </Link>
        <div className="flex items-center gap-2">
          <Link
            to="/lectura-adaptativa"
            className="text-xs font-semibold text-muted-foreground hover:text-coral transition-colors"
          >
            📖 Releer texto
          </Link>
          <span className="text-xs font-bold uppercase tracking-wider text-turquoise bg-white px-3 py-1 rounded-full border border-border">
            Fase 3 · Tutoría con IA
          </span>
        </div>
      </header>

      <section className="mx-auto max-w-4xl px-6 pt-2 pb-4 text-center">
        <h1 className="text-3xl md:text-5xl font-display font-bold text-institutional-deep">
          Práctica Guiada con la Tutora IA 🦉
        </h1>
        <p className="mt-2 text-base text-muted-foreground max-w-2xl mx-auto">
          Responde a las preguntas de Bú. Si necesitas orientación, solicita pistas socráticas para
          reflexionar antes de formular tu respuesta final.
        </p>
      </section>

      <section className="px-4 md:px-6">
        <ReadingTutorChat />
      </section>
    </main>
  );
}
