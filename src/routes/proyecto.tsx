import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/proyecto")({
  head: () => ({
    meta: [
      { title: "El Proyecto · Modelo ADDIE, EBC y DBA — Exploradores de Datos" },
      {
        name: "description",
        content:
          "Fundamentación pedagógica del AVA: modelo de diseño instruccional ADDIE, Estándares Básicos de Competencias y DBA 10 y 11 de grado 3°.",
      },
    ],
  }),
  component: ProyectoPage,
});

const addieFases = [
  {
    letra: "A",
    fase: "Análisis",
    subtitulo: "Diagnóstico",
    icon: "🔍",
    body: "Se aplicó la prueba diagnóstica «¡Exploradores de Datos!» a los estudiantes de 3° de la sede Escilda Medina Pacheco. Se detectaron fortalezas en conteo y organización (80%) y debilidades críticas en pictogramas con escala (20%) y construcción autónoma de gráficas (39%).",
  },
  {
    letra: "D",
    fase: "Diseño",
    subtitulo: "Planificación",
    icon: "📐",
    body: "Con base en el diagnóstico se estructuró la estrategia: navegación por módulos semanales, gamificación y aprendizaje basado en retos (misiones), alineada a los EBC y a los DBA 10 y 11 de grado 3°.",
  },
  {
    letra: "D",
    fase: "Desarrollo",
    subtitulo: "Creación de recursos",
    icon: "🛠️",
    body: "Construcción de este AVA con las 3 misiones — El Dilema de la Fruta, Consultoría en la Tienda Escolar y El Jugo Estrella — y juegos interactivos propios, integrando herramientas como Google Forms, Canva, PhET y Scratch.",
  },
  {
    letra: "I",
    fase: "Implementación",
    subtitulo: "Ejecución",
    icon: "🏫",
    body: "Puesta en marcha de las actividades en el aula presencial y en la plataforma, con acompañamiento docente, seguimiento formativo y registro sistemático del proceso de aprendizaje.",
  },
  {
    letra: "E",
    fase: "Evaluación",
    subtitulo: "Valoración",
    icon: "📈",
    body: "Análisis de los resultados tras la intervención, comparando el desempeño antes y después para valorar la mejora del pensamiento aleatorio y reflexionar sobre la efectividad de la estrategia.",
  },
];

const estandares = [
  { icon: "🗂️", t: "Clasificar y organizar datos de acuerdo a cualidades y atributos y presentarlos en tablas." },
  { icon: "💬", t: "Interpretar cualitativamente datos referidos a situaciones del entorno escolar." },
  { icon: "📖", t: "Describir situaciones o eventos a partir de un conjunto de datos." },
  { icon: "📊", t: "Representar datos relativos al entorno usando objetos concretos, pictogramas y diagramas de barras." },
  { icon: "🔁", t: "Identificar regularidades y tendencias en un conjunto de datos." },
  { icon: "⚖️", t: "Explicar, desde la experiencia, la posibilidad o imposibilidad de ocurrencia de eventos cotidianos." },
  { icon: "🔮", t: "Predecir si la posibilidad de ocurrencia de un evento es mayor que la de otro." },
  { icon: "🧩", t: "Resolver y formular preguntas que requieran coleccionar y analizar datos del entorno próximo." },
];

const hallazgos = [
  { valor: "80%", label: "Dominio del conteo y la organización básica de datos", tipo: "fortaleza" },
  { valor: "76%", label: "Acierto comparando ruletas: el pensamiento visual es su mayor fortaleza", tipo: "fortaleza" },
  { valor: "75%", label: "Interpretación de tablas de frecuencia ya construidas", tipo: "fortaleza" },
  { valor: "52%", label: "Noción de probabilidad (eventos seguros, posibles e imposibles)", tipo: "reto" },
  { valor: "39%", label: "Construcción autónoma de gráficas de barras", tipo: "reto" },
  { valor: "20%", label: "Pictogramas con escala (comprender que un símbolo vale varias unidades)", tipo: "reto" },
];

