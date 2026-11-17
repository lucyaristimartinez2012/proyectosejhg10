import { useState } from "react";
import { X, RotateCcw, Plus, Trash2, Download, Upload } from "lucide-react";
import { EditablePresentationData, SiteTexts } from "../data/siteContent";
import { ChapterQuestion } from "../data/chapters";

interface TextEditorModalProps {
  open: boolean;
  onClose: () => void;
  data: EditablePresentationData;
  onChange: (next: EditablePresentationData) => void;
  onResetDefaults: () => void;
}

type EditorTab = "intro" | "exposition" | "chapters" | "closing" | "gallery";

export default function TextEditorModal({
  open,
  onClose,
  data,
  onChange,
  onResetDefaults,
}: TextEditorModalProps) {
  const [tab, setTab] = useState<EditorTab>("chapters");
  const [editingChapterIdx, setEditingChapterIdx] = useState(0);
  const [importError, setImportError] = useState<string | null>(null);

  if (!open) return null;

  const updateText = (key: keyof SiteTexts, value: string) => {
    onChange({
      ...data,
      texts: {
        ...data.texts,
        [key]: value,
      },
    });
  };

  const updateChapter = (idx: number, patch: Partial<ChapterQuestion>) => {
    const updated = data.chapters.map((ch, i) => (i === idx ? { ...ch, ...patch } : ch));
    onChange({ ...data, chapters: updated });
  };

  const updatePillar = (
    chapterIdx: number,
    pillarIdx: number,
    field: "title" | "detail",
    value: string
  ) => {
    const ch = data.chapters[chapterIdx];
    if (!ch) return;
    const pillars = ch.pillars.map((p, i) =>
      i === pillarIdx ? { ...p, [field]: value } : p
    );
    updateChapter(chapterIdx, { pillars });
  };

  const addPillar = (chapterIdx: number) => {
    const ch = data.chapters[chapterIdx];
    if (!ch) return;
    updateChapter(chapterIdx, {
      pillars: [...ch.pillars, { title: "Nuevo punto clave", detail: "Escribe el desarrollo aquí." }],
    });
  };

  const removePillar = (chapterIdx: number, pillarIdx: number) => {
    const ch = data.chapters[chapterIdx];
    if (!ch || ch.pillars.length <= 1) return;
    updateChapter(chapterIdx, {
      pillars: ch.pillars.filter((_, i) => i !== pillarIdx),
    });
  };

  const addChapter = () => {
    const nextNum = String(data.chapters.length + 1).padStart(2, "0");
    const romanNumerals = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];
    const roman = romanNumerals[data.chapters.length] || nextNum;
    const fallbackImg =
      data.gallery[data.chapters.length % data.gallery.length]?.imageUrl ||
      data.chapters[0]?.imageUrl ||
      "";
    const newCh: ChapterQuestion = {
      id: `q-${Date.now()}`,
      number: nextNum,
      roman,
      frameCode: `35MM · ${nextNum}X`,
      kicker: "Tema del capítulo",
      question: `Nueva pregunta ${nextNum}`,
      coreThesis: "Idea central de este capítulo.",
      pillars: [
        { title: "Primer punto clave", detail: "Explicación del primer punto." },
      ],
      classPrompt: "¿Qué opinan sobre este punto?",
      imageUrl: fallbackImg,
      imageCaption: `Fotograma ${nextNum} — Descripción visual.`,
    };
    const nextChapters = [...data.chapters, newCh];
    onChange({ ...data, chapters: nextChapters });
    setEditingChapterIdx(nextChapters.length - 1);
  };

  const removeChapter = (idx: number) => {
    if (data.chapters.length <= 1) return;
    const nextChapters = data.chapters.filter((_, i) => i !== idx);
    onChange({ ...data, chapters: nextChapters });
    setEditingChapterIdx(Math.max(0, Math.min(idx, nextChapters.length - 1)));
  };

  const updateGalleryItem = (
    idx: number,
    field: "frameCode" | "label",
    value: string
  ) => {
    const nextGallery = data.gallery.map((g, i) =>
      i === idx ? { ...g, [field]: value } : g
    );
    onChange({ ...data, gallery: nextGallery });
  };

  const handleExportJson = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "textos-trabajo-grupal-grado10.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImportError(null);
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result || "")) as Partial<EditablePresentationData>;
        if (!parsed.texts || !Array.isArray(parsed.chapters)) {
          throw new Error("Formato de archivo no válido.");
        }
        onChange({
          texts: { ...data.texts, ...parsed.texts },
          chapters: parsed.chapters,
          gallery: Array.isArray(parsed.gallery) ? parsed.gallery : data.gallery,
        });
      } catch (err) {
        setImportError(err instanceof Error ? err.message : "No se pudo leer el archivo JSON.");
      }
    };
    reader.readAsText(file);
  };

  const renderInputField = (
    label: string,
    key: keyof SiteTexts,
    multiline = false
  ) => (
    <div key={key} className="space-y-1.5">
      <label className="block font-mono text-[11px] text-[#E5A93B]">{label}</label>
      {multiline ? (
        <textarea
          rows={2}
          value={data.texts[key]}
          onChange={(e) => updateText(key, e.target.value)}
          className="w-full bg-[#070709] border border-white/15 px-3 py-2 text-sm text-[#EAE4D7] focus:outline-none focus:border-[#E5A93B]"
        />
      ) : (
        <input
          type="text"
          value={data.texts[key]}
          onChange={(e) => updateText(key, e.target.value)}
          className="w-full bg-[#070709] border border-white/15 px-3 py-2 text-sm text-[#EAE4D7] focus:outline-none focus:border-[#E5A93B]"
        />
      )}
    </div>
  );

  const safeIdx = Math.min(editingChapterIdx, Math.max(0, data.chapters.length - 1));
  const activeCh = data.chapters[safeIdx];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Editor completo de textos"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4"
    >
      <div className="w-full max-w-4xl max-h-[90vh] flex flex-col bg-[#0F1014] border border-white/15 text-[#EAE4D7]">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-4 border-b border-white/10 shrink-0">
          <div>
            <h2
              className="text-xl font-semibold text-[#EAE4D7]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Editor de Textos de la Presentación
            </h2>
            <p className="text-xs font-mono text-[#EAE4D7]/60 mt-0.5">
              Cualquier cambio se guarda automáticamente en este navegador
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleExportJson}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono border border-white/15 text-[#EAE4D7]/80 hover:border-[#E5A93B] cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Exportar</span>
            </button>
            <label className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono border border-white/15 text-[#EAE4D7]/80 hover:border-[#E5A93B] cursor-pointer">
              <Upload className="w-3.5 h-3.5" />
              <span>Importar</span>
              <input
                type="file"
                accept="application/json"
                onChange={handleImportJson}
                className="hidden"
              />
            </label>
            <button
              type="button"
              onClick={onResetDefaults}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono border border-[#A61C2B]/60 text-[#ff9b9b] hover:bg-[#A61C2B]/20 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Restaurar originales</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="Cerrar editor"
              className="p-2 text-[#EAE4D7]/70 hover:text-[#EAE4D7] border border-white/10 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap border-b border-white/10 px-6 gap-2 pt-2 shrink-0">
          {[
            { id: "chapters" as const, label: `Preguntas (${data.chapters.length})` },
            { id: "intro" as const, label: "Inicio, 404 y Título" },
            { id: "exposition" as const, label: "Encabezados Exposición" },
            { id: "closing" as const, label: "Cierre y Créditos" },
            { id: "gallery" as const, label: "Etiquetas Cinta 35mm" },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setTab(item.id)}
              className={`px-3.5 py-2 text-xs font-medium border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
                tab === item.id
                  ? "border-[#E5A93B] text-[#E5A93B]"
                  : "border-transparent text-[#EAE4D7]/65 hover:text-[#EAE4D7]"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {importError && (
            <p className="text-xs text-[#ff8a8a] border border-[#A61C2B]/60 bg-[#A61C2B]/15 p-3">
              {importError}
            </p>
          )}

          {tab === "intro" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {renderInputField("Título Principal de Marca (esquina y barra)", "brandTitle")}
              {renderInputField("Subtítulo de Marca", "brandSubtitle")}
              {renderInputField("Texto invitación de scroll inicial", "introScrollPrompt")}
              {renderInputField("Cabecera izquierda CRT 404", "intro404HeaderLeft")}
              {renderInputField("Cabecera derecha CRT 404", "intro404HeaderRight")}
              {renderInputField("Comando de consola CRT", "intro404Command")}
              {renderInputField("Código Error 404", "intro404Code")}
              {renderInputField("Título Error 404 inicial", "intro404Title")}
              {renderInputField("Texto descriptivo Error 404", "intro404Body", true)}
              {renderInputField("Indicación inferior Error 404", "intro404Hint")}
              {renderInputField("Botón reiniciar señal 404", "intro404Button")}
              {renderInputField("Texto parpadeo CRT", "introFlickerTitle")}
              {renderInputField("Subtítulo parpadeo CRT", "introFlickerSubtitle")}
              {renderInputField("Antetítulo de portada", "mainTitleKicker")}
              {renderInputField("Título grande de portada", "mainTitleHeadline")}
              {renderInputField("Subtítulo de portada", "mainTitleSubtitle", true)}
              {renderInputField("Línea inferior de portada", "mainTitleMeta")}
              {renderInputField("Botón entrar a la cinta", "mainTitleCta")}
            </div>
          )}

          {tab === "exposition" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {renderInputField("Antetítulo de la exposición", "expositionKicker")}
              {renderInputField("Título de la sección", "expositionHeading")}
              {renderInputField("Texto guía superior derecho", "expositionHint")}
              {renderInputField("Etiqueta puntos clave", "labelKeyPoints")}
              {renderInputField("Etiqueta pregunta al salón", "labelClassPrompt")}
              {renderInputField("Etiqueta metáfora visual", "labelVisualMetaphor")}
              {renderInputField("Antetítulo fin de preguntas", "expositionEndKicker")}
              {renderInputField("Mensaje fin de preguntas", "expositionEndText", true)}
              {renderInputField("Botón ir al cierre", "expositionEndCta")}
            </div>
          )}

          {tab === "chapters" && activeCh && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-white/10">
                <div className="flex flex-wrap gap-1.5">
                  {data.chapters.map((ch, idx) => (
                    <button
                      key={ch.id}
                      type="button"
                      onClick={() => setEditingChapterIdx(idx)}
                      className={`px-3 py-1.5 text-xs font-mono border cursor-pointer tabular-nums ${
                        idx === safeIdx
                          ? "bg-[#EAE4D7] text-[#070709] border-[#EAE4D7] font-semibold"
                          : "border-white/15 text-[#EAE4D7]/75 hover:border-white/35"
                      }`}
                    >
                      P{ch.number}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={addChapter}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-mono border border-[#E5A93B]/50 text-[#E5A93B] hover:bg-[#E5A93B]/10 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Añadir pregunta</span>
                  </button>
                </div>

                {data.chapters.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeChapter(safeIdx)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-mono text-[#ff9b9b] border border-[#A61C2B]/50 hover:bg-[#A61C2B]/20 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Eliminar P{activeCh.number}</span>
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="block font-mono text-[11px] text-[#E5A93B]">NÚMERO</label>
                  <input
                    type="text"
                    value={activeCh.number}
                    onChange={(e) => updateChapter(safeIdx, { number: e.target.value })}
                    className="w-full bg-[#070709] border border-white/15 px-3 py-2 text-sm text-[#EAE4D7] focus:outline-none focus:border-[#E5A93B]"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block font-mono text-[11px] text-[#E5A93B]">ROMANO</label>
                  <input
                    type="text"
                    value={activeCh.roman}
                    onChange={(e) => updateChapter(safeIdx, { roman: e.target.value })}
                    className="w-full bg-[#070709] border border-white/15 px-3 py-2 text-sm text-[#EAE4D7] focus:outline-none focus:border-[#E5A93B]"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block font-mono text-[11px] text-[#E5A93B]">CÓDIGO FOTOGRAMA</label>
                  <input
                    type="text"
                    value={activeCh.frameCode}
                    onChange={(e) => updateChapter(safeIdx, { frameCode: e.target.value })}
                    className="w-full bg-[#070709] border border-white/15 px-3 py-2 text-sm text-[#EAE4D7] focus:outline-none focus:border-[#E5A93B]"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block font-mono text-[11px] text-[#E5A93B]">TEMA / ANTETÍTULO</label>
                <input
                  type="text"
                  value={activeCh.kicker}
                  onChange={(e) => updateChapter(safeIdx, { kicker: e.target.value })}
                  className="w-full bg-[#070709] border border-white/15 px-3 py-2 text-sm text-[#EAE4D7] focus:outline-none focus:border-[#E5A93B]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block font-mono text-[11px] text-[#E5A93B]">PREGUNTA PRINCIPAL</label>
                <textarea
                  rows={2}
                  value={activeCh.question}
                  onChange={(e) => updateChapter(safeIdx, { question: e.target.value })}
                  className="w-full bg-[#070709] border border-white/15 px-3 py-2 text-sm text-[#EAE4D7] focus:outline-none focus:border-[#E5A93B]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block font-mono text-[11px] text-[#E5A93B]">TESIS / RESPUESTA PRINCIPAL</label>
                <textarea
                  rows={3}
                  value={activeCh.coreThesis}
                  onChange={(e) => updateChapter(safeIdx, { coreThesis: e.target.value })}
                  className="w-full bg-[#070709] border border-white/15 px-3 py-2 text-sm text-[#EAE4D7] focus:outline-none focus:border-[#E5A93B]"
                />
              </div>

              {/* Pillars */}
              <div className="space-y-3 border-t border-white/10 pt-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-[#E5A93B]">PUNTOS CLAVE</span>
                  <button
                    type="button"
                    onClick={() => addPillar(safeIdx)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-mono border border-white/15 hover:border-[#E5A93B] cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Agregar punto</span>
                  </button>
                </div>

                {activeCh.pillars.map((pillar, pIdx) => (
                  <div key={pIdx} className="p-3 bg-[#070709] border border-white/10 space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <input
                        type="text"
                        value={pillar.title}
                        onChange={(e) => updatePillar(safeIdx, pIdx, "title", e.target.value)}
                        className="flex-1 bg-[#0F1014] border border-white/15 px-2.5 py-1.5 text-sm font-semibold text-[#EAE4D7] focus:outline-none focus:border-[#E5A93B]"
                      />
                      {activeCh.pillars.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removePillar(safeIdx, pIdx)}
                          aria-label="Eliminar punto"
                          className="p-1.5 text-[#ff9b9b] hover:bg-[#A61C2B]/20 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                    <textarea
                      rows={2}
                      value={pillar.detail}
                      onChange={(e) => updatePillar(safeIdx, pIdx, "detail", e.target.value)}
                      className="w-full bg-[#0F1014] border border-white/15 px-2.5 py-1.5 text-xs text-[#EAE4D7]/85 focus:outline-none focus:border-[#E5A93B]"
                    />
                  </div>
                ))}
              </div>

              <div className="space-y-1.5">
                <label className="block font-mono text-[11px] text-[#E5A93B]">PREGUNTA PARA EL SALÓN</label>
                <textarea
                  rows={2}
                  value={activeCh.classPrompt}
                  onChange={(e) => updateChapter(safeIdx, { classPrompt: e.target.value })}
                  className="w-full bg-[#070709] border border-white/15 px-3 py-2 text-sm text-[#EAE4D7] focus:outline-none focus:border-[#E5A93B]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block font-mono text-[11px] text-[#E5A93B]">PIE DE FOTO / METÁFORA VISUAL</label>
                <textarea
                  rows={2}
                  value={activeCh.imageCaption}
                  onChange={(e) => updateChapter(safeIdx, { imageCaption: e.target.value })}
                  className="w-full bg-[#070709] border border-white/15 px-3 py-2 text-sm text-[#EAE4D7] focus:outline-none focus:border-[#E5A93B]"
                />
              </div>
            </div>
          )}

          {tab === "closing" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {renderInputField("Título parpadeo final", "closingFlickerTitle")}
              {renderInputField("Subtítulo parpadeo final", "closingFlickerSubtitle")}
              {renderInputField("Antetítulo de créditos", "closingSponsorKicker")}
              {renderInputField("Frase de patrocinio / créditos", "closingSponsorQuote", true)}
              {renderInputField("Indicación bajo los créditos", "closingSponsorHint")}
              {renderInputField("Cabecera izquierda 404 final", "closing404HeaderLeft")}
              {renderInputField("Cabecera derecha 404 final", "closing404HeaderRight")}
              {renderInputField("Código 404 final", "closing404Code")}
              {renderInputField("Mensaje 404 final", "closing404Title")}
              {renderInputField("Nota debajo del 404 final", "closing404Note")}
              {renderInputField("Texto durante cierre del telón", "closingCurtainCaption")}
              {renderInputField("Texto en pantalla negra final", "closingBlackoutText")}
              {renderInputField("Botón volver al inicio", "closingReplayText")}
            </div>
          )}

          {tab === "gallery" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.gallery.map((item, idx) => (
                <div key={item.id} className="flex items-center gap-3 p-3 bg-[#070709] border border-white/10">
                  <img
                    src={item.imageUrl}
                    alt={item.label}
                    className="w-20 h-14 object-cover grayscale border border-white/15 shrink-0"
                  />
                  <div className="flex-1 space-y-1.5">
                    <input
                      type="text"
                      value={item.frameCode}
                      onChange={(e) => updateGalleryItem(idx, "frameCode", e.target.value)}
                      className="w-full bg-[#0F1014] border border-white/15 px-2 py-1 text-[11px] font-mono text-[#E5A93B]"
                    />
                    <input
                      type="text"
                      value={item.label}
                      onChange={(e) => updateGalleryItem(idx, "label", e.target.value)}
                      className="w-full bg-[#0F1014] border border-white/15 px-2 py-1 text-xs text-[#EAE4D7]"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-white/10 flex justify-end shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold bg-[#EAE4D7] text-[#070709] hover:bg-white cursor-pointer"
          >
            Listo
          </button>
        </div>
      </div>
    </div>
  );
}
