import { createFileRoute, Link } from "@tanstack/react-router";
import { BuMascot } from "@/components/BuMascot";

export const Route = createFileRoute("/")({
  component: LandingPage,
});

type Step = {
  fase: string;
  title: string;
  subtitle: string;
  icon: string;
  badge: string;
  to: string;
  cta: string;
  color: string;
};

const rutaPedagogica: Step[] = [
  {
    fase: "Fase 1 · Diagnóstico",
    title: "Diagnóstico Inicial Automatizado",
    subtitle:
      "Prueba interactiva de 10 reactivos que clasifica tu nivel lector (literal, inferencial y crítico).",
    icon: "🧭",
    badge: "Calificación Inmediata",
    to: "/diagnostico-lectura",
    cta: "Iniciar diagnóstico",
    color: "from-turquoise/20 to-institutional/10",
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
    color: "from-coral/20 to-gold/15",
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
    color: "from-gold/25 to-turquoise/15",
  },
  {
    fase: "Fase 4 · Evaluación",
    title: "Evaluación Formativa Automatizada",
    subtitle:
      "Mide tu ganancia neta de aprendizaje con reporte detallado por dimensiones e insignia de logro.",
    icon: "📝",
    badge: "Reporte y Certificado",
    to: "/evaluacion-formativa",
    cta: "Presentar examen",
    color: "from-emerald-100 to-turquoise/20",
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

function LandingPage() {
  return (
    <main className="bg-paper min-h-screen">
      {/* NAVBAR */}
      <nav className="sticky top-0 z-40 backdrop-blur bg-white/80 border-b border-border/60">
        <div className="mx-auto max-w-6xl px-6 h-16 flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-2 font-display font-bold text-institutional-deep text-lg"
          >
            <span className="text-2xl">🦉</span>
            <span>
              Aventura Lectora <span className="text-coral text-sm">con IA</span>
            </span>
          </Link>
          <div className="flex items-center gap-1 md:gap-3 text-sm font-semibold">
            <a
              href="#ruta"
              className="px-3 py-2 rounded-full text-institutional-deep hover:bg-institutional/10 transition-colors hidden sm:inline-block"
            >
              Ruta Pedagógica
            </a>
            <Link
              to="/lectura-adaptativa"
              className="px-3 py-2 rounded-full text-institutional-deep hover:bg-institutional/10 transition-colors hidden md:inline-block"
            >
              Lectura Adaptada
            </Link>
            <Link
              to="/tutor-ia"
              className="px-3 py-2 rounded-full text-coral hover:bg-coral/10 transition-colors font-bold"
            >
              🤖 Tutor IA
            </Link>
            <Link
              to="/proyecto"
              className="px-3 py-2 rounded-full text-institutional-deep hover:bg-institutional/10 transition-colors"
            >
              El Proyecto
            </Link>
            <Link
              to="/ingresar"
              className="ml-1 inline-flex items-center gap-1.5 rounded-full border-2 border-institutional text-institutional px-4 py-1.5 font-bold hover:bg-institutional hover:text-white transition-colors text-xs md:text-sm"
            >
              🔑 Ingresar
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-6xl px-6 pt-10 pb-16 md:pt-16 md:pb-20 grid md:grid-cols-2 gap-8 items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/80 backdrop-blur px-4 py-1.5 text-xs md:text-sm font-semibold text-institutional border border-institutional/15 shadow-sm">
              <span>🏫</span> I.E. Ciudad de Tunja · Sede Escilda Medina Pacheco · Grado 3°
            </span>
            <h1 className="mt-5 text-4xl md:text-6xl font-display font-bold text-institutional-deep leading-[1.05]">
              Fortalecimiento de la <br />
              <span className="text-coral">Comprensión Lectora</span> <br />
              mediante Inteligencia Artificial
            </h1>
            <p className="mt-5 text-base md:text-lg text-muted-foreground max-w-xl leading-relaxed">
              Un Ambiente Virtual de Aprendizaje (AVA) interactivo donde los estudiantes de 3°
              aprenden a su propio ritmo con <strong>lecturas multinivel</strong>,{" "}
              <strong>evaluaciones automatizadas</strong> y un{" "}
              <strong>tutor socrático con IA</strong> que brinda retroalimentación formativa en
              tiempo real.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/diagnostico-lectura" className="btn-primary">
                🧭 Iniciar Diagnóstico Automatizado
              </Link>
              <Link to="/lectura-adaptativa" className="btn-secondary">
                📖 Leer Historia Adaptada
              </Link>
            </div>
          </div>

          <div className="relative flex justify-center">
            <div className="absolute -inset-6 rounded-[3rem] bg-gradient-to-br from-turquoise/30 via-gold/25 to-coral/25 blur-3xl" />
            <div className="relative animate-float text-center">
              <BuMascot eager className="w-64 md:w-88 h-auto drop-shadow-2xl mx-auto" />
              <div className="mt-3 inline-block rounded-2xl bg-white/90 backdrop-blur px-4 py-2 border border-border shadow text-xs font-bold text-institutional-deep">
                🦉 «¡Hola! Soy Bú, tu tutora de lectura con IA»
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CARACTERÍSTICAS CLAVE DEL PROTOTIPO (RÚBRICA) */}
      <section className="mx-auto max-w-6xl px-6 py-10">
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="card-soft p-6 border-t-4 border-t-turquoise">
            <div className="w-12 h-12 rounded-2xl bg-turquoise/20 text-institutional-deep grid place-items-center text-2xl mb-3">
              ⚡
            </div>
            <h3 className="font-display font-bold text-lg text-institutional-deep">
              Evaluación Automatizada
            </h3>
            <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
              Pruebas estandarizadas con corrección inmediata sin demoras, desglose por nivel
              literal, inferencial y crítico, y asignación de nivel.
            </p>
          </div>

          <div className="card-soft p-6 border-t-4 border-t-coral">
            <div className="w-12 h-12 rounded-2xl bg-coral/20 text-coral grid place-items-center text-2xl mb-3">
              🤖
            </div>
            <h3 className="font-display font-bold text-lg text-institutional-deep">
              Tutor Socrático con IA
            </h3>
            <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
              Andamiaje dinámico: la IA analiza las respuestas de los niños y formula pistas
              progresivas y preguntas reflexivas sin dar la respuesta servida.
            </p>
          </div>

          <div className="card-soft p-6 border-t-4 border-t-gold">
            <div className="w-12 h-12 rounded-2xl bg-gold/20 text-institutional-deep grid place-items-center text-2xl mb-3">
              🎯
            </div>
            <h3 className="font-display font-bold text-lg text-institutional-deep">
              Lectura Adaptativa Multinivel
            </h3>
            <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
              Un mismo texto curricular en 3 versiones de complejidad (Explorador, Aventurero,
              Maestro) con glosario interactivo contextualizado en Cartagena.
            </p>
          </div>
        </div>
      </section>

      {/* RUTA PEDAGÓGICA (5 FASES DEL DISEÑO CURRICULAR) */}
      <section id="ruta" className="mx-auto max-w-6xl px-6 py-12 scroll-mt-20">
        <div className="text-center mb-10">
          <p className="text-xs font-bold tracking-widest uppercase text-turquoise">
            Diseño Curricular · Semana 3 & 4
          </p>
          <h2 className="mt-1 text-3xl md:text-4xl font-display font-bold text-institutional-deep">
            Ruta de Intervención Pedagógica
          </h2>
          <p className="mt-2 text-muted-foreground max-w-2xl mx-auto text-sm md:text-base">
            Flujo estructurado paso a paso para transitar desde el acompañamiento hacia la autonomía
            lectora:
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {rutaPedagogica.map((r, i) => (
            <div
              key={r.fase}
              className="card-soft p-6 flex flex-col justify-between border-2 border-border hover:border-turquoise transition-all"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-coral">
                    {r.fase}
                  </span>
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-institutional/10 text-institutional">
                    {r.badge}
                  </span>
                </div>
                <div className="flex items-start gap-4">
                  <span className="text-3xl shrink-0 p-3 rounded-2xl bg-paper border border-border">
                    {r.icon}
                  </span>
                  <div>
                    <h3 className="font-display font-bold text-xl text-institutional-deep">
                      {r.title}
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                      {r.subtitle}
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-border/60">
                <Link to={r.to} className="btn-primary w-full text-center text-sm py-2">
                  {r.cta} →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* INSTITUCIÓN EDUCATIVA */}
      <section className="mx-auto max-w-6xl px-6 py-12">
        <div className="text-center mb-8">
          <p className="text-xs font-bold tracking-widest uppercase text-turquoise">
            Contexto Institucional
          </p>
          <h2 className="mt-1 text-2xl md:text-3xl font-display font-bold text-institutional-deep">
            Institución Educativa Ciudad de Tunja
          </h2>
          <p className="mt-2 text-sm text-muted-foreground max-w-3xl mx-auto">
            Institución oficial de Cartagena de Indias comprometida con la innovación didáctica y la
            inclusión mediante tecnología educativa.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {schoolFacts.map((f) => (
            <div key={f.label} className="card-soft p-4 flex items-center gap-3">
              <span className="text-2xl shrink-0">{f.icon}</span>
              <div>
                <div className="text-[11px] font-bold tracking-wider uppercase text-muted-foreground">
                  {f.label}
                </div>
                <div className="text-sm font-semibold text-institutional-deep">{f.value}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-border/60 bg-white/60 py-8 text-center text-xs text-muted-foreground">
        <div className="mx-auto max-w-6xl px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <strong>Aventura Lectora con IA</strong> · Institución Educativa Ciudad de Tunja ·
            Cartagena de Indias
          </div>
          <div>
            Maestría en Educación Mediada por las TIC ·{" "}
            <strong>Universidad Tecnológica de Bolívar</strong> · 2026
          </div>
          <div>
            <Link to="/proyecto" className="font-semibold text-institutional hover:underline">
              Ver Fundamentación Curricular y Equipo →
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
