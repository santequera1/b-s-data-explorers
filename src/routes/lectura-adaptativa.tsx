import { createFileRoute, Link } from "@tanstack/react-router";
import { MultiLevelReader } from "@/components/MultiLevelReader";

type Search = { nivel?: "explorador" | "aventurero" | "maestro" };

export const Route = createFileRoute("/lectura-adaptativa")({
  validateSearch: (search: Record<string, unknown>): Search => ({
    nivel:
      search.nivel === "explorador" || search.nivel === "aventurero" || search.nivel === "maestro"
        ? search.nivel
        : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Lectura Adaptativa Multinivel · El Secreto del Manglar — I.E. Ciudad de Tunja" },
      {
        name: "description",
        content:
          "Lectura multinivel adaptada a los ritmos de aprendizaje de grado 3° con glosario interactivo contextualizado en Cartagena.",
      },
    ],
  }),
  component: LecturaAdaptativaPage,
});

function LecturaAdaptativaPage() {
  const { nivel } = Route.useSearch();

  return (
    <main className="bg-paper min-h-screen pb-16">
      <header className="mx-auto max-w-5xl px-6 pt-6 pb-4 flex items-center justify-between">
        <Link
          to="/lectura"
          className="inline-flex items-center gap-2 text-sm font-semibold text-institutional-deep hover:text-coral transition-colors"
        >
          ← Volver a Aventura Lectora
        </Link>
        <span className="text-xs font-bold uppercase tracking-wider text-coral bg-white px-3 py-1 rounded-full border border-border">
          Fase 2 · Lectura Adaptada
        </span>
      </header>

      <section className="px-4 md:px-6 pt-2">
        <MultiLevelReader nivelInicial={nivel || "explorador"} />
      </section>
    </main>
  );
}