function ProyectoPage() {
  return (
    <main className="bg-paper min-h-screen">
      <header className="mx-auto max-w-6xl px-6 pt-6 pb-4">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-institutional-deep hover:text-coral transition-colors"
        >
          ← Volver al inicio
        </Link>
      </header>

      {/* HERO */}
      <section className="mx-auto max-w-4xl px-6 pt-4 pb-10 text-center">
        <p className="text-sm font-semibold tracking-widest uppercase text-turquoise">
          Fundamentación pedagógica
        </p>
        <h1 className="mt-2 text-3xl md:text-5xl font-display font-bold text-institutional-deep leading-tight">
          Un AVA diseñado con el modelo <span className="text-coral">ADDIE</span>
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          <strong>Exploradores de Datos</strong> es el Entorno Virtual de Aprendizaje del
          proyecto <em>«Estrategia Pedagógica Mediada por las TIC para el Fortalecimiento
          del Pensamiento Aleatorio en Estudiantes de Grado 3° de la Institución Educativa
          Ciudad de Tunja, Sede Escilda Medina Pacheco»</em> (Universidad Tecnológica de
          Bolívar · Proyecto Aplicado II).
        </p>
      </section>

      {/* ADDIE */}
      <section className="mx-auto max-w-6xl px-6 py-10">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-display font-bold text-institutional-deep">
            Las 5 fases del diseño instruccional
          </h2>
          <p className="mt-2 text-muted-foreground">
            Cada fase del modelo ADDIE se aplica así en este proyecto:
          </p>
        </div>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {addieFases.map((f, i) => (
            <div key={i} className="card-soft p-6 relative overflow-hidden">
              <div className="absolute -top-4 -right-2 text-[7rem] leading-none font-display font-bold text-institutional/5 select-none">
                {f.letra}
              </div>
              <div className="relative">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-institutional to-turquoise text-white grid place-items-center text-2xl shadow-lg">
                  {f.icon}
                </div>
                <div className="mt-3 text-xs font-bold tracking-widest uppercase text-coral">
                  Fase {i + 1} · {f.subtitulo}
                </div>
                <h3 className="mt-1 font-display font-bold text-xl text-institutional-deep">
                  {f.fase}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">{f.body}</p>
              </div>
            </div>
          ))}
          {/* Card resumen */}
          <div className="card-soft p-6 bg-gradient-to-br from-institutional to-institutional-deep text-white">
            <div className="text-2xl">🦉</div>
            <h3 className="mt-3 font-display font-bold text-xl">¿Por qué ADDIE?</h3>
            <p className="mt-2 text-sm text-white/85">
              Este marco sistemático garantiza que la plataforma sea coherente, esté
              alineada con los referentes de calidad del MEN (EBC y DBA) y responda
              directamente a las necesidades detectadas en el diagnóstico — no a la
              improvisación.
            </p>
          </div>
        </div>
      </section>

      {/* DIAGNÓSTICO */}
      <section className="mx-auto max-w-6xl px-6 py-10">
        <div className="text-center mb-10">
          <p className="text-sm font-semibold tracking-widest uppercase text-turquoise">
            Fase de análisis
          </p>
          <h2 className="mt-2 text-2xl md:text-3xl font-display font-bold text-institutional-deep">
            Lo que reveló el diagnóstico
          </h2>
          <p className="mt-2 text-muted-foreground max-w-2xl mx-auto">
            Resultados de la prueba «¡Exploradores de Datos! Mi prueba de estadística y
            probabilidad», aplicada al grado 3° de la sede Escilda Medina Pacheco:
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {hallazgos.map((h, i) => (
            <div
              key={i}
              className={`card-soft p-5 border-t-4 ${
                h.tipo === "fortaleza" ? "border-t-turquoise" : "border-t-coral"
              }`}
            >
              <div className="flex items-baseline gap-2">
                <span
                  className={`font-display font-bold text-3xl ${
                    h.tipo === "fortaleza" ? "text-turquoise" : "text-coral"
                  }`}
                >
                  {h.valor}
                </span>
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  {h.tipo === "fortaleza" ? "Fortaleza" : "Reto detectado"}
                </span>
              </div>
              <p className="mt-2 text-sm text-institutional-deep">{h.label}</p>
            </div>
          ))}
        </div>
        <p className="mt-6 text-center text-sm text-muted-foreground max-w-3xl mx-auto">
          💡 La brecha entre organizar datos (80%) y construirlos gráficamente (39%)
          justifica la mediación TIC: el software asume la carga procedimental del dibujo
          para que el niño se concentre en el <strong>análisis</strong>. Por eso las
          misiones de este AVA priorizan pictogramas con escala y construcción guiada de
          gráficas.
        </p>
      </section>

      {/* REFERENTES: EBC */}
      <section className="mx-auto max-w-6xl px-6 py-10">
        <div className="text-center mb-8">
          <p className="text-sm font-semibold tracking-widest uppercase text-turquoise">
            Referentes de calidad · MEN
          </p>
          <h2 className="mt-2 text-2xl md:text-3xl font-display font-bold text-institutional-deep">
            Estándares Básicos de Competencias (1° a 3°)
          </h2>
          <p className="mt-2 text-muted-foreground">
            Pensamiento aleatorio y sistemas de datos:
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {estandares.map((e, i) => (
            <div key={i} className="card-soft p-4 flex items-start gap-3">
              <span className="text-2xl shrink-0">{e.icon}</span>
              <p className="text-sm text-institutional-deep">{e.t}</p>
            </div>
          ))}
        </div>
      </section>

      {/* DBA */}
      <section className="mx-auto max-w-6xl px-6 py-10">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-display font-bold text-institutional-deep">
            Derechos Básicos de Aprendizaje · Grado 3°
          </h2>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="card-soft p-7 border-t-4 border-t-institutional">
            <div className="inline-flex items-center gap-2 rounded-full bg-institutional/10 px-3 py-1 text-xs font-bold text-institutional uppercase tracking-wider">
              DBA 10 · Lectura e interpretación de datos
            </div>
            <p className="mt-3 text-institutional-deep font-medium">
              «Lee e interpreta información contenida en tablas de frecuencia, gráficos de
              barras y/o pictogramas con escala, para formular y resolver preguntas de
              situaciones de su entorno.»
            </p>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li>✅ Construir tablas y gráficos que representen datos.</li>
              <li>✅ Analizar e interpretar información según el contexto.</li>
              <li>✅ Identificar la moda a partir de datos en gráficos y tablas.</li>
              <li>✅ Comparar información entre tablas y gráficos.</li>
            </ul>
            <p className="mt-4 text-xs font-semibold text-turquoise uppercase tracking-wider">
              Se trabaja en: Misiones 1, 2 y 3
            </p>
          </div>
          <div className="card-soft p-7 border-t-4 border-t-coral">
            <div className="inline-flex items-center gap-2 rounded-full bg-coral/10 px-3 py-1 text-xs font-bold text-coral uppercase tracking-wider">
              DBA 11 · Probabilidad y azar
            </div>
            <p className="mt-3 text-institutional-deep font-medium">
              «Plantea y resuelve preguntas sobre la posibilidad de ocurrencia de
              situaciones aleatorias cotidianas y cuantifica la posibilidad de ocurrencia
              de eventos simples en una escala cualitativa (mayor, menor e igual).»
            </p>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li>✅ Usar la escala: imposible, menos posible, igualmente posible, más posible, seguro.</li>
              <li>✅ Representar posibles resultados con diagramas.</li>
              <li>✅ Asignar la posibilidad de ocurrencia según la escala.</li>
              <li>✅ Predecir usando resultados de una situación aleatoria.</li>
            </ul>
            <p className="mt-4 text-xs font-semibold text-coral uppercase tracking-wider">
              Se trabaja en: Retos de azar (Cara o Sello · La Ruleta)
            </p>
          </div>
        </div>
        <div className="mt-8 text-center">
          <Link to="/juegos" className="btn-primary">
            🎮 Ir a los módulos y juegos
          </Link>
        </div>
      </section>

      {/* EQUIPO */}
      <section className="mx-auto max-w-5xl px-6 py-12">
        <div className="card-soft p-8 md:p-10">
          <div className="text-center">
            <p className="text-sm font-semibold tracking-widest uppercase text-turquoise">
              Equipo investigador
            </p>
            <h2 className="mt-2 text-2xl font-display font-bold text-institutional-deep">
              Universidad Tecnológica de Bolívar · Proyecto Aplicado II
            </h2>
          </div>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {[
              "Alexis Cogollo Orozco",
              "Sandra Jiménez Jiménez",
              "Katerine Barrios Alcázar",
              "Eliceth Johana Dávila Amaris",
              "Ladys Zamorano Imbett",
            ].map((n) => (
              <span
                key={n}
                className="rounded-full bg-institutional/8 border border-institutional/15 px-4 py-1.5 text-sm font-semibold text-institutional-deep"
              >
                {n}
              </span>
            ))}
          </div>
          <p className="mt-5 text-center text-sm text-muted-foreground">
            Asesor: <strong>Raúl Ernesto Acosta Mesa</strong> · Cartagena de Indias,
            Bolívar · 2026
          </p>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            Investigación-acción con enfoque cualitativo: diagnóstico → planificación →
            implementación → análisis y reflexión.
          </p>
        </div>
      </section>
    </main>
  );
}
