import { createFileRoute } from "@tanstack/react-router";
import { ModuleLayout } from "@/components/ModuleLayout";
import { ShopChartGame } from "@/components/ShopChartGame";

export const Route = createFileRoute("/modulo-2")({
  head: () => ({
    meta: [
      { title: "Módulo 2 · Tablas y gráficos — Exploradores de Datos" },
      {
        name: "description",
        content:
          "Misión 2: Consultoría en la Tienda Escolar. Construye gráficos de barras y pictogramas con escala a partir de tablas de frecuencia.",
      },
    ],
  }),
  component: Modulo2,
});

function Modulo2() {
  return (
    <ModuleLayout
      week="Semana 2 · Módulo 2"
      title="Tablas de frecuencia y gráficos"
      subtitle="Misión 2: Consultoría en la Tienda Escolar 🏪"
      dba="DBA 10 · Lectura e interpretación de datos"
      estandar="EBC: representar datos con pictogramas y diagramas de barras"
      theoryTitle="Antes de jugar, descubre…"
      theory={[
        {
          icon: "📋",
          title: "La tabla de frecuencia",
          body: "Organiza los datos en filas: cada fila dice cuántas veces apareció cada cosa. Es el primer paso para entender la información.",
        },
        {
          icon: "📊",
          title: "El gráfico de barras",
          body: "Cada barra crece según su frecuencia. La barra más alta gana: ¡así los números se ven de un solo vistazo!",
        },
        {
          icon: "⭐",
          title: "El pictograma con escala",
          body: "Dibujamos símbolos en vez de barras. ¡Ojo! Un símbolo puede valer 2 o más unidades — eso se llama escala, y es el secreto del pictograma.",
        },
      ]}
      missionTitle="Consultoría en la Tienda Escolar"
      missionBody="En clase analizarán el consumo real de bolis, fritos y mangos de la tienda del colegio, y diseñarán sus propios gráficos de barras y pictogramas para presentar los resultados como verdaderos consultores."
      missionTools={["🎨 Canva", "📋 Tablas de conteo", "🏪 Tienda escolar"]}
    >
      <ShopChartGame />
    </ModuleLayout>
  );
}
