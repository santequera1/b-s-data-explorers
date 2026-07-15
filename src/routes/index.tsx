import { createFileRoute, Link } from "@tanstack/react-router";
import { BuMascot } from "@/components/BuMascot";

export const Route = createFileRoute("/")({
  component: LandingPage,
});

type Stop = {
  n: string;
  title: string;
  subtitle: string;
  icon: string;
  playable?: boolean;
};

const stops: Stop[] = [
  { n: "0", title: "Diagnóstico", subtitle: "¿Cuánto sabes ya?", icon: "🧭" },
  { n: "1", title: "¿Qué es un dato?", subtitle: "Recolectar información", icon: "🔎" },
  { n: "2", title: "Organizar datos", subtitle: "Tablas de conteo", icon: "📋" },
  { n: "3", title: "Pictogramas", subtitle: "Contar con dibujos", icon: "🖼️" },
  { n: "4", title: "Gráficos de barras", subtitle: "¡Qué barra tan alta!", icon: "📊" },
  { n: "5", title: "¿Seguro o imposible?", subtitle: "Certeza y posibilidad", icon: "⚖️" },
  { n: "6", title: "Cara o Sello", subtitle: "El gran experimento del azar", icon: "🪙", playable: true },
  { n: "7", title: "La ruleta de la suerte", subtitle: "Probabilidad", icon: "🎡", playable: true },
  { n: "8", title: "Proyecto final", subtitle: "¡Serás Explorador!", icon: "🏆" },
];

const schoolFacts = [
  { icon: "🏛️", label: "Carácter", value: "Institución oficial (pública)" },
  { icon: "🎓", label: "Modalidad", value: "Técnica y académica" },
  { icon: "📅", label: "Calendario", value: "Calendario A" },
  { icon: "🏫", label: "Sedes", value: "2 sedes en Cartagena" },
  { icon: "📍", label: "Ubicación", value: "Barrio María Auxiliadora, Camino del Medio" },
  { icon: "🧒", label: "Comunidad", value: "Más de 1.800 estudiantes" },
];

