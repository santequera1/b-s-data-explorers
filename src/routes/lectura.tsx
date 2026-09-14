import { createFileRoute, Link } from "@tanstack/react-router";
import { BuMascot } from "@/components/BuMascot";

export const Route = createFileRoute("/lectura")({
  head: () => ({
    meta: [
      { title: "Aventura Lectora con IA · Comprensión Lectora Grado 3° — I.E. Ciudad de Tunja" },
      {
        name: "description",
        content:
          "Ambiente Virtual de Aprendizaje para el fortalecimiento de la comprensión lectora en grado 3° mediante IA. I.E. Ciudad de Tunja (Cartagena).",
      },
    ],
  }),
  component: LecturaLandingPage,
});

type Step = {
  fase: string;
  title: string;
  subtitle: string;
  icon: string;
  badge: string;
  to: string;
  cta: string;
};

const rutaPedagogica: Step[] = [
  {
    fase: "Fase 1 · Diagnóstico",
    title: "Diagnóstico Inicial Automatizado",
    subtitle:
      "Prueba interactiva de 10 reactivos que califica inmediatamente tu nivel (literal, inferencial y crítico).",
    icon: "🧭",
    badge: "Calificación Inmediata",
    to: "/diagnostico-lectura",
    cta: "Iniciar diagnóstico",
  },
  {
    fase: "Fase 2 · Adaptación",
    title: "Lectura Adaptativa Multinivel",
    subtitle:
      "Historia «El Secreto del Manglar» adaptada en 3 niveles con glosario interactivo de Cartagena.",
    icon: "📖",
    badge: "Personalización",
    to: "/lectura-adaptativa",
    cta: "Comenzar a leer",
  },
  {
    fase: "Fase 3 · Andamiaje",
    title: "Práctica Guiada con Tutor IA",
    subtitle:
      "Conversa con Bú: recibe pistas socráticas y retroalimentación inteligente sin respuestas servidas.",
    icon: "🦉",
    badge: "Tutor Socrático IA",
    to: "/tutor-ia",
    cta: "Conversar con la IA",
  },
  {
    fase: "Fase 4 · Evaluación",
    title: "Evaluación Formativa Automatizada",
    subtitle: "Mide tu ganancia de aprendizaje con reporte por dimensiones y certificado de logro.",
    icon: "📝",
    badge: "Reporte y Certificado",
    to: "/evaluacion-formativa",
    cta: "Presentar examen",
  },
];

const schoolFacts = [
  { icon: "🏛️", label: "Carácter", value: "Institución oficial (pública)" },
  { icon: "🎓", label: "Modalidad", value: "Técnica y académica" },
  { icon: "📅", label: "Calendario", value: "Calendario A" },
  { icon: "🏫", label: "Sedes", value: "Sede principal y sede Escilda Medina Pacheco" },
  {
    icon: "📍",
    label: "Ubicación",
    value: "Barrio María Auxiliadora, Camino del Medio · Cartagena",
  },
  { icon: "🧒", label: "Población objetivo", value: "Estudiantes de Grado 3° de Básica Primaria" },
];

