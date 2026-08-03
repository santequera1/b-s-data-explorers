import { useEffect, useMemo, useState } from "react";
import { BuMascot } from "./BuMascot";
import { saveProgress } from "@/lib/api";

type Face = "cara" | "sello";
type Range = { id: string; label: string; min: number; max: number };

const RANGES: Range[] = [
  { id: "a", label: "0 a 2 veces", min: 0, max: 2 },
  { id: "b", label: "3 a 5 veces", min: 3, max: 5 },
  { id: "c", label: "6 a 8 veces", min: 6, max: 8 },
  { id: "d", label: "9 o 10 veces", min: 9, max: 10 },
];

const TOTAL_FLIPS = 10;

type Phase = "prediccion" | "jugando" | "resultado";

type Props = {
  playerName?: string;
  soundOn: boolean;
};

export function CoinExperiment({ playerName, soundOn }: Props) {
  const [phase, setPhase] = useState<Phase>("prediccion");
  const [prediction, setPrediction] = useState<Range | null>(null);
  const [results, setResults] = useState<Face[]>([]);
  const [flipping, setFlipping] = useState(false);
  const [currentFace, setCurrentFace] = useState<Face>("cara");
  const [rotation, setRotation] = useState(0);

  const caras = useMemo(() => results.filter((r) => r === "cara").length, [results]);
  const sellos = results.length - caras;

  useEffect(() => {
    if (phase === "resultado" && prediction) {
      const hit = caras >= prediction.min && caras <= prediction.max;
      saveProgress({
        data: {
          actividad: "reto-moneda",
          nota: 100,
          detalle: hit
            ? `Predicción acertada (${caras} caras)`
            : `Predicción no acertada (${caras} caras)`,
        },
      }).catch(() => {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  function playBlip() {
    if (!soundOn) return;
    try {
      const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.frequency.value = 520;
      o.type = "triangle";
      g.gain.value = 0.08;
      o.connect(g).connect(ctx.destination);
      o.start();
      o.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.25);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
      o.stop(ctx.currentTime + 0.3);
    } catch {
      /* ignore */
    }
  }

  function flip() {
    if (flipping || results.length >= TOTAL_FLIPS) return;
    setFlipping(true);
    playBlip();
    const next: Face = Math.random() < 0.5 ? "cara" : "sello";
    const spins = 6 + Math.floor(Math.random() * 3);
    const extra = next === "cara" ? 0 : 180;
    const nextRotation = rotation + spins * 360 + extra;
    setRotation(nextRotation);
    setTimeout(() => {
      setCurrentFace(next);
      setResults((r) => {
        const updated = [...r, next];
        if (updated.length >= TOTAL_FLIPS) {
          setTimeout(() => setPhase("resultado"), 400);
        }
        return updated;
      });
      setFlipping(false);
    }, 2400);
  }

  function reset() {
    setPhase("prediccion");
    setPrediction(null);
    setResults([]);
    setRotation(0);
    setCurrentFace("cara");
  }

  const greeting = playerName ? `¡Hola, ${playerName}!` : "¡Hola, explorador!";

  return (
    <div className="mx-auto max-w-5xl">
      {/* Lab scene wrapper */}
      <div className="relative card-soft overflow-hidden">
        {/* Backdrop: window with jungle */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-b from-turquoise/20 via-cream to-gold-soft/40" />
          <div className="absolute top-6 right-6 w-40 h-28 rounded-2xl bg-gradient-to-b from-turquoise/60 to-institutional/70 opacity-70 hidden md:block" />
        </div>

        <div className="relative p-6 md:p-10 grid md:grid-cols-[auto_1fr] gap-6 items-start">
          {/* Bú + dialogue */}
          <div className="flex md:flex-col items-center gap-4 md:w-48">
            <BuMascot eager className="w-32 md:w-44 h-auto drop-shadow-xl animate-float" />
          </div>

          <div className="flex-1">
            {phase === "prediccion" && (
              <PredictionPhase
                greeting={greeting}
                onPick={(r) => {
                  setPrediction(r);
                  setPhase("jugando");
                }}
              />
            )}

            {phase === "jugando" && (
              <PlayPhase
                caras={caras}
                sellos={sellos}
                total={TOTAL_FLIPS}
                results={results}
                rotation={rotation}
                currentFace={currentFace}
                flipping={flipping}
                onFlip={flip}
              />
            )}

            {phase === "resultado" && prediction && (
              <ResultPhase
                caras={caras}
                sellos={sellos}
                prediction={prediction}
                onReset={reset}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- Phases ---------- */

function Bubble({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative bg-white rounded-3xl p-5 md:p-6 shadow-lg border-2 border-institutional/10">
      <div className="absolute -left-2 top-8 w-4 h-4 rotate-45 bg-white border-l-2 border-b-2 border-institutional/10 hidden md:block" />
      {children}
    </div>
  );
}

function PredictionPhase({
  greeting,
  onPick,
}: {
  greeting: string;
  onPick: (r: Range) => void;
}) {
  return (
    <div className="animate-bounce-in space-y-5">
      <Bubble>
        <p className="text-lg md:text-xl text-institutional-deep font-medium">
          {greeting} Hoy vamos a descubrir qué tan predecible es el azar.{" "}
          <strong>Vamos a lanzar esta moneda 10 veces.</strong>
        </p>
        <p className="mt-3 text-institutional-deep text-lg">
          Antes de empezar... ¿cuántas veces crees que saldrá <strong>CARA</strong>?
        </p>
      </Bubble>
      <div className="grid grid-cols-2 gap-3">
        {RANGES.map((r) => (
          <button
            key={r.id}
            onClick={() => onPick(r)}
            className="min-h-16 rounded-2xl bg-white border-2 border-institutional/15 hover:border-coral hover:bg-coral/5 active:scale-[0.98] transition-all p-4 text-left"
          >
            <div className="text-xs font-bold uppercase tracking-wider text-turquoise">
              Mi predicción
            </div>
            <div className="font-display font-bold text-xl text-institutional-deep">
              {r.label}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function PlayPhase({
  caras,
  sellos,
  total,
  results,
  rotation,
  currentFace,
  flipping,
  onFlip,
}: {
  caras: number;
  sellos: number;
  total: number;
  results: Face[];
  rotation: number;
  currentFace: Face;
  flipping: boolean;
  onFlip: () => void;
}) {
  const remaining = total - results.length;
  return (
    <div className="grid gap-6 md:grid-cols-[1fr_260px] items-start">
      {/* Coin table */}
      <div className="flex flex-col items-center gap-6 py-4">
        <div className="coin-scene">
          <div
            className="coin"
            style={{ transform: `rotateY(${rotation}deg)` }}
            aria-label={`Moneda: ${currentFace}`}
          >
            <div className="coin-face front">🦉</div>
            <div className="coin-face back">✦</div>
            <div className="coin-edge" />
          </div>
        </div>
        <button
          onClick={onFlip}
          disabled={flipping || remaining === 0}
          className="btn-primary text-xl px-10 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {flipping ? "Girando…" : remaining === 0 ? "¡Listo!" : "¡Lanzar!"}
        </button>
        <div className="text-sm text-muted-foreground">
          Lanzamiento <strong>{results.length}</strong> de {total}
        </div>
      </div>

      {/* Notebook */}
      <div className="card-soft p-5 bg-cream">
        <div className="text-xs font-bold uppercase tracking-widest text-coral">
          Libreta de Bú
        </div>
        <div className="mt-3 space-y-3">
          <NotebookRow label="CARA" icon="🦉" count={caras} color="var(--turquoise)" />
          <NotebookRow label="SELLO" icon="✦" count={sellos} color="var(--gold)" />
        </div>
        <div className="mt-5 grid grid-cols-5 gap-1.5">
          {Array.from({ length: total }).map((_, i) => {
            const r = results[i];
            return (
              <div
                key={i}
                className={`aspect-square rounded-lg grid place-items-center text-lg font-bold border-2 ${
                  r
                    ? r === "cara"
                      ? "bg-turquoise/20 border-turquoise"
                      : "bg-gold/25 border-gold"
                    : "bg-white/60 border-dashed border-muted-foreground/30 text-muted-foreground/40"
                }`}
              >
                {r ? (r === "cara" ? "🦉" : "✦") : i + 1}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function NotebookRow({
  label,
  icon,
  count,
  color,
}: {
  label: string;
  icon: string;
  count: number;
  color: string;
}) {
  return (
    <div>
      <div className="flex items-center justify-between text-sm">
        <span className="font-display font-bold text-institutional-deep">
          {icon} {label}
        </span>
        <span className="font-bold" style={{ color }}>
          {count}
        </span>
      </div>
      <div className="mt-1 flex gap-1">
        {Array.from({ length: count }).map((_, i) => (
          <span
            key={i}
            className="inline-block w-1.5 h-6 rounded-full animate-bounce-in"
            style={{ background: color, animationDelay: `${i * 40}ms` }}
          />
        ))}
      </div>
    </div>
  );
}

function ResultPhase({
  caras,
  sellos,
  prediction,
  onReset,
}: {
  caras: number;
  sellos: number;
  prediction: Range;
  onReset: () => void;
}) {
  const hit = caras >= prediction.min && caras <= prediction.max;
  const max = Math.max(caras, sellos, 1);
  return (
    <div className="animate-bounce-in space-y-5">
      <Bubble>
        <p className="text-lg text-institutional-deep">
          Tú dijiste que saldría cara <strong>{prediction.label}</strong>, y salió{" "}
          <strong className="text-coral">{caras} veces</strong>.
        </p>
        <p className="mt-2 text-institutional-deep">
          {hit
            ? "¡Tu predicción se acercó mucho! Eso es pensar como un explorador de datos 🔎"
            : "¡No fue lo que pensabas! El azar sorprende — por eso lo estudiamos."}
        </p>
      </Bubble>

      {/* Bar chart */}
      <div className="card-soft p-6">
        <div className="text-xs font-bold uppercase tracking-widest text-turquoise">
          Resultado real
        </div>
        <div className="mt-4 grid grid-cols-2 gap-8 items-end h-48">
          {[
            { label: "CARA", icon: "🦉", value: caras, color: "var(--turquoise)" },
            { label: "SELLO", icon: "✦", value: sellos, color: "var(--gold)" },
          ].map((b) => (
            <div key={b.label} className="flex flex-col items-center justify-end h-full">
              <div className="text-2xl font-display font-bold text-institutional-deep">
                {b.value}
              </div>
              <div
                className="w-full rounded-t-2xl transition-all duration-1000"
                style={{
                  height: `${(b.value / max) * 100}%`,
                  minHeight: "8px",
                  background: `linear-gradient(180deg, ${b.color}, color-mix(in oklab, ${b.color} 70%, black))`,
                }}
              />
              <div className="mt-2 font-display font-bold text-institutional-deep">
                {b.icon} {b.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <button onClick={onReset} className="btn-primary">
          🔄 Jugar de nuevo
        </button>
        <a href="/semana-7" className="btn-secondary">
          Siguiente juego: La Ruleta 🎡
        </a>
      </div>
    </div>
  );
}
