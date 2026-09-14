import { useState } from "react";
import { BuMascot } from "./BuMascot";
import { RETOS_TUTOR_IA, type RetoTutorIA } from "@/lib/lectura-data";
import { consultarTutorIA } from "@/lib/api";
import { Link } from "@tanstack/react-router";

type Message = {
  id: string;
  sender: "tutor" | "estudiante";
  text: string;
  puntos?: number;
  emoticon?: string;
  esExito?: boolean;
};

export function ReadingTutorChat() {
  const [retoIndex, setRetoIndex] = useState(0);
  const [inputRespuesta, setInputRespuesta] = useState("");
  const [cargando, setCargando] = useState(false);
  const [pistasUsadas, setPistasUsadas] = useState(0);
  const [retosCompletados, setRetosCompletados] = useState<string[]>([]);
  const [mensajes, setMensajes] = useState<Message[]>([
    {
      id: "intro_1",
      sender: "tutor",
      text: `¡Hola, explorador(a) de palabras! 🦉 Soy Bú, tu tutora de lectura con Inteligencia Artificial. Juntos vamos a profundizar en «El Secreto del Manglar». No te preocupes por equivocarte: yo te iré dando pistas socráticas para que descubras las respuestas por ti mismo(a).`,
      emoticon: "👋🦉",
    },
    {
      id: "intro_2",
      sender: "tutor",
      text: `${RETOS_TUTOR_IA[0].titulo}: ${RETOS_TUTOR_IA[0].pregunta}`,
      emoticon: "🌿",
    },
  ]);

  const retoActual: RetoTutorIA = RETOS_TUTOR_IA[retoIndex];
  const yaCompletoTodos = retosCompletados.length === RETOS_TUTOR_IA.length;

  async function enviarRespuesta() {
    if (!inputRespuesta.trim() || cargando) return;
    const texto = inputRespuesta.trim();
    setInputRespuesta("");

    const msgEstudiante: Message = {
      id: `usr_${Date.now()}`,
      sender: "estudiante",
      text: texto,
    };
    setMensajes((prev) => [...prev, msgEstudiante]);
    setCargando(true);

    try {
      const res = await consultarTutorIA({
        data: {
          retoId: retoActual.id,
          respuesta: texto,
          pistasUsadas,
        },
      });

      const msgTutor: Message = {
        id: `tut_${Date.now()}`,
        sender: "tutor",
        text: res.mensajeFeedback,
        puntos: res.puntos,
        emoticon: res.emoticon,
        esExito: res.correcto,
      };

      setMensajes((prev) => [...prev, msgTutor]);

      if (res.correcto) {
        if (!retosCompletados.includes(retoActual.id)) {
          setRetosCompletados((prev) => [...prev, retoActual.id]);
        }
      }
    } catch {
      setMensajes((prev) => [
        ...prev,
        {
          id: `tut_err_${Date.now()}`,
          sender: "tutor",
          text: "¡Buen intento! Tu respuesta tiene sentido. Sigamos pensando en los detalles del manglar.",
          emoticon: "🦉",
          esExito: true,
        },
      ]);
    } finally {
      setCargando(false);
    }
  }

  function pedirPista() {
    if (pistasUsadas < retoActual.pistas.length) {
      const pista = retoActual.pistas[pistasUsadas];
      setPistasUsadas((p) => p + 1);
      setMensajes((prev) => [
        ...prev,
        {
          id: `pista_${Date.now()}`,
          sender: "tutor",
          text: pista,
          emoticon: "💡",
        },
      ]);
    }
  }

  function avanzarSiguienteReto() {
    if (retoIndex + 1 < RETOS_TUTOR_IA.length) {
      const nextReto = RETOS_TUTOR_IA[retoIndex + 1];
      setRetoIndex(retoIndex + 1);
      setPistasUsadas(0);
      setMensajes((prev) => [
        ...prev,
        {
          id: `next_${Date.now()}`,
          sender: "tutor",
          text: `¡Fantástico! Pasamos al ${nextReto.titulo} (${nextReto.tipo.toUpperCase()}).\n\n${nextReto.pregunta}`,
          emoticon: "🚀🦉",
        },
      ]);
    }
  }

  return (
    <div className="mx-auto max-w-4xl">
      {/* HEADER DEL RETO */}
      <div className="card-soft p-5 mb-5 flex flex-wrap items-center justify-between gap-4 border-2 border-turquoise/30">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-turquoise to-institutional text-white grid place-items-center text-3xl shadow">
            🦉
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-coral">
              Fase 3 · Tutoría Socrática con IA
            </span>
            <h2 className="text-xl md:text-2xl font-display font-bold text-institutional-deep">
              {retoActual.titulo}
            </h2>
            <span className="inline-block mt-0.5 rounded-full bg-institutional/10 px-2.5 py-0.5 text-xs font-semibold text-institutional capitalize">
              Nivel {retoActual.tipo}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {RETOS_TUTOR_IA.map((r, idx) => {
            const superado = retosCompletados.includes(r.id);
            const activo = idx === retoIndex;
            return (
              <button
                key={r.id}
                onClick={() => {
                  setRetoIndex(idx);
                  setPistasUsadas(0);
                }}
                className={`w-10 h-10 rounded-xl font-display font-bold text-sm transition-all ${
                  superado
                    ? "bg-turquoise text-white shadow"
                    : activo
                      ? "bg-coral text-white scale-110 shadow-lg"
                      : "bg-white border-2 border-border text-muted-foreground"
                }`}
              >
                {superado ? "✓" : idx + 1}
              </button>
            );
          })}
        </div>
      </div>

      {/* ÁREA DE CHAT */}
      <div className="card-soft p-4 md:p-6 mb-4 h-[440px] overflow-y-auto flex flex-col gap-3 bg-paper/60 border border-border">
        {mensajes.map((m) => {
          const esTutor = m.sender === "tutor";
          return (
            <div
              key={m.id}
              className={`flex gap-3 max-w-[88%] ${esTutor ? "self-start" : "self-end flex-row-reverse"}`}
            >
              {esTutor && (
                <div className="shrink-0 w-9 h-9 rounded-full bg-institutional/10 border border-institutional/20 grid place-items-center text-lg">
                  {m.emoticon || "🦉"}
                </div>
              )}
              <div
                className={`p-4 rounded-2xl text-sm md:text-base leading-relaxed whitespace-pre-line shadow-sm ${
                  esTutor
                    ? m.esExito
                      ? "bg-emerald-50 border-2 border-emerald-300 text-emerald-950 font-medium"
                      : "bg-white border border-border text-institutional-deep"
                    : "bg-gradient-to-r from-institutional to-institutional-deep text-white"
                }`}
              >
                {m.text}
                {m.puntos !== undefined && (
                  <div className="mt-2 text-xs font-bold text-turquoise">
                    ⭐ Puntos ganados: {m.puntos}/100
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {cargando && (
          <div className="self-start flex items-center gap-2 text-sm text-muted-foreground italic bg-white p-3 rounded-2xl border border-border">
            <span className="animate-spin">🦉</span> Bú está analizando tu respuesta con IA...
          </div>
        )}
      </div>

      {/* CONTROLES Y RESPUESTA */}
      <div className="card-soft p-4 flex flex-col gap-3">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <button
            onClick={pedirPista}
            disabled={pistasUsadas >= retoActual.pistas.length || cargando}
            className="text-xs font-bold px-3 py-1.5 rounded-full bg-gold/20 text-institutional-deep hover:bg-gold/40 transition-colors disabled:opacity-40"
          >
            💡 Pedir pista socrática ({retoActual.pistas.length - pistasUsadas} disponibles)
          </button>

          {retosCompletados.includes(retoActual.id) && retoIndex + 1 < RETOS_TUTOR_IA.length && (
            <button onClick={avanzarSiguienteReto} className="btn-primary text-xs py-1.5 px-4">
              Avanzar al siguiente reto →
            </button>
          )}

          {yaCompletoTodos && (
            <Link
              to="/evaluacion-formativa"
              className="btn-primary text-xs py-1.5 px-4 bg-emerald-600"
            >
              🏆 ¡Retos superados! Ir a la Evaluación Formativa →
            </Link>
          )}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            enviarRespuesta();
          }}
          className="flex gap-2"
        >
          <input
            type="text"
            value={inputRespuesta}
            onChange={(e) => setInputRespuesta(e.target.value)}
            placeholder="Escribe tu respuesta aquí para Bú..."
            disabled={cargando}
            className="flex-1 rounded-2xl border-2 border-institutional/20 px-4 py-3 text-sm md:text-base focus:outline-none focus:border-coral transition-colors"
          />
          <button
            type="submit"
            disabled={!inputRespuesta.trim() || cargando}
            className="btn-primary px-6"
          >
            Enviar a Bú
          </button>
        </form>
      </div>
    </div>
  );
}
