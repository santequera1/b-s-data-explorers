import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { BuMascot } from "@/components/BuMascot";
import { Menu, X } from "lucide-react";

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <main className="bg-paper min-h-screen">
      {/* NAVBAR RESPONSIVE CON MENÚ HAMBURGUESA */}
      <nav className="sticky top-0 z-40 backdrop-blur bg-white/95 border-b border-border/60">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-2">
          {/* LOGO */}
          <Link
            to="/lectura"
            className="flex items-center gap-2 font-display font-bold text-institutional-deep text-base sm:text-lg shrink-0"
          >
            <span className="text-xl sm:text-2xl animate-float">🦉</span>
            <span>
              Aventura Lectora <span className="text-coral text-xs sm:text-sm">con IA</span>
            </span>
          </Link>

          {/* MENÚ DE ESCRITORIO (OCULTO EN MÓVIL) */}
          <div className="hidden md:flex items-center gap-1.5 lg:gap-2 text-xs sm:text-sm font-semibold">
            <Link
              to="/"
              className="px-2.5 py-1.5 rounded-full text-muted-foreground hover:text-institutional-deep hover:bg-paper transition-colors"
            >
              ← Portal General
            </Link>
            <a
              href="#ruta"
              className="px-2.5 py-1.5 rounded-full text-institutional-deep hover:bg-institutional/10 transition-colors"
            >
              Ruta
            </a>
            <Link
              to="/lectura-adaptativa"
              className="px-2.5 py-1.5 rounded-full text-institutional-deep hover:bg-institutional/10 transition-colors"
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
              className="ml-1 inline-flex items-center gap-1 rounded-full border-2 border-institutional text-institutional px-3 py-1 font-bold hover:bg-institutional hover:text-white transition-colors text-xs shadow-xs"
            >
              🔑 Ingresar
            </Link>
          </div>

          {/* BOTÓN HAMBURGUESA (SÓLO EN MÓVIL) */}
          <div className="flex md:hidden items-center">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? "Cerrar menú" : "Abrir menú de navegación"}
              className="p-2 rounded-xl text-institutional-deep hover:bg-institutional/10 focus:outline-none focus:ring-2 focus:ring-turquoise transition-colors"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6 text-coral" />
              ) : (
                <Menu className="w-6 h-6 text-institutional-deep" />
              )}
            </button>
          </div>
        </div>

        {/* DESPLEGABLE DEL MENÚ EN MÓVIL */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border/80 bg-white/98 backdrop-blur-md px-4 py-3 shadow-xl animate-in slide-in-from-top-2 duration-200">
            <div className="flex flex-col gap-1 font-display text-sm font-semibold">
              <Link
                to="/diagnostico-lectura"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-institutional-deep hover:bg-turquoise/15 transition-colors"
              >
                <span className="text-xl">🧭</span>
                <span>Diagnóstico Inicial</span>
              </Link>
              <Link
                to="/lectura-adaptativa"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-institutional-deep hover:bg-turquoise/15 transition-colors"
              >
                <span className="text-xl">📖</span>
                <span>Lectura Adaptada (El Manglar)</span>
              </Link>
              <Link
                to="/tutor-ia"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-coral font-bold bg-coral/10 hover:bg-coral/20 transition-colors"
              >
                <span className="text-xl">🤖</span>
                <span>Tutor Socrático con Bú</span>
              </Link>
              <Link
                to="/evaluacion-formativa"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-institutional-deep hover:bg-turquoise/15 transition-colors"
              >
                <span className="text-xl">🏆</span>
                <span>Evaluación y Diploma</span>
              </Link>
              <Link
                to="/proyecto-lectura"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-muted-foreground hover:text-institutional-deep hover:bg-paper transition-colors"
              >
                <span className="text-xl">🎓</span>
                <span>El Proyecto (UTB)</span>
              </Link>
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-muted-foreground hover:text-institutional-deep hover:bg-paper transition-colors border-t border-border/60 pt-2.5 mt-1"
              >
                <span className="text-xl">🦉</span>
                <span>← Volver a Exploradores de Datos</span>
              </Link>
              <Link
                to="/ingresar"
                onClick={() => setMobileMenuOpen(false)}
                className="btn-primary w-full text-center text-sm py-2.5 mt-2 flex items-center justify-center gap-2 shadow-xs"
              >
                <span>🔑</span>
                <span>Ingresar a Mi Cuenta</span>
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* HERO CENTRADO EN NIÑOS: EL BÚHO APARECE ANTES DEL TEXTO */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white/80 via-paper to-paper border-b border-border/40">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 pt-3 pb-6 sm:pt-6 sm:pb-8 lg:pt-8 lg:pb-10">
          <div className="grid md:grid-cols-12 gap-6 items-center">
            {/* EL BÚHO BÚ: EN MÓVIL APARECE PRIMERO (order-1), EN DESCRITORIO AL LADO (order-2) */}
            <div className="order-1 md:order-2 md:col-span-5 lg:col-span-5 flex flex-col items-center justify-center text-center">
              {/* BURBUJA DE DIÁLOGO INFANTIL */}
              <div className="relative mb-2 animate-bounce-in">
                <div className="inline-flex items-center gap-1.5 rounded-2xl bg-white px-3.5 py-1.5 border-2 border-coral/30 shadow-md text-xs sm:text-sm font-display font-bold text-institutional-deep">
                  <span>✨</span>
                  <span>«¡Hola! Soy Bú 🦉 ¡Acompáñame a explorar y jugar!»</span>
                </div>
                {/* Flechita de la burbuja */}
                <div className="w-3 h-3 bg-white border-b-2 border-r-2 border-coral/30 transform rotate-45 mx-auto -mt-1.5 shadow-xs" />
              </div>

              {/* IMAGEN DE LA MASCOTA CON AURA ANIMADA */}
              <div className="relative">
                <div className="absolute -inset-4 rounded-full bg-gradient-to-br from-turquoise/30 via-gold/25 to-coral/25 blur-xl animate-pulse" />
                <div className="relative animate-float">
                  <BuMascot
                    eager
                    className="w-32 sm:w-44 md:w-52 lg:w-60 h-auto drop-shadow-xl mx-auto"
                  />
                </div>
              </div>
            </div>

            {/* TEXTO Y BOTONES: EN MÓVIL APARECE DEBAJO DEL BÚHO (order-2), EN ESCRITORIO A LA IZQUIERDA (order-1) */}
            <div className="order-2 md:order-1 md:col-span-7 lg:col-span-7 flex flex-col justify-center text-center md:text-left">
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-[11px] sm:text-xs font-bold text-institutional border border-institutional/20 shadow-xs">
                  <span>🏫</span> I.E. Ciudad de Tunja · Sede Escilda Medina Pacheco · Grado 3°
                </span>
              </div>

              {/* TÍTULO ESTIMULANTE Y AMIGABLE */}
              <h1 className="mt-2 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-bold text-institutional-deep leading-tight">
                ¡Aventura de Lectura <span className="text-coral">con Bú y la IA!</span>
              </h1>

              {/* INVITACIÓN CORTA Y DIRECTA PARA NIÑOS */}
              <p className="mt-2 text-xs sm:text-sm md:text-base text-muted-foreground max-w-xl leading-relaxed mx-auto md:mx-0">
                ¡Descubre el <strong>Secreto del Manglar</strong>! Lee cuentos a tu propio ritmo,
                gana medallas y conversa con tu tutora mágica <strong>Bú</strong>, quien te dará pistas
                inteligentes para superar cada reto.
              </p>

              {/* BOTONES GRANDES Y LLAMATIVOS */}
              <div className="mt-4 sm:mt-5 flex flex-wrap sm:flex-nowrap items-center justify-center md:justify-start gap-2.5">
                <Link
                  to="/diagnostico-lectura"
                  className="btn-primary text-xs sm:text-sm py-3 px-5 shadow-md flex items-center justify-center gap-2 whitespace-nowrap w-full sm:w-auto"
                >
                  <span className="text-base">🧭</span>
                  <span>¡Comenzar el Diagnóstico!</span>
                </Link>
                <Link
                  to="/lectura-adaptativa"
                  className="btn-secondary text-xs sm:text-sm py-3 px-5 shadow-xs flex items-center justify-center gap-2 whitespace-nowrap w-full sm:w-auto"
                >
                  <span className="text-base">📖</span>
                  <span>¡Leer Cuento del Manglar!</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* LOS 3 PODERES DE LA AVENTURA (CARACTERÍSTICAS PARA NIÑOS) */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-6 sm:py-8">
        <div className="grid gap-3.5 sm:grid-cols-3">
          <div className="card-soft p-5 border-t-4 border-t-turquoise">
            <div className="w-10 h-10 rounded-xl bg-turquoise/20 text-institutional-deep grid place-items-center text-xl mb-2.5">
              ⚡
            </div>
            <h3 className="font-display font-bold text-base md:text-lg text-institutional-deep">
              Juegos y Pruebas Rápidas
            </h3>
            <p className="text-xs md:text-sm text-muted-foreground mt-1 leading-relaxed">
              Responde 10 preguntas interactivas y descubre tu nivel de explorador al instante sin esperar.
            </p>
          </div>

          <div className="card-soft p-5 border-t-4 border-t-coral">
            <div className="w-10 h-10 rounded-xl bg-coral/20 text-coral grid place-items-center text-xl mb-2.5">
              🦉
            </div>
            <h3 className="font-display font-bold text-base md:text-lg text-institutional-deep">
              Tu Amiga Bú te Da Pistas
            </h3>
            <p className="text-xs md:text-sm text-muted-foreground mt-1 leading-relaxed">
              ¡Nunca te quedas atascado! Bú te hace preguntas mágicas que te ayudan a pensar y resolver cada misterio.
            </p>
          </div>

          <div className="card-soft p-5 border-t-4 border-t-gold">
            <div className="w-10 h-10 rounded-xl bg-gold/20 text-institutional-deep grid place-items-center text-xl mb-2.5">
              📖
            </div>
            <h3 className="font-display font-bold text-base md:text-lg text-institutional-deep">
              Cuentos a Tu Medida
            </h3>
            <p className="text-xs md:text-sm text-muted-foreground mt-1 leading-relaxed">
              Lee en versión Fácil, Normal o Pro, con un glosario con dibujos y palabras de nuestra Cartagena.
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
