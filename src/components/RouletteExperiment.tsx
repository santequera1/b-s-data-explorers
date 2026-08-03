import { useEffect, useMemo, useState } from "react";
import { BuMascot } from "./BuMascot";
import { saveProgress } from "@/lib/api";

type ColorId = "turquesa" | "dorado" | "coral";

type ColorDef = {
  id: ColorId;
  label: string;
  icon: string;
  cssVar: string;
  slices: number;
};

const COLORS: ColorDef[] = [
  { id: "turquesa", label: "Turquesa", icon: "🐠", cssVar: "var(--turquoise)", slices: 4 },
  { id: "dorado", label: "Dorado", icon: "🌟", cssVar: "var(--gold)", slices: 3 },
  { id: "coral", label: "Coral", icon: "🍓", cssVar: "var(--coral)", slices: 1 },
];

const TOTAL_SPINS = 8;
const SLICE_COUNT = COLORS.reduce((acc, c) => acc + c.slices, 0);
const SLICE_ANGLE = 360 / SLICE_COUNT;

// Interleave slices so equal colors aren't all contiguous
const WHEEL: ColorId[] = [
  "turquesa",
  "dorado",
  "turquesa",
  "coral",
  "turquesa",
  "dorado",
  "turquesa",
  "dorado",
];

type Phase = "prediccion" | "jugando" | "resultado";

type Props = {
  playerName?: string;
  soundOn: boolean;
};

