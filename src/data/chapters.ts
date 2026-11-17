export interface ChapterPillar {
  title: string;
  detail: string;
}

export interface ChapterQuestion {
  id: string;
  number: string;
  roman: string;
  frameCode: string;
  kicker: string;
  question: string;
  coreThesis: string;
  pillars: ChapterPillar[];
  classPrompt: string;
  imageUrl: string;
  imageCaption: string;
}

export interface FilmstripNaturePhoto {
  id: string;
  frameCode: string;
  imageUrl: string;
  label: string;
  chapterIndex?: number;
}

export const FILMSTRIP_NATURE_GALLERY: FilmstripNaturePhoto[] = [
  {
    id: "nat-01",
    frameCode: "35MM · 01A",
    imageUrl: "/src/assets/images/nature_bw_dunes_time_1794951011416.jpg",
    label: "Dunas al alba · P01",
    chapterIndex: 0,
  },
  {
    id: "nat-02",
    frameCode: "35MM · 02B",
    imageUrl: "/src/assets/images/nature_bw_ocean_waves_1794951986305.jpg",
    label: "Oleaje atlántico",
  },
  {
    id: "nat-03",
    frameCode: "35MM · 03C",
    imageUrl: "/src/assets/images/nature_bw_alpine_peaks_1794951011891.jpg",
    label: "Cumbres sobre niebla · P02",
    chapterIndex: 1,
  },
  {
    id: "nat-04",
    frameCode: "35MM · 04D",
    imageUrl: "/src/assets/images/nature_bw_frost_pines_1794951987054.jpg",
    label: "Pinos con escarcha",
  },
  {
    id: "nat-05",
    frameCode: "35MM · 05E",
    imageUrl: "/src/assets/images/nature_bw_river_flow_1794951012964.jpg",
    label: "Río en calma · P03",
    chapterIndex: 2,
  },
  {
    id: "nat-06",
    frameCode: "35MM · 06F",
    imageUrl: "/src/assets/images/nature_bw_canyon_beam_1794951986196.jpg",
    label: "Haz de luz en cañón",
  },
  {
    id: "nat-07",
    frameCode: "35MM · 07G",
    imageUrl: "/src/assets/images/nature_bw_misty_forest_1794951013378.jpg",
    label: "Sendero en bosque · P04",
    chapterIndex: 3,
  },
  {
    id: "nat-08",
    frameCode: "35MM · 08H",
    imageUrl: "/src/assets/images/nature_bw_waterfall_basalt_1794951987016.jpg",
    label: "Cascada en basalto",
  },
  {
    id: "nat-09",
    frameCode: "35MM · 09I",
    imageUrl: "/src/assets/images/nature_bw_quiet_lake_1794951013955.jpg",
    label: "Lago en silencio · P05",
    chapterIndex: 4,
  },
  {
    id: "nat-10",
    frameCode: "35MM · 10J",
    imageUrl: "/src/assets/images/nature_bw_starry_ridge_1794951987957.jpg",
    label: "Cordillera estrellada",
  },
];