function LecturaLandingPage() {
  return (
    <main className="bg-paper min-h-screen">
      {/* NAVBAR */}
      <nav className="sticky top-0 z-40 backdrop-blur bg-white/85 border-b border-border/60">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-2">
          <Link
            to="/lectura"
            className="flex items-center gap-2 font-display font-bold text-institutional-deep text-base sm:text-lg shrink-0"
          >
            <span className="text-xl sm:text-2xl">🦉</span>
            <span>
              Aventura Lectora <span className="text-coral text-xs sm:text-sm">con IA</span>
            </span>
          </Link>
          <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm font-semibold">
            <Link
              to="/"
              className="px-2.5 py-1.5 rounded-full text-muted-foreground hover:text-institutional-deep hover:bg-paper transition-colors hidden md:inline-block"
            >
              ← Portal General
            </Link>
            <a
              href="#ruta"
              className="px-2.5 py-1.5 rounded-full text-institutional-deep hover:bg-institutional/10 transition-colors hidden sm:inline-block"
            >
              Ruta
            </a>
            <Link
              to="/lectura-adaptativa"
              className="px-2.5 py-1.5 rounded-full text-institutional-deep hover:bg-institutional/10 transition-colors hidden sm:inline-block"
            >
              Lectura
            </Link>
            <Link
              to="/tutor-ia"
              className="px-2.5 py-1.5 rounded-full text-coral hover:bg-coral/10 transition-colors font-bold"
            >
              🤖 Tutor IA
            </Link>
            <Link
              to="/proyecto-lectura"
              className="px-2.5 py-1.5 rounded-full text-institutional-deep hover:bg-institutional/10 transition-colors"
            >
              El Proyecto
            </Link>
            <Link
              to="/ingresar"
              className="ml-1 inline-flex items-center gap-1 rounded-full border-2 border-institutional text-institutional px-3 py-1 font-bold hover:bg-institutional hover:text-white transition-colors text-xs"
            >
              🔑 Ingresar
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO COMPACTO Y OPTIMIZADO (VISIBLE SIN SCROLL) */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white/70 via-paper to-paper border-b border-border/40">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 pt-4 pb-6 sm:pt-6 sm:pb-8 lg:pt-8 lg:pb-10">
          <div className="grid md:grid-cols-12 gap-6 items-center">
            {/* COLUMNA IZQUIERDA: TEXTO Y ACCIONES */}
            <div className="md:col-span-7 lg:col-span-8 flex flex-col justify-center">
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-[11px] sm:text-xs font-bold text-institutional border border-institutional/20 shadow-xs">
                  <span>🏫</span> I.E. Ciudad de Tunja · Sede Escilda Medina Pacheco · Grado 3°
                </span>
              </div>

              {/* TÍTULO REORGANIZADO EN 2-3 LÍNEAS LIMPIAS */}
              <h1 className="mt-2 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-bold text-institutional-deep leading-tight">
                Comprensión Lectora <span className="text-coral">con Inteligencia Artificial</span>
              </h1>

              {/* PÁRRAFO SINTÉTICO */}
              <p className="mt-2 text-xs sm:text-sm md:text-base text-muted-foreground max-w-xl leading-relaxed">
                Ambiente Virtual de Aprendizaje (AVA) para grado 3°. Fortalece tu lectura a tu
                propio ritmo con <strong>lecturas multinivel</strong>,{" "}
                <strong>evaluaciones automatizadas</strong> y un <strong>tutor socrático</strong>{" "}
                que te guía con pistas en tiempo real.
              </p>

              {/* BOTONES SIEMPRE VISIBLES JUNTOS */}
              <div className="mt-4 sm:mt-5 flex flex-wrap sm:flex-nowrap items-center gap-2.5">
                <Link
                  to="/diagnostico-lectura"
                  className="btn-primary text-xs sm:text-sm py-2.5 px-4 shadow-md flex items-center justify-center gap-2 whitespace-nowrap w-full sm:w-auto"
                >
                  <span>🧭</span>
                  <span>Iniciar Diagnóstico Automatizado</span>
                </Link>
                <Link
                  to="/lectura-adaptativa"
                  className="btn-secondary text-xs sm:text-sm py-2.5 px-4 shadow-xs flex items-center justify-center gap-2 whitespace-nowrap w-full sm:w-auto"
                >
                  <span>📖</span>
                  <span>Leer Historia Adaptada</span>
                </Link>
              </div>
            </div>

            {/* COLUMNA DERECHA: MASCOTA BÚ PROPORCIONADA */}
            <div className="md:col-span-5 lg:col-span-4 flex flex-col items-center justify-center">
              <div className="relative">
                <div className="absolute -inset-4 rounded-full bg-gradient-to-br from-turquoise/25 via-gold/20 to-coral/20 blur-xl" />
                <div className="relative animate-float text-center">
                  <BuMascot
                    eager
                    className="w-36 sm:w-44 md:w-52 lg:w-60 h-auto drop-shadow-xl mx-auto"
                  />
                  <div className="mt-1.5 inline-block rounded-xl bg-white/90 backdrop-blur px-3 py-1 border border-border shadow-xs text-[11px] font-bold text-institutional-deep">
                    🦉 «¡Hola! Soy Bú, tu tutora de lectura con IA»
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CARACTERÍSTICAS CLAVE DEL PROTOTIPO (RÚBRICA) */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-8">
        <div className="grid gap-3.5 sm:grid-cols-3">
          <div className="card-soft p-5 border-t-4 border-t-turquoise">
            <div className="w-10 h-10 rounded-xl bg-turquoise/20 text-institutional-deep grid place-items-center text-xl mb-2.5">
              ⚡
            </div>
            <h3 className="font-display font-bold text-base md:text-lg text-institutional-deep">
              Evaluación Automatizada
            </h3>
            <p className="text-xs md:text-sm text-muted-foreground mt-1 leading-relaxed">
              Pruebas estandarizadas con corrección inmediata sin demoras, desglose por nivel
              literal, inferencial y crítico, y asignación de nivel.
            </p>
          </div>

          <div className="card-soft p-5 border-t-4 border-t-coral">
            <div className="w-10 h-10 rounded-xl bg-coral/20 text-coral grid place-items-center text-xl mb-2.5">
              🤖
            </div>
            <h3 className="font-display font-bold text-base md:text-lg text-institutional-deep">
              Tutor Socrático con IA
            </h3>
            <p className="text-xs md:text-sm text-muted-foreground mt-1 leading-relaxed">
              Andamiaje dinámico: la IA analiza las respuestas de los niños y formula pistas
              progresivas y preguntas reflexivas sin dar la respuesta servida.
            </p>
          </div>

          <div className="card-soft p-5 border-t-4 border-t-gold">
            <div className="w-10 h-10 rounded-xl bg-gold/20 text-institutional-deep grid place-items-center text-xl mb-2.5">
              🎯
            </div>
            <h3 className="font-display font-bold text-base md:text-lg text-institutional-deep">
              Lectura Adaptativa Multinivel
            </h3>
            <p className="text-xs md:text-sm text-muted-foreground mt-1 leading-relaxed">
              Un mismo texto curricular en 3 versiones de complejidad (Explorador, Aventurero,
              Maestro) con glosario interactivo contextualizado en Cartagena.
            </p>
          </div>
        </div>
      </section>

      {/* RUTA PEDAGÓGICA (5 FASES DEL DISEÑO CURRICULAR) */}
      <section id="ruta" className="mx-auto max-w-6xl px-4 sm:px-6 py-8 scroll-mt-20">
        <div className="text-center mb-8">
          <p className="text-xs font-bold tracking-widest uppercase text-turquoise">
            Diseño Curricular · Semana 3 & 4
          </p>
          <h2 className="mt-1 text-2xl md:text-3xl font-display font-bold text-institutional-deep">
            Ruta de Intervención Pedagógica
          </h2>
          <p className="mt-1.5 text-xs sm:text-sm text-muted-foreground max-w-2xl mx-auto">
            Flujo estructurado paso a paso para transitar desde el acompañamiento hacia la autonomía
            lectora:
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {rutaPedagogica.map((r) => (
            <div
              key={r.fase}
              className="card-soft p-5 flex flex-col justify-between border-2 border-border hover:border-turquoise transition-all"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <span className="text-xs font-bold uppercase tracking-wider text-coral">
                    {r.fase}
                  </span>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-institutional/10 text-institutional">
                    {r.badge}
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-2xl shrink-0 p-2.5 rounded-xl bg-paper border border-border">
                    {r.icon}
                  </span>
                  <div>
                    <h3 className="font-display font-bold text-lg text-institutional-deep">
                      {r.title}
                    </h3>
                    <p className="mt-0.5 text-xs md:text-sm text-muted-foreground leading-relaxed">
                      {r.subtitle}
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-border/60">
                <Link to={r.to} className="btn-primary w-full text-center text-xs sm:text-sm py-2">
                  {r.cta} →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* INSTITUCIÓN EDUCATIVA */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-8">
        <div className="text-center mb-6">
          <p className="text-xs font-bold tracking-widest uppercase text-turquoise">
            Contexto Institucional
          </p>
          <h2 className="mt-1 text-xl md:text-2xl font-display font-bold text-institutional-deep">
            Institución Educativa Ciudad de Tunja
          </h2>
          <p className="mt-1 text-xs text-muted-foreground max-w-3xl mx-auto">
            Institución oficial de Cartagena de Indias comprometida con la innovación didáctica y la
            inclusión mediante tecnología educativa.
          </p>
        </div>

        <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
          {schoolFacts.map((f) => (
            <div key={f.label} className="card-soft p-3.5 flex items-center gap-3">
              <span className="text-xl shrink-0">{f.icon}</span>
              <div>
                <div className="text-[10px] font-bold tracking-wider uppercase text-muted-foreground">
                  {f.label}
                </div>
                <div className="text-xs sm:text-sm font-semibold text-institutional-deep">
                  {f.value}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* DESCARGA DE DOCUMENTACIÓN INSTITUCIONAL Y ACADÉMICA */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 pb-8">
        <div className="card-soft p-4 md:p-5 border border-institutional/20 bg-white flex flex-col md:flex-row items-center justify-between gap-4 shadow-xs">
          <div className="flex items-center gap-3 text-center md:text-left">
            <span className="text-2xl sm:text-3xl shrink-0">📄</span>
            <div>
              <h4 className="font-display font-bold text-sm sm:text-base text-institutional-deep">
                Documentación Pedagógica e Institucional en PDF
              </h4>
              <p className="text-xs text-muted-foreground mt-0.5">
                Descarga el Dossier Académico de Sustentación (UTB) y el Manual de Operación para la I.E. Ciudad de Tunja.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 w-full md:w-auto">
            <a
              href="/docs/Dossier_Sustentacion_Docente_UTB_AVA_Lectura.pdf"
              download
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary text-xs py-2 px-3.5 shadow-xs flex items-center justify-center gap-1.5 whitespace-nowrap w-full sm:w-auto"
            >
              <span>🎓</span>
              <span>Dossier Docente UTB</span>
            </a>
            <a
              href="/docs/Manual_Institucional_Implementacion_Colegio_Ciudad_de_Tunja.pdf"
              download
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary text-xs py-2 px-3.5 shadow-xs flex items-center justify-center gap-1.5 whitespace-nowrap w-full sm:w-auto"
            >
              <span>🏫</span>
              <span>Manual Colegio</span>
            </a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-border/60 bg-white/60 py-6 text-center text-xs text-muted-foreground">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-3">
          <div>
            <strong>Aventura Lectora con IA</strong> · Institución Educativa Ciudad de Tunja ·
            Cartagena
          </div>
          <div>
            Maestría en Educación Mediada por las TIC ·{" "}
            <strong>Universidad Tecnológica de Bolívar</strong> · 2026
          </div>
          <div>
            <Link
              to="/proyecto-lectura"
              className="font-semibold text-institutional hover:underline"
            >
              Ver Fundamentación Curricular y Equipo →
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
