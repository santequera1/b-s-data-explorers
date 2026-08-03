import { useMemo, useState } from "react";
import { BuMascot } from "./BuMascot";
import { saveProgress } from "@/lib/api";

type FruitId = "mango" | "banano" | "patilla";

type FruitDef = { id: FruitId; label: string; icon: string; cssVar: string };

const FRUITS: FruitDef[] = [
  { id: "mango", label: "Mango", icon: "🥭", cssVar: "var(--gold)" },
  { id: "banano", label: "Banano", icon: "🍌", cssVar: "var(--turquoise)" },
  { id: "patilla", label: "Patilla", icon: "🍉", cssVar: "var(--coral)" },
];

// 12 amigos encuestados: 6 mango, 4 banano, 2 patilla
const BASE_VOTES: FruitId[] = [
  "mango", "banano", "mango", "patilla", "mango", "banano",
  "mango", "mango", "banano", "patilla", "banano", "mango",
];

const KID_FACES = ["👧🏽", "👦🏾", "👧🏻", "👦🏽", "👧🏾", "👦🏻", "👧🏿", "👦🏿", "👧🏼", "👦🏼", "👧🏽", "👦🏾"];

type Phase = "intro" | "encuesta" | "tabla" | "resultado";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function FruitDataGame() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [votes, setVotes] = useState<FruitId[]>(() => shuffle(BASE_VOTES));
  const [current, setCurrent] = useState(0);
  const [counts, setCounts] = useState<Record<FruitId, number>>({ mango: 0, banano: 0, patilla: 0 });
  const [shake, setShake] = useState(false);
  const [answers, setAnswers] = useState<Record<FruitId, number | null>>({ mango: null, banano: null, patilla: null });
  const [tableChecked, setTableChecked] = useState(false);
  const [favorite, setFavorite] = useState<FruitId | null>(null);
  const [errors, setErrors] = useState(0);

  const realCounts = useMemo(() => {
    const c: Record<FruitId, number> = { mango: 0, banano: 0, patilla: 0 };
    for (const v of votes) c[v]++;
    return c;
  }, [votes]);

  const done = current >= votes.length;
  const tableCorrect =
    answers.mango === realCounts.mango &&
    answers.banano === realCounts.banano &&
    answers.patilla === realCounts.patilla;

  function registerVote(picked: FruitId) {
    if (done) return;
    const actual = votes[current];
    if (picked === actual) {
      setCounts((c) => ({ ...c, [picked]: c[picked] + 1 }));
      setCurrent((i) => i + 1);
    } else {
      setErrors((e) => e + 1);
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  }

  function reset() {
    setVotes(shuffle(BASE_VOTES));
    setPhase("intro");
    setCurrent(0);
    setCounts({ mango: 0, banano: 0, patilla: 0 });
    setAnswers({ mango: null, banano: null, patilla: null });
    setTableChecked(false);
    setFavorite(null);
    setErrors(0);
  }

  function pickFavorite(id: FruitId) {
    setFavorite(id);
    if (id === "mango") {
      saveProgress({
        data: {
          actividad: "modulo-1",
          nota: Math.max(50, 100 - errors * 5),
          detalle: `${errors} errores durante la misión`,
        },
      }).catch(() => {});
    } else {
      setErrors((e) => e + 1);
    }
  }

  return (
    <div className="mx-auto max-w-5xl">
      <div className="relative card-soft overflow-hidden">
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-gold/10 via-cream to-turquoise/10" />
        <div className="relative p-6 md:p-10 grid md:grid-cols-[auto_1fr] gap-6 items-start">
          <div className="flex md:flex-col items-center gap-4 md:w-44">
            <BuMascot eager className="w-28 md:w-40 h-auto drop-shadow-xl animate-float" />
          </div>

          <div className="flex-1">
            {phase === "intro" && (
              <div className="animate-bounce-in space-y-5">
                <Bubble>
                  <p className="text-lg md:text-xl text-institutional-deep font-medium">
                    ¡Hola, explorador! Un <strong>dato</strong> es una pieza de
                    información que recogemos del mundo: una respuesta, un color, un
                    número…
                  </p>
                  <p className="mt-3 text-institutional-deep text-lg">
                    La profe tiene un dilema: quiere llevar <strong>una sola fruta</strong>{" "}
                    a la salida pedagógica, ¡pero no sabe cuál! Vamos a{" "}
                    <strong>encuestar a 12 amigos</strong> y registrar cada respuesta como
                    un dato. 🍉🥭🍌
                  </p>
                </Bubble>
                <button onClick={() => setPhase("encuesta")} className="btn-primary text-lg">
                  🎤 ¡Empezar la encuesta!
                </button>
              </div>
            )}

            {phase === "encuesta" && (
              <div className="space-y-5">
                {!done ? (
                  <>
                    <Bubble>
                      <div className="flex items-center gap-4">
                        <div className="text-5xl">{KID_FACES[current]}</div>
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Amigo {current + 1} de {votes.length} dice:
                          </p>
                          <p className="text-xl font-display font-bold text-institutional-deep">
                            «¡Mi fruta favorita es{" "}
                            <span className="text-coral">
                              {FRUITS.find((f) => f.id === votes[current])!.label.toLowerCase()}
                            </span>
                            ! {FRUITS.find((f) => f.id === votes[current])!.icon}»
                          </p>
                        </div>
                      </div>
                      <p className="mt-3 text-sm text-institutional-deep">
                        Toca la fila correcta de la libreta para registrar este dato 👇
                      </p>
                    </Bubble>
                    <div className={`grid gap-3 ${shake ? "animate-[shake_0.4s]" : ""}`}>
                      {FRUITS.map((f) => (
                        <button
                          key={f.id}
                          onClick={() => registerVote(f.id)}
                          className="card-soft p-4 flex items-center gap-4 border-2 border-transparent hover:border-coral active:scale-[0.99] transition-all text-left"
                        >
                          <span className="text-3xl">{f.icon}</span>
                          <span className="font-display font-bold text-lg text-institutional-deep w-24">
                            {f.label}
                          </span>
                          <span className="flex flex-wrap gap-1 flex-1">
                            {Array.from({ length: counts[f.id] }).map((_, i) => (
                              <span
                                key={i}
                                className="inline-block w-1.5 h-6 rounded-full animate-bounce-in"
                                style={{ background: f.cssVar }}
                              />
                            ))}
                          </span>
                          <span className="font-bold text-xl" style={{ color: f.cssVar }}>
                            {counts[f.id]}
                          </span>
                        </button>
                      ))}
                    </div>
                    {shake && (
                      <p className="text-sm font-semibold text-coral animate-bounce-in">
                        🙉 ¡Escucha bien! Esa no fue la fruta que dijo tu amigo.
                      </p>
                    )}
                  </>
                ) : (
                  <div className="animate-bounce-in space-y-5">
                    <Bubble>
                      <p className="text-lg text-institutional-deep">
                        ¡Encuesta terminada! 🎉 Registraste <strong>12 datos</strong>.
                        Ahora organicémoslos en una <strong>tabla de frecuencia</strong>:
                        cuenta los palotes y escribe cuántos votos tuvo cada fruta.
                      </p>
                    </Bubble>
                    <button onClick={() => setPhase("tabla")} className="btn-primary">
                      📋 Completar la tabla
                    </button>
                  </div>
                )}
              </div>
            )}

            {phase === "tabla" && (
              <div className="animate-bounce-in space-y-5">
                <Bubble>
                  <p className="text-lg text-institutional-deep">
                    La <strong>frecuencia</strong> es el número de veces que se repite un
                    dato. ¿Cuántos votos tuvo cada fruta?
                  </p>
                </Bubble>
                <div className="card-soft p-5 bg-cream space-y-4">
                  {FRUITS.map((f) => (
                    <div key={f.id} className="flex items-center gap-3 flex-wrap">
                      <span className="text-2xl">{f.icon}</span>
                      <span className="font-display font-bold text-institutional-deep w-20">
                        {f.label}
                      </span>
                      <span className="flex gap-1">
                        {Array.from({ length: realCounts[f.id] }).map((_, i) => (
                          <span
                            key={i}
                            className="inline-block w-1.5 h-6 rounded-full"
                            style={{ background: f.cssVar }}
                          />
                        ))}
                      </span>
                      <span className="ml-auto flex gap-1.5">
                        {[2, 3, 4, 5, 6, 7].map((n) => (
                          <button
                            key={n}
                            onClick={() => {
                              setAnswers((a) => ({ ...a, [f.id]: n }));
                              setTableChecked(false);
                            }}
                            className={`w-10 h-10 rounded-xl font-bold border-2 transition-all ${
                              answers[f.id] === n
                                ? "bg-institutional text-white border-institutional"
                                : "bg-white border-institutional/15 text-institutional-deep hover:border-coral"
                            }`}
                          >
                            {n}
                          </button>
                        ))}
                      </span>
                    </div>
                  ))}
                </div>
                {tableChecked && !tableCorrect && (
                  <p className="text-sm font-semibold text-coral animate-bounce-in">
                    🔍 Casi… vuelve a contar los palotes de cada fila.
                  </p>
                )}
                <button
                  onClick={() => {
                    setTableChecked(true);
                    if (tableCorrect) setPhase("resultado");
                  }}
                  disabled={answers.mango === null || answers.banano === null || answers.patilla === null}
                  className="btn-primary disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  ✅ Revisar mi tabla
                </button>
              </div>
            )}

            {phase === "resultado" && (
              <div className="animate-bounce-in space-y-5">
                <Bubble>
                  <p className="text-lg text-institutional-deep">
                    ¡Tabla perfecta! 🏅 Ahora resuelve el dilema de la profe: según los
                    datos, ¿qué fruta debe llevar a la salida?
                  </p>
                </Bubble>
                <div className="grid grid-cols-3 gap-3">
                  {FRUITS.map((f) => (
                    <button
                      key={f.id}
                      onClick={() => pickFavorite(f.id)}
                      className={`card-soft p-4 text-center border-2 transition-all ${
                        favorite === f.id ? "border-coral bg-coral/5" : "border-transparent hover:border-coral/50"
                      }`}
                    >
                      <div className="text-4xl">{f.icon}</div>
                      <div className="font-display font-bold text-institutional-deep mt-1">
                        {f.label}
                      </div>
                      <div className="text-sm text-muted-foreground">{realCounts[f.id]} votos</div>
                    </button>
                  ))}
                </div>
                {favorite && (
                  <Bubble>
                    {favorite === "mango" ? (
                      <p className="text-lg text-institutional-deep">
                        🎉 ¡Exacto! El <strong>mango</strong> ganó con{" "}
                        <strong>{realCounts.mango} votos</strong>. Acabas de hacer lo que
                        hacen los estadísticos: <strong>recolectar datos</strong>,{" "}
                        <strong>organizarlos en una tabla</strong> y{" "}
                        <strong>tomar una decisión</strong> con ellos. ¡Dilema resuelto!
                      </p>
                    ) : (
                      <p className="text-lg text-institutional-deep">
                        🤔 Mira bien la tabla: ¿cuál fruta tiene <strong>más</strong>{" "}
                        votos?
                      </p>
                    )}
                  </Bubble>
                )}
                {favorite === "mango" && (
                  <div className="flex flex-wrap gap-3">
                    <button onClick={reset} className="btn-primary">
                      🔄 Jugar de nuevo
                    </button>
                    <a href="/modulo-2" className="btn-secondary">
                      Siguiente misión: La Tienda Escolar 🏪
                    </a>
                  </div>
                )}
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
