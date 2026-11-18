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
    label: "Caso 1 · Estudio",
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
    label: "Caso 2 · Escritura",
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
    label: "Caso 3 · Orden",
    chapterIndex: 2,
  },
  {
    id: "nat-06",
    frameCode: "35MM · 06F",
    imageUrl: "/src/assets/images/nature_bw_canyon_beam_1794951986196.jpg",
    label: "Haz de luz en cañón",
  },
];

export const GRADE_10_CHAPTERS: ChapterQuestion[] = [
  {
    id: "c1",
    number: "01",
    roman: "I",
    frameCode: "35MM · 01A",
    kicker: "Organización y Enfoque",
    question: "Caso 1: Terminar el estudio porque falta poco para terminar",
    coreThesis: "",
    pillars: [
      { title: "1. Ordenar nuestro escritorio", detail: "Crear un entorno limpio, despejado y libre de elementos innecesarios." },
      { title: "2. Abrir la plataforma", detail: "Tener listos los accesos, documentos y materiales digitales requeridos." },
      { title: "3. Organizar qué hacer primero", detail: "Definir con claridad las prioridades de cierre para optimizar minutos." },
      { title: "4. Asignarle tiempo a cada guía", detail: "Establecer micro-bloques temporales para cada asignación pendiente." },
      { title: "5. Quitar distracciones", detail: "Silenciar notificaciones y apartar el teléfono celular del alcance visual." },
      { title: "6. Iniciar los primeros 5 minutos haciendo la actividad", detail: "Romper la inercia mental con la regla de arranque rápido." },
      { title: "7. No parar hasta terminar", detail: "Mantener el ritmo constante y enfocado hasta alcanzar la meta final." },
    ],
    classPrompt: "",
    imageUrl: "/src/assets/images/nature_bw_dunes_time_1794951011416.jpg",
    imageCaption: "",
  },
  {
    id: "c2",
    number: "02",
    roman: "II",
    frameCode: "35MM · 03C",
    kicker: "Proceso Creativo",
    question: "Caso 2: Trabajar en terminar de escribir un libro",
    coreThesis: "",
    pillars: [
      { title: "1. Hacer un borrador", detail: "Plasmar las ideas principales y la estructura general sin censura inicial." },
      { title: "2. Preparar el ambiente para inspiración", detail: "Buscar un espacio con silencio, iluminación adecuada y comodidad." },
      { title: "3. Organizar ideas para escribir", detail: "Establecer el índice temático y el hilo conductor de la obra." },
      { title: "4. Revisar ortografía", detail: "Corregir detalles gramaticales, puntuación y redacción de los párrafos." },
      { title: "5. Finiquitar detalles", detail: "Pulir transiciones, introducciones y conclusiones clave." },
      { title: "6. Continuar por capítulos", detail: "Avanzar de manera constante y estructurada paso a paso." },
    ],
    classPrompt: "",
    imageUrl: "/src/assets/images/nature_bw_alpine_peaks_1794951011891.jpg",
    imageCaption: "",
  },
  {
    id: "c3",
    number: "03",
    roman: "III",
    frameCode: "35MM · 05E",
    kicker: "Orden y Bienestar",
    question: "Caso 3: Organizar mi ropa",
    coreThesis: "",
    pillars: [
      { title: "1. Barrer la habitación", detail: "Limpiar el suelo y despejar el espacio físico por completo." },
      { title: "2. Limpiar el polvo", detail: "Retirar impurezas de superficies, repisas y muebles." },
      { title: "3. Sacar toda la ropa", detail: "Visualizar todas las prendas en un solo lugar para evaluar su estado." },
      { title: "4. Hacer una lista de pendientes por ordenar", detail: "Clasificar la ropa por categorías, uso y prioridades." },
      { title: "5. Asignar un lugar específico", detail: "Guardar cada prenda en su cajón o colgador correspondiente." },
      { title: "6. Ordenar por color", detail: "Agrupar visualmente las prendas para mayor armonía y facilidad." },
      { title: "7. Perfumar la ropa", detail: "Aportar un toque final agradable y fresco al guardar las prendas." },
    ],
    classPrompt: "",
    imageUrl: "/src/assets/images/nature_bw_river_flow_1794951012964.jpg",
    imageCaption: "",
  },
];
