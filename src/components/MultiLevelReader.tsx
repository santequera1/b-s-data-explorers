import { useState } from "react";
import {
  HISTORIA_MULTINIVEL,
  GLOSARIO,
  type NivelLectura,
  type GlosarioTerm,
} from "@/lib/lectura-data";
import { Link } from "@tanstack/react-router";

export function MultiLevelReader({ nivelInicial = "explorador" }: { nivelInicial?: NivelLectura }) {
  const [nivel, setNivel] = useState<NivelLectura>(nivelInicial);
  const [palabraActiva, setPalabraActiva] = useState<GlosarioTerm | null>(null);
  const [fontSize, setFontSize] = useState<"base" | "lg" | "xl">("lg");
  const [parrafoActivo, setParrafoActivo] = useState<number | null>(null);

  const historia = HISTORIA_MULTINIVEL[nivel];

  const fontClasses = {
    base: "text-base md:text-lg leading-relaxed",
    lg: "text-lg md:text-xl leading-loose",
    xl: "text-xl md:text-2xl leading-loose",
  };

  return (
    <div className="mx-auto max-w-5xl">
      {/* SELECTOR DE NIVEL Y CONTROLES */}
      <div className="card-soft p-5 mb-6 flex flex-wrap items-center justify-between gap-4 border-2 border-institutional/20">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-turquoise">
            Fase 2 · Lectura Adaptativa Multinivel
          </span>
          <h2 className="text-xl md:text-2xl font-display font-bold text-institutional-deep">
            El Secreto del Manglar de la Ciénaga
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Cartagena de Indias · Adaptación personalizada para Grado 3°
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex bg-paper rounded-2xl p-1 border border-border">
            {(["explorador", "aventurero", "maestro"] as NivelLectura[]).map((n) => {
              const info = HISTORIA_MULTINIVEL[n];
              const activo = nivel === n;
              return (
                <button
                  key={n}
                  onClick={() => setNivel(n)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    activo
                      ? "bg-coral text-white shadow"
                      : "text-institutional-deep hover:bg-white/60"
                  }`}
                >
                  <span>{info.badge}</span>
                  <span className="capitalize">{n}</span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-1 bg-paper rounded-2xl p-1 border border-border">
            <button
              onClick={() => setFontSize("base")}
              title="Texto normal"
              className={`w-8 h-8 rounded-xl font-display font-bold text-xs ${fontSize === "base" ? "bg-white shadow text-coral" : "text-muted-foreground"}`}
            >
              A
            </button>
            <button
              onClick={() => setFontSize("lg")}
              title="Texto grande"
              className={`w-8 h-8 rounded-xl font-display font-bold text-sm ${fontSize === "lg" ? "bg-white shadow text-coral" : "text-muted-foreground"}`}
            >
              A+
            </button>
            <button
              onClick={() => setFontSize("xl")}
              title="Texto muy grande"
              className={`w-8 h-8 rounded-xl font-display font-bold text-base ${fontSize === "xl" ? "bg-white shadow text-coral" : "text-muted-foreground"}`}
            >
              A++
            </button>
          </div>
        </div>
      </div>

      {/* MODAL / BANNER DE GLOSARIO ACTIVO */}
      {palabraActiva && (
        <div className="card-soft p-5 mb-6 bg-gradient-to-r from-gold/20 via-turquoise/15 to-coral/15 border-2 border-gold flex items-start justify-between gap-4 animate-fadeIn">
          <div className="flex items-start gap-3">
            <span className="text-4xl">{palabraActiva.icono}</span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display font-bold text-xl text-institutional-deep">
                  {palabraActiva.palabra}
                </h3>
                <span className="text-xs font-bold uppercase tracking-wider rounded-full bg-gold/40 px-2 py-0.5 text-institutional-deep">
                  Glosario Interactivo
                </span>
              </div>
              <p className="mt-1 text-sm md:text-base text-institutional-deep font-medium">
                {palabraActiva.definicion}
              </p>
              <p className="mt-1 text-xs text-muted-foreground italic">
                Ejemplo: «{palabraActiva.ejemplo}»
              </p>
            </div>
          </div>
          <button
            onClick={() => setPalabraActiva(null)}
            className="w-8 h-8 rounded-full bg-white text-institutional font-bold hover:bg-coral hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>
      )}

      {/* CUERPO DEL TEXTO */}
      <div className="space-y-6 mb-8">
        {historia.parrafos.map((p) => {
          const enfocado = parrafoActivo === p.id;
          return (
            <article
              key={p.id}
              onClick={() => setParrafoActivo(p.id)}
              className={`card-soft p-6 md:p-8 transition-all cursor-pointer ${
                enfocado
                  ? "border-2 border-turquoise shadow-lg scale-[1.01]"
                  : "hover:border-turquoise/40"
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-turquoise">
                  Párrafo {p.id} · {p.subtitulo}
                </span>
                <span className="text-xs text-muted-foreground">
                  {enfocado ? "👀 Leyendo enfocado" : "Toca para enfocar"}
                </span>
              </div>

              <p className={`text-institutional-deep font-normal ${fontClasses[fontSize]}`}>
                {p.contenido}
              </p>

              {/* PALABRAS CLAVE CON GLOSARIO */}
              <div className="mt-5 pt-4 border-t border-border/60 flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  Palabras clave:
                </span>
                {p.palabrasClave.map((k) => {
                  const item = GLOSARIO[k];
                  if (!item) return null;
                  return (
                    <button
                      key={k}
                      onClick={(e) => {
                        e.stopPropagation();
                        setPalabraActiva(item);
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-institutional/10 text-institutional hover:bg-gold hover:text-institutional-deep transition-all"
                    >
                      <span>{item.icono}</span>
                      <span>{item.palabra}</span>
                      <span className="text-[10px] text-muted-foreground">📖</span>
                    </button>
                  );
                })}
              </div>

              {/* PREGUNTA GUÍA DEL PÁRRAFO */}
              <div className="mt-3 bg-paper p-3 rounded-xl flex items-center gap-2 text-xs md:text-sm font-semibold text-institutional-deep">
                <span>💭</span>
                <span>Pregunta guía: {p.preguntaGuia}</span>
              </div>
            </article>
          );
        })}
      </div>

      {/* ACCIONES FINALES */}
      <div className="card-soft p-6 text-center bg-gradient-to-br from-turquoise/20 to-gold/20 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-left">
          <h3 className="font-display font-bold text-xl text-institutional-deep">
            ¿Terminaste de leer la historia?
          </h3>
          <p className="text-sm text-muted-foreground">
            Ahora vamos a reflexionar junto a Bú con preguntas socráticas interactivas.
          </p>
        </div>
        <div className="flex gap-3 flex-wrap">
          <Link to="/tutor-ia" className="btn-primary">
            🦉 Practicar con la Tutora IA →
          </Link>
          <Link to="/evaluacion-formativa" className="btn-secondary">
            📝 Ir al Examen Formativo
          </Link>
        </div>
      </div>
    </div>
  );
}
