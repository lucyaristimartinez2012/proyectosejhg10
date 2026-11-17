import { useMemo } from "react";
import { SiteTexts } from "../data/siteContent";

interface Crt404SequenceProps {
  progress: number;
  texts: SiteTexts;
  onAdvanceToTitle: () => void;
  onAdvanceToFilmstrip: () => void;
}

export default function Crt404Sequence({
  progress,
  texts,
  onAdvanceToTitle,
  onAdvanceToFilmstrip,
}: Crt404SequenceProps) {
  const opacity = useMemo(() => {
    if (progress < 0.37) return 0;
    if (progress < 0.41) return (progress - 0.37) / 0.04;
    if (progress <= 0.63) return 1;
    if (progress < 0.69) return 1 - (progress - 0.63) / 0.06;
    return 0;
  }, [progress]);

  if (opacity <= 0.01) {
    return null;
  }

  const is404Phase = progress < 0.5;
  const isFlickerPhase = progress >= 0.5 && progress < 0.56;
  const isTitlePhase = progress >= 0.56;

  return (
    <section
      aria-label="Secuencia CRT 404 y Título Principal"
      className="fixed inset-0 z-20 flex items-center justify-center bg-[#040504] overflow-hidden"
      style={{ opacity }}
    >
      <div className="absolute inset-0 crt-scanlines pointer-events-none opacity-80" />
      <div className="absolute inset-0 crt-vignette pointer-events-none" />
      <div className="absolute inset-0 film-grain-overlay pointer-events-none opacity-45" />

      {is404Phase && (
        <div className="relative z-10 max-w-2xl w-full mx-6 border border-[#4ADE80]/30 bg-[#050806]/95 p-8 md:p-10 shadow-[0_0_60px_rgba(74,222,128,0.08)]">
          <div className="flex items-center justify-between border-b border-[#4ADE80]/20 pb-3 mb-6 font-mono text-xs text-[#4ADE80]/80 tabular-nums">
            <span>{texts.intro404HeaderLeft}</span>
            <span>{texts.intro404HeaderRight}</span>
          </div>

          <div className="space-y-4 font-mono">
            <p className="text-xs text-[#4ADE80]/75 tracking-wider">
              {texts.intro404Command}
            </p>
            <div className="py-2">
              <p className="text-5xl md:text-7xl font-semibold tracking-tight text-[#4ADE80] tabular-nums">
                {texts.intro404Code}
              </p>
              <p className="mt-2 text-base md:text-lg text-[#E5A93B] tracking-wide">
                {texts.intro404Title}
              </p>
            </div>
            <p className="text-sm text-[#EAE4D7]/75 leading-relaxed">
              {texts.intro404Body}
            </p>
            <div className="pt-4 flex flex-wrap items-center justify-between gap-4 border-t border-[#4ADE80]/20">
              <span className="text-xs text-[#4ADE80]/70">{texts.intro404Hint}</span>
              <button
                type="button"
                onClick={onAdvanceToTitle}
                className="px-4 py-2 text-xs font-medium bg-[#4ADE80]/15 text-[#4ADE80] border border-[#4ADE80]/40 hover:bg-[#4ADE80]/25 transition-colors cursor-pointer whitespace-nowrap"
              >
                {texts.intro404Button}
              </button>
            </div>
          </div>
        </div>
      )}

      {isFlickerPhase && (
        <div className="relative z-10 w-full max-w-3xl mx-6 text-center animate-crt-flicker">
          <div className="h-[2px] w-full bg-[#EAE4D7]/80 mb-6" />
          <p className="font-mono text-4xl md:text-6xl font-semibold text-[#EAE4D7] tracking-widest tabular-nums">
            {texts.introFlickerTitle}
          </p>
          <p className="mt-3 font-mono text-xs text-[#E5A93B] tracking-[0.3em]">
            {texts.introFlickerSubtitle}
          </p>
          <div className="h-[1px] w-2/3 mx-auto bg-[#4ADE80]/70 mt-6" />
        </div>
      )}

      {isTitlePhase && (
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <p className="font-mono text-xs md:text-sm tracking-[0.28em] text-[#E5A93B] mb-5 tabular-nums">
            {texts.mainTitleKicker}
          </p>
          <h1
            className="text-4xl sm:text-6xl md:text-7xl font-semibold tracking-tight text-[#EAE4D7] leading-[1.08]"
            style={{ fontFamily: "var(--font-display)", textWrap: "balance" }}
          >
            {texts.mainTitleHeadline}
          </h1>
          <p className="mt-5 text-lg md:text-2xl text-[#EAE4D7]/80 font-normal max-w-2xl mx-auto leading-relaxed">
            {texts.mainTitleSubtitle}
          </p>
          <p className="mt-8 text-xs font-mono text-[#EAE4D7]/55">
            {texts.mainTitleMeta}
          </p>
          <div className="mt-10">
            <button
              type="button"
              onClick={onAdvanceToFilmstrip}
              className="px-6 py-3 text-sm font-medium bg-[#A61C2B] text-[#EAE4D7] hover:bg-[#8E1623] transition-colors cursor-pointer whitespace-nowrap"
            >
              {texts.mainTitleCta}
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