function LandingPage() {
  return (
    <main className="bg-paper min-h-screen">
      {/* NAV */}
      <nav className="sticky top-0 z-40 backdrop-blur bg-white/70 border-b border-border/60">
        <div className="mx-auto max-w-6xl px-6 h-16 flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-2 font-display font-bold text-institutional-deep"
          >
            <span className="text-2xl">🦉</span>
            <span className="hidden sm:inline">Exploradores de Datos</span>
          </Link>
          <div className="flex items-center gap-1 md:gap-2 text-sm font-semibold">
            <a
              href="#colegio"
              className="px-3 py-2 rounded-full text-institutional-deep hover:bg-institutional/10 transition-colors"
            >
              El colegio
            </a>
            <a
              href="#mapa"
              className="px-3 py-2 rounded-full text-institutional-deep hover:bg-institutional/10 transition-colors"
            >
              La aventura
            </a>
            <Link
              to="/juegos"
              className="ml-1 inline-flex items-center gap-1.5 rounded-full bg-gradient-to-b from-coral to-coral-deep text-white px-4 py-2 shadow hover:-translate-y-0.5 transition-transform"
            >
              🎮 Juegos
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-6xl px-6 pt-10 pb-16 md:pt-16 md:pb-24 grid md:grid-cols-2 gap-8 items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/70 backdrop-blur px-4 py-1.5 text-sm font-semibold text-institutional border border-institutional/15">
              <span>🦉</span> Institución Educativa Ciudad de Tunja · 3° primaria
            </span>
            <h1 className="mt-5 text-5xl md:text-7xl font-display font-bold text-institutional-deep leading-[1.02]">
              Exploradores <br /> de <span className="text-coral">Datos</span>
            </h1>
            <p className="mt-5 text-lg md:text-xl text-muted-foreground max-w-xl">
              Un viaje de 8 semanas para aprender <strong>estadística jugando</strong> junto a
              Bú, la búho exploradora. Recoge pistas, organiza datos y descubre el azar.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/juegos" className="btn-primary">
                🎮 Ir a los juegos
                <span aria-hidden>→</span>
              </Link>
              <a href="#mapa" className="btn-secondary">
                Conocer la aventura
              </a>
            </div>
          </div>

          <div className="relative flex justify-center">
            <div className="absolute -inset-6 rounded-[3rem] bg-gradient-to-br from-turquoise/25 via-gold/20 to-coral/20 blur-2xl" />
            <div className="relative animate-float">
              <BuMascot eager className="w-72 md:w-96 h-auto drop-shadow-2xl" />
            </div>
          </div>
        </div>
      </section>

      {/* EL COLEGIO */}
      <section id="colegio" className="mx-auto max-w-6xl px-6 py-16 scroll-mt-20">
        <div className="text-center mb-12">
          <p className="text-sm font-semibold tracking-widest uppercase text-turquoise">
            Nuestra institución
          </p>
          <h2 className="mt-2 text-3xl md:text-4xl font-display font-bold text-institutional-deep">
            Institución Educativa Ciudad de Tunja
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
            Somos una institución educativa oficial de{" "}
            <strong>Cartagena de Indias</strong>, ubicada en el barrio María Auxiliadora,
            sector Camino del Medio. Formamos niños, niñas y jóvenes con una oferta
            técnica y académica, comprometidos con una educación pública de calidad
            que prepara a nuestros estudiantes para comprender y transformar su entorno.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {schoolFacts.map((f) => (
            <div key={f.label} className="card-soft p-5 flex items-start gap-4">
              <div className="shrink-0 w-12 h-12 rounded-2xl bg-gold/25 grid place-items-center text-2xl">
                {f.icon}
              </div>
              <div>
                <div className="text-xs font-bold tracking-wider uppercase text-turquoise">
                  {f.label}
                </div>
                <div className="mt-0.5 font-display font-bold text-institutional-deep leading-snug">
                  {f.value}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <div className="card-soft p-8">
            <div className="text-3xl">🎯</div>
            <h3 className="mt-3 font-display font-bold text-xl text-institutional-deep">
              Nuestro compromiso
            </h3>
            <p className="mt-2 text-muted-foreground">
              Ofrecer una formación integral que combine el saber académico y técnico
              con valores como el respeto, la responsabilidad y la curiosidad. Creemos
              que cada estudiante puede alcanzar grandes metas cuando aprende con
              sentido y con alegría.
            </p>
          </div>
          <div className="card-soft p-8">
            <div className="text-3xl">💡</div>
            <h3 className="mt-3 font-display font-bold text-xl text-institutional-deep">
              Innovación pedagógica
            </h3>
            <p className="mt-2 text-muted-foreground">
              <strong>Exploradores de Datos</strong> es una apuesta del colegio por
              integrar la tecnología al aula: un recurso digital propio que enseña el
              pensamiento aleatorio del área de matemáticas a través del juego, la
              experimentación y la narrativa.
            </p>
          </div>
        </div>
      </section>

      {/* QUÉ ES */}
      <section className="mx-auto max-w-4xl px-6 py-16 text-center">
        <h2 className="text-3xl md:text-4xl font-display font-bold text-institutional-deep">
          Un curso para curiosos
        </h2>
        <p className="mt-4 text-lg text-muted-foreground">
          Exploradores de Datos convierte el <em>pensamiento aleatorio</em> del MEN en una
          aventura ilustrada. Cada semana, Bú propone un pequeño reto con animaciones,
          juegos y experimentos — para que los niños aprendan matemáticas descubriéndolas,
          no memorizándolas.
        </p>
      </section>

      {/* MAPA DE LA AVENTURA */}
      <section id="mapa" className="mx-auto max-w-6xl px-6 py-12 scroll-mt-20">
        <div className="text-center mb-12">
          <p className="text-sm font-semibold tracking-widest uppercase text-turquoise">
            El mapa de la aventura
          </p>
          <h2 className="mt-2 text-3xl md:text-4xl font-display font-bold text-institutional-deep">
            8 semanas, 8 descubrimientos
          </h2>
        </div>

        <ol className="relative grid gap-6 md:grid-cols-3">
          {stops.map((s, i) => (
            <li
              key={s.n}
              className="card-soft p-6 relative group hover:-translate-y-1 transition-transform"
              style={{ transform: `rotate(${(i % 3) - 1}deg)` }}
            >
              <div className="flex items-start gap-4">
                <div className="shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br from-institutional to-turquoise text-white grid place-items-center text-2xl shadow-lg">
                  {s.icon}
                </div>
                <div>
                  <div className="text-xs font-bold tracking-wider text-coral uppercase">
                    {s.n === "0" ? "Inicio" : s.n === "8" ? "Meta" : `Semana ${s.n}`}
                  </div>
                  <h3 className="mt-1 font-display font-bold text-lg text-institutional-deep leading-tight">
                    {s.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">{s.subtitle}</p>
                </div>
              </div>
              {s.playable && (
                <Link
                  to={s.n === "6" ? "/semana-6" : "/semana-7"}
                  className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-coral hover:underline"
                >
                  🎮 Jugar →
                </Link>
              )}
            </li>
          ))}
        </ol>
      </section>

      {/* CÓMO FUNCIONA */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-institutional-deep">
            ¿Cómo funciona?
          </h2>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {[
            { icon: "🔑", title: "Entra a Moodle", body: "Con tu usuario del colegio, abres tu aula virtual." },
            { icon: "🗺️", title: "Descubre cada semana", body: "Bú te acompaña en un reto nuevo lleno de juegos." },
            { icon: "🏅", title: "Gana tu insignia", body: "Al terminar te conviertes en un Explorador de Datos." },
          ].map((step, i) => (
            <div key={i} className="card-soft p-8 text-center">
              <div className="mx-auto w-16 h-16 rounded-full bg-gold/30 grid place-items-center text-3xl">
                {step.icon}
              </div>
              <div className="mt-3 text-xs font-bold tracking-widest text-turquoise uppercase">
                Paso {i + 1}
              </div>
              <h3 className="font-display font-bold text-xl mt-1 text-institutional-deep">{step.title}</h3>
              <p className="mt-2 text-muted-foreground">{step.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* DOCENTES */}
      <section className="mx-auto max-w-5xl px-6 py-16">
        <div className="card-soft p-8 md:p-12 bg-gradient-to-br from-institutional to-institutional-deep text-white">
          <div className="grid md:grid-cols-[1fr_auto] gap-6 items-center">
            <div>
              <p className="text-sm font-semibold tracking-widest uppercase text-gold">
                Para docentes y colegio
              </p>
              <h2 className="mt-2 text-2xl md:text-3xl font-display font-bold">
                Un recurso alineado al currículo
              </h2>
              <p className="mt-3 text-white/85 max-w-2xl">
                Recurso digital diseñado para grado <strong>3° de primaria</strong>, alineado a
                los Estándares Básicos de Competencias del MEN en <em>pensamiento aleatorio</em>.
                Pensado para integrarse a Moodle: la plataforma administra login y seguimiento;
                Exploradores de Datos entrega la experiencia interactiva.
              </p>
              <ul className="mt-5 grid gap-2 text-white/90 text-sm sm:grid-cols-2">
                <li className="flex items-center gap-2">✅ Estándares MEN de 3° grado</li>
                <li className="flex items-center gap-2">✅ Secuencia didáctica de 8 semanas</li>
                <li className="flex items-center gap-2">✅ Juegos y experimentos guiados</li>
                <li className="flex items-center gap-2">✅ Sin instalación: funciona en el navegador</li>
              </ul>
            </div>
            <div className="text-6xl md:text-7xl">🦉</div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-border/60">
        <div className="mx-auto max-w-6xl px-6 py-10 grid md:grid-cols-3 gap-6 text-sm text-muted-foreground">
          <div>
            <div className="font-display font-bold text-institutional-deep text-lg">
              Exploradores de Datos
            </div>
            <p className="mt-1">Guiado por Bú, la búho exploradora.</p>
            <p className="mt-2">
              <Link to="/juegos" className="font-semibold text-coral hover:underline">
                🎮 Zona de juegos →
              </Link>
            </p>
          </div>
          <div>
            <div className="font-semibold text-foreground">Institución</div>
            <p>Institución Educativa Ciudad de Tunja</p>
            <p>Barrio María Auxiliadora, Camino del Medio</p>
            <p>Cartagena de Indias, Colombia · 2026</p>
          </div>
          <div>
            <div className="font-semibold text-foreground">Contacto</div>
            <p>Prof. Alexis Cogollo Orozco</p>
            <p>ieciudaddetunja@hotmail.com</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
