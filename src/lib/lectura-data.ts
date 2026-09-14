// Base de datos pedagógica del módulo de Comprensión Lectora
// Basado en el diseño curricular "Hacia la personalización del currículo mediante IA"
// Maestría en Educación Mediada por las TIC · Universidad Tecnológica de Bolívar · Grado 3°

export type NivelLectura = "explorador" | "aventurero" | "maestro";
export type NivelComprension = "literal" | "inferencial" | "critico";

export type GlosarioTerm = {
  palabra: string;
  definicion: string;
  ejemplo: string;
  icono: string;
};

export const GLOSARIO: Record<string, GlosarioTerm> = {
  manglar: {
    palabra: "Manglar",
    definicion:
      "Bosque de árboles especiales que crecen en aguas saladas entre el mar y la tierra.",
    ejemplo: "En la Ciénaga de la Virgen de Cartagena protegemos el manglar.",
    icono: "🌿",
  },
  garza: {
    palabra: "Garza",
    definicion:
      "Ave zancuda de cuello largo y plumas blancas que habita cerca de lagunas y ciénagas.",
    ejemplo: "Sofi la garza observaba los peces desde lo alto de una rama.",
    icono: "🪶",
  },
  ecosistema: {
    palabra: "Ecosistema",
    definicion:
      "Comunidad de seres vivos (animales, plantas) que comparten un mismo hogar natural y se ayudan entre sí.",
    ejemplo: "El manglar es un ecosistema lleno de vida marina.",
    icono: "🌍",
  },
  marea: {
    palabra: "Marea",
    definicion: "El movimiento natural de subida y bajada del agua del mar durante el día.",
    ejemplo: "Cuando bajó la marea, los cangrejos salieron a buscar comida.",
    icono: "🌊",
  },
  refugio: {
    palabra: "Refugio",
    definicion: "Lugar seguro donde los animales se protegen de peligros o tormentas.",
    ejemplo: "Las raíces del mangle sirven de refugio para los pececitos recién nacidos.",
    icono: "🛡️",
  },
  solidaridad: {
    palabra: "Solidaridad",
    definicion: "Ayudar a los demás con cariño y compromiso cuando tienen una dificultad.",
    ejemplo: "Todos los animales mostraron solidaridad limpiando las ramas del manglar.",
    icono: "🤝",
  },
};

export type HistoriaNivel = {
  nivel: NivelLectura;
  nombreNivel: string;
  descripcion: string;
  badge: string;
  parrafos: {
    id: number;
    subtitulo: string;
    contenido: string;
    palabrasClave: string[];
    preguntaGuia: string;
  }[];
};

