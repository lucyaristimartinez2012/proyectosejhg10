import {
  ChapterQuestion,
  FILMSTRIP_NATURE_GALLERY,
  FilmstripNaturePhoto,
  GRADE_10_CHAPTERS,
} from "./chapters";

export interface SiteTexts {
  // Top & Opening
  brandTitle: string;
  brandSubtitle: string;
  introScrollPrompt: string;
  // Intro 404 & Flicker
  intro404HeaderLeft: string;
  intro404HeaderRight: string;
  intro404Command: string;
  intro404Code: string;
  intro404Title: string;
  intro404Body: string;
  intro404Hint: string;
  intro404Button: string;
  introFlickerTitle: string;
  introFlickerSubtitle: string;
  // Title Screen
  mainTitleKicker: string;
  mainTitleHeadline: string;
  mainTitleSubtitle: string;
  mainTitleMeta: string;
  mainTitleCta: string;
  // Exposition Section
  expositionKicker: string;
  expositionHeading: string;
  expositionHint: string;
  labelKeyPoints: string;
  labelClassPrompt: string;
  labelVisualMetaphor: string;
  expositionEndKicker: string;
  expositionEndText: string;
  expositionEndCta: string;
  // Closing Sequence
  closingFlickerTitle: string;
  closingFlickerSubtitle: string;
  closingSponsorKicker: string;
  closingSponsorQuote: string;
  closingSponsorHint: string;
  closing404HeaderLeft: string;
  closing404HeaderRight: string;
  closing404Code: string;
  closing404Title: string;
  closing404Note: string;
  closingCurtainCaption: string;
  closingBlackoutText: string;
  closingReplayText: string;
}

export interface EditablePresentationData {
  texts: SiteTexts;
  chapters: ChapterQuestion[];
  gallery: FilmstripNaturePhoto[];
}

export const DEFAULT_SITE_TEXTS: SiteTexts = {
  brandTitle: "Trabajo grupal Salud Emocional G10",
  brandSubtitle: "Por: El mejor equipo del mundo.",
  introScrollPrompt: "Desliza hacia abajo para acercarte al monitor o pulsa Auto-Cine",

  intro404HeaderLeft: "TERMINAL CRT · CANAL 03",
  intro404HeaderRight: "SYNC 60HZ",
  intro404Command: "C:\\SALUD_EMOCIONAL\\G10> CARGANDO CASOS PRÁCTICOS...",
  intro404Code: "ERROR 404",
  intro404Title: "SEÑAL DE TIEMPO NO ENCONTRADA",
  intro404Body:
    "El sistema ha detectado tareas pendientes y desorden; es momento de estructurar nuestros hábitos para recuperar la calma.",
  intro404Hint: "Desliza hacia abajo para restablecer la señal...",
  intro404Button: "Reiniciar señal",
  introFlickerTitle: "404 // SYNC...",
  introFlickerSubtitle: "ESTABILIZANDO CINTA DE 35MM",

  mainTitleKicker: "SALUD EMOCIONAL · GRADO 10",
  mainTitleHeadline: "Trabajo grupal Salud Emocional G10",
  mainTitleSubtitle:
    "Por: El mejor equipo del mundo.",
  mainTitleMeta: "Trabajo Grupal",
  mainTitleCta: "Entrar a la Presentación",

  expositionKicker: "EXPOSICIÓN GUIADA · SALUD EMOCIONAL G10",
  expositionHeading: "Tres Casos Prácticos de Organización",
  expositionHint:
    "Desliza hacia abajo para recorrer cada caso · Las cintas permanecen activas",
  labelKeyPoints: "PASOS DE LA ACCIÓN",
  labelClassPrompt: "PREGUNTA PARA EL SALÓN",
  labelVisualMetaphor: "METÁFORA VISUAL",
  expositionEndKicker: "FIN DE LOS CASOS",
  expositionEndText:
    "Continúa deslizando hacia abajo para el parpadeo final y el cierre del telón",
  expositionEndCta: "Ir al cierre de la función",

  closingFlickerTitle: "FIN DEL ROLLO // SYNC...",
  closingFlickerSubtitle: "CIERRE DE TRANSMISIÓN",
  closingSponsorKicker: "CRÉDITOS DE PRODUCCIÓN · SALUD EMOCIONAL G10",
  closingSponsorQuote:
    "Esta presentación fue patrocinada por el café y la amistad...",
  closingSponsorHint: "Continúa deslizando para cerrar la señal",
  closing404HeaderLeft: "TERMINAL CRT · SALIDA",
  closing404HeaderRight: "FIN DE ARCHIVO",
  closing404Code: "ERROR 404",
  closing404Title: "MÁS DIAPOSITIVAS NO ENCONTRADAS",
  closing404Note: "Desconectando proyector... Alejando cámara del escenario.",
  closingCurtainCaption: "Cerrando el telón · Gracias por su atención",
  closingBlackoutText: "FIN DE LA PROYECCIÓN",
  closingReplayText: "Volver al inicio",
};

const STORAGE_KEY = "salud_emocional_g10_content_v1";

export function getDefaultPresentationData(): EditablePresentationData {
  return {
    texts: { ...DEFAULT_SITE_TEXTS },
    chapters: GRADE_10_CHAPTERS.map((ch) => ({
      ...ch,
      pillars: ch.pillars.map((p) => ({ ...p })),
    })),
    gallery: FILMSTRIP_NATURE_GALLERY.map((g) => ({ ...g })),
  };
}

export function loadPresentationData(): EditablePresentationData {
  const defaults = getDefaultPresentationData();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaults;
    const parsed = JSON.parse(raw) as Partial<EditablePresentationData>;
    return {
      texts: { ...defaults.texts, ...(parsed.texts || {}) },
      chapters:
        Array.isArray(parsed.chapters) && parsed.chapters.length > 0
          ? parsed.chapters
          : defaults.chapters,
      gallery:
        Array.isArray(parsed.gallery) && parsed.gallery.length > 0
          ? parsed.gallery
          : defaults.gallery,
    };
  } catch {
    return defaults;
  }
}

export function savePresentationData(data: EditablePresentationData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // ignore storage quota errors
  }
}

export function clearPresentationData(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}
