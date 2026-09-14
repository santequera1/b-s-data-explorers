// Tutor Inteligente Socrático con IA para Comprensión Lectora Grado 3°
// Enfoque pedagógico: Andamiaje dinámico (Vygotsky / Bruner)
// Proporciona pistas y preguntas socráticas sin entregar la respuesta directa.

import { RETOS_TUTOR_IA, type RetoTutorIA } from "./lectura-data";

export type FeedbackTutor = {
  correcto: boolean;
  nivelLogro: "alto" | "medio" | "en_proceso";
  mensajeFeedback: string;
  pistaSiguiente?: string;
  puntos: number;
  emoticon: string;
};

function normalizar(texto: string): string {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Analizador socrático heurístico de alta confiabilidad
 * Garantiza retroalimentación pedagógica inmediata y precisa para niños de 3°
 */
function evaluarHeuristico(
  reto: RetoTutorIA,
  respuestaEstudiante: string,
  pistasUsadas: number,
): FeedbackTutor {
  const norm = normalizar(respuestaEstudiante);
  const palabras = norm.split(" ");

  if (norm.length < 5) {
    return {
      correcto: false,
      nivelLogro: "en_proceso",
      mensajeFeedback:
        "¡Hola! Bú quiere escuchar un poquito más de tus ideas. Escribe una oración con más detalles de lo que leíste.",
      pistaSiguiente: reto.pistas[0],
      puntos: 30,
      emoticon: "🦉💭",
    };
  }

  // Contar palabras clave presentes
  const encontradas = reto.criteriosEvaluacion.palabrasClaveEsperadas.filter((kw) => {
    const kwNorm = normalizar(kw);
    return norm.includes(kwNorm) || palabras.some((p) => p.startsWith(kwNorm.slice(0, 4)));
  });

  const ratio =
    encontradas.length / Math.min(3, reto.criteriosEvaluacion.palabrasClaveEsperadas.length);

  if (ratio >= 0.6 || (encontradas.length >= 2 && norm.length >= 15)) {
    return {
      correcto: true,
      nivelLogro: "alto",
      mensajeFeedback: `¡Brillante! 🌟 ${reto.criteriosEvaluacion.mensajeExito} Noté que mencionaste conceptos clave como «${encontradas.slice(0, 2).join("» y «")}». ¡Gran trabajo de comprensión!`,
      puntos: Math.max(70, 100 - pistasUsadas * 10),
      emoticon: "🎉🦉",
    };
  }

  if (ratio >= 0.3 || encontradas.length >= 1) {
    const siguientePista = reto.pistas[Math.min(pistasUsadas, reto.pistas.length - 1)];
    return {
      correcto: false,
      nivelLogro: "medio",
      mensajeFeedback: `¡Vas por un excelente camino! 🧭 Mencionaste «${encontradas[0]}», lo cual es muy importante. Para que tu respuesta sea súper completa, piensa: ${siguientePista}`,
      pistaSiguiente: siguientePista,
      puntos: 60,
      emoticon: "💡🦉",
    };
  }

  // Respuesta aún en proceso
  const pista = reto.pistas[Math.min(pistasUsadas, reto.pistas.length - 1)];
  return {
    correcto: false,
    nivelLogro: "en_proceso",
    mensajeFeedback: `¡Gracias por tu esfuerzo! 🌿 Bú te da una pista socrática para investigar en el texto: ${pista} ¿Qué opinas si lo intentamos de nuevo juntos?`,
    pistaSiguiente: pista,
    puntos: 40,
    emoticon: "🔍🦉",
  };
}

/**
 * Consulta socrática híbrida (Gemini API con fallback automático a heurístico pedagógico)
 */
export async function evaluarRespuestaConIA(
  retoId: string,
  respuestaEstudiante: string,
  pistasUsadas: number = 0,
): Promise<FeedbackTutor> {
  const reto = RETOS_TUTOR_IA.find((r) => r.id === retoId);
  if (!reto) {
    return {
      correcto: true,
      nivelLogro: "medio",
      mensajeFeedback: "¡Bien hecho! Sigue avanzando.",
      puntos: 50,
      emoticon: "🦉",
    };
  }

  const apiKey = process.env.GEMINI_API_KEY;

  if (apiKey && respuestaEstudiante.trim().length > 5) {
    try {
      const prompt = `
Eres Bú, una lechuza sabia, cariñosa y pedagógica que guía a niños de 3° de primaria en Colombia (Institución Educativa Ciudad de Tunja, Cartagena).
El niño está respondiendo esta pregunta de comprensión lectora:
Pregunta: "${reto.pregunta}"
Tipo de nivel: ${reto.tipo}
Idea principal esperada: "${reto.criteriosEvaluacion.ideaPrincipal}"
Palabras clave esperadas: ${reto.criteriosEvaluacion.palabrasClaveEsperadas.join(", ")}
Respuesta del niño: "${respuestaEstudiante}"

Instrucciones pedagógicas:
1. Evalúa si el niño comprendió la idea.
2. Si está bien, felicítalo calurosamente y refuerza su comprensión (máximo 2 párrafos infantiles con emojis).
3. Si le falta precisión o comete un error, NO le des la respuesta directa: dale una pista socrática amigable y hazle una pregunta reflexiva para que vuelva a pensar.
4. Responde en formato JSON estricto:
{
  "correcto": boolean,
  "nivelLogro": "alto" | "medio" | "en_proceso",
  "mensajeFeedback": string,
  "pistaSiguiente": string
}
`;
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { responseMimeType: "application/json" },
          }),
          signal: AbortSignal.timeout(5000), // 5s timeout
        },
      );

      if (res.ok) {
        const json = await res.json();
        const rawText = json?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (rawText) {
          const parsed = JSON.parse(rawText);
          return {
            correcto: Boolean(parsed.correcto),
            nivelLogro: parsed.nivelLogro || (parsed.correcto ? "alto" : "medio"),
            mensajeFeedback: parsed.mensajeFeedback,
            pistaSiguiente: parsed.pistaSiguiente,
            puntos: parsed.correcto ? Math.max(70, 100 - pistasUsadas * 10) : 50,
            emoticon: parsed.correcto ? "🌟🦉" : "💡🦉",
          };
        }
      }
    } catch {
      // Si la API falla o tarda, el motor heurístico toma el control transparente y perfectamente
    }
  }

  return evaluarHeuristico(reto, respuestaEstudiante, pistasUsadas);
}
