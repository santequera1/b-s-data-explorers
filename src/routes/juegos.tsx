import { createFileRoute, Link } from "@tanstack/react-router";
import { BuMascot } from "@/components/BuMascot";

export const Route = createFileRoute("/juegos")({
  head: () => ({
    meta: [
      { title: "Módulos y Juegos — Exploradores de Datos" },
      {
        name: "description",
        content:
          "La zona interactiva del AVA: 3 módulos semanales con misiones de estadística y retos de probabilidad para 3° de primaria.",
      },
    ],
  }),
  component: GamesPage,
});

type ModuleCard = {
  week: string;
  title: string;
  mission: string;
  description: string;
  icon: string;
  to: "/modulo-1" | "/modulo-2" | "/modulo-3";
  dba: string;
  skills: string[];
};

const modules: ModuleCard[] = [
  {
    week: "Semana 1 · Módulo 1",
    title: "¿Qué es un dato?",
    mission: "Misión: El Dilema de la Fruta",
    description:
      "Encuesta a 12 amigos, registra cada dato con palotes y arma tu primera tabla de frecuencia para resolver el dilema de la profe.",
    icon: "🥭",
    to: "/modulo-1",
    dba: "DBA 10",
    skills: ["Recolección de datos", "Conteo", "Tabla de frecuencia"],
  },
  {
    week: "Semana 2 · Módulo 2",
    title: "Tablas de frecuencia y gráficos",
    mission: "Misión: Consultoría en la Tienda Escolar",
    description:
      "Conviértete en consultor de doña Marta: construye el gráfico de barras y el pictograma con escala de las ventas de bolis, fritos y mangos.",
    icon: "🏪",
    to: "/modulo-2",
    dba: "DBA 10",
    skills: ["Gráfico de barras", "Pictograma con escala", "Interpretación"],
  },
  {
    week: "Semana 3 · Módulo 3",
    title: "La moda",
    mission: "Misión: El Jugo Estrella",
    description:
      "Cuenta los votos del salón, encuentra el dato que más se repite y corona al Jugo Estrella del kiosco del recreo.",
    icon: "🧃",
    to: "/modulo-3",
    dba: "DBA 10",
    skills: ["La moda", "Análisis de gráficas", "Decisiones con datos"],
  },
];

type AzarCard = {
  title: string;
  description: string;
  icon: string;
  to: "/semana-6" | "/semana-7";
  skills: string[];
};

const retosAzar: AzarCard[] = [
  {
    title: "Cara o Sello",
    description:
      "Predice, lanza la moneda 10 veces y compara tu predicción con lo que pasó de verdad.",
    icon: "🪙",
    to: "/semana-6",
    skills: ["Predicción", "Experimento aleatorio"],
  },
  {
    title: "La Ruleta de la Suerte",
    description:
      "Gira la ruleta de colores y descubre por qué algunos resultados son más probables que otros.",
    icon: "🎡",
    to: "/semana-7",
    skills: ["Más y menos probable", "Comparación"],
  },
];

function GamesPage() {
  return (
    <main className="bg-paper min-h-screen">
      <header className="mx-auto max-w-6xl px-6 pt-6 pb-4 flex items-center justify-between">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-institutional-deep hover:text-coral transition-colors"
        >
          ← Volver al inicio
        </Link>
        <Link
          to="/proyecto"
          className="text-xs font-semibold text-muted-foreground hover:text-coral transition-colors"
        >
          Fundamentación pedagógica →
        </Link>
      </header>

      {/* HERO */}
      <section className="mx-auto max-w-6xl px-6 pt-4 pb-10 text-center">
        <div className="flex justify-center">
          <BuMascot eager className="w-32 md:w-40 h-auto drop-shadow-xl animate-float" />
        </div>
        <p className="mt-4 text-sm font-semibold tracking-widest uppercase text-turquoise">
          Zona interactiva · Un módulo por semana
        </p>
        <h1 className="mt-2 text-4xl md:text-6xl font-display font-bold text-institutional-deep">
          ¡A <span className="text-coral">jugar</span> con los datos!
        </h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          Tres misiones de estadística y dos retos de azar. Completa los módulos en orden
          y conviértete en Explorador de Datos. 🏅
        </p>
      </section>

      {/* MÓDULOS */}
      <section className="mx-auto max-w-6xl px-6 pb-12">
        <h2 className="text-xl font-display font-bold text-institutional-deep mb-5">
          🗺️ Los módulos de la aventura
        </h2>
        <div className="grid gap-6 lg:grid-cols-3">
          {modules.map((m, i) => (
            <Link
              key={m.to}
              to={m.to}
              className="card-soft p-6 group hover:-translate-y-1 transition-transform block relative overflow-hidden"
            >
              <div className="absolute -top-3 -right-1 text-[6rem] leading-none font-display font-bold text-institutional/5 select-none">
                {i + 1}
              </div>
              <div className="relative">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-institutional to-turquoise text-white grid place-items-center text-3xl shadow-lg group-hover:scale-110 transition-transform">
                  {m.icon}
                </div>
                <div className="mt-3 text-xs font-bold tracking-wider text-coral uppercase">
                  {m.week}
                </div>
                <h3 className="mt-1 font-display font-bold text-xl text-institutional-deep">
                  {m.title}
                </h3>
                <p className="text-sm font-semibold text-turquoise mt-0.5">{m.mission}</p>
                <p className="mt-2 text-sm text-muted-foreground">{m.description}</p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  <span className="rounded-full bg-institutional/10 text-institutional text-xs font-bold px-2.5 py-1">
                    {m.dba}
                  </span>
                  {m.skills.map((s) => (
                    <span
                      key={s}
                      className="rounded-full bg-turquoise/15 text-institutional-deep text-xs font-semibold px-2.5 py-1"
                    >
                      {s}
                    </span>
                  ))}
                </div>
                <div className="mt-4 inline-flex items-center gap-1 font-display font-semibold text-coral">
                  Empezar misión <span aria-hidden>→</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* RETOS DE AZAR */}
      <section className="mx-auto max-w-6xl px-6 pb-20">
        <div className="flex items-center gap-3 mb-5 flex-wrap">
          <h2 className="text-xl font-display font-bold text-institutional-deep">
            🎲 Retos de azar y probabilidad
          </h2>
          <span className="rounded-full bg-coral/10 text-coral text-xs font-bold px-2.5 py-1">
            DBA 11 · Probabilidad y azar
          </span>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {retosAzar.map((g) => (
            <Link
              key={g.to}
              to={g.to}
              className="card-soft p-6 md:p-8 group hover:-translate-y-1 transition-transform block"
            >
              <div className="flex items-start gap-5">
                <div className="shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br from-coral to-coral-deep text-white grid place-items-center text-3xl shadow-lg group-hover:scale-110 transition-transform">
                  {g.icon}
                </div>
                <div className="flex-1">
                  <h3 className="font-display font-bold text-2xl text-institutional-deep">
                    {g.title}
                  </h3>
                  <p className="mt-2 text-muted-foreground">{g.description}</p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {g.skills.map((s) => (
                      <span
                        key={s}
                        className="rounded-full bg-turquoise/15 text-institutional-deep text-xs font-semibold px-2.5 py-1"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                  <div className="mt-4 inline-flex items-center gap-1 font-display font-semibold text-coral">
                    Jugar ahora <span aria-hidden>→</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
