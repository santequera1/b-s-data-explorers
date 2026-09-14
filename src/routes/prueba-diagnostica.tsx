import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { BuMascot } from "@/components/BuMascot";
import { getMyDiagnostico, saveDiagnostico, type Momento } from "@/lib/api";
import {
  FRUTAS,
  FRUTAS_SECUENCIA,
  TRANSPORTES,
  PICTO_ESCALA,
  LIBROS,
  FICHAS,
  MASCOTAS,
  MASCOTAS_SECUENCIA,
  type Respuestas,
} from "@/lib/diagnostico-data";

type Search = { momento?: Momento };

export const Route = createFileRoute("/prueba-diagnostica")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    momento: s.momento === "post" ? "post" : undefined,
  }),
  loader: async () => {
    const data = await getMyDiagnostico();
    if (!data) throw redirect({ to: "/ingresar" });
    return data;
  },
  head: () => ({
    meta: [
      { title: "Prueba Diagnóstica — Exploradores de Datos" },
      {
        name: "description",
        content:
          "¡Exploradores de Datos! Mi prueba de estadística y probabilidad para 3° de primaria.",
      },
    ],
  }),
  component: PruebaPage,
});

type Pantalla = "inicio" | 1 | 2 | 3 | 4 | 5 | 6 | "fin";