export const GRADE_10_CHAPTERS: ChapterQuestion[] = [
  {
    id: "q1",
    number: "01",
    roman: "I",
    frameCode: "35MM · 01A",
    kicker: "Percepción del tiempo · Psicología del hábito",
    question:
      "¿Por qué sentimos que el tiempo no alcanza en Grado 10 y qué es realmente la procrastinación?",
    coreThesis:
      "El problema casi nunca es falta de horas, sino fricción emocional: postergamos tareas porque nuestro cerebro busca aliviar el estrés o el aburrimiento inmediato, pagando después con ansiedad acumulada.",
    pillars: [
      {
        title: "No es pereza, es regulación emocional",
        detail:
          "Cuando un taller de matemáticas o un ensayo parece confuso, evitarlo produce un alivio corto de dopamina, aunque empeore la presión horas más tarde.",
      },
      {
        title: "La ilusión de las 'horas invisibles'",
        detail:
          "Entre cambios de salón, redes sociales y transiciones sin plan, se pierden hasta 2 horas diarias en micro-pausas que nadie registra.",
      },
      {
        title: "Regla de los 5 minutos para arrancar",
        detail:
          "Reducir el inicio a solo cinco minutos desactiva la resistencia mental: una vez superado el arranque, continuar cuesta la mitad de esfuerzo.",
      },
    ],
    classPrompt:
      "¿Qué tarea de esta semana estás evitando hoy y cuál sería el primer paso de 5 minutos para destrabarla?",
    imageUrl: "/src/assets/images/nature_bw_dunes_time_1794951011416.jpg",
    imageCaption:
      "Fotograma 01 — Las dunas recuerdan al reloj de arena: cada grano cae al mismo ritmo, pero solo notamos el viento cuando cambia la forma del paisaje.",
  },
  {
    id: "q2",
    number: "02",
    roman: "II",
    frameCode: "35MM · 03C",
    kicker: "Priorización · Matriz de Eisenhower",
    question:
      "¿Cómo distinguir lo urgente de lo importante antes de que llegue la fecha límite?",
    coreThesis:
      "Lo urgente grita para que lo atiendas ya; lo importante construye tus notas, tu calma y tus metas aunque no suene ninguna alarma todavía.",
    pillars: [
      {
        title: "Cuadrante I — Urgente e Importante",
        detail:
          "Evaluaciones de mañana o entregas de hoy. Deben resolverse de inmediato, pero si toda la semana vive aquí, el cansancio se vuelve crónico.",
      },
      {
        title: "Cuadrante II — Importante pero No Urgente",
        detail:
          "Repasar apuntes, avanzar proyectos grupales con tiempo y dormir bien. Quien protege este cuadrante reduce casi todas las crisis futuras.",
      },
      {
        title: "Cuadrantes III y IV — Ruido y escape",
        detail:
          "Mensajes no prioritarios, notificaciones constantes y desplazamiento infinito en pantallas que consumen energía sin aportar avance real.",
      },
    ],
    classPrompt:
      "De las tres actividades que hiciste ayer después del colegio, ¿cuál pertenecía realmente al Cuadrante II?",
    imageUrl: "/src/assets/images/nature_bw_alpine_peaks_1794951011891.jpg",
    imageCaption:
      "Fotograma 02 — Las cumbres sobre la niebla ilustran la prioridad: desde lo alto se distinguen las montañas reales del ruido pasajero del valle.",
  },
  {
    id: "q3",
    number: "03",
    roman: "III",
    frameCode: "35MM · 05E",
    kicker: "Atención profunda · Ritmos de enfoque",
    question:
      "¿Por qué estudiar cuatro horas seguidas rinde menos que usar bloques de enfoque?",
    coreThesis:
      "La concentración humana funciona por ciclos de intensidad y recuperación. Estudiar sin pausas ni foco divide la atención entre el cuaderno y el cansancio mental.",
    pillars: [
      {
        title: "El mito de la multitarea",
        detail:
          "Cada vez que cambias del cuaderno a un chat, el cerebro tarda varios minutos en recuperar la profundidad de lectura, duplicando el tiempo total.",
      },
      {
        title: "Bloques 25/5 o 45/10 (Método Pomodoro)",
        detail:
          "Trabajar con un temporizador visible durante 25 a 45 minutos en una sola materia, seguido de 5 a 10 minutos reales de descanso sin pantalla.",
      },
      {
        title: "Pausas que sí recargan",
        detail:
          "Caminar, hidratarse o mirar por la ventana descansa la corteza prefrontal; revisar videos cortos sigue saturando la memoria de trabajo.",
      },
    ],
    classPrompt:
      "¿Cuánto tiempo logras estudiar antes de mirar tu celular por primera vez, y qué pasaría si cronometraras un solo bloque limpio?",
    imageUrl: "/src/assets/images/nature_bw_river_flow_1794951012964.jpg",
    imageCaption:
      "Fotograma 03 — El río constante talla la roca sin fuerza brusca: la continuidad en intervalos firmes supera cualquier esfuerzo aislado.",
  },
  {
    id: "q4",
    number: "04",
    roman: "IV",
    frameCode: "35MM · 07G",
    kicker: "Arquitectura semanal · Equilibrio real",
    question:
      "¿Cómo construir una semana realista sin sacrificar sueño ni tiempo libre?",
    coreThesis:
      "Un horario perfecto en papel fracasa al segundo día. Un horario útil deja bloques fijos para lo esencial, respeta 8 horas de descanso y reserva un colchón para imprevistos.",
    pillars: [
      {
        title: "Primero los pilares fijos, luego las tareas",
        detail:
          "Ubica primero clases, transporte, descanso nocturno, alimentación y deporte; el estudio ocupa los espacios reales restantes, no horas imaginarias.",
      },
      {
        title: "La regla del margen de imprevistos (20%)",
        detail:
          "Dejar una franja libre el miércoles o el viernes absorbe retrasos, lluvias o trabajos inesperados sin derrumbar toda la semana.",
      },
      {
        title: "El sueño consolida lo aprendido",
        detail:
          "Durante el sueño profundo el cerebro fija la memoria académica; trasnochar borra parte del estudio del día siguiente.",
      },
    ],
    classPrompt:
      "¿Tu horario actual incluye explícitamente tus horas de descanso y ocio, o solo anota obligaciones?",
    imageUrl: "/src/assets/images/nature_bw_misty_forest_1794951013378.jpg",
    imageCaption:
      "Fotograma 04 — Entre árboles altos y niebla densa, un sendero trazado evita caminar en círculos y convierte la caminata en calma.",
  },
  {
    id: "q5",
    number: "05",
    roman: "V",
    frameCode: "35MM · 09I",
    kicker: "Higiene digital · Entorno consciente",
    question:
      "¿Qué papel juega la tecnología como aliada o distractora del tiempo?",
    coreThesis:
      "Las pantallas no son neutras: están diseñadas para retener tu atención el mayor tiempo posible, pero con reglas claras se convierten en calendarios, temporizadores y herramientas de creación.",
    pillars: [
      {
        title: "Fricción positiva y negativa",
        detail:
          "Aumenta un paso de fricción para lo que distrae (silenciar notificaciones o dejar el teléfono en otra mesa) y reduce la fricción para estudiar (material listo).",
      },
      {
        title: "Modo escala de grises y horarios de desconexión",
        detail:
          "Quitar el color de la pantalla en la noche y fijar una hora de cierre digital protege la calidad del sueño y la atención de la mañana.",
      },
      {
        title: "De consumidor pasivo a creador intencional",
        detail:
          "Usar calendarios visuales, listas concretas de tres metas diarias y herramientas digitales para producir proyectos propios en lugar de solo desplazarse.",
      },
    ],
    classPrompt:
      "Si revisaras el tiempo de pantalla de ayer, ¿qué aplicación te dio más valor y cuál te quitó tiempo sin que lo notaras?",
    imageUrl: "/src/assets/images/nature_bw_quiet_lake_1794951013955.jpg",
    imageCaption:
      "Fotograma 05 — Cuando cesa el viento, el lago refleja el cielo entero: la mente organizada necesita silencio digital para pensar con claridad.",
  },
];