export const HISTORIA_MULTINIVEL: Record<NivelLectura, HistoriaNivel> = {
  explorador: {
    nivel: "explorador",
    nombreNivel: "Nivel 1 · Explorador",
    descripcion: "Texto adaptado con oraciones claras, palabras destacadas y apoyo visual.",
    badge: "🌱",
    parrafos: [
      {
        id: 1,
        subtitulo: "El hogar de Sofi y Martín",
        contenido:
          "Cerca de Cartagena, en una hermosa ciénaga, vivía Sofi, una pequeña garza de plumas blancas, y su amigo Martín, un pelícano juguetón. Su hogar favorito era el manglar. Allí jugaban entre raíces grandes y aguas tranquilas.",
        palabrasClave: ["garza", "manglar"],
        preguntaGuia: "¿Quiénes son los dos amigos y dónde viven?",
      },
      {
        id: 2,
        subtitulo: "Un problema en el agua",
        contenido:
          "Una mañana, la marea bajó y Martín notó algo extraño: muchas botellas plásticas y bolsas flotaban entre las raíces. Los pececitos estaban asustados porque no encontraban refugio seguro.",
        palabrasClave: ["marea", "refugio"],
        preguntaGuia: "¿Qué problema descubrió Martín cuando bajó la marea?",
      },
      {
        id: 3,
        subtitulo: "El plan de ayuda",
        contenido:
          "Sofi voló hacia las ramas más altas y llamó a Beto el cangrejo y a Bú la sabia lechuza. «¡Nuestro ecosistema nos necesita!», dijo Sofi. Con gran solidaridad, cada animal recogió un desecho hasta dejar el agua limpia y clara.",
        palabrasClave: ["ecosistema", "solidaridad"],
        preguntaGuia: "¿Qué hicieron los amigos para resolver la situación?",
      },
    ],
  },
  aventurero: {
    nivel: "aventurero",
    nombreNivel: "Nivel 2 · Aventurero",
    descripcion: "Narrativa intermedia con diálogos ricos, conectores y detalles contextuales.",
    badge: "🧭",
    parrafos: [
      {
        id: 1,
        subtitulo: "Amanecer en la Ciénaga de la Virgen",
        contenido:
          "El sol caribeño comenzaba a dorar las aguas tranquilas de la Ciénaga de la Virgen en Cartagena. Sofi, una curiosa garza de pico dorado, estiraba sus alas mientras observaba a Martín, un pelícano de mirada noble que pescaba con destreza. Su hábitat no era un lugar cualquiera: habitaban un extenso manglar donde la vida marina florecía con fuerza.",
        palabrasClave: ["garza", "manglar"],
        preguntaGuia: "¿Qué cualidades demuestran Sofi y Martín en su vida cotidiana?",
      },
      {
        id: 2,
        subtitulo: "El secreto que reveló la bajamar",
        contenido:
          "De pronto, al cambiar la marea matutina, las raíces zancudas del mangle dejaron ver una triste sorpresa. Corrientes lejanas habían arrastrado botellas plásticas, empaques y mallas viejas. Los pequeños alevines y peces bebé nadaban desorientados, habiendo perdido el refugio seguro donde siempre se protegían de las corrientes fuertes.",
        palabrasClave: ["marea", "refugio"],
        preguntaGuia:
          "¿Por qué la basura representaba un peligro directo para los seres más pequeños?",
      },
      {
        id: 3,
        subtitulo: "La fuerza de la comunidad",
        contenido:
          "Lejos de rendirse, Sofi emitió un canto de alerta que reunió a Beto el cangrejo azul y a Bú, la observadora lechuza del manglar. «Si cuidamos este ecosistema, nos cuidamos a nosotros mismos», proclamó Bú con firmeza. Demostrando una auténtica solidaridad comunitaria, formaron una cadena de ayuda: Martín cargaba los objetos flotantes en su pico elástico, Beto cortaba las mallas con sus pinzas y Sofi apilaba todo en la orilla para que los guardabosques lo retiraran. El agua volvió a brillar como un espejo cristalino.",
        palabrasClave: ["ecosistema", "solidaridad"],
        preguntaGuia:
          "¿Cómo se complementaron las habilidades de cada animal para lograr el rescate del manglar?",
      },
    ],
  },
  maestro: {
    nivel: "maestro",
    nombreNivel: "Nivel 3 · Maestro",
    descripcion:
      "Texto enriquecido con vocabulario literario, descripciones profundas y matices críticos.",
    badge: "🏆",
    parrafos: [
      {
        id: 1,
        subtitulo: "El equilibrio ancestral del ecosistema costero",
        contenido:
          "En el horizonte cartagenero, donde la brisa marina acaricia los bordes de la Ciénaga de la Virgen, se erige uno de los santuarios ecológicos más valiosos del litoral: el denso manglar. En este tejido vivo de raíces entrelazadas convivían en perfecta armonía Sofi, una elegante garza real poseedora de una aguda capacidad de observación, y Martín, un veterano pelícano pardo cuya memoria albergaba los ciclos de innumerables estaciones.",
        palabrasClave: ["garza", "manglar"],
        preguntaGuia:
          "¿De qué manera el autor resalta la importancia ecológica y la memoria del entorno natural?",
      },
      {
        id: 2,
        subtitulo: "La huella invisible de la contaminación urbana",
        contenido:
          "Durante el reflujo de la marea diurna, un fenómeno alarmante interrumpió la serenidad del paisaje: toneladas de polímeros y desechos sintéticos, transportados por los drenajes urbanos circundantes, quedaron atrapados en el entramado vegetal. Aquellas raíces que durante generaciones habían servido de refugio insustituible y sala de cuna para las especies juveniles del Caribe, se convirtieron repentinamente en trampas que amenazaban la supervivencia de la fauna nativa.",
        palabrasClave: ["marea", "refugio"],
        preguntaGuia:
          "¿Qué contraste crítico se establece entre la función original del manglar y el efecto de los desechos?",
      },
      {
        id: 3,
        subtitulo: "La movilización colectiva y la ética de la conservación",
        contenido:
          "Conscientes de la urgencia del desafío, Sofi y Martín convocaron una asamblea de emergencia. Bú, la consejera pedagógica del bosque, recordó a los congregados que la preservación de un ecosistema requiere tanto liderazgo como acción coordinada. Aquella jornada se convirtió en una lección viva de solidaridad cívica y ambiental: mediante una labor sinérgica y extenuante, Beto el cangrejo, Martín y Sofi restauraron la pureza del humedal, dejando claro que el bienestar de la naturaleza depende directamente de la responsabilidad ética de sus habitantes.",
        palabrasClave: ["ecosistema", "solidaridad"],
        preguntaGuia: "¿Qué valores humanos y éticos se desprenden del desenlace de esta historia?",
      },
    ],
  },
};