function PruebaPage() {
  const data = Route.useLoaderData();
  const { momento: momentoParam } = Route.useSearch();
  const momento: Momento = momentoParam ?? "pre";
  const esDocente = data.session.rol === "docente";
  const yaPresentada = data.presentado[momento];

  const [pantalla, setPantalla] = useState<Pantalla>("inicio");
  const [r, setR] = useState<Respuestas>({});
  const [enviando, setEnviando] = useState(false);
  const [resultadoEnvio, setResultadoEnvio] = useState<"ok" | "repetida" | "preview" | null>(null);

  function set(key: string, value: unknown) {
    setR((prev) => ({ ...prev, [key]: value }));
  }
  function setSub(key: string, sub: string, value: unknown) {
    setR((prev) => {
      const obj = { ...((prev[key] as Record<string, unknown>) ?? {}) };
      obj[sub] = value;
      return { ...prev, [key]: obj };
    });
  }
  function subVal(key: string, sub: string): unknown {
    return (r[key] as Record<string, unknown> | undefined)?.[sub];
  }

  const tablaCompleta = (key: string, subs: readonly string[]) =>
    subs.every((s) => subVal(key, s) !== undefined && subVal(key, s) !== null);

  const completa: Record<number, boolean> = {
    1:
      r.i1 !== undefined &&
      tablaCompleta(
        "i2",
        FRUTAS.map((f) => f.id),
      ) &&
      r.i3 !== undefined &&
      r.i4 !== undefined,
    2:
      r.i5 !== undefined &&
      r.i6 !== undefined &&
      r.i7 !== undefined &&
      r.i8 !== undefined &&
      tablaCompleta(
        "i9",
        TRANSPORTES.map((t) => t.id),
      ),
    3: r.i10 !== undefined && r.i11 !== undefined && r.i12 !== undefined && r.i13 !== undefined,
    4: r.i14 !== undefined && r.i15 !== undefined && r.i16 !== undefined,
    5: r.i17 !== undefined && r.i18 !== undefined && String(r.i19 ?? "").trim().length > 0,
    6:
      tablaCompleta(
        "i20",
        MASCOTAS.map((m) => m.id),
      ) &&
      tablaCompleta(
        "i21",
        MASCOTAS.map((m) => m.id),
      ) &&
      r.i22 !== undefined &&
      r.i23 !== undefined &&
      String(r.i24 ?? "").trim().length > 0,
  };

  async function enviar() {
    if (enviando) return;
    setEnviando(true);
    try {
      if (esDocente) {
        setResultadoEnvio("preview");
      } else {
        const res = await saveDiagnostico({
          data: {
            momento,
            respuestas: r as Record<string, import("@/lib/api").RespuestaValor>,
            abiertas: { i19: String(r.i19 ?? ""), i24: String(r.i24 ?? "") },
          },
        });
        setResultadoEnvio(res.ok && res.yaExistia ? "repetida" : "ok");
      }
      setPantalla("fin");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <main className="bg-paper min-h-screen pb-16">
      <header className="mx-auto max-w-4xl px-6 pt-6 pb-2 flex items-center justify-between gap-3">
        <Link
          to="/juegos"
          className="inline-flex items-center gap-2 text-sm font-semibold text-institutional-deep hover:text-coral transition-colors"
        >
          ← Salir de la prueba
        </Link>
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-institutional/10 border border-institutional/20 px-3 py-1 text-xs font-bold text-institutional uppercase">
            {momento === "pre" ? "Prueba inicial" : "Prueba final"}
          </span>
          <span className="rounded-full bg-white border-2 border-institutional/15 px-3 py-1 text-xs font-bold text-institutional-deep">
            👤 {data.session.nombre.split(" ")[0]}
          </span>
        </div>
      </header>

      {typeof pantalla === "number" && (
        <div className="mx-auto max-w-4xl px-6 pt-3">
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div
                key={n}
                className={`h-2.5 flex-1 rounded-full transition-colors ${
                  n < pantalla ? "bg-turquoise" : n === pantalla ? "bg-coral" : "bg-muted"
                }`}
              />
            ))}
          </div>
          <p className="mt-1.5 text-xs font-semibold text-muted-foreground text-right">
            Situación {pantalla} de 6
          </p>
        </div>
      )}

      <div className="mx-auto max-w-4xl px-4 md:px-6 pt-4">
        {pantalla === "inicio" && (
          <div className="animate-bounce-in text-center">
            <BuMascot eager className="w-32 md:w-40 h-auto mx-auto drop-shadow-xl animate-float" />
            <h1 className="mt-4 text-3xl md:text-5xl font-display font-bold text-institutional-deep">
              ¡Exploradores de Datos!
            </h1>
            <p className="mt-2 text-lg text-muted-foreground">
              Mi prueba de estadística y probabilidad 🧭
            </p>
            <div className="card-soft p-6 md:p-8 mt-6 text-left max-w-xl mx-auto">
              <p className="text-institutional-deep text-lg">
                ¡Hola, {data.session.nombre.split(" ")[0]}! Esta no es una prueba para ganar o
                perder: es para <strong>descubrir cuánto sabes</strong> y ayudarte a aprender mejor.
              </p>
              <ul className="mt-4 space-y-2 text-institutional-deep">
                <li>
                  🧩 Son <strong>6 situaciones</strong> con preguntas cortas.
                </li>
                <li>👀 Observa, analiza y responde con atención.</li>
                <li>🤫 Trabaja solo(a), sin ayuda de tus compañeros.</li>
                <li>🏆 ¡Tú puedes!</li>
              </ul>
              {yaPresentada && !esDocente && (
                <p className="mt-4 text-sm font-semibold text-coral">
                  ⚠️ Ya presentaste esta prueba. Puedes repasarla, pero la que cuenta para tu profe
                  es la primera que enviaste.
                </p>
              )}
              {esDocente && (
                <p className="mt-4 text-sm font-semibold text-turquoise">
                  👩‍🏫 Modo docente: puedes recorrer la prueba, tus respuestas no se guardarán.
                </p>
              )}
            </div>
            <button onClick={() => setPantalla(1)} className="btn-primary text-lg mt-6">
              🚀 ¡Empezar!
            </button>
          </div>
        )}

        {pantalla === 1 && (
          <Situacion
            titulo="I. Recolección y organización de datos"
            sub="Situación 1: La fruta favorita del salón"
          >
            <Enunciado>
              La profesora preguntó a los estudiantes cuál era su fruta favorita. Estas fueron las
              respuestas:
            </Enunciado>
            <div className="card-soft p-4 bg-cream text-3xl md:text-4xl leading-relaxed text-center tracking-wide">
              {FRUTAS_SECUENCIA.map((f, i) => (
                <span key={i} className="inline-block px-0.5">
                  {FRUTAS.find((x) => x.id === f)!.icon}
                </span>
              ))}
            </div>

            <Pregunta n={1} texto="¿Cuántos estudiantes respondieron la encuesta?">
              <NumOpciones opciones={[12, 14, 15, 16]} valor={r.i1} onPick={(v) => set("i1", v)} />
            </Pregunta>

            <Pregunta n={2} texto="Completa la tabla de conteo: ¿cuántos votos tuvo cada fruta?">
              <div className="space-y-3">
                {FRUTAS.map((f) => (
                  <FilaTabla
                    key={f.id}
                    icon={f.icon}
                    label={f.label}
                    opciones={[1, 2, 3, 4, 5, 6, 7, 8]}
                    valor={subVal("i2", f.id)}
                    onPick={(v) => setSub("i2", f.id, v)}
                  />
                ))}
              </div>
            </Pregunta>

            <Pregunta n={3} texto="¿Cuál fue la fruta preferida por los estudiantes?">
              <Opciones
                opciones={FRUTAS.map((f) => ({ v: f.id, label: `${f.icon} ${f.label}` }))}
                valor={r.i3}
                onPick={(v) => set("i3", v)}
              />
            </Pregunta>

            <Pregunta n={4} texto="¿Cuál fue la fruta menos escogida?">
              <Opciones
                opciones={FRUTAS.map((f) => ({ v: f.id, label: `${f.icon} ${f.label}` }))}
                valor={r.i4}
                onPick={(v) => set("i4", v)}
              />
            </Pregunta>

            <Avanzar ok={completa[1]} onNext={() => setPantalla(2)} />
          </Situacion>
        )}

        {pantalla === 2 && (
          <Situacion
            titulo="II. Representación e interpretación de datos"
            sub="Situación 2: Medios de transporte para ir al colegio"
          >
            <Enunciado>Resultados de la encuesta:</Enunciado>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="card-soft p-4 bg-cream">
                <div className="text-xs font-bold uppercase tracking-widest text-coral mb-2">
                  Tabla
                </div>
                {TRANSPORTES.map((t) => (
                  <div
                    key={t.id}
                    className="flex items-center justify-between py-1.5 border-b border-institutional/10 last:border-0"
                  >
                    <span className="font-semibold text-institutional-deep">
                      {t.icon} {t.label}
                    </span>
                    <span className="font-display font-bold text-institutional">{t.n}</span>
                  </div>
                ))}
              </div>
              <BarChart
                datos={TRANSPORTES.map((t) => ({ label: t.icon, n: t.n }))}
                max={12}
                titulo="Medios de transporte"
              />
            </div>

            <Pregunta n={5} texto="¿Cuál fue el medio de transporte más utilizado?">
              <Opciones
                opciones={TRANSPORTES.map((t) => ({ v: t.id, label: `${t.icon} ${t.label}` }))}
                valor={r.i5}
                onPick={(v) => set("i5", v)}
              />
            </Pregunta>
            <Pregunta n={6} texto="¿Cuántos estudiantes van caminando al colegio?">
              <NumOpciones opciones={[6, 8, 10, 12]} valor={r.i6} onPick={(v) => set("i6", v)} />
            </Pregunta>
            <Pregunta n={7} texto="¿Cuántos estudiantes utilizan bicicleta?">
              <NumOpciones opciones={[4, 6, 8, 10]} valor={r.i7} onPick={(v) => set("i7", v)} />
            </Pregunta>
            <Pregunta n={8} texto="¿Cuántos estudiantes participaron en la encuesta?">
              <NumOpciones opciones={[26, 32, 36, 40]} valor={r.i8} onPick={(v) => set("i8", v)} />
            </Pregunta>

            <Pregunta
              n={9}
              texto={`Completa el pictograma. Recuerda la escala: cada ⭐ vale ${PICTO_ESCALA} estudiantes. ¿Cuántas estrellas necesita cada transporte?`}
            >
              <div className="space-y-3">
                {TRANSPORTES.map((t) => (
                  <FilaTabla
                    key={t.id}
                    icon={t.icon}
                    label={t.label}
                    opciones={[1, 2, 3, 4, 5, 6]}
                    valor={subVal("i9", t.id)}
                    onPick={(v) => setSub("i9", t.id, v)}
                    simbolo="⭐"
                  />
                ))}
              </div>
            </Pregunta>

            <Avanzar ok={completa[2]} onNext={() => setPantalla(3)} />
          </Situacion>
        )}

        {pantalla === 3 && (
          <Situacion titulo="III. Interpretación de gráficas" sub="Situación 3: Libros favoritos">
            <Enunciado>Los estudiantes eligieron el libro que más les gustó:</Enunciado>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="card-soft p-4 bg-cream">
                <div className="text-xs font-bold uppercase tracking-widest text-coral mb-2">
                  Tabla
                </div>
                {LIBROS.map((l) => (
                  <div
                    key={l.id}
                    className="flex items-center justify-between py-1.5 border-b border-institutional/10 last:border-0"
                  >
                    <span className="font-semibold text-institutional-deep">
                      {l.icon} {l.label}
                    </span>
                    <span className="font-display font-bold text-institutional">{l.n}</span>
                  </div>
                ))}
              </div>
              <BarChart
                datos={LIBROS.map((l) => ({ label: l.icon, n: l.n }))}
                max={12}
                titulo="Libros favoritos"
              />
            </div>

            <Pregunta n={10} texto="¿Qué libro obtuvo más votos?">
              <Opciones
                opciones={LIBROS.map((l) => ({ v: l.id, label: `${l.icon} ${l.label}` }))}
                valor={r.i10}
                onPick={(v) => set("i10", v)}
              />
            </Pregunta>
            <Pregunta n={11} texto="¿Cuántos estudiantes prefieren el libro del Espacio?">
              <NumOpciones opciones={[5, 7, 9, 11]} valor={r.i11} onPick={(v) => set("i11", v)} />
            </Pregunta>
            <Pregunta n={12} texto="¿Cuál libro obtuvo menos votos?">
              <Opciones
                opciones={LIBROS.map((l) => ({ v: l.id, label: `${l.icon} ${l.label}` }))}
                valor={r.i12}
                onPick={(v) => set("i12", v)}
              />
            </Pregunta>
            <Pregunta n={13} texto="¿Cuántos votos suman Aventuras y Animales juntos?">
              <NumOpciones
                opciones={[16, 18, 20, 22]}
                valor={r.i13}
                onPick={(v) => set("i13", v)}
              />
            </Pregunta>

            <Avanzar ok={completa[3]} onNext={() => setPantalla(4)} />
          </Situacion>
        )}

        {pantalla === 4 && (
          <Situacion titulo="IV. Noción de probabilidad" sub="Situación 4: La bolsa de fichas">
            <Enunciado>Dentro de la bolsa hay:</Enunciado>
            <div className="card-soft p-5 bg-cream">
              <div className="flex flex-wrap items-center justify-center gap-6">
                <div className="rounded-[2rem] border-4 border-institutional/25 bg-white p-5 max-w-56">
                  <div className="flex flex-wrap gap-2 justify-center">
                    {FICHAS.flatMap((f) =>
                      Array.from({ length: f.n }).map((_, i) => (
                        <span
                          key={`${f.id}${i}`}
                          className="inline-block w-7 h-7 rounded-full shadow-inner"
                          style={{ background: f.color }}
                        />
                      )),
                    )}
                  </div>
                  <div className="mt-2 text-center text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    La bolsa
                  </div>
                </div>
                <ul className="space-y-2">
                  {FICHAS.map((f) => (
                    <li
                      key={f.id}
                      className="flex items-center gap-2 font-semibold text-institutional-deep"
                    >
                      <span
                        className="w-5 h-5 rounded-full inline-block"
                        style={{ background: f.color }}
                      />
                      {f.n} {f.n === 1 ? "ficha" : "fichas"} {f.label.toLowerCase()}
                      {f.n === 1 ? "" : "s"}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <Pregunta
              n={14}
              texto="Si sacas una ficha sin mirar, ¿cuál color tiene MAYOR probabilidad de salir?"
            >
              <Opciones
                opciones={[
                  { v: "azul", label: "🔵 Azul" },
                  { v: "verde", label: "🟢 Verde" },
                  { v: "roja", label: "🔴 Roja" },
                  { v: "igual", label: "🤷 Todas igual" },
                ]}
                valor={r.i14}
                onPick={(v) => set("i14", v)}
              />
            </Pregunta>
            <Pregunta n={15} texto="¿Qué color tiene MENOR probabilidad de salir?">
              <Opciones
                opciones={[
                  { v: "azul", label: "🔵 Azul" },
                  { v: "verde", label: "🟢 Verde" },
                  { v: "roja", label: "🔴 Roja" },
                  { v: "igual", label: "🤷 Todas igual" },
                ]}
                valor={r.i15}
                onPick={(v) => set("i15", v)}
              />
            </Pregunta>
            <Pregunta
              n={16}
              texto="Si agregamos 5 fichas verdes a la bolsa, ¿qué color sería ahora el MÁS probable?"
            >
              <Opciones
                opciones={[
                  { v: "roja", label: "🔴 Roja" },
                  { v: "azul", label: "🔵 Azul" },
                  { v: "verde", label: "🟢 Verde" },
                  { v: "igual", label: "🤷 Todas igual" },
                ]}
                valor={r.i16}
                onPick={(v) => set("i16", v)}
              />
            </Pregunta>

            <Avanzar ok={completa[4]} onNext={() => setPantalla(5)} />
          </Situacion>
        )}

        {pantalla === 5 && (
          <Situacion titulo="V. Comparación de probabilidades" sub="Situación 5: Las ruletas">
            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
              <RuletaSVG nombre="Ruleta A" amarillo={3} />
              <RuletaSVG nombre="Ruleta B" amarillo={1} />
            </div>

            <Pregunta n={17} texto="¿En cuál ruleta es MÁS probable obtener el color amarillo?">
              <Opciones
                opciones={[
                  { v: "A", label: "Ruleta A" },
                  { v: "B", label: "Ruleta B" },
                  { v: "ambas", label: "En ambas" },
                  { v: "ninguna", label: "En ninguna" },
                ]}
                valor={r.i17}
                onPick={(v) => set("i17", v)}
              />
            </Pregunta>
            <Pregunta n={18} texto="¿En cuál ruleta es MENOS probable obtener el color azul?">
              <Opciones
                opciones={[
                  { v: "A", label: "Ruleta A" },
                  { v: "B", label: "Ruleta B" },
                  { v: "ambas", label: "En ambas" },
                  { v: "ninguna", label: "En ninguna" },
                ]}
                valor={r.i18}
                onPick={(v) => set("i18", v)}
              />
            </Pregunta>
            <Pregunta n={19} texto="Explica con tus palabras por qué elegiste esa respuesta:">
              <textarea
                value={String(r.i19 ?? "")}
                onChange={(e) => set("i19", e.target.value)}
                rows={3}
                className="w-full rounded-2xl border-2 border-institutional/15 bg-white p-4 text-institutional-deep focus:border-coral focus:outline-none transition-colors"
                placeholder="Escribe aquí tu explicación…"
              />
            </Pregunta>

            <Avanzar ok={completa[5]} onNext={() => setPantalla(6)} />
          </Situacion>
        )}

        {pantalla === 6 && (
          <Situacion
            titulo="VI. Construyo mi propia gráfica"
            sub="Encuesta en mi salón: la mascota favorita"
          >
            <Enunciado>
              Preguntamos a 10 compañeros cuál es su mascota favorita. Estas fueron sus respuestas:
            </Enunciado>
            <div className="card-soft p-4 bg-cream text-3xl md:text-4xl leading-relaxed text-center tracking-wide">
              {MASCOTAS_SECUENCIA.map((m, i) => (
                <span key={i} className="inline-block px-0.5">
                  {MASCOTAS.find((x) => x.id === m)!.icon}
                </span>
              ))}
            </div>

            <Pregunta n={20} texto="Completa la tabla con los resultados:">
              <div className="space-y-3">
                {MASCOTAS.map((m) => (
                  <FilaTabla
                    key={m.id}
                    icon={m.icon}
                    label={m.label}
                    opciones={[0, 1, 2, 3, 4, 5, 6]}
                    valor={subVal("i20", m.id)}
                    onPick={(v) => setSub("i20", m.id, v)}
                  />
                ))}
              </div>
            </Pregunta>

            <Pregunta n={21} texto="Construye tu gráfica de barras con los botones + y −:">
              <div className="card-soft p-5">
                <div className="grid grid-cols-4 gap-4 items-end" style={{ height: 220 }}>
                  {MASCOTAS.map((m) => {
                    const v = Number(subVal("i21", m.id) ?? 0);
                    return (
                      <div
                        key={m.id}
                        className="flex flex-col items-center justify-end h-full gap-1.5"
                      >
                        <div className="font-display font-bold text-institutional-deep">{v}</div>
                        <div
                          className="w-full max-w-14 rounded-t-lg bg-gradient-to-b from-turquoise to-institutional transition-all duration-300"
                          style={{ height: `${(v / 6) * 130}px`, minHeight: v > 0 ? 6 : 0 }}
                        />
                        <div className="text-xl">{m.icon}</div>
                        <div className="flex gap-1.5">
                          <button
                            onClick={() => setSub("i21", m.id, Math.max(0, v - 1))}
                            aria-label={`Quitar uno a ${m.label}`}
                            className="w-9 h-9 rounded-full bg-white border-2 border-institutional/15 font-bold text-lg text-institutional-deep hover:border-coral transition-colors"
                          >
                            −
                          </button>
                          <button
                            onClick={() => setSub("i21", m.id, Math.min(6, v + 1))}
                            aria-label={`Sumar uno a ${m.label}`}
                            className="w-9 h-9 rounded-full bg-white border-2 border-institutional/15 font-bold text-lg text-institutional-deep hover:border-coral transition-colors"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </Pregunta>

            <Pregunta n={22} texto="¿Cuál fue la mascota más elegida?">
              <Opciones
                opciones={MASCOTAS.map((m) => ({ v: m.id, label: `${m.icon} ${m.label}` }))}
                valor={r.i22}
                onPick={(v) => set("i22", v)}
              />
            </Pregunta>
            <Pregunta n={23} texto="¿Cuál fue la menos elegida?">
              <Opciones
                opciones={MASCOTAS.map((m) => ({ v: m.id, label: `${m.icon} ${m.label}` }))}
                valor={r.i23}
                onPick={(v) => set("i23", v)}
              />
            </Pregunta>
            <Pregunta n={24} texto="¿Qué aprendiste sobre las tablas y las gráficas?">
              <textarea
                value={String(r.i24 ?? "")}
                onChange={(e) => set("i24", e.target.value)}
                rows={3}
                className="w-full rounded-2xl border-2 border-institutional/15 bg-white p-4 text-institutional-deep focus:border-coral focus:outline-none transition-colors"
                placeholder="Escribe aquí lo que aprendiste…"
              />
            </Pregunta>

            <div className="mt-8 flex justify-end">
              <button
                onClick={enviar}
                disabled={!completa[6] || enviando}
                className="btn-primary text-lg disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {enviando ? "Enviando…" : "📨 Enviar mi prueba"}
              </button>
            </div>
            {!completa[6] && (
              <p className="mt-2 text-right text-xs text-muted-foreground">
                Responde todas las preguntas para poder enviar.
              </p>
            )}
          </Situacion>
        )}

        {pantalla === "fin" && (
          <div className="animate-bounce-in text-center py-10">
            <BuMascot eager className="w-32 md:w-40 h-auto mx-auto drop-shadow-xl animate-float" />
            <h1 className="mt-4 text-3xl md:text-5xl font-display font-bold text-institutional-deep">
              {resultadoEnvio === "preview" ? "Vista previa terminada" : "¡Prueba enviada! 🎉"}
            </h1>
            <div className="card-soft p-6 mt-6 max-w-lg mx-auto">
              {resultadoEnvio === "ok" && (
                <p className="text-lg text-institutional-deep">
                  ¡Lo lograste, {data.session.nombre.split(" ")[0]}! 🏅 Tus respuestas quedaron
                  guardadas y tu profe las revisará. Ahora sí… ¡a jugar y aprender!
                </p>
              )}
              {resultadoEnvio === "repetida" && (
                <p className="text-lg text-institutional-deep">
                  ¡Buen repaso! Recuerda que la prueba que cuenta es la <strong>primera</strong> que
                  enviaste — esta práctica no reemplaza tus respuestas.
                </p>
              )}
              {resultadoEnvio === "preview" && (
                <p className="text-lg text-institutional-deep">
                  Recorriste la prueba en modo docente: no se guardó ningún dato. Los resultados de
                  tus estudiantes aparecen en el panel.
                </p>
              )}
            </div>
            <div className="mt-6 flex justify-center gap-3 flex-wrap">
              <Link to="/juegos" className="btn-primary">
                🎮 Ir a los juegos
              </Link>
              {esDocente && (
                <Link to="/panel" className="btn-secondary">
                  📋 Ver panel
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

/* ---------- Piezas de UI ---------- */

function Situacion({
  titulo,
  sub,
  children,
}: {
  titulo: string;
  sub: string;
  children: React.ReactNode;
}) {
  return (
    <div className="animate-bounce-in space-y-5 pb-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-display font-bold text-institutional-deep">
          {titulo}
        </h1>
        <p className="text-coral font-semibold mt-1">{sub}</p>
      </div>
      {children}
    </div>
  );
}

function Enunciado({ children }: { children: React.ReactNode }) {
  return <p className="text-institutional-deep text-lg">{children}</p>;
}

function Pregunta({ n, texto, children }: { n: number; texto: string; children: React.ReactNode }) {
  return (
    <div className="card-soft p-5">
      <p className="font-display font-bold text-institutional-deep mb-3">
        <span className="inline-grid place-items-center w-7 h-7 rounded-full bg-institutional text-white text-sm mr-2">
          {n}
        </span>
        {texto}
      </p>
      {children}
    </div>
  );
}

function Opciones({
  opciones,
  valor,
  onPick,
}: {
  opciones: { v: string; label: string }[];
  valor: unknown;
  onPick: (v: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {opciones.map((o) => (
        <button
          key={o.v}
          onClick={() => onPick(o.v)}
          className={`rounded-2xl px-4 py-2.5 border-2 font-semibold transition-all min-h-11 ${
            valor === o.v
              ? "bg-institutional text-white border-institutional"
              : "bg-white border-institutional/15 text-institutional-deep hover:border-coral"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

function NumOpciones({
  opciones,
  valor,
  onPick,
}: {
  opciones: number[];
  valor: unknown;
  onPick: (v: number) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {opciones.map((n) => (
        <button
          key={n}
          onClick={() => onPick(n)}
          className={`w-14 h-12 rounded-2xl border-2 font-bold text-lg transition-all ${
            valor === n
              ? "bg-institutional text-white border-institutional"
              : "bg-white border-institutional/15 text-institutional-deep hover:border-coral"
          }`}
        >
          {n}
        </button>
      ))}
    </div>
  );
}

function FilaTabla({
  icon,
  label,
  opciones,
  valor,
  onPick,
  simbolo,
}: {
  icon: string;
  label: string;
  opciones: number[];
  valor: unknown;
  onPick: (v: number) => void;
  simbolo?: string;
}) {
  return (
    <div className="flex items-center gap-3 flex-wrap">
      <span className="font-display font-bold text-institutional-deep w-28 shrink-0">
        {icon} {label}
      </span>
      {simbolo && (
        <span className="text-lg min-w-24">
          {typeof valor === "number" ? simbolo.repeat(valor) : ""}
        </span>
      )}
      <span className="ml-auto flex gap-1.5 flex-wrap">
        {opciones.map((n) => (
          <button
            key={n}
            onClick={() => onPick(n)}
            className={`w-10 h-10 rounded-xl font-bold border-2 transition-all ${
              valor === n
                ? "bg-institutional text-white border-institutional"
                : "bg-white border-institutional/15 text-institutional-deep hover:border-coral"
            }`}
          >
            {n}
          </button>
        ))}
      </span>
    </div>
  );
}

function BarChart({
  datos,
  max,
  titulo,
}: {
  datos: { label: string; n: number }[];
  max: number;
  titulo: string;
}) {
  return (
    <div className="card-soft p-4">
      <div className="text-xs font-bold uppercase tracking-widest text-turquoise mb-2">
        {titulo}
      </div>
      <div
        className="grid gap-3 items-end"
        style={{ gridTemplateColumns: `repeat(${datos.length}, 1fr)`, height: 180 }}
      >
        {datos.map((d, i) => (
          <div key={i} className="flex flex-col items-center justify-end h-full gap-1">
            <div className="font-display font-bold text-sm text-institutional-deep">{d.n}</div>
            <div
              className="w-full max-w-12 rounded-t-lg bg-gradient-to-b from-turquoise to-institutional"
              style={{ height: `${(d.n / max) * 120}px` }}
            />
            <div className="text-xl">{d.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function RuletaSVG({ nombre, amarillo }: { nombre: string; amarillo: number }) {
  // Ruleta de 4 sectores: `amarillo` sectores amarillos, el resto azules.
  const size = 140;
  const r = size / 2;
  function sector(i: number) {
    const a0 = ((i * 90 - 90) * Math.PI) / 180;
    const a1 = (((i + 1) * 90 - 90) * Math.PI) / 180;
    return `M ${r} ${r} L ${r + Math.cos(a0) * r} ${r + Math.sin(a0) * r} A ${r} ${r} 0 0 1 ${r + Math.cos(a1) * r} ${r + Math.sin(a1) * r} Z`;
  }
  return (
    <div className="card-soft p-4 text-center">
      <svg
        viewBox={`0 0 ${size} ${size}`}
        width="100%"
        style={{ maxWidth: 150 }}
        className="mx-auto"
      >
        {[0, 1, 2, 3].map((i) => (
          <path
            key={i}
            d={sector(i)}
            fill={i < amarillo ? "#f4c460" : "#3e6dbb"}
            stroke="white"
            strokeWidth="2"
          />
        ))}
        <circle cx={r} cy={r} r={8} fill="white" stroke="#2a306e" strokeWidth="2" />
      </svg>
      <div className="mt-2 font-display font-bold text-institutional-deep">{nombre}</div>
    </div>
  );
}

function Avanzar({ ok, onNext }: { ok: boolean; onNext: () => void }) {
  return (
    <div className="mt-6 flex flex-col items-end gap-1.5">
      <button
        onClick={() => {
          onNext();
          window.scrollTo({ top: 0 });
        }}
        disabled={!ok}
        className="btn-primary disabled:opacity-60 disabled:cursor-not-allowed"
      >
        Siguiente →
      </button>
      {!ok && (
        <p className="text-xs text-muted-foreground">
          Responde todas las preguntas para continuar.
        </p>
      )}
    </div>
  );
}
