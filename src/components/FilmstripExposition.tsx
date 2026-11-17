import { ArrowDown, Pencil } from "lucide-react";
import { ChapterQuestion, FilmstripNaturePhoto } from "../data/chapters";
import { SiteTexts } from "../data/siteContent";

interface FilmstripExpositionProps {
  showPinnedStrips: boolean;
  texts: SiteTexts;
  chapters: ChapterQuestion[];
  gallery: FilmstripNaturePhoto[];
  activeChapterIndex: number;
  onSelectChapter: (idx: number) => void;
  onOpenTextEditor: () => void;
  onJumpToAct: (progress: number) => void;
  onJumpToClosing: () => void;
}

export default function FilmstripExposition({
  showPinnedStrips,
  texts,
  chapters,
  gallery,
  activeChapterIndex,
  onSelectChapter,
  onOpenTextEditor,
  onJumpToAct,
  onJumpToClosing,
}: FilmstripExpositionProps) {
  const stripItems = gallery.map((item) => ({
    key: item.id,
    frameCode: item.frameCode,
    imageUrl: item.imageUrl,
    label: item.label,
    chapterIndex: item.chapterIndex,
  }));

  const reversedStripItems = [...stripItems].reverse();

  const renderStripTrack = (
    items: typeof stripItems,
    directionClass: "animate-film-marquee-left" | "animate-film-marquee-right"
  ) => (
    <div className="film-marquee-wrap relative w-full overflow-hidden bg-[#0B0C10]/95 border-y border-white/15">
      <div className="h-2.5 w-full film-sprocket-row border-b border-white/10" />
      <div className={`flex w-max ${directionClass}`}>
        {[0, 1].map((dup) => (
          <div key={dup} className="flex items-stretch gap-3 px-2 py-1.5 shrink-0">
            {items.map((frame) => (
              <button
                key={`${dup}-${frame.key}`}
                type="button"
                onClick={() => {
                  if (frame.chapterIndex !== undefined && frame.chapterIndex < chapters.length) {
                    onSelectChapter(frame.chapterIndex);
                  }
                }}
                className={`group relative w-32 sm:w-40 shrink-0 text-left overflow-hidden bg-[#070709] border transition-colors ${
                  frame.chapterIndex === activeChapterIndex
                    ? "border-[#E5A93B]"
                    : "border-white/15 hover:border-white/40"
                } ${frame.chapterIndex !== undefined ? "cursor-pointer" : "cursor-default"}`}
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img
                    src={frame.imageUrl}
                    alt={frame.label}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover grayscale contrast-125"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                  <div className="absolute bottom-1 left-2 right-2 flex items-center justify-between font-mono text-[9px] text-[#EAE4D7]/85 tabular-nums">
                    <span>{frame.frameCode}</span>
                    <span className="truncate max-w-[80px] text-[#E5A93B]">{frame.label}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        ))}
      </div>
      <div className="h-2.5 w-full film-sprocket-row border-t border-white/10" />
    </div>
  );

  return (
    <div className="relative z-10 bg-[#070709] text-[#EAE4D7]">
      <div className="fixed inset-0 film-grain-overlay pointer-events-none opacity-30" />
      <div className="fixed inset-0 crt-scanlines pointer-events-none opacity-20" />

      {/* PINNED TOP HEADER + TOP CONTINUOUS 35MM FILMSTRIP */}
      {showPinnedStrips && (
        <div className="fixed top-0 left-0 right-0 z-30">
          <header className="bg-[#070709]/95 border-b border-white/10">
            <div className="max-w-7xl mx-auto px-6 py-2.5 flex items-center justify-between gap-8">
              <button
                type="button"
                onClick={() => onJumpToAct(0)}
                className="text-sm md:text-base font-semibold tracking-tight text-[#EAE4D7] hover:text-[#E5A93B] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {texts.brandTitle}
              </button>

              <nav className="hidden md:flex items-center gap-6 text-xs text-[#EAE4D7]/70">
                <button
                  type="button"
                  onClick={() => onJumpToAct(0.05)}
                  className="hover:text-[#EAE4D7] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  Telón
                </button>
                <button
                  type="button"
                  onClick={() => onJumpToAct(0.45)}
                  className="hover:text-[#EAE4D7] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  Error 404
                </button>
                <button
                  type="button"
                  onClick={() => onSelectChapter(0)}
                  className="text-[#E5A93B] hover:text-[#EAE4D7] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  Preguntas
                </button>
                <button
                  type="button"
                  onClick={onJumpToClosing}
                  className="hover:text-[#EAE4D7] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  Cierre
                </button>
              </nav>

              <div className="flex items-center gap-3 shrink-0">
                <button
                  type="button"
                  onClick={onOpenTextEditor}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium border border-[#E5A93B]/60 text-[#E5A93B] hover:bg-[#E5A93B]/15 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <Pencil className="w-3.5 h-3.5" />
                  <span>Editar textos</span>
                </button>
              </div>
            </div>
          </header>

          {renderStripTrack(stripItems, "animate-film-marquee-left")}
        </div>
      )}

      {/* PINNED BOTTOM CONTINUOUS 35MM FILMSTRIP */}
      {showPinnedStrips && (
        <div className="fixed bottom-0 left-0 right-0 z-20">
          {renderStripTrack(reversedStripItems, "animate-film-marquee-right")}
        </div>
      )}

      {/* SCROLLABLE MIDDLE EXPOSITION */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-44 pb-44 space-y-24">
        <div className="border-b border-white/10 pb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-mono text-xs text-[#E5A93B] tracking-widest">
              {texts.expositionKicker}
            </p>
            <h2
              className="mt-2 text-2xl sm:text-3xl font-semibold text-[#EAE4D7]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {texts.expositionHeading}
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <p className="font-mono text-xs text-[#EAE4D7]/60">{texts.expositionHint}</p>
            <button
              type="button"
              onClick={onOpenTextEditor}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-mono border border-[#E5A93B]/60 text-[#E5A93B] hover:bg-[#E5A93B]/15 transition-colors cursor-pointer whitespace-nowrap"
            >
              <Pencil className="w-3.5 h-3.5" />
              <span>Editar textos</span>
            </button>
          </div>
        </div>

        {chapters.map((chapter, idx) => {
          const isCurrent = idx === activeChapterIndex;
          const totalStr = String(chapters.length).padStart(2, "0");

          return (
            <article
              key={chapter.id}
              id={`chapter-${idx}`}
              data-chapter-index={idx}
              className="scroll-mt-44 pt-4 pb-16 border-b border-white/10 last:border-b-0"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
                {/* Left Column */}
                <div className="lg:col-span-7 flex flex-col justify-between space-y-7">
                  <div className="space-y-4">
                    <div className="flex flex-wrap items-center gap-3 text-xs font-mono tabular-nums">
                      <span className={isCurrent ? "text-[#E5A93B]" : "text-[#EAE4D7]/75"}>
                        CAPÍTULO {chapter.roman} · PREGUNTA {chapter.number} DE {totalStr}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="text-[#EAE4D7]/60">{chapter.kicker}</span>
                    </div>

                    <h3
                      className="text-2xl sm:text-3xl md:text-4xl font-semibold text-[#EAE4D7] leading-[1.18]"
                      style={{ fontFamily: "var(--font-display)", textWrap: "balance" }}
                    >
                      {chapter.question}
                    </h3>

                    <p className="text-base md:text-lg text-[#EAE4D7]/85 leading-relaxed max-w-[68ch]">
                      {chapter.coreThesis}
                    </p>
                  </div>

                  {/* Key Points */}
                  <div className="space-y-4">
                    <div className="border-b border-white/10 pb-2">
                      <h4 className="font-mono text-xs tracking-wider text-[#EAE4D7]/70">
                        {texts.labelKeyPoints}
                      </h4>
                    </div>

                    <div className="space-y-4">
                      {chapter.pillars.map((pillar, i) => (
                        <div
                          key={`${chapter.id}-p-${i}`}
                          className="border-b border-white/10 pb-3.5 last:border-b-0"
                        >
                          <div className="flex items-baseline gap-3">
                            <span className="font-mono text-xs text-[#E5A93B] tabular-nums">
                              0{i + 1}.
                            </span>
                            <h5 className="text-base font-semibold text-[#EAE4D7]">
                              {pillar.title}
                            </h5>
                          </div>
                          <p className="mt-1.5 pl-8 text-sm md:text-[15px] text-[#EAE4D7]/75 leading-relaxed">
                            {pillar.detail}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="lg:col-span-5 flex flex-col justify-between space-y-5">
                  <figure className="border border-white/15 bg-[#0F1014] overflow-hidden">
                    <div className="relative aspect-[4/3] bg-[#070709]">
                      <img
                        src={chapter.imageUrl}
                        alt={chapter.imageCaption}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover grayscale contrast-125"
                      />
                    </div>
                    <figcaption className="p-4 border-t border-white/10 space-y-1.5">
                      <p className="font-mono text-[11px] text-[#E5A93B] tabular-nums">
                        {chapter.frameCode} · {texts.labelVisualMetaphor}
                      </p>
                      <p className="text-sm text-[#EAE4D7]/80 leading-relaxed">
                        {chapter.imageCaption}
                      </p>
                    </figcaption>
                  </figure>

                  <div className="border border-white/15 bg-[#0F1014] p-5">
                    <p className="font-mono text-xs text-[#E5A93B] mb-2">
                      {texts.labelClassPrompt}
                    </p>
                    <p className="text-sm md:text-base italic text-[#EAE4D7] leading-relaxed">
                      “{chapter.classPrompt}”
                    </p>
                  </div>
                </div>
              </div>
            </article>
          );
        })}

        {/* Transition Invitation to Closing Sequence */}
        <div className="py-14 text-center space-y-4 border-t border-white/10">
          <p className="font-mono text-xs tracking-[0.25em] text-[#E5A93B]">
            {texts.expositionEndKicker}
          </p>
          <p className="text-lg text-[#EAE4D7]/80">{texts.expositionEndText}</p>
          <div className="pt-2 flex justify-center">
            <button
              type="button"
              onClick={onJumpToClosing}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-mono bg-[#A61C2B] text-[#EAE4D7] hover:bg-[#8E1623] transition-colors cursor-pointer"
            >
              <span>{texts.expositionEndCta}</span>
              <ArrowDown className="w-4 h-4" />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