export type PreguntaQuiz = {
  id: string;
  numero: number;
  texto: string;
  nivel: NivelComprension;
  etiquetaNivel: string;
  opciones: {
    letra: "A" | "B" | "C" | "D";
    texto: string;
    esCorrecta: boolean;
    explicacion: string;
  }[];
  pistaSocratica: string;
};

// 1. Diagnóstico Inicial Automatizado (10 reactivos: 4 Literales, 4 Inferenciales, 2 Críticos)
export const DIAGNOSTICO_INICIAL_PREGUNTAS: PreguntaQuiz[] = [
  {
    id: "diag_1",
    numero: 1,
    texto: "¿Quiénes son los personajes principales que viven en la ciénaga?",
    nivel: "literal",
    etiquetaNivel: "Nivel Literal",
    opciones: [
      {
        letra: "A",
        texto: "Un león y una cebra salvaje",
        esCorrecta: false,
        explicacion: "Estos animales viven en la sabana, no en el manglar cartagenero.",
      },
      {
        letra: "B",
        texto: "Sofi la garza y Martín el pelícano",
        esCorrecta: true,
        explicacion: "¡Correcto! El texto nombra claramente a Sofi la garza y Martín el pelícano.",
      },
      {
        letra: "C",
        texto: "Un gato callejero y un perro guardián",
        esCorrecta: false,
        explicacion: "No son los animales que habitan la ciénaga según la lectura.",
      },
      {
        letra: "D",
        texto: "Un tiburón blanco y una ballena jorobada",
        esCorrecta: false,
        explicacion: "Ellos viven en altamar, no en las aguas de la ciénaga.",
      },
    ],
    pistaSocratica:
      "Vuelve a leer el primer párrafo: ¿qué animales con alas disfrutan del manglar?",
  },
  {
    id: "diag_2",
    numero: 2,
    texto: "¿En qué lugar de Colombia transcurre la historia?",
    nivel: "literal",
    etiquetaNivel: "Nivel Literal",
    opciones: [
      {
        letra: "A",
        texto: "En las montañas nevadas de Pasto",
        esCorrecta: false,
        explicacion: "La lectura menciona un manglar costero, no una montaña fría.",
      },
      {
        letra: "B",
        texto: "En el desierto de la Guajira",
        esCorrecta: false,
        explicacion: "La historia ocurre en un cuerpo de agua con mangles.",
      },
      {
        letra: "C",
        texto: "En la Ciénaga cerca de Cartagena de Indias",
        esCorrecta: true,
        explicacion: "¡Excelente! La historia se sitúa en la ciénaga y costa de Cartagena.",
      },
      {
        letra: "D",
        texto: "En un bosque de pinos en Medellín",
        esCorrecta: false,
        explicacion: "No corresponde al entorno del manglar cartagenero.",
      },
    ],
    pistaSocratica: "¿Qué ciudad costera del Caribe colombiano se nombra al principio?",
  },
  {
    id: "diag_3",
    numero: 3,
    texto: "¿Qué fenómeno del agua ocurrió antes de que descubrieran la basura?",
    nivel: "literal",
    etiquetaNivel: "Nivel Literal",
    opciones: [
      {
        letra: "A",
        texto: "Hubo una nevada intensa",
        esCorrecta: false,
        explicacion: "En Cartagena nunca cae nieve.",
      },
      {
        letra: "B",
        texto: "La marea bajó y dejó al descubierto las raíces",
        esCorrecta: true,
        explicacion: "¡Muy bien! Cuando bajó la marea se pudieron ver los desechos atrapados.",
      },
      {
        letra: "C",
        texto: "Un tsunami inundó toda la ciudad",
        esCorrecta: false,
        explicacion: "El texto no describe ninguna catástrofe de ese tipo.",
      },
      {
        letra: "D",
        texto: "El agua se congeló por completo",
        esCorrecta: false,
        explicacion: "El clima tropical del manglar mantiene el agua cálida.",
      },
    ],
    pistaSocratica:
      "Busca la palabra que describe el movimiento diario de subida y bajada del mar.",
  },
  {
    id: "diag_4",
    numero: 4,
    texto: "¿Qué herramienta natural utilizó Martín el pelícano para recoger los plásticos?",
    nivel: "literal",
    etiquetaNivel: "Nivel Literal",
    opciones: [
      {
        letra: "A",
        texto: "Una carretilla de madera",
        esCorrecta: false,
        explicacion: "Los animales no usaron carretillas.",
      },
      {
        letra: "B",
        texto: "Su pico elástico y amplio",
        esCorrecta: true,
        explicacion:
          "¡Exacto! Los pelícanos tienen una bolsa elástica en su pico ideal para atrapar objetos en el agua.",
      },
      {
        letra: "C",
        texto: "Una caña de pescar metálica",
        esCorrecta: false,
        explicacion: "Martín utilizó su propio cuerpo como ave acuática.",
      },
      {
        letra: "D",
        texto: "Una aspiradora eléctrica",
        esCorrecta: false,
        explicacion: "En la naturaleza no hay aspiradoras.",
      },
    ],
    pistaSocratica:
      "¿Qué parte característica del cuerpo de un pelícano le permite cargar cosas grandes?",
  },
  {
    id: "diag_5",
    numero: 5,
    texto: "¿Por qué los peces pequeños estaban asustados al llegar la basura?",
    nivel: "inferencial",
    etiquetaNivel: "Nivel Inferencial",
    opciones: [
      {
        letra: "A",
        texto: "Porque no les gustaba el color de las bolsas",
        esCorrecta: false,
        explicacion: "El problema no era el color, sino el peligro para su vida.",
      },
      {
        letra: "B",
        texto: "Porque perdieron su refugio seguro y podían enfermar o quedar atrapados",
        esCorrecta: true,
        explicacion:
          "¡Gran deducción! Los desechos bloquean sus raíces refugio y contaminan su alimento.",
      },
      {
        letra: "C",
        texto: "Porque querían salir volando al cielo",
        esCorrecta: false,
        explicacion: "Los peces no pueden volar fuera del agua.",
      },
      {
        letra: "D",
        texto: "Porque la música estaba demasiado alta",
        esCorrecta: false,
        explicacion: "No había música en el lugar.",
      },
    ],
    pistaSocratica:
      "Piensa: si tu casa se llena de cosas peligrosas, ¿cómo te afectaría para vivir?",
  },
  {
    id: "diag_6",
    numero: 6,
    texto: "¿Qué se puede deducir sobre la personalidad de Sofi la garza?",
    nivel: "inferencial",
    etiquetaNivel: "Nivel Inferencial",
    opciones: [
      {
        letra: "A",
        texto: "Es perezosa y prefiere que otros hagan todo",
        esCorrecta: false,
        explicacion: "Al contrario, ella tomó la iniciativa inmediatamente.",
      },
      {
        letra: "B",
        texto: "Es miedosa y huyó de la ciénaga",
        esCorrecta: false,
        explicacion: "Sofi no escapó; se quedó a ayudar a su comunidad.",
      },
      {
        letra: "C",
        texto: "Es líder, solidaria y se preocupa por el bienestar común",
        esCorrecta: true,
        explicacion: "¡Brillante! Sofi convocó a los amigos y coordinó la ayuda con valentía.",
      },
      {
        letra: "D",
        texto: "No le importaba lo que pasara en el manglar",
        esCorrecta: false,
        explicacion: "Sofi ama su hogar y lo defendió.",
      },
    ],
    pistaSocratica: "¿Qué acciones tomó Sofi apenas vio el problema en lugar de quedarse quieta?",
  },
  {
    id: "diag_7",
    numero: 7,
    texto: "¿De dónde provino probablemente la basura que llegó al manglar?",
    nivel: "inferencial",
    etiquetaNivel: "Nivel Inferencial",
    opciones: [
      {
        letra: "A",
        texto: "Los propios peces la fabricaron",
        esCorrecta: false,
        explicacion: "Los animales acuáticos no producen plásticos.",
      },
      {
        letra: "B",
        texto: "Cayó de las estrellas durante la noche",
        esCorrecta: false,
        explicacion: "El plástico es un invento humano, no espacial.",
      },
      {
        letra: "C",
        texto: "De personas que arrojan residuos a las calles y canales de la ciudad",
        esCorrecta: true,
        explicacion:
          "¡Acertado! Las lluvias y canales arrastran la basura urbana hacia las ciénagas y mares.",
      },
      {
        letra: "D",
        texto: "Nació naturalmente de las hojas de los árboles",
        esCorrecta: false,
        explicacion: "Las plantas producen flores y frutos, no botellas.",
      },
    ],
    pistaSocratica: "¿Quiénes usan botellas y bolsas plásticas en la vida diaria?",
  },
  {
    id: "diag_8",
    numero: 8,
    texto: "¿Por qué fue fundamental que los animales trabajaran en equipo y no solos?",
    nivel: "inferencial",
    etiquetaNivel: "Nivel Inferencial",
    opciones: [
      {
        letra: "A",
        texto: "Porque la basura era demasiada y cada uno tenía una habilidad diferente",
        esCorrecta: true,
        explicacion:
          "¡Muy bien! Uniendo el pico de Martín, las pinzas de Beto y las alas de Sofi lograron lo que uno solo no podía.",
      },
      {
        letra: "B",
        texto: "Porque estaban aburridos y querían hablar",
        esCorrecta: false,
        explicacion: "Tenían una misión de vida urgente.",
      },
      {
        letra: "C",
        texto: "Porque les gustaba competir para ver quién ganaba",
        esCorrecta: false,
        explicacion: "No estaban compitiendo, estaban cooperando.",
      },
      {
        letra: "D",
        texto: "Porque Bú se los exigió con un castigo",
        esCorrecta: false,
        explicacion: "Lo hicieron voluntariamente por amor a su hogar.",
      },
    ],
    pistaSocratica: "¿Qué podía hacer el cangrejo con sus pinzas que el pelícano no podía hacer?",
  },
  {
    id: "diag_9",
    numero: 9,
    texto:
      "Si fueras un estudiante de 3° de la I.E. Ciudad de Tunja, ¿qué acción concreta propondrías para proteger el manglar?",
    nivel: "critico",
    etiquetaNivel: "Nivel Crítico",
    opciones: [
      {
        letra: "A",
        texto: "No hacer nada porque los niños no tienen responsabilidad",
        esCorrecta: false,
        explicacion: "Todos podemos aportar con pequeñas acciones diarias.",
      },
      {
        letra: "B",
        texto: "Reducir el uso de bolsas plásticas y organizar campañas de reciclaje escolar",
        esCorrecta: true,
        explicacion:
          "¡Excelente postura crítica! Proponer soluciones desde la escuela previene que la basura llegue al agua.",
      },
      {
        letra: "C",
        texto: "Botar más basura en los canales para que el agua se la lleve",
        esCorrecta: false,
        explicacion: "Eso empeoraría gravemente el problema ambiental.",
      },
      {
        letra: "D",
        texto: "Encerrar a los animales en jaulas para que no se ensucien",
        esCorrecta: false,
        explicacion: "Los animales silvestres deben vivir libres en hábitats limpios.",
      },
    ],
    pistaSocratica: "¿Qué hábitos positivos en tu colegio o casa evitan la contaminación del mar?",
  },
  {
    id: "diag_10",
    numero: 10,
    texto: "¿Qué opinas del mensaje final de Bú sobre la solidaridad comunitaria?",
    nivel: "critico",
    etiquetaNivel: "Nivel Crítico",
    opciones: [
      {
        letra: "A",
        texto: "Que es una exageración y cada cual debe salvarse solo",
        esCorrecta: false,
        explicacion: "El individualismo destruye los ecosistemas y las comunidades.",
      },
      {
        letra: "B",
        texto:
          "Que es una enseñanza valiosa porque cuidando el entorno nos cuidamos a nosotros mismos",
        esCorrecta: true,
        explicacion:
          "¡Pensamiento crítico sobresaliente! La salud de la naturaleza está conectada con nuestra salud y bienestar.",
      },
      {
        letra: "C",
        texto: "Que la naturaleza no necesita de los seres vivos",
        esCorrecta: false,
        explicacion: "Todos formamos parte del mismo equilibrio biológico.",
      },
      {
        letra: "D",
        texto: "Que solo los adultos deberían escuchar ese consejo",
        esCorrecta: false,
        explicacion: "Los niños son guardianes vitales del planeta.",
      },
    ],
    pistaSocratica: "¿Cómo se relaciona la ayuda mutua con el bienestar de toda una comunidad?",
  },
];

