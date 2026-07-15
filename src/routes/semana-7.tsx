import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { RouletteExperiment } from "@/components/RouletteExperiment";

type Search = { nombre?: string };

export const Route = createFileRoute("/semana-7")({
  validateSearch: (search: Record<string, unknown>): Search => ({
    nombre: typeof search.nombre === "string" ? search.nombre : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Semana 7 · La Ruleta de la Suerte — Exploradores de Datos" },
      {
        name: "description",
        content:
          "Gira la ruleta de colores con Bú y descubre por qué algunos resultados son más probables que otros.",
      },
      { property: "og:title", content: "Semana 7 · La Ruleta de la Suerte" },
      {
        property: "og:description",
        content: "Módulo interactivo de probabilidad para 3° de primaria.",
      },
    ],
  }),
  component: Semana7,
});

function Semana7() {
  const { nombre } = Route.useSearch();
  const [soundOn, setSoundOn] = useState(true);

  return (
    <main className="bg-paper min-h-screen">
      <header className="mx-auto max-w-5xl px-6 pt-6 pb-4 flex items-center justify-between">
        <Link
          to="/juegos"
          className="inline-flex items-center gap-2 text-sm font-semibold text-institutional-deep hover:text-coral transition-colors"
        >
          ← Volver a los juegos
        </Link>
        <button
          onClick={() => setSoundOn((s) => !s)}
          aria-label={soundOn ? "Silenciar sonidos" : "Activar sonidos"}
          className="w-11 h-11 rounded-full bg-white border-2 border-institutional/15 grid place-items-center text-xl shadow hover:border-coral transition-colors"
        >
          {soundOn ? "🔊" : "🔇"}
        </button>
      </header>

      <section className="mx-auto max-w-5xl px-6 pb-4 text-center">
        <div className="text-xs font-bold tracking-widest uppercase text-coral">
          Semana 7
        </div>
        <h1 className="mt-2 text-3xl md:text-5xl font-display font-bold text-institutional-deep">
          La Ruleta de la Suerte
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          ¿Qué color es más probable? 🎡
        </p>
      </section>

      <section className="px-4 md:px-6 pb-16">
        <RouletteExperiment playerName={nombre} soundOn={soundOn} />
      </section>
    </main>
  );
}
