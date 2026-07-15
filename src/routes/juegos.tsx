import { createFileRoute, Link } from "@tanstack/react-router";
import { BuMascot } from "@/components/BuMascot";

export const Route = createFileRoute("/juegos")({
  head: () => ({
    meta: [
      { title: "Zona de Juegos — Exploradores de Datos" },
      {
        name: "description",
        content:
          "La zona interactiva de Exploradores de Datos: juegos de estadística y probabilidad para 3° de primaria.",
      },
    ],
  }),
  component: GamesPage,
});

type Game = {
  week: string;
  title: string;
  description: string;
  icon: string;
  to?: "/semana-6" | "/semana-7";
  skills: string[];
};

const games: Game[] = [
  {
    week: "Semana 6",
    title: "Cara o Sello",
    description:
      "Predice, lanza la moneda 10 veces y compara tu predicción con lo que pasó de verdad. ¿Qué tan predecible es el azar?",
    icon: "🪙",
    to: "/semana-6",
    skills: ["Predicción", "Conteo", "Gráfico de barras"],
  },
  {
    week: "Semana 7",
    title: "La Ruleta de la Suerte",
    description:
      "Gira la ruleta de colores y descubre por qué algunos resultados son más probables que otros.",
    icon: "🎡",
    to: "/semana-7",
    skills: ["Probabilidad", "Más y menos probable"],
  },
  {
    week: "Semana 2",
    title: "Organizar Datos",
    description: "Ayuda a Bú a clasificar sus hallazgos en tablas de conteo.",
    icon: "📋",
    skills: ["Tablas de conteo"],
  },
  {
    week: "Semana 3",
    title: "Pictogramas",
    description: "Cuenta historias con dibujos: cada figura vale por varios datos.",
    icon: "🖼️",
    skills: ["Pictogramas"],
  },
  {
    week: "Semana 4",
    title: "Gráficos de Barras",
    description: "Construye tus propias barras y aprende a leerlas como un experto.",
    icon: "📊",
    skills: ["Gráficos de barras"],
  },
  {
    week: "Semana 5",
    title: "¿Seguro o Imposible?",
    description: "Clasifica sucesos: ¿es seguro, posible o imposible que ocurran?",
    icon: "⚖️",
    skills: ["Certeza", "Posibilidad"],
  },
];

function GamesPage() {
  const available = games.filter((g) => g.to);
  const upcoming = games.filter((g) => !g.to);

  return (
    <main className="bg-paper min-h-screen">
      <header className="mx-auto max-w-6xl px-6 pt-6 pb-4 flex items-center justify-between">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-institutional-deep hover:text-coral transition-colors"
        >
          ← Volver al inicio
        </Link>
      </header>

      {/* HERO */}
      <section className="mx-auto max-w-6xl px-6 pt-4 pb-10 text-center">
        <div className="flex justify-center">
          <BuMascot eager className="w-32 md:w-40 h-auto drop-shadow-xl animate-float" />
        </div>
        <p className="mt-4 text-sm font-semibold tracking-widest uppercase text-turquoise">
          Zona interactiva
        </p>
        <h1 className="mt-2 text-4xl md:text-6xl font-display font-bold text-institutional-deep">
          ¡A <span className="text-coral">jugar</span> con los datos!
        </h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          Aquí viven todos los juegos de la aventura. Elige uno, sigue las pistas de Bú
          y conviértete en un Explorador de Datos.
        </p>
      </section>

      {/* DISPONIBLES */}
      <section className="mx-auto max-w-6xl px-6 pb-12">
        <h2 className="text-xl font-display font-bold text-institutional-deep mb-5">
          🎮 Listos para jugar
        </h2>
        <div className="grid gap-6 md:grid-cols-2">
          {available.map((g) => (
            <Link
              key={g.week}
              to={g.to!}
              className="card-soft p-6 md:p-8 group hover:-translate-y-1 transition-transform block"
            >
              <div className="flex items-start gap-5">
                <div className="shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br from-institutional to-turquoise text-white grid place-items-center text-3xl shadow-lg group-hover:scale-110 transition-transform">
                  {g.icon}
                </div>
                <div className="flex-1">
                  <div className="text-xs font-bold tracking-wider text-coral uppercase">
                    {g.week}
                  </div>
                  <h3 className="mt-1 font-display font-bold text-2xl text-institutional-deep">
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

      {/* PRÓXIMAMENTE */}
      <section className="mx-auto max-w-6xl px-6 pb-20">
        <h2 className="text-xl font-display font-bold text-institutional-deep mb-5">
          🔒 Próximamente
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {upcoming.map((g) => (
            <div key={g.week} className="card-soft p-5 opacity-70">
              <div className="w-12 h-12 rounded-2xl bg-muted grid place-items-center text-2xl grayscale">
                {g.icon}
              </div>
              <div className="mt-3 text-xs font-bold tracking-wider text-muted-foreground uppercase">
                {g.week}
              </div>
              <h3 className="mt-1 font-display font-bold text-lg text-institutional-deep">
                {g.title}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">{g.description}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
