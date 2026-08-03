// Instrumento "¡Exploradores de Datos! Mi prueba de estadística y probabilidad"
// Digitalización del Anexo A del proyecto (6 situaciones, 24 ítems).
// Este archivo es compartido por la prueba (cliente) y la calificación (servidor).

export type Dimension = "d1" | "d2" | "d3";

export const DIMENSIONES: Record<Dimension, string> = {
  d1: "Recolección y organización de datos",
  d2: "Representación e interpretación de gráficos",
  d3: "Noción de probabilidad y azar",
};

/* ---------- Situación 1: La fruta favorita (ítems 1–4) ---------- */

export const FRUTAS_SECUENCIA = [
  "manzana", "banano", "manzana", "uva", "naranja",
  "banano", "manzana", "uva", "banano", "manzana",
  "banano", "manzana", "uva", "banano", "manzana",
] as const;

export const FRUTAS = [
  { id: "manzana", label: "Manzana", icon: "🍎" },
  { id: "banano", label: "Banano", icon: "🍌" },
  { id: "uva", label: "Uva", icon: "🍇" },
  { id: "naranja", label: "Naranja", icon: "🍊" },
] as const;

export const FRUTAS_FRECUENCIA: Record<string, number> = {
  manzana: 6,
  banano: 5,
  uva: 3,
  naranja: 1,
};

/* ---------- Situación 2: Medios de transporte (ítems 5–9) ---------- */

export const TRANSPORTES = [
  { id: "caminando", label: "Caminando", icon: "🚶", n: 10 },
  { id: "bicicleta", label: "Bicicleta", icon: "🚲", n: 6 },
  { id: "bus", label: "Bus", icon: "🚌", n: 12 },
  { id: "automovil", label: "Automóvil", icon: "🚗", n: 8 },
] as const;

export const PICTO_ESCALA = 2; // 1 símbolo = 2 estudiantes

/* ---------- Situación 3: Libros favoritos (ítems 10–13) ---------- */

export const LIBROS = [
  { id: "aventuras", label: "Aventuras", icon: "📚", n: 9 },
  { id: "dinosaurios", label: "Dinosaurios", icon: "🦕", n: 5 },
  { id: "espacio", label: "Espacio", icon: "🚀", n: 7 },
  { id: "animales", label: "Animales", icon: "🐾", n: 11 },
] as const;

/* ---------- Situación 4: La bolsa de fichas (ítems 14–16) ---------- */

export const FICHAS = [
  { id: "roja", label: "Roja", color: "#e2603f", n: 8 },
  { id: "azul", label: "Azul", color: "#3e6dbb", n: 3 },
  { id: "verde", label: "Verde", color: "#4a9e5c", n: 1 },
] as const;

/* ---------- Situación 6: Mi propia gráfica (ítems 20–24) ---------- */

export const MASCOTAS_SECUENCIA = [
  "perro", "gato", "perro", "conejo", "gato",
  "perro", "pajaro", "conejo", "perro", "gato",
] as const;

export const MASCOTAS = [
  { id: "perro", label: "Perro", icon: "🐶" },
  { id: "gato", label: "Gato", icon: "🐱" },
  { id: "conejo", label: "Conejo", icon: "🐰" },
  { id: "pajaro", label: "Pájaro", icon: "🐦" },
] as const;

export const MASCOTAS_FRECUENCIA: Record<string, number> = {
  perro: 4,
  gato: 3,
  conejo: 2,
  pajaro: 1,
};

/* ---------- Clave de respuestas y dimensiones por ítem ---------- */

// Las respuestas se envían como Record<string, unknown> con llaves "i1".."i24".
// Ítems compuestos (2, 9, 20, 21) son objetos {sub: valor}.

export type Respuestas = Record<string, unknown>;

type ItemDef = {
  n: number;
  dim: Dimension;
  abierta?: boolean;
  check?: (v: unknown) => boolean;
};

function eqNum(expected: number) {
  return (v: unknown) => Number(v) === expected;
}
function eqStr(expected: string) {
  return (v: unknown) => v === expected;
}
function eqTabla(expected: Record<string, number>) {
  return (v: unknown) => {
    if (typeof v !== "object" || v === null) return false;
    const o = v as Record<string, unknown>;
    return Object.entries(expected).every(([k, n]) => Number(o[k]) === n);
  };
}

export const ITEMS: ItemDef[] = [
  { n: 1, dim: "d1", check: eqNum(15) },
  { n: 2, dim: "d1", check: eqTabla(FRUTAS_FRECUENCIA) },
  { n: 3, dim: "d1", check: eqStr("manzana") },
  { n: 4, dim: "d1", check: eqStr("naranja") },
  { n: 5, dim: "d2", check: eqStr("bus") },
  { n: 6, dim: "d2", check: eqNum(10) },
  { n: 7, dim: "d2", check: eqNum(6) },
  { n: 8, dim: "d2", check: eqNum(36) },
  {
    n: 9,
    dim: "d2",
    check: eqTabla({ caminando: 5, bicicleta: 3, bus: 6, automovil: 4 }),
  },
  { n: 10, dim: "d2", check: eqStr("animales") },
  { n: 11, dim: "d2", check: eqNum(7) },
  { n: 12, dim: "d2", check: eqStr("dinosaurios") },
  { n: 13, dim: "d2", check: eqNum(20) },
  { n: 14, dim: "d3", check: eqStr("roja") },
  { n: 15, dim: "d3", check: eqStr("verde") },
  { n: 16, dim: "d3", check: eqStr("roja") },
  { n: 17, dim: "d3", check: eqStr("A") },
  { n: 18, dim: "d3", check: eqStr("A") },
  { n: 19, dim: "d3", abierta: true },
  { n: 20, dim: "d1", check: eqTabla(MASCOTAS_FRECUENCIA) },
  { n: 21, dim: "d2", check: eqTabla(MASCOTAS_FRECUENCIA) },
  { n: 22, dim: "d2", check: eqStr("perro") },
  { n: 23, dim: "d2", check: eqStr("pajaro") },
  { n: 24, dim: "d1", abierta: true },
];

export type Evaluacion = {
  porItem: Record<number, boolean>;
  porDimension: Record<Dimension, { ok: number; total: number }>;
  total: { ok: number; total: number };
};

export function evaluar(respuestas: Respuestas): Evaluacion {
  const porItem: Record<number, boolean> = {};
  const porDimension: Record<Dimension, { ok: number; total: number }> = {
    d1: { ok: 0, total: 0 },
    d2: { ok: 0, total: 0 },
    d3: { ok: 0, total: 0 },
  };
  let ok = 0;
  let total = 0;

  for (const item of ITEMS) {
    if (item.abierta || !item.check) continue;
    const correcto = item.check(respuestas[`i${item.n}`]);
    porItem[item.n] = correcto;
    porDimension[item.dim].total++;
    total++;
    if (correcto) {
      porDimension[item.dim].ok++;
      ok++;
    }
  }
  return { porItem, porDimension, total: { ok, total } };
}
