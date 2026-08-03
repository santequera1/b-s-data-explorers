import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { BuMascot } from "@/components/BuMascot";
import { getMyProgress, logout } from "@/lib/api";
import type { ActivityRecord } from "@/lib/server/store";

export const Route = createFileRoute("/juegos")({
  loader: () => getMyProgress(),
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
  id: string;
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
    id: "modulo-1",
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
    id: "modulo-2",
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
    id: "modulo-3",
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
  id: string;
  title: string;
  description: string;
  icon: string;
  to: "/semana-6" | "/semana-7";
  skills: string[];
};

const retosAzar: AzarCard[] = [
  {
    id: "reto-moneda",
    title: "Cara o Sello",
    description:
      "Predice, lanza la moneda 10 veces y compara tu predicción con lo que pasó de verdad.",
    icon: "🪙",
    to: "/semana-6",
    skills: ["Predicción", "Experimento aleatorio"],
  },
  {
    id: "reto-ruleta",
    title: "La Ruleta de la Suerte",
    description:
      "Gira la ruleta de colores y descubre por qué algunos resultados son más probables que otros.",
    icon: "🎡",
    to: "/semana-7",
    skills: ["Más y menos probable", "Comparación"],
  },
];

const ALL_IDS = [...modules.map((m) => m.id), ...retosAzar.map((r) => r.id)];

function DoneBadge({ record }: { record?: ActivityRecord }) {
  if (!record) return null;
  return (
    <span className="absolute top-4 right-4 inline-flex items-center gap-1 rounded-full bg-turquoise/15 border border-turquoise/40 px-2.5 py-1 text-xs font-bold text-institutional-deep">
      ✅ {record.nota}/100
    </span>
  );
}

function GamesPage() {
  const data = Route.useLoaderData();
  const router = useRouter();
  const session = data?.session ?? null;
  const acts = data?.actividades ?? {};
  const completadas = ALL_IDS.filter((id) => acts[id]).length;
  const pct = Math.round((completadas / ALL_IDS.length) * 100);

  async function salir() {
    await logout();
    router.invalidate();
  }

  return (
    <main className="bg-paper min-h-screen">
      <header className="mx-auto max-w-6xl px-6 pt-6 pb-4 flex items-center justify-between gap-3 flex-wrap">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-institutional-deep hover:text-coral transition-colors"
        >
          ← Volver al inicio
        </Link>
        {session ? (
          <div className="flex items-center gap-3">
            {session.rol === "docente" && (
              <Link to="/panel" className="text-sm font-bold text-coral hover:underline">
                📋 Panel docente
              </Link>
            )}
            <span className="rounded-full bg-white border-2 border-institutional/15 px-4 py-1.5 text-sm font-bold text-institutional-deep">
              👤 {session.nombre.split(" ")[0]}
            </span>
            <button
              onClick={salir}
              className="text-xs font-semibold text-muted-foreground hover:text-coral transition-colors"
            >
              Salir
            </button>
          </div>
        ) : (
          <Link
            to="/ingresar"
            className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-b from-coral to-coral-deep text-white px-4 py-2 text-sm font-bold shadow hover:-translate-y-0.5 transition-transform"
          >
            🔑 Ingresar
          </Link>
        )}
      </header>

      {/* HERO */}
      <section className="mx-auto max-w-6xl px-6 pt-2 pb-8 text-center">
        <div className="flex justify-center">
          <BuMascot eager className="w-28 md:w-36 h-auto drop-shadow-xl animate-float" />
        </div>
        <p className="mt-3 text-sm font-semibold tracking-widest uppercase text-turquoise">
          Zona interactiva · Un módulo por semana
        </p>
        <h1 className="mt-2 text-4xl md:text-6xl font-display font-bold text-institutional-deep">
          ¡A <span className="text-coral">jugar</span> con los datos!
        </h1>

        {session ? (
          <div className="mt-5 mx-auto max-w-md card-soft p-4">
            <div className="flex items-center justify-between text-sm font-bold text-institutional-deep">
              <span>Progreso de {session.nombre.split(" ")[0]}</span>
              <span className="text-coral">{pct}%</span>
            </div>
            <div className="mt-2 h-4 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-turquoise to-coral transition-all duration-700"
                style={{ width: `${pct}%` }}
              />
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              {completadas} de {ALL_IDS.length} actividades completadas
              {pct === 100 ? " · ¡Eres Explorador de Datos! 🏆" : ""}
            </p>
          </div>
        ) : (
          <p className="mt-4 text-muted-foreground">
            <Link to="/ingresar" className="font-bold text-coral hover:underline">
              Ingresa con tu usuario
            </Link>{" "}
            para guardar tu progreso y tus notas. 🏅
          </p>
        )}
      </section>

      {/* ACTIVIDAD INICIAL */}
      <section className="mx-auto max-w-6xl px-6 pb-10">
        <a
          href="https://docs.google.com/forms/d/e/1FAIpQLSefcumlUjoAoY45Lf92d0Buz4w21pqjUsX_XtIhjuYI1uFaeA/viewform"
          target="_blank"
          rel="noreferrer"
          className="card-soft p-5 flex items-center gap-4 border-2 border-dashed border-gold/60 hover:-translate-y-0.5 transition-transform"
        >
          <span className="shrink-0 w-12 h-12 rounded-2xl bg-gold/25 grid place-items-center text-2xl">
            📱
          </span>
          <span className="flex-1">
            <span className="block text-xs font-bold tracking-wider text-coral uppercase">
              Antes de empezar · Encuesta
            </span>
            <span className="block font-display font-bold text-lg text-institutional-deep">
              Descubriendo mi mundo digital
            </span>
            <span className="block text-sm text-muted-foreground">
              Cuéntanos qué tecnología usas en casa. ¡Son solo 12 preguntas!
            </span>
          </span>
          <span className="font-display font-semibold text-coral">Responder →</span>
        </a>
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
              <DoneBadge record={acts[m.id]} />
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
                  {acts[m.id] ? "Jugar otra vez" : "Empezar misión"} <span aria-hidden>→</span>
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
              className="card-soft p-6 md:p-8 group hover:-translate-y-1 transition-transform block relative"
            >
              <DoneBadge record={acts[g.id]} />
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
                    {acts[g.id] ? "Jugar otra vez" : "Jugar ahora"} <span aria-hidden>→</span>
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
