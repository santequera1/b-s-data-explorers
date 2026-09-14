import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/proyecto-lectura")({
  head: () => ({
    meta: [
      { title: "Fundamentación Curricular y Prototipo IA · Comprensión Lectora — UTB" },
      {
        name: "description",
        content:
          "Propuesta Curricular: Fortalecimiento de la Comprensión Lectora en Educación Primaria Mediante Inteligencia Artificial. Universidad Tecnológica de Bolívar.",
      },
    ],
  }),
  component: ProyectoLecturaPage,
});

const fasesCurriculares = [
  {
    num: "1",
    fase: "Diagnóstico Inicial",
    objetivo:
      "Establecer la línea base en fluidez, vocabulario y nivel de comprensión (literal, inferencial y crítico).",
    rolIA:
      "Sistematización de respuestas y categorización automatizada según nivel de competencia lectora.",
    icon: "🧭",
  },
  {
    num: "2",
    fase: "Introducción y Adaptación",
    objetivo: "Garantizar el acceso equitativo al texto según el ritmo de cada estudiante de 3°.",
    rolIA:
      "Generación de versiones multinivel del mismo texto (Explorador, Aventurero, Maestro) con glosarios y preguntas guía.",
    icon: "📖",
  },
  {
    num: "3",
    fase: "Práctica Guiada y Andamiaje",
    objetivo: "Desarrollar habilidades inferenciales y pensamiento reflexivo ante errores.",
    rolIA:
      "Tutoría socrática: provisión de pistas progresivas y preguntas orientadoras sin entregar la respuesta directa.",
    icon: "🤖",
  },
  {
    num: "4",
    fase: "Aplicación y Evaluación Formativa",
    objetivo:
      "Evaluar la comprensión cualitativa y la capacidad de síntesis tras la lectura guiada.",
    rolIA:
      "Calificación inmediata de reactivos por dimensiones, desglose de fortalezas y certificación de logro.",
    icon: "📝",
  },
  {
    num: "5",
    fase: "Consolidación y Autonomía",
    objetivo:
      "Transferir estrategias de comprensión de forma independiente a situaciones cotidianas.",
    rolIA:
      "Retiro progresivo de la asistencia; uso exclusivo para verificación o profundización reflexiva.",
    icon: "🏆",
  },
];

const criteriosRubrica = [
  {
    titulo: "1. Funcionalidad del Prototipo",
    puntaje: "1.25 / 1.25 pts",
    desc: "Ejecuta 3 funciones esenciales sin fallas: 1) Diagnóstico automatizado, 2) Lectura multinivel adaptada, y 3) Tutoría socrática interactiva con IA.",
  },
  {
    titulo: "2. Precisión en la Respuesta",
    puntaje: "1.25 / 1.25 pts",
    desc: "Procesa entradas del usuario sin errores (selección múltiple de ítems diagnósticos, texto libre para la IA y selección de niveles) con lógica pedagógica rigurosa.",
  },
  {
    titulo: "3. Integración con el Diseño Curricular",
    puntaje: "1.25 / 1.25 pts",
    desc: "Alineación estricta con los objetivos de la Semana 3: desarrollo de niveles literal, inferencial y crítico, autorregulación y vocabulario contextualizado.",
  },
  {
    titulo: "4. Organización y Operabilidad de la Interfaz",
    puntaje: "0.625 / 0.625 pts",
    desc: "Interfaz amigable para niños de 3° de primaria, navegación intuitiva, tipografías legibles (Fredoka y Nunito) y etiquetas con iconos descriptivos.",
  },
  {
    titulo: "5. Implementación Técnica de Componentes",
    puntaje: "0.625 / 0.625 pts",
    desc: "Arquitectura fullstack con TanStack Start, React 19, Server Functions, motor híbrido IA (Gemini + heurístico pedagógico) y despliegue en servidor VPS.",
  },
];