// Preguntas y retos para la Práctica Guiada con el Tutor IA (Fase 3: Andamiaje Socrático)
export type RetoTutorIA = {
  id: string;
  numero: number;
  titulo: string;
  pregunta: string;
  tipo: NivelComprension;
  pistas: string[];
  criteriosEvaluacion: {
    palabrasClaveEsperadas: string[];
    ideaPrincipal: string;
    mensajeExito: string;
  };
};

export const RETOS_TUTOR_IA: RetoTutorIA[] = [
  {
    id: "tutor_reto_1",
    numero: 1,
    titulo: "Reto 1: Descubriendo el conflicto",
    pregunta:
      "Explícale a Bú con tus propias palabras: ¿cuál fue el grave peligro que descubrieron Sofi y Martín cuando bajó la marea en la ciénaga?",
    tipo: "literal",
    pistas: [
      "💡 Pista 1: Recuerda qué objetos flotaban entre las raíces que no pertenecían a la naturaleza.",
      "💡 Pista 2: Piensa en el material del que estaban hechas las botellas y bolsas que llegaron.",
      "💡 Pista 3: ¿Cómo reaccionaron los pececitos que vivían allí?",
    ],
    criteriosEvaluacion: {
      palabrasClaveEsperadas: [
        "basura",
        "plastico",
        "botellas",
        "bolsas",
        "contaminacion",
        "peces",
        "raices",
        "refugio",
      ],
      ideaPrincipal: "Llegó basura y plástico que atrapó las raíces y asustó a los peces pequeños.",
      mensajeExito:
        "¡Maravilloso! Has identificado con precisión el conflicto central de la historia.",
    },
  },
  {
    id: "tutor_reto_2",
    numero: 2,
    titulo: "Reto 2: El misterio de la llegada",
    pregunta:
      "¿Por qué crees que la basura llegó hasta ese manglar tan apartado si los animales no usan plásticos?",
    tipo: "inferencial",
    pistas: [
      "💡 Pista 1: ¿Quiénes son los únicos seres que fabrican y consumen productos en bolsas y botellas?",
      "💡 Pista 2: Cuando llueve fuerte en Cartagena, ¿hacia dónde corre el agua de las calles y caños?",
      "💡 Pista 3: Piensa en la conexión entre los barrios de la ciudad y la Ciénaga de la Virgen.",
    ],
    criteriosEvaluacion: {
      palabrasClaveEsperadas: [
        "personas",
        "humanos",
        "ciudad",
        "calles",
        "caños",
        "corriente",
        "marea",
        "lluvia",
        "cartagena",
      ],
      ideaPrincipal:
        "Las personas arrojan basura en la ciudad y el agua o la marea la arrastran hasta el manglar.",
      mensajeExito:
        "¡Extraordinaria inferencia! Lograste relacionar la historia con el impacto de las acciones humanas en la naturaleza.",
    },
  },
  {
    id: "tutor_reto_3",
    numero: 3,
    titulo: "Reto 3: Mi propuesta protectora",
    pregunta:
      "Imagina que eres el alcalde o alcaldesa infantil de Cartagena por un día: ¿qué mensaje o regla crearías en tu colegio y barrio para que los manglares nunca más sufran por la basura?",
    tipo: "critico",
    pistas: [
      "💡 Pista 1: Piensa en qué podemos hacer con las botellas antes de tirarlas.",
      "💡 Pista 2: ¿Cómo enseñarías a los vecinos a cuidar el agua?",
      "💡 Pista 3: ¿Qué sanción o premio pondrías para cuidar los árboles de mangle?",
    ],
    criteriosEvaluacion: {
      palabrasClaveEsperadas: [
        "reciclar",
        "cuidar",
        "limpiar",
        "no botar",
        "proteger",
        "campaña",
        "regla",
        "manglar",
        "colegio",
        "planeta",
      ],
      ideaPrincipal:
        "Proponer una acción ciudadana de reciclaje, educación ambiental o protección de las aguas.",
      mensajeExito:
        "¡Eres un verdadero líder ecológico! Tu respuesta demuestra pensamiento crítico y amor por tu comunidad.",
    },
  },
];
