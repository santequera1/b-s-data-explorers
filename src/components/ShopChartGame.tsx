import { useState } from "react";
import { BuMascot } from "./BuMascot";
import { saveProgress } from "@/lib/api";

type ProductId = "bolis" | "fritos" | "mangos";

type ProductDef = {
  id: ProductId;
  label: string;
  icon: string;
  cssVar: string;
  ventas: number;
};

const PRODUCTS: ProductDef[] = [
  { id: "bolis", label: "Bolis", icon: "🍧", cssVar: "var(--turquoise)", ventas: 8 },
  { id: "fritos", label: "Fritos", icon: "🥟", cssVar: "var(--gold)", ventas: 6 },
  { id: "mangos", label: "Mangos", icon: "🥭", cssVar: "var(--coral)", ventas: 4 },
];

const ESCALA = 2; // 1 símbolo = 2 ventas
const MAX_BAR = 10;

type Phase = "intro" | "barras" | "pictograma" | "preguntas" | "resultado";

export function ShopChartGame() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [bars, setBars] = useState<Record<ProductId, number>>({ bolis: 0, fritos: 0, mangos: 0 });
  const [barsChecked, setBarsChecked] = useState(false);
  const [pict, setPict] = useState<Record<ProductId, number>>({ bolis: 0, fritos: 0, mangos: 0 });
  const [pictChecked, setPictChecked] = useState(false);
  const [q1, setQ1] = useState<ProductId | null>(null);
  const [q2, setQ2] = useState<number | null>(null);
  const [errors, setErrors] = useState(0);

  const barsCorrect = PRODUCTS.every((p) => bars[p.id] === p.ventas);
  const pictCorrect = PRODUCTS.every((p) => pict[p.id] === p.ventas / ESCALA);
  const q1Correct = q1 === "bolis";
  const q2Correct = q2 === 2;

  function reset() {
    setPhase("intro");
    setBars({ bolis: 0, fritos: 0, mangos: 0 });
    setBarsChecked(false);
    setPict({ bolis: 0, fritos: 0, mangos: 0 });
    setPictChecked(false);
    setQ1(null);
    setQ2(null);
    setErrors(0);
  }

  function finish() {
    setPhase("resultado");
    saveProgress({
      data: {
        actividad: "modulo-2",
        nota: Math.max(50, 100 - errors * 5),
        detalle: `${errors} errores durante la consultoría`,
      },
    }).catch(() => {});
  }

  return (
    <div className="mx-auto max-w-5xl">
      <div className="relative card-soft overflow-hidden">
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-turquoise/10 via-cream to-gold/10" />
        <div className="relative p-6 md:p-10 grid md:grid-cols-[auto_1fr] gap-6 items-start">
          <div className="flex md:flex-col items-center gap-4 md:w-44">
            <BuMascot eager className="w-28 md:w-40 h-auto drop-shadow-xl animate-float" />
          </div>

          <div className="flex-1">
            {phase === "intro" && (
              <div className="animate-bounce-in space-y-5">
                <Bubble>
                  <p className="text-lg md:text-xl text-institutional-deep font-medium">
                    ¡Doña Marta, la de la tienda escolar, nos contrató como{" "}
                    <strong>consultores de datos</strong>! 🏪 Quiere saber qué se vendió más esta
                    semana para surtir mejor la tienda.
                  </p>
                  <p className="mt-3 text-institutional-deep">
                    Esta es su tabla de ventas. Nuestra misión: convertirla en{" "}
                    <strong>gráficos</strong> que ella entienda de un vistazo.
                  </p>
                </Bubble>
                <SalesTable />
                <button onClick={() => setPhase("barras")} className="btn-primary text-lg">
                  📊 Construir el gráfico de barras
                </button>
              </div>
            )}

            {phase === "barras" && (
              <div className="animate-bounce-in space-y-5">
                <Bubble>
                  <p className="text-lg text-institutional-deep">
                    Usa los botones <strong>+</strong> y <strong>−</strong> para que cada barra
                    llegue justo hasta el número de ventas de la tabla. 👇
                  </p>
                </Bubble>
                <SalesTable compact />
                <div className="card-soft p-5">
                  <div className="grid grid-cols-3 gap-6 items-end" style={{ height: 240 }}>
                    {PRODUCTS.map((p) => (
                      <div
                        key={p.id}
                        className="flex flex-col items-center justify-end h-full gap-2"
                      >
                        <div className="font-display font-bold text-institutional-deep">
                          {bars[p.id]}
                        </div>
                        <div
                          className="w-full max-w-20 rounded-t-xl transition-all duration-300"
                          style={{
                            height: `${(bars[p.id] / MAX_BAR) * 170}px`,
                            background: `linear-gradient(180deg, ${p.cssVar}, color-mix(in oklab, ${p.cssVar} 70%, black))`,
                            minHeight: bars[p.id] > 0 ? 8 : 0,
                          }}
                        />
                        <div className="font-display font-bold text-sm text-institutional-deep">
                          {p.icon} {p.label}
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setBars((b) => ({ ...b, [p.id]: Math.max(0, b[p.id] - 1) }));
                              setBarsChecked(false);
                            }}
                            aria-label={`Quitar uno a ${p.label}`}
                            className="w-10 h-10 rounded-full bg-white border-2 border-institutional/15 font-bold text-xl text-institutional-deep hover:border-coral transition-colors"
                          >
                            −
                          </button>
                          <button
                            onClick={() => {
                              setBars((b) => ({ ...b, [p.id]: Math.min(MAX_BAR, b[p.id] + 1) }));
                              setBarsChecked(false);
                            }}
                            aria-label={`Sumar uno a ${p.label}`}
                            className="w-10 h-10 rounded-full bg-white border-2 border-institutional/15 font-bold text-xl text-institutional-deep hover:border-coral transition-colors"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                {barsChecked && !barsCorrect && (
                  <p className="text-sm font-semibold text-coral animate-bounce-in">
                    📏 Compara cada barra con la tabla: alguna no coincide todavía.
                  </p>
                )}
                <button
                  onClick={() => {
                    setBarsChecked(true);
                    if (barsCorrect) setPhase("pictograma");
                    else setErrors((e) => e + 1);
                  }}
                  className="btn-primary"
                >
                  ✅ Revisar mis barras
                </button>
              </div>
            )}

            {phase === "pictograma" && (
              <div className="animate-bounce-in space-y-5">
                <Bubble>
                  <p className="text-lg text-institutional-deep">
                    ¡Barras perfectas! Ahora un <strong>pictograma</strong>: dibujamos con símbolos.
                    Pero atención a la <strong>escala</strong>:
                  </p>
                  <p className="mt-2 text-xl font-display font-bold text-institutional-deep text-center">
                    1 símbolo ⭐ = {ESCALA} ventas
                  </p>
                  <p className="mt-2 text-institutional-deep">
                    ¿Cuántos símbolos necesita cada producto?
                  </p>
                </Bubble>
                <SalesTable compact />
                <div className="card-soft p-5 space-y-4">
                  {PRODUCTS.map((p) => (
                    <div key={p.id} className="flex items-center gap-3 flex-wrap">
                      <span className="font-display font-bold text-institutional-deep w-24">
                        {p.icon} {p.label}
                      </span>
                      <span className="flex gap-1 text-2xl min-w-32">
                        {Array.from({ length: pict[p.id] }).map((_, i) => (
                          <span key={i} className="animate-bounce-in">
                            ⭐
                          </span>
                        ))}
                      </span>
                      <span className="ml-auto flex gap-1.5">
                        {[1, 2, 3, 4, 5].map((n) => (
                          <button
                            key={n}
                            onClick={() => {
                              setPict((v) => ({ ...v, [p.id]: n }));
                              setPictChecked(false);
                            }}
                            className={`w-10 h-10 rounded-xl font-bold border-2 transition-all ${
                              pict[p.id] === n
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
                {pictChecked && !pictCorrect && (
                  <p className="text-sm font-semibold text-coral animate-bounce-in">
                    🤔 Recuerda: cada ⭐ vale {ESCALA} ventas. Si vendimos 8 bolis, ¿cuántas
                    estrellas son? Piensa en contar de 2 en 2.
                  </p>
                )}
                <button
                  onClick={() => {
                    setPictChecked(true);
                    if (pictCorrect) setPhase("preguntas");
                    else setErrors((e) => e + 1);
                  }}
                  disabled={PRODUCTS.some((p) => pict[p.id] === 0)}
                  className="btn-primary disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  ✅ Revisar mi pictograma
                </button>
              </div>
            )}

            {phase === "preguntas" && (
              <div className="animate-bounce-in space-y-5">
                <Bubble>
                  <p className="text-lg text-institutional-deep">
                    ¡Pictograma con escala dominado! 🌟 Última parte de la consultoría: responder
                    las preguntas de doña Marta.
                  </p>
                </Bubble>

                <div className="card-soft p-5 space-y-3">
                  <p className="font-display font-bold text-institutional-deep">
                    1. ¿Qué producto se vendió MÁS esta semana?
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {PRODUCTS.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => {
                          setQ1(p.id);
                          if (p.id !== "bolis") setErrors((e) => e + 1);
                        }}
                        className={`rounded-2xl px-4 py-2 border-2 font-semibold transition-all ${
                          q1 === p.id
                            ? q1Correct
                              ? "bg-turquoise/20 border-turquoise text-institutional-deep"
                              : "bg-coral/10 border-coral text-coral"
                            : "bg-white border-institutional/15 text-institutional-deep hover:border-coral"
                        }`}
                      >
                        {p.icon} {p.label}
                      </button>
                    ))}
                  </div>
                  {q1 && !q1Correct && (
                    <p className="text-sm font-semibold text-coral">
                      Mira cuál barra es la más alta 👀
                    </p>
                  )}
                </div>

                <div className="card-soft p-5 space-y-3">
                  <p className="font-display font-bold text-institutional-deep">
                    2. ¿Cuántos fritos MÁS que mangos se vendieron?
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {[1, 2, 3, 4].map((n) => (
                      <button
                        key={n}
                        onClick={() => {
                          setQ2(n);
                          if (n !== 2) setErrors((e) => e + 1);
                        }}
                        className={`w-12 h-12 rounded-2xl border-2 font-bold text-lg transition-all ${
                          q2 === n
                            ? q2Correct
                              ? "bg-turquoise/20 border-turquoise text-institutional-deep"
                              : "bg-coral/10 border-coral text-coral"
                            : "bg-white border-institutional/15 text-institutional-deep hover:border-coral"
                        }`}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                  {q2 !== null && !q2Correct && (
                    <p className="text-sm font-semibold text-coral">
                      Resta: fritos (6) − mangos (4) = … 🧮
                    </p>
                  )}
                </div>

                {q1Correct && q2Correct && (
                  <button onClick={finish} className="btn-primary animate-bounce-in">
                    🏅 Entregar la consultoría
                  </button>
                )}
              </div>
            )}

            {phase === "resultado" && (
              <div className="animate-bounce-in space-y-5">
                <Bubble>
                  <p className="text-lg text-institutional-deep">
                    🎉 ¡Consultoría entregada! Doña Marta ya sabe que los{" "}
                    <strong>bolis 🍧 son su producto estrella</strong> y que debe surtir más. Hoy
                    aprendiste a construir <strong>gráficos de barras</strong> y{" "}
                    <strong>pictogramas con escala</strong> — las herramientas favoritas de los
                    exploradores de datos.
                  </p>
                </Bubble>
                <div className="flex flex-wrap gap-3">
                  <button onClick={reset} className="btn-primary">
                    🔄 Jugar de nuevo
                  </button>
                  <a href="/modulo-3" className="btn-secondary">
                    Siguiente misión: El Jugo Estrella 🧃
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

function SalesTable({ compact }: { compact?: boolean }) {
  return (
    <div className={`card-soft bg-cream ${compact ? "p-3" : "p-5"}`}>
      <div className="text-xs font-bold uppercase tracking-widest text-coral mb-2">
        Ventas de la semana · Tienda escolar
      </div>
      <div className="grid grid-cols-3 gap-2 text-center">
        {PRODUCTS.map((p) => (
          <div key={p.id} className="bg-white rounded-xl p-2 border border-institutional/10">
            <div className={compact ? "text-xl" : "text-2xl"}>{p.icon}</div>
            <div className="text-xs font-semibold text-muted-foreground">{p.label}</div>
            <div className="font-display font-bold text-xl" style={{ color: p.cssVar }}>
              {p.ventas}
            </div>
          </div>
        ))}
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