export function RouletteExperiment({ playerName, soundOn }: Props) {
  const [phase, setPhase] = useState<Phase>("prediccion");
  const [prediction, setPrediction] = useState<ColorDef | null>(null);
  const [results, setResults] = useState<ColorId[]>([]);
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [lastResult, setLastResult] = useState<ColorId | null>(null);

  const counts = useMemo(() => {
    const c: Record<ColorId, number> = { turquesa: 0, dorado: 0, coral: 0 };
    for (const r of results) c[r]++;
    return c;
  }, [results]);

  useEffect(() => {
    if (phase === "resultado" && prediction) {
      const max = Math.max(...COLORS.map((c) => counts[c.id]));
      const hit = counts[prediction.id] === max;
      saveProgress({
        data: {
          actividad: "reto-ruleta",
          nota: 100,
          detalle: hit ? "Predicción acertada" : "Predicción no acertada",
        },
      }).catch(() => {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  function playBlip() {
    if (!soundOn) return;
    try {
      const ctx = new (window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.frequency.value = 420;
      o.type = "triangle";
      g.gain.value = 0.08;
      o.connect(g).connect(ctx.destination);
      o.start();
      o.frequency.exponentialRampToValueAtTime(760, ctx.currentTime + 0.3);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
      o.stop(ctx.currentTime + 0.35);
    } catch {
      /* ignore */
    }
  }

  function spin() {
    if (spinning || results.length >= TOTAL_SPINS) return;
    setSpinning(true);
    setLastResult(null);
    playBlip();

    const sliceIndex = Math.floor(Math.random() * SLICE_COUNT);
    const landed = WHEEL[sliceIndex];

    // Rotate so the winning slice's center ends up under the top pointer
    const sliceCenter = sliceIndex * SLICE_ANGLE + SLICE_ANGLE / 2;
    const current = ((rotation % 360) + 360) % 360;
    const target = (360 - sliceCenter + 360) % 360;
    const delta = (target - current + 360) % 360;
    const jitter = (Math.random() - 0.5) * (SLICE_ANGLE * 0.6);
    const fullSpins = 4 + Math.floor(Math.random() * 3);
    const nextRotation = rotation + fullSpins * 360 + delta + jitter;
    setRotation(nextRotation);

    setTimeout(() => {
      setLastResult(landed);
      setResults((r) => {
        const updated = [...r, landed];
        if (updated.length >= TOTAL_SPINS) {
          setTimeout(() => setPhase("resultado"), 600);
        }
        return updated;
      });
      setSpinning(false);
    }, 3200);
  }

  function reset() {
    setPhase("prediccion");
    setPrediction(null);
    setResults([]);
    setRotation(0);
    setLastResult(null);
  }

  const greeting = playerName ? `¡Hola, ${playerName}!` : "¡Hola, explorador!";

  return (
    <div className="mx-auto max-w-5xl">
      <div className="relative card-soft overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-b from-coral/10 via-cream to-turquoise/15" />
        </div>

        <div className="relative p-6 md:p-10 grid md:grid-cols-[auto_1fr] gap-6 items-start">
          <div className="flex md:flex-col items-center gap-4 md:w-48">
            <BuMascot eager className="w-32 md:w-44 h-auto drop-shadow-xl animate-float" />
          </div>

          <div className="flex-1">
            {phase === "prediccion" && (
              <PredictionPhase
                greeting={greeting}
                onPick={(c) => {
                  setPrediction(c);
                  setPhase("jugando");
                }}
              />
            )}

            {phase === "jugando" && (
              <PlayPhase
                counts={counts}
                total={TOTAL_SPINS}
                done={results.length}
                rotation={rotation}
                spinning={spinning}
                lastResult={lastResult}
                onSpin={spin}
              />
            )}

            {phase === "resultado" && prediction && (
              <ResultPhase counts={counts} prediction={prediction} onReset={reset} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- UI pieces ---------- */

function Bubble({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative bg-white rounded-3xl p-5 md:p-6 shadow-lg border-2 border-institutional/10">
      <div className="absolute -left-2 top-8 w-4 h-4 rotate-45 bg-white border-l-2 border-b-2 border-institutional/10 hidden md:block" />
      {children}
    </div>
  );
}

function Wheel({ rotation, spinning }: { rotation: number; spinning: boolean }) {
  const size = 260;
  const r = size / 2;

  function sliceLabelPos(i: number) {
    const angle = ((i * SLICE_ANGLE + SLICE_ANGLE / 2 - 90) * Math.PI) / 180;
    return {
      x: r + Math.cos(angle) * r * 0.62,
      y: r + Math.sin(angle) * r * 0.62,
    };
  }

  function slicePath(i: number) {
    const a0 = ((i * SLICE_ANGLE - 90) * Math.PI) / 180;
    const a1 = (((i + 1) * SLICE_ANGLE - 90) * Math.PI) / 180;
    const x0 = r + Math.cos(a0) * r;
    const y0 = r + Math.sin(a0) * r;
    const x1 = r + Math.cos(a1) * r;
    const y1 = r + Math.sin(a1) * r;
    return `M ${r} ${r} L ${x0} ${y0} A ${r} ${r} 0 0 1 ${x1} ${y1} Z`;
  }

  return (
    <div className="relative" style={{ width: size, height: size }}>
      {/* Pointer */}
      <div
        className="absolute left-1/2 -top-2 -translate-x-1/2 z-10 text-3xl drop-shadow"
        aria-hidden
      >
        🔻
      </div>
      <svg
        viewBox={`0 0 ${size} ${size}`}
        width={size}
        height={size}
        role="img"
        aria-label={spinning ? "La ruleta está girando" : "Ruleta de colores"}
        style={{
          transform: `rotate(${rotation}deg)`,
          transition: "transform 3.2s cubic-bezier(0.22, 1, 0.36, 1)",
          borderRadius: "50%",
          boxShadow:
            "0 0 0 8px white, 0 0 0 10px color-mix(in oklab, var(--institutional) 25%, white), 0 16px 40px -12px color-mix(in oklab, var(--institutional) 45%, transparent)",
        }}
      >
        {WHEEL.map((colorId, i) => {
          const def = COLORS.find((c) => c.id === colorId)!;
          const pos = sliceLabelPos(i);
          return (
            <g key={i}>
              <path d={slicePath(i)} fill={def.cssVar} stroke="white" strokeWidth="3" />
              <text
                x={pos.x}
                y={pos.y}
                fontSize="22"
                textAnchor="middle"
                dominantBaseline="central"
              >
                {def.icon}
              </text>
            </g>
          );
        })}
        <circle cx={r} cy={r} r={22} fill="white" />
        <text x={r} y={r + 1} fontSize="20" textAnchor="middle" dominantBaseline="central">
          🦉
        </text>
      </svg>
    </div>
  );
}

function PredictionPhase({
  greeting,
  onPick,
}: {
  greeting: string;
  onPick: (c: ColorDef) => void;
}) {
  return (
    <div className="animate-bounce-in space-y-5">
      <Bubble>
        <p className="text-lg md:text-xl text-institutional-deep font-medium">
          {greeting} Mira mi ruleta: tiene <strong>8 casillas</strong> — 4 turquesas 🐠,
          3 doradas 🌟 y solo 1 coral 🍓.
        </p>
        <p className="mt-3 text-institutional-deep text-lg">
          Vamos a girarla <strong>{TOTAL_SPINS} veces</strong>. ¿Qué color crees que
          saldrá <strong>más veces</strong>?
        </p>
      </Bubble>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {COLORS.map((c) => (
          <button
            key={c.id}
            onClick={() => onPick(c)}
            className="min-h-16 rounded-2xl bg-white border-2 border-institutional/15 hover:border-coral hover:bg-coral/5 active:scale-[0.98] transition-all p-4 text-left"
          >
            <div className="text-xs font-bold uppercase tracking-wider text-turquoise">
              Mi predicción
            </div>
            <div className="font-display font-bold text-xl text-institutional-deep flex items-center gap-2">
              <span>{c.icon}</span> {c.label}
            </div>
            <div className="text-xs text-muted-foreground mt-0.5">
              {c.slices} {c.slices === 1 ? "casilla" : "casillas"}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function PlayPhase({
  counts,
  total,
  done,
  rotation,
  spinning,
  lastResult,
  onSpin,
}: {
  counts: Record<ColorId, number>;
  total: number;
  done: number;
  rotation: number;
  spinning: boolean;
  lastResult: ColorId | null;
  onSpin: () => void;
}) {
  const remaining = total - done;
  const last = lastResult ? COLORS.find((c) => c.id === lastResult) : null;

  return (
    <div className="grid gap-6 md:grid-cols-[1fr_260px] items-start">
      <div className="flex flex-col items-center gap-6 py-4">
        <Wheel rotation={rotation} spinning={spinning} />
        <button
          onClick={onSpin}
          disabled={spinning || remaining === 0}
          className="btn-primary text-xl px-10 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {spinning ? "Girando…" : remaining === 0 ? "¡Listo!" : "¡Girar!"}
        </button>
        <div className="text-sm text-muted-foreground min-h-6" aria-live="polite">
          {last && !spinning ? (
            <span className="font-semibold text-institutional-deep">
              Salió {last.icon} {last.label} ·{" "}
            </span>
          ) : null}
          Giro <strong>{done}</strong> de {total}
        </div>
      </div>

      <div className="card-soft p-5 bg-cream">
        <div className="text-xs font-bold uppercase tracking-widest text-coral">
          Libreta de Bú
        </div>
        <div className="mt-3 space-y-3">
          {COLORS.map((c) => (
            <TallyRow key={c.id} def={c} count={counts[c.id]} />
          ))}
        </div>
      </div>
    </div>
  );
}

function TallyRow({ def, count }: { def: ColorDef; count: number }) {
  return (
    <div>
      <div className="flex items-center justify-between text-sm">
        <span className="font-display font-bold text-institutional-deep">
          {def.icon} {def.label}
        </span>
        <span className="font-bold" style={{ color: def.cssVar }}>
          {count}
        </span>
      </div>
      <div className="mt-1 flex gap-1">
        {Array.from({ length: count }).map((_, i) => (
          <span
            key={i}
            className="inline-block w-1.5 h-6 rounded-full animate-bounce-in"
            style={{ background: def.cssVar, animationDelay: `${i * 40}ms` }}
          />
        ))}
      </div>
    </div>
  );
}

function ResultPhase({
  counts,
  prediction,
  onReset,
}: {
  counts: Record<ColorId, number>;
  prediction: ColorDef;
  onReset: () => void;
}) {
  const max = Math.max(...COLORS.map((c) => counts[c.id]), 1);
  const winners = COLORS.filter((c) => counts[c.id] === max);
  const hit = winners.some((w) => w.id === prediction.id);

  return (
    <div className="animate-bounce-in space-y-5">
      <Bubble>
        <p className="text-lg text-institutional-deep">
          Tú predijiste que ganaría{" "}
          <strong>
            {prediction.icon} {prediction.label}
          </strong>
          , y el color que más salió fue{" "}
          <strong className="text-coral">
            {winners.map((w) => `${w.icon} ${w.label}`).join(" y ")}
          </strong>
          .
        </p>
        <p className="mt-2 text-institutional-deep">
          {hit
            ? "¡Acertaste! Cuando un color tiene más casillas, es más probable que salga. 🎯"
            : "Esta vez el azar te sorprendió. Pero fíjate: entre más casillas tiene un color, más probable es que salga."}
        </p>
        <p className="mt-2 text-institutional-deep text-sm">
          💡 Turquesa tiene 4 casillas de 8, ¡la mitad de la ruleta! Por eso suele ganar.
          Coral solo tiene 1, por eso es el <strong>menos probable</strong>.
        </p>
      </Bubble>

      <div className="card-soft p-6">
        <div className="text-xs font-bold uppercase tracking-widest text-turquoise">
          Resultado real
        </div>
        <div className="mt-4 grid grid-cols-3 gap-6 items-end h-48">
          {COLORS.map((c) => (
            <div key={c.id} className="flex flex-col items-center justify-end h-full">
              <div className="text-2xl font-display font-bold text-institutional-deep">
                {counts[c.id]}
              </div>
              <div
                className="w-full rounded-t-2xl transition-all duration-1000"
                style={{
                  height: `${(counts[c.id] / max) * 100}%`,
                  minHeight: "8px",
                  background: `linear-gradient(180deg, ${c.cssVar}, color-mix(in oklab, ${c.cssVar} 70%, black))`,
                }}
              />
              <div className="mt-2 font-display font-bold text-institutional-deep text-sm md:text-base">
                {c.icon} {c.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <button onClick={onReset} className="btn-primary">
          🔄 Jugar de nuevo
        </button>
      </div>
    </div>
  );
}
