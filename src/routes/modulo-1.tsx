import { createFileRoute } from "@tanstack/react-router";
import { ModuleLayout } from "@/components/ModuleLayout";
import { FruitDataGame } from "@/components/FruitDataGame";

export const Route = createFileRoute("/modulo-1")({
  head: () => ({
    meta: [
      { title: "Módulo 1 · ¿Qué es un dato? — Exploradores de Datos" },
      {
        name: "description",
        content:
          "Misión 1: El Dilema de la Fruta. Aprende qué es un dato, recolecta información y organízala en tablas de frecuencia.",
      },
    ],
  }),
  component: Modulo1,
});

function Modulo1() {
  return (
    <ModuleLayout
      week="Semana 1 · Módulo 1"
      title="¿Qué es un dato?"
      subtitle="Misión 1: El Dilema de la Fruta 🥭"
      dba="DBA 10 · Lectura e interpretación de datos"
      estandar="EBC: clasificar y organizar datos y presentarlos en tablas"
      theoryTitle="Antes de jugar, descubre…"
      theory={[
        {
          icon: "🔎",
          title: "El dato",
          body: "Un dato es una pieza de información que recogemos del mundo: la fruta favorita de un amigo, el color de un carro, la edad de tu mascota.",
        },
        {
          icon: "🎤",
          title: "La encuesta",
          body: "Para recolectar datos hacemos preguntas. Cada respuesta que anotamos es un dato nuevo para nuestra colección.",
        },
        {
          icon: "📋",
          title: "El conteo",
          body: "Con palotes (|||) contamos cuántas veces se repite cada respuesta. Así los datos dejan de ser un desorden y empiezan a contarnos historias.",
        },
      ]}
      missionTitle="El Dilema de la Fruta"
      missionBody="En clase, con tu profe, harán una encuesta de verdad usando un formulario digital para decidir la fruta de la salida pedagógica, y organizarán las respuestas en tablas de frecuencia con una hoja de cálculo."
      missionTools={["📝 Google Forms", "📊 Google Sheets", "🏞️ Salida pedagógica"]}
    >
      <FruitDataGame />
    </ModuleLayout>
  );
}
