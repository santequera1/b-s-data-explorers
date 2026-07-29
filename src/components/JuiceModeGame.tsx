import { useMemo, useState } from "react";
import { BuMascot } from "./BuMascot";

type JuiceId = "mango" | "maracuya" | "tamarindo";

type JuiceDef = { id: JuiceId; label: string; icon: string; cssVar: string };

const JUICES: JuiceDef[] = [
  { id: "mango", label: "Mango", icon: "🥭", cssVar: "var(--gold)" },
  { id: "maracuya", label: "Maracuyá", icon: "🧃", cssVar: "var(--turquoise)" },
  { id: "tamarindo", label: "Tamarindo", icon: "🤎", cssVar: "var(--coral)" },
];

// Rondas con distinta moda para poder rejugar
const ROUNDS: Record<JuiceId, number>[] = [
  { mango: 7, maracuya: 5, tamarindo: 3 },
  { mango: 4, maracuya: 8, tamarindo: 3 },
  { mango: 3, maracuya: 5, tamarindo: 7 },
];

type Phase = "intro" | "votacion" | "preguntas" | "resultado";

export function JuiceModeGame() {
  const [round, setRound] = useState(0);
  const [phase, setPhase] = useState<Phase>("intro");
  const [revealed, setRevealed] = useState(0);
  const [qModa, setQModa] = useState<JuiceId | null>(null);
  const [qVotos, setQVotos] = useState<number | null>(null);
  const [qMenor, setQMenor] = useState<JuiceId | null>(null);

  const targets = ROUNDS[round % ROUNDS.length];
  const totalVotes = targets.mango + targets.maracuya + targets.tamarindo;

  // Secuencia intercalada de votos para la animación de conteo
  const sequence = useMemo(() => {
    const seq: JuiceId[] = [];
    const remaining = { ...targets };
    const order: JuiceId[] = ["mango", "maracuya", "tamarindo"];
    let i = 0;
    while (seq.length < totalVotes) {
      const id = order[i % order.length];
      if (remaining[id] > 0) {
        seq.push(id);
        remaining[id]--;
      }
      i++;
    }
    return seq;
  }, [targets, totalVotes]);

  const counts = useMemo(() => {
    const c: Record<JuiceId, number> = { mango: 0, maracuya: 0, tamarindo: 0 };
    for (let i = 0; i < revealed; i++) c[sequence[i]]++;
    return c;
  }, [revealed, sequence]);

  const moda = (Object.entries(targets) as [JuiceId, number][]).reduce((a, b) =>
    b[1] > a[1] ? b : a
  )[0];
  const menor = (Object.entries(targets) as [JuiceId, number][]).reduce((a, b) =>
    b[1] < a[1] ? b : a
  )[0];
  const maxCount = Math.max(...Object.values(targets));

  const allRevealed = revealed >= totalVotes;
  const allCorrect = qModa === moda && qVotos === targets[moda] && qMenor === menor;

  function nextRound() {
    setRound((r) => r + 1);
    setPhase("votacion");
    setRevealed(0);
    setQModa(null);
    setQVotos(null);
    setQMenor(null);
  }

  return (
    <div className="mx-auto max-w-5xl">
      <div className="relative card-soft overflow-hidden">
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-coral/10 via-cream to-gold/10" />
        <div className="relative p-6 md:p-10 grid md:grid-cols-[auto_1fr] gap-6 items-start">
          <div className="flex md:flex-col items-center gap-4 md:w-44">
            <BuMascot eager className="w-28 md:w-40 h-auto drop-shadow-xl animate-float" />
          </div>

          <div className="flex-1">
            {phase === "intro" && (
              <div className="animate-bounce-in space-y-5">
                <Bubble>
                  <p className="text-lg md:text-xl text-institutional-deep font-medium">
                    ¡El kiosco del recreo solo puede vender <strong>un jugo</strong>! 🧃
                    Para elegirlo, todo el salón votó por su favorito.
                  </p>
                  <p className="mt-3 text-institutional-deep text-lg">
                    El jugo ganador será el <strong>Jugo Estrella</strong> ⭐ — en
                    estadística, el dato que más se repite se llama{" "}
                    <strong>la moda</strong>. ¡Contemos los votos y encontrémosla!
                  </p>
                </Bubble>
                <button onClick={() => setPhase("votacion")} className="btn-primary text-lg">
                  🗳️ ¡Contar los votos!
                </button>
              </div>
            )}

            {phase === "votacion" && (
              <div className="space-y-5">
                <Bubble>
                  <p className="text-lg text-institutional-deep">
                    {allRevealed ? (
                      <>¡Todos los votos contados! 🎉 Mira cómo quedó la gráfica.</>
                    ) : (
                      <>
                        Toca <strong>«Sacar voto»</strong> para leer cada papelito de la
                        urna. La gráfica crece sola: tú concéntrate en{" "}
                        <strong>observar</strong>. 👀
                      </>
                    )}
                  </p>
                </Bubble>

                <div className="card-soft p-5">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold uppercase tracking-widest text-coral">
                      Votos del salón
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {revealed} de {totalVotes}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-6 items-end" style={{ height: 220 }}>
                    {JUICES.map((j) => (
                      <div key={j.id} className="flex flex-col items-center justify-end h-full gap-1">
                        <div className="font-display font-bold text-xl text-institutional-deep">
                          {counts[j.id]}
                        </div>
                        <div
                          className="w-full max-w-20 rounded-t-xl transition-all duration-300"
                          style={{
                            height: `${(counts[j.id] / maxCount) * 150}px`,
                            background: `linear-gradient(180deg, ${j.cssVar}, color-mix(in oklab, ${j.cssVar} 70%, black))`,
                            minHeight: counts[j.id] > 0 ? 8 : 0,
                          }}
                        />
                        <div className="font-display font-bold text-sm text-institutional-deep text-center">
                          {j.icon} {j.label}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {!allRevealed ? (
                  <div className="flex items-center gap-4">
                    <button onClick={() => setRevealed((r) => r + 1)} className="btn-primary text-lg">
                      🗳️ Sacar voto
                    </button>
                    {revealed > 0 && (
                      <span className="text-2xl animate-bounce-in" key={revealed}>
                        {JUICES.find((j) => j.id === sequence[revealed - 1])!.icon} ¡voto para{" "}
                        {JUICES.find((j) => j.id === sequence[revealed - 1])!.label}!
                      </span>
                    )}
                  </div>
                ) : (
                  <button onClick={() => setPhase("preguntas")} className="btn-primary animate-bounce-in">
                    🔍 Analizar los resultados
                  </button>
                )}
              </div>
            )}

            {phase === "preguntas" && (
              <div className="animate-bounce-in space-y-5">
                <div className="card-soft p-5 space-y-3">
                  <p className="font-display font-bold text-institutional-deep">
                    1. ¿Cuál es la moda? (el Jugo Estrella ⭐)
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {JUICES.map((j) => (
                      <button
                        key={j.id}
                        onClick={() => setQModa(j.id)}
                        className={`rounded-2xl px-4 py-2 border-2 font-semibold transition-all ${
                          qModa === j.id
                            ? qModa === moda
                              ? "bg-turquoise/20 border-turquoise text-institutional-deep"
                              : "bg-coral/10 border-coral text-coral"
                            : "bg-white border-institutional/15 text-institutional-deep hover:border-coral"
                        }`}
                      >
                        {j.icon} {j.label}
                      </button>
                    ))}
                  </div>
                  {qModa && qModa !== moda && (
                    <p className="text-sm font-semibold text-coral">
                      La moda es el dato que MÁS se repite. ¿Cuál barra quedó más alta?
                    </p>
                  )}
                </div>

                <div className="card-soft p-5 space-y-3">
                  <p className="font-display font-bold text-institutional-deep">
                    2. ¿Cuántos votos tuvo la moda?
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {[3, 5, 7, 8]
                      .filter((n, i, arr) => arr.indexOf(n) === i)
                      .map((n) => (
                        <button
                          key={n}
                          onClick={() => setQVotos(n)}
                          className={`w-12 h-12 rounded-2xl border-2 font-bold text-lg transition-all ${
                            qVotos === n
                              ? qVotos === targets[moda]
                                ? "bg-turquoise/20 border-turquoise text-institutional-deep"
                                : "bg-coral/10 border-coral text-coral"
                              : "bg-white border-institutional/15 text-institutional-deep hover:border-coral"
                          }`}
                        >
                          {n}
                        </button>
                      ))}
                  </div>
                </div>

                <div className="card-soft p-5 space-y-3">
                  <p className="font-display font-bold text-institutional-deep">
                    3. ¡Pregunta de experto! 🧠 ¿Cuál jugo fue el MENOS votado?
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {JUICES.map((j) => (
                      <button
                        key={j.id}
                        onClick={() => setQMenor(j.id)}
                        className={`rounded-2xl px-4 py-2 border-2 font-semibold transition-all ${
                          qMenor === j.id
                            ? qMenor === menor
                              ? "bg-turquoise/20 border-turquoise text-institutional-deep"
                              : "bg-coral/10 border-coral text-coral"
                            : "bg-white border-institutional/15 text-institutional-deep hover:border-coral"
                        }`}
                      >
                        {j.icon} {j.label}
                      </button>
                    ))}
                  </div>
                  {qMenor && qMenor !== menor && (
                    <p className="text-sm font-semibold text-coral">
                      Ahora busca la barra más BAJITA de la gráfica. 👇
                    </p>
                  )}
                </div>

                {allCorrect && (
                  <button onClick={() => setPhase("resultado")} className="btn-primary animate-bounce-in">
                    ⭐ ¡Coronar al Jugo Estrella!
                  </button>
                )}
              </div>
            )}

            {phase === "resultado" && (
              <div className="animate-bounce-in space-y-5">
                <Bubble>
                  <p className="text-lg text-institutional-deep">
                    🏆 ¡El Jugo Estrella es{" "}
                    <strong>
                      {JUICES.find((j) => j.id === moda)!.icon}{" "}
                      {JUICES.find((j) => j.id === moda)!.label}
                    </strong>{" "}
                    con <strong>{targets[moda]} votos</strong>!
                  </p>
                  <p className="mt-2 text-institutional-deep">
                    Ya sabes el secreto: la <strong>moda</strong> es el dato que más se
                    repite en un conjunto. Los exploradores de datos la usan para tomar
                    decisiones — como qué jugo vender en el kiosco. 🧃
                  </p>
                </Bubble>
                <div className="flex flex-wrap gap-3">
                  <button onClick={nextRound} className="btn-primary">
                    🔄 Otra votación (¡cambian los votos!)
                  </button>
                  <a href="/semana-6" className="btn-secondary">
                    Ahora, los retos de azar 🪙
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Bubble({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative bg-white rounded-3xl p-5 md:p-6 shadow-lg border-2 border-institutional/10">
      <div className="absolute -left-2 top-8 w-4 h-4 rotate-45 bg-white border-l-2 border-b-2 border-institutional/10 hidden md:block" />
      {children}
    </div>
  );
}
