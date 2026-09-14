import { useState } from "react";
import {
  DIAGNOSTICO_INICIAL_PREGUNTAS,
  type PreguntaQuiz,
  type NivelLectura,
  type NivelComprension,
} from "@/lib/lectura-data";
import { saveDiagnosticoLectura, saveEvaluacionLectura } from "@/lib/api";
import { Link } from "@tanstack/react-router";

type QuizMode = "diagnostico" | "formativa";

export function AutomatedQuiz({
  modo = "diagnostico",
  preguntas = DIAGNOSTICO_INICIAL_PREGUNTAS,
  nombreEstudiante = "Explorador(a)",
}: {
  modo?: QuizMode;
  preguntas?: PreguntaQuiz[];
  nombreEstudiante?: string;
}) {
  const [indiceActual, setIndiceActual] = useState(0);
  const [respuestas, setRespuestas] = useState<Record<string, "A" | "B" | "C" | "D">>({});
  const [finalizado, setFinalizado] = useState(false);
  const [guardado, setGuardado] = useState(false);

  const pregunta = preguntas[indiceActual];
  const totalPreguntas = preguntas.length;

  function seleccionarOpcion(letra: "A" | "B" | "C" | "D") {
    setRespuestas((prev) => ({ ...prev, [pregunta.id]: letra }));
  }

  function calcularResultados() {
    let correctas = 0;
    const porDimension: Record<NivelComprension, { ok: number; total: number }> = {
      literal: { ok: 0, total: 0 },
      inferencial: { ok: 0, total: 0 },
      critico: { ok: 0, total: 0 },
    };

    for (const p of preguntas) {
      porDimension[p.nivel].total++;
      const resp = respuestas[p.id];
      const opt = p.opciones.find((o) => o.letra === resp);
      if (opt?.esCorrecta) {
        correctas++;
        porDimension[p.nivel].ok++;
      }
    }

    const porcentaje = Math.round((correctas / totalPreguntas) * 100);

    let nivelAsignado: NivelLectura = "explorador";
    if (porcentaje >= 80) nivelAsignado = "maestro";
    else if (porcentaje >= 60) nivelAsignado = "aventurero";

    return {
      correctas,
      total: totalPreguntas,
      porcentaje,
      porDimension,
      nivelAsignado,
    };
  }

  const resultados = finalizado ? calcularResultados() : null;

  async function finalizarEvaluacion() {
    setFinalizado(true);
    const res = calcularResultados();

    if (modo === "diagnostico") {
      try {
        await saveDiagnosticoLectura({
          data: {
            respuestas,
            desglose: {
              literal: res.porDimension.literal.ok,
              inferencial: res.porDimension.inferencial.ok,
              critico: res.porDimension.critico.ok,
              total: res.correctas,
              porcentaje: res.porcentaje,
            },
            nivelAsignado: res.nivelAsignado,
          },
        });
        setGuardado(true);
      } catch {
        setGuardado(true);
      }
    } else {
      try {
        await saveEvaluacionLectura({
          data: {
            nota: res.porcentaje,
            desglose: {
              literal: res.porDimension.literal.ok,
              inferencial: res.porDimension.inferencial.ok,
              critico: res.porDimension.critico.ok,
              total: res.correctas,
            },
            respuestas,
          },
        });
        setGuardado(true);
      } catch {
        setGuardado(true);
      }
    }
  }

  if (finalizado && resultados) {
    return (
      <div className="mx-auto max-w-4xl animate-fadeIn">
        {/* REPORTE DE RESULTADOS AUTOMATIZADO */}
        <div className="card-soft p-6 md:p-10 border-2 border-turquoise mb-6 text-center">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-br from-turquoise to-institutional text-white grid place-items-center text-4xl shadow-lg mb-4">
            {resultados.porcentaje >= 80 ? "🏆" : resultados.porcentaje >= 60 ? "🧭" : "🌱"}
          </div>

          <span className="text-xs font-bold tracking-widest uppercase text-coral">
            {modo === "diagnostico"
              ? "Diagnóstico Automatizado Completado"
              : "Evaluación Formativa Finalizada"}
          </span>

          <h2 className="mt-1 text-3xl md:text-4xl font-display font-bold text-institutional-deep">
            {resultados.porcentaje >= 80
              ? "¡Desempeño Sobresaliente!"
              : resultados.porcentaje >= 60
                ? "¡Buen Trabajo de Comprensión!"
                : "¡Gran Esfuerzo, Sigamos Aprendiendo!"}
          </h2>

          <p className="mt-2 text-muted-foreground text-sm md:text-base">
            Estudiante: <strong>{nombreEstudiante}</strong> · I.E. Ciudad de Tunja (Cartagena)
          </p>

          {/* TARJETAS DE DESGLOSE */}
          <div className="mt-8 grid gap-4 sm:grid-cols-4">
            <div className="card-soft p-4 bg-white">
              <div className="text-3xl font-display font-bold text-institutional">
                {resultados.porcentaje}%
              </div>
              <div className="text-xs font-bold text-muted-foreground uppercase mt-1">
                Puntaje Total
              </div>
            </div>

            <div className="card-soft p-4 bg-white border-t-4 border-t-turquoise">
              <div className="text-2xl font-display font-bold text-institutional-deep">
                {resultados.porDimension.literal.ok} / {resultados.porDimension.literal.total}
              </div>
              <div className="text-xs font-bold text-turquoise uppercase mt-1">
                Comprensión Literal
              </div>
            </div>

            <div className="card-soft p-4 bg-white border-t-4 border-t-coral">
              <div className="text-2xl font-display font-bold text-institutional-deep">
                {resultados.porDimension.inferencial.ok} /{" "}
                {resultados.porDimension.inferencial.total}
              </div>
              <div className="text-xs font-bold text-coral uppercase mt-1">
                Comprensión Inferencial
              </div>
            </div>

            <div className="card-soft p-4 bg-white border-t-4 border-t-gold">
              <div className="text-2xl font-display font-bold text-institutional-deep">
                {resultados.porDimension.critico.ok} / {resultados.porDimension.critico.total}
              </div>
              <div className="text-xs font-bold text-gold uppercase mt-1">Comprensión Crítica</div>
            </div>
          </div>

          {/* NIVEL ASIGNADO / RECOMENDADO */}
          <div className="mt-6 p-5 rounded-2xl bg-paper border border-border flex items-center justify-between gap-4 flex-wrap text-left">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Nivel de lectura recomendado:
              </span>
              <h3 className="text-xl font-display font-bold text-institutional-deep capitalize">
                {resultados.nivelAsignado === "maestro" &&
                  "🏆 Nivel Maestro (Lectura Avanzada y Crítica)"}
                {resultados.nivelAsignado === "aventurero" &&
                  "🧭 Nivel Aventurero (Lectura Intermedia Guiada)"}
                {resultados.nivelAsignado === "explorador" &&
                  "🌱 Nivel Explorador (Lectura con Andamiaje y Apoyo)"}
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                La plataforma adaptará automáticamente los textos a tu nivel para que aprendas a tu
                propio ritmo.
              </p>
            </div>

            <Link to="/lectura-adaptativa" className="btn-primary py-2 px-5 text-sm">
              Comenzar Lectura Adaptada →
            </Link>
          </div>
        </div>

        {/* REVISIÓN DETALLADA REACTIVO POR REACTIVO */}
        <div className="card-soft p-6 mb-8">
          <h3 className="font-display font-bold text-xl text-institutional-deep mb-4">
            Revisión Pedagógica Ítem por Ítem
          </h3>
          <div className="space-y-4">
            {preguntas.map((p) => {
              const resp = respuestas[p.id];
              const opt = p.opciones.find((o) => o.letra === resp);
              const esCorrecta = opt?.esCorrecta ?? false;
              const correctaObj = p.opciones.find((o) => o.esCorrecta);

              return (
                <div
                  key={p.id}
                  className={`p-4 rounded-2xl border ${esCorrecta ? "bg-emerald-50/70 border-emerald-300" : "bg-red-50/70 border-red-300"}`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Pregunta {p.numero} · {p.etiquetaNivel}
                    </span>
                    <span
                      className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                        esCorrecta ? "bg-emerald-200 text-emerald-900" : "bg-red-200 text-red-900"
                      }`}
                    >
                      {esCorrecta ? "✓ Correcta" : "✗ Requiere repaso"}
                    </span>
                  </div>

                  <p className="font-semibold text-institutional-deep text-sm md:text-base">
                    {p.texto}
                  </p>

                  <div className="mt-2 text-xs md:text-sm text-institutional-deep">
                    Tu respuesta:{" "}
                    <strong>{resp ? `${resp}) ${opt?.texto}` : "Sin responder"}</strong>
                  </div>

                  {!esCorrecta && correctaObj && (
                    <div className="mt-1 text-xs text-emerald-800 font-semibold">
                      Respuesta esperada: {correctaObj.letra}) {correctaObj.texto}
                    </div>
                  )}

                  <div className="mt-2 text-xs text-muted-foreground italic border-t border-border/40 pt-1.5">
                    💡 Explicación pedagógica: {opt?.explicacion || correctaObj?.explicacion}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // MODO ACTIVO: RESPONDIENDO EL CUESTIONARIO
  const seleccionada = respuestas[pregunta.id];
  const completadas = Object.keys(respuestas).length;
  const pctProgreso = Math.round((completadas / totalPreguntas) * 100);

  return (
    <div className="mx-auto max-w-3xl">
      {/* BARRA DE PROGRESO */}
      <div className="card-soft p-4 mb-6 flex items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-coral">
            {modo === "diagnostico"
              ? "Fase 1 · Diagnóstico Inicial"
              : "Fase 4 · Evaluación Formativa"}
          </span>
          <div className="font-display font-bold text-sm text-institutional-deep">
            Pregunta {indiceActual + 1} de {totalPreguntas}
          </div>
        </div>

        <div className="flex-1 max-w-xs">
          <div className="flex justify-between text-[11px] font-bold text-muted-foreground mb-1">
            <span>Progreso</span>
            <span>{pctProgreso}%</span>
          </div>
          <div className="h-2.5 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-turquoise to-coral transition-all duration-300"
              style={{ width: `${pctProgreso}%` }}
            />
          </div>
        </div>
      </div>

      {/* TARJETA DE LA PREGUNTA */}
      <div className="card-soft p-6 md:p-8 mb-6 border-2 border-institutional/20">
        <div className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-institutional/10 text-institutional mb-3">
          {pregunta.etiquetaNivel}
        </div>

        <h3 className="text-lg md:text-xl font-display font-bold text-institutional-deep leading-snug mb-6">
          {pregunta.texto}
        </h3>

        {/* OPCIONES DE RESPUESTA */}
        <div className="space-y-3">
          {pregunta.opciones.map((opt) => {
            const esSeleccionada = seleccionada === opt.letra;
            return (
              <button
                key={opt.letra}
                onClick={() => seleccionarOpcion(opt.letra)}
                className={`w-full text-left p-4 rounded-2xl border-2 transition-all flex items-start gap-3 ${
                  esSeleccionada
                    ? "border-coral bg-coral/10 shadow-sm scale-[1.01]"
                    : "border-border bg-white hover:border-turquoise hover:bg-paper"
                }`}
              >
                <span
                  className={`w-8 h-8 shrink-0 rounded-xl font-display font-bold text-sm grid place-items-center transition-colors ${
                    esSeleccionada ? "bg-coral text-white" : "bg-paper text-institutional-deep"
                  }`}
                >
                  {opt.letra}
                </span>
                <span className="text-sm md:text-base text-institutional-deep font-medium pt-1 leading-snug">
                  {opt.texto}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* NAVEGACIÓN */}
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={() => setIndiceActual((i) => Math.max(0, i - 1))}
          disabled={indiceActual === 0}
          className="btn-secondary text-sm disabled:opacity-30"
        >
          ← Anterior
        </button>

        {indiceActual + 1 < totalPreguntas ? (
          <button
            onClick={() => setIndiceActual((i) => i + 1)}
            disabled={!seleccionada}
            className="btn-primary text-sm disabled:opacity-40"
          >
            Siguiente →
          </button>
        ) : (
          <button
            onClick={finalizarEvaluacion}
            disabled={completadas < totalPreguntas}
            className="btn-primary text-sm bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40"
          >
            🏁 Finalizar y Calificar
          </button>
        )}
      </div>
    </div>
  );
}