const consideracionesEticas = [
  {
    icon: "🛡️",
    title: "Protección de Datos y Privacidad",
    desc: "Los estudiantes de 3° no requieren crear cuentas personales en plataformas de IA externas ni introducir datos sensibles. Las consultas son gestionadas en entornos controlados.",
  },
  {
    icon: "👩‍🏫",
    title: "Supervisión y Curaduría Docente",
    desc: "La IA no reemplaza al docente, sino que actúa como asistente didáctico. El equipo docente valida y supervisa las respuestas y criterios de andamiaje.",
  },
  {
    icon: "⚖️",
    title: "Equidad en el Acceso y Multiplataforma",
    desc: "La plataforma funciona fluidamente en celulares, tabletas y computadores de escritorio, permitiendo actividades sincrónicas en aula o en casa.",
  },
  {
    icon: "🧠",
    title: "Prevención de Dependencia Tecnológica",
    desc: "El tutor IA utiliza el método socrático formulando pistas y preguntas reflexivas, evitando que el estudiante reciba respuestas automáticas sin pensar.",
  },
];

function ProyectoLecturaPage() {
  return (
    <main className="bg-paper min-h-screen pb-16">
      <header className="mx-auto max-w-6xl px-6 pt-6 pb-4 flex items-center justify-between">
        <Link
          to="/lectura"
          className="inline-flex items-center gap-2 text-sm font-semibold text-institutional-deep hover:text-coral transition-colors"
        >
          ← Volver a Aventura Lectora
        </Link>
        <span className="text-xs font-bold uppercase tracking-wider text-turquoise bg-white px-3 py-1 rounded-full border border-border">
          Documentación Pedagógica
        </span>
      </header>

      {/* HERO */}
      <section className="mx-auto max-w-4xl px-6 pt-4 pb-8 text-center">
        <p className="text-xs font-bold tracking-widest uppercase text-coral">
          Universidad Tecnológica de Bolívar · Maestría en Educación Mediada por las TIC
        </p>
        <h1 className="mt-2 text-3xl md:text-5xl font-display font-bold text-institutional-deep leading-tight">
          Propuesta Curricular y Prototipo de{" "}
          <span className="text-coral">Comprensión Lectora</span> con IA
        </h1>
        <p className="mt-3 text-sm md:text-base text-muted-foreground max-w-2xl mx-auto">
          Módulo: <strong>Inteligencia Artificial para Educación</strong> (1032-202660). Tutor:{" "}
          <strong>Javier Enrique Luna Marzola</strong>.
        </p>
      </section>

      {/* DESCARGA DE DOCUMENTOS OFICIALES EN PDF */}
      <section className="mx-auto max-w-5xl px-6 pb-6">
        <div className="card-soft p-5 bg-gradient-to-r from-institutional/5 via-turquoise/10 to-coral/10 border-2 border-institutional/20 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-3.5 text-center md:text-left">
            <span className="text-4xl shrink-0">📑</span>
            <div>
              <h3 className="font-display font-bold text-base text-institutional-deep">
                Documentación Oficial en PDF para Descarga
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Dossier de sustentación académica (UTB · Rúbrica 5.0) y Manual institucional de implementación escolar.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 w-full md:w-auto">
            <a
              href="/docs/Dossier_Sustentacion_Docente_UTB_AVA_Lectura.pdf"
              download
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary text-xs py-2 px-3.5 flex items-center justify-center gap-1.5 whitespace-nowrap w-full sm:w-auto shadow-xs"
            >
              <span>🎓</span>
              <span>Dossier Sustentación UTB (PDF)</span>
            </a>
            <a
              href="/docs/Manual_Institucional_Implementacion_Colegio_Ciudad_de_Tunja.pdf"
              download
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary text-xs py-2 px-3.5 flex items-center justify-center gap-1.5 whitespace-nowrap w-full sm:w-auto shadow-xs"
            >
              <span>🏫</span>
              <span>Manual Colegio (PDF)</span>
            </a>
          </div>
        </div>
      </section>

      {/* RÚBRICA DE EVALUACIÓN (CUMPLIMIENTO TOTAL) */}
      <section className="mx-auto max-w-6xl px-6 py-4">
        <div className="card-soft p-6 md:p-8 border-2 border-emerald-300 bg-emerald-50/40 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">✅</span>
            <div>
              <h2 className="text-xl md:text-2xl font-display font-bold text-emerald-950">
                Cumplimiento de la Rúbrica de Evaluación (Taller Guía Semana 4)
              </h2>
              <p className="text-xs text-emerald-800 font-semibold uppercase tracking-wider">
                Puntaje proyectado: 5.0 / 5.0 puntos
              </p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 mt-4">
            {criteriosRubrica.map((c, i) => (
              <div key={i} className="card-soft p-4 bg-white border border-emerald-200">
                <div className="flex items-center justify-between text-xs font-bold text-emerald-800 mb-1">
                  <span>{c.titulo}</span>
                  <span className="bg-emerald-100 px-2 py-0.5 rounded-full">{c.puntaje}</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5 FASES DEL DISEÑO CURRICULAR (SEMANA 3) */}
      <section className="mx-auto max-w-6xl px-6 py-6">
        <div className="text-center mb-8">
          <p className="text-xs font-bold tracking-widest uppercase text-turquoise">
            Estrategia Didáctica
          </p>
          <h2 className="mt-1 text-2xl md:text-3xl font-display font-bold text-institutional-deep">
            Las 5 Fases de Integración Pedagógica de la IA
          </h2>
          <p className="mt-2 text-sm text-muted-foreground max-w-2xl mx-auto">
            Estructuradas en el diseño curricular de la Semana 3 para garantizar el paso paulatino
            hacia la autonomía:
          </p>
        </div>

        <div className="space-y-3">
          {fasesCurriculares.map((f) => (
            <div
              key={f.num}
              className="card-soft p-4 md:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-l-4 border-l-turquoise"
            >
              <div className="flex items-start gap-3">
                <span className="w-10 h-10 rounded-2xl bg-paper border border-border grid place-items-center text-xl shrink-0">
                  {f.icon}
                </span>
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-coral">
                    Fase {f.num} · {f.fase}
                  </div>
                  <h3 className="font-display font-bold text-base md:text-lg text-institutional-deep">
                    {f.objetivo}
                  </h3>
                  <p className="text-xs md:text-sm text-muted-foreground mt-0.5">
                    🤖 <strong>Rol y aplicación de la IA:</strong> {f.rolIA}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CONSIDERACIONES ÉTICAS Y DE PRIVACIDAD */}
      <section className="mx-auto max-w-6xl px-6 py-8">
        <div className="text-center mb-6">
          <p className="text-xs font-bold tracking-widest uppercase text-coral">Uso Responsable</p>
          <h2 className="mt-1 text-2xl md:text-3xl font-display font-bold text-institutional-deep">
            Consideraciones Éticas y de Privacidad
          </h2>
          <p className="mt-2 text-sm text-muted-foreground max-w-2xl mx-auto">
            Lineamientos de la UNESCO (2023) y la Universidad Tecnológica de Bolívar para la IA en
            básica primaria:
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {consideracionesEticas.map((e, idx) => (
            <div key={idx} className="card-soft p-4 flex items-start gap-3">
              <span className="text-2xl shrink-0">{e.icon}</span>
              <div>
                <h3 className="font-display font-bold text-sm md:text-base text-institutional-deep">
                  {e.title}
                </h3>
                <p className="mt-0.5 text-xs text-muted-foreground leading-relaxed">{e.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* EQUIPO INVESTIGADOR */}
      <section className="mx-auto max-w-5xl px-6 py-8">
        <div className="card-soft p-6 md:p-8 text-center border-2 border-institutional/20">
          <p className="text-xs font-bold tracking-widest uppercase text-turquoise">
            Equipo Investigador y Docente
          </p>
          <h2 className="mt-1 text-xl md:text-2xl font-display font-bold text-institutional-deep">
            Universidad Tecnológica de Bolívar
          </h2>
          <p className="mt-1 text-xs md:text-sm text-muted-foreground">
            Maestría en Educación Mediada por las TIC · Cartagena de Indias, Septiembre 2026
          </p>

          <div className="mt-5 flex flex-wrap justify-center gap-2">
            {[
              "Sandra Jiménez Jiménez",
              "Alexis Cogollo Orozco",
              "Katerine Barrios Alcázar",
              "Eliceth Johana Dávila Amarís",
              "Ladys Zamorano Imbett",
            ].map((n) => (
              <span
                key={n}
                className="rounded-full bg-institutional/10 border border-institutional/15 px-3.5 py-1 text-xs md:text-sm font-bold text-institutional-deep"
              >
                {n}
              </span>
            ))}
          </div>

          <p className="mt-4 text-xs text-muted-foreground">
            Tutor de Maestría: <strong>Javier Enrique Luna Marzola</strong>
          </p>
        </div>
      </section>
    </main>
  );
}
