import { createFileRoute } from "@tanstack/react-router";
import { ModuleLayout } from "@/components/ModuleLayout";
import { JuiceModeGame } from "@/components/JuiceModeGame";

export const Route = createFileRoute("/modulo-3")({
  head: () => ({
    meta: [
      { title: "Módulo 3 · La moda — Exploradores de Datos" },
      {
        name: "description",
        content:
          "Misión 3: El Jugo Estrella. Descubre la moda: el dato que más se repite, y úsala para tomar decisiones.",
      },
    ],
  }),
  component: Modulo3,
});

function Modulo3() {
  return (
    <ModuleLayout
      week="Semana 3 · Módulo 3"
      title="La moda"
      subtitle="Misión 3: El Jugo Estrella 🧃"
      dba="DBA 10 · Identificar la moda en gráficos y tablas"
      estandar="EBC: identificar regularidades y tendencias en un conjunto de datos"
      theoryTitle="Antes de jugar, descubre…"
      theory={[
        {
          icon: "⭐",
          title: "La moda",
          body: "En estadística, la moda es el dato que MÁS se repite en un conjunto. Si 7 amigos votan mango y 3 votan tamarindo, ¡la moda es el mango!",
        },
        {
          icon: "📊",
          title: "Encontrarla en gráficas",
          body: "En un gráfico de barras, la moda es facilísima de ver: es la barra más alta de todas.",
        },
        {
          icon: "🎯",
          title: "Decidir con datos",
          body: "La moda nos ayuda a tomar decisiones: qué jugo vender, qué juego elegir para el recreo, qué cuento leer en clase.",
        },
      ]}
      missionTitle="El Jugo Estrella"
      missionBody="El reto final del aula: identificar la moda de consumo real del salón, experimentar con laboratorios virtuales y construir una narrativa lúdica en Scratch para presentar la decisión del Jugo Estrella."
      missionTools={["🔬 Laboratorios PhET", "🐱 Scratch", "🗳️ Votación real del salón"]}
    >
      <JuiceModeGame />
    </ModuleLayout>
  );
}
