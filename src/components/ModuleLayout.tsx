import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

type TheoryCard = { icon: string; title: string; body: string };

type Props = {
  week: string;
  title: string;
  subtitle: string;
  dba: string;
  estandar: string;
  theoryTitle: string;
  theory: TheoryCard[];
  missionTitle: string;
  missionBody: string;
  missionTools: string[];
  videoId?: string;
  videoTitle?: string;
  children: ReactNode; // el juego
};

export function ModuleLayout({
  week,
  title,
  subtitle,
  dba,
  estandar,
  theoryTitle,
  theory,
  missionTitle,
  missionBody,
  missionTools,
  videoId,
  videoTitle,
  children,
}: Props) {
  return (
    <main className="bg-paper min-h-screen">
      <header className="mx-auto max-w-5xl px-6 pt-6 pb-4 flex items-center justify-between">
        <Link
          to="/juegos"
          className="inline-flex items-center gap-2 text-sm font-semibold text-institutional-deep hover:text-coral transition-colors"
        >
          ← Volver a los módulos
        </Link>
        <Link
          to="/proyecto"
          className="text-xs font-semibold text-muted-foreground hover:text-coral transition-colors"
        >
          Ver referentes MEN →
        </Link>
      </header>

      {/* TÍTULO */}
      <section className="mx-auto max-w-5xl px-6 pb-6 text-center">
        <div className="text-xs font-bold tracking-widest uppercase text-coral">{week}</div>
        <h1 className="mt-2 text-3xl md:text-5xl font-display font-bold text-institutional-deep">
          {title}
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">{subtitle}</p>
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          <span className="rounded-full bg-institutional/10 border border-institutional/20 px-3 py-1 text-xs font-bold text-institutional">
            {dba}
          </span>
          <span className="rounded-full bg-turquoise/15 border border-turquoise/30 px-3 py-1 text-xs font-bold text-institutional-deep">
            {estandar}
          </span>
        </div>
      </section>

      {/* TEORÍA */}
      <section className="mx-auto max-w-5xl px-6 py-6">
        <h2 className="text-xl font-display font-bold text-institutional-deep mb-4">
          📚 {theoryTitle}
        </h2>
        <div className="grid gap-4 md:grid-cols-3">
          {theory.map((t, i) => (
            <div key={i} className="card-soft p-5">
              <div className="text-3xl">{t.icon}</div>
              <h3 className="mt-2 font-display font-bold text-institutional-deep">{t.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{t.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* VIDEO */}
      {videoId && (
        <section className="mx-auto max-w-5xl px-6 py-6">
          <h2 className="text-xl font-display font-bold text-institutional-deep mb-4">
            🎬 {videoTitle ?? "Mira el video de la semana"}
          </h2>
          <div className="card-soft overflow-hidden">
            <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${videoId}`}
                title={videoTitle ?? "Video de la semana"}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full border-0"
              />
            </div>
          </div>
        </section>
      )}

      {/* JUEGO */}
      <section className="px-4 md:px-6 py-8">
        <div className="mx-auto max-w-5xl mb-4">
          <h2 className="text-xl font-display font-bold text-institutional-deep">
            🎮 ¡A practicar!
          </h2>
        </div>
        {children}
      </section>

      {/* MISIÓN EN EL AULA */}
      <section className="mx-auto max-w-5xl px-6 py-8 pb-16">
        <div className="card-soft p-7 md:p-9 bg-gradient-to-br from-institutional to-institutional-deep text-white">
          <p className="text-xs font-bold tracking-widest uppercase text-gold">
            Misión en el aula
          </p>
          <h2 className="mt-2 text-2xl font-display font-bold">{missionTitle}</h2>
          <p className="mt-3 text-white/85">{missionBody}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {missionTools.map((t) => (
              <span
                key={t}
                className="rounded-full bg-white/15 border border-white/25 px-3 py-1 text-xs font-semibold"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
