import { RotateCcw } from "lucide-react";
import { SiteTexts } from "../data/siteContent";

interface ClosingSequenceProps {
  outroProgress: number;
  texts: SiteTexts;
  onReplay: () => void;
}

export default function ClosingSequence({
  outroProgress,
  texts,
  onReplay,
}: ClosingSequenceProps) {
  if (outroProgress <= 0.01) return null;

  const isFlicker = outroProgress < 0.14;
  const isSponsor = outroProgress >= 0.14 && outroProgress < 0.38;
  const is404Outro = outroProgress >= 0.38 && outroProgress < 0.58;
  const isCurtainClose = outroProgress >= 0.58 && outroProgress < 0.9;
  const isBlackout = outroProgress >= 0.9;

  let overlayBgOpacity = 1;
  if (outroProgress >= 0.56 && outroProgress < 0.64) {
    overlayBgOpacity = 1 - (outroProgress - 0.56) / 0.08;
  } else if (outroProgress >= 0.64 && outroProgress < 0.88) {
    overlayBgOpacity = 0;
  } else if (outroProgress >= 0.88) {
    overlayBgOpacity = Math.min(1, (outroProgress - 0.88) / 0.1);
  }

  return (
    <section
      aria-label="Secuencia final de cierre"
      className="fixed inset-0 z-30 flex items-center justify-center pointer-events-none"
    >
      <div
        className="absolute inset-0 bg-black transition-opacity duration-150"
        style={{ opacity: overlayBgOpacity }}
      />

      {(isFlicker || isSponsor || is404Outro) && (
        <>
          <div className="absolute inset-0 crt-scanlines opacity-75 pointer-events-none" />
          <div className="absolute inset-0 crt-vignette pointer-events-none" />
          <div className="absolute inset-0 film-grain-overlay opacity-40 pointer-events-none" />
        </>
      )}

      {isFlicker && (
        <div className="relative z-10 max-w-3xl mx-6 text-center animate-crt-flicker">
          <div className="h-[2px] w-full bg-[#EAE4D7]/80 mb-5" />
          <p className="font-mono text-3xl md:text-5xl font-semibold text-[#EAE4D7] tracking-widest">
            {texts.closingFlickerTitle}
          </p>
          <p className="mt-3 font-mono text-xs text-[#E5A93B] tracking-[0.28em]">
            {texts.closingFlickerSubtitle}
          </p>
          <div className="h-[1px] w-2/3 mx-auto bg-[#4ADE80]/70 mt-5" />
        </div>
      )}

      {isSponsor && (
        <div className="relative z-10 max-w-3xl mx-6 text-center space-y-6">
          <p className="font-mono text-xs tracking-[0.28em] text-[#E5A93B]">
            {texts.closingSponsorKicker}
          </p>
          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-semibold text-[#EAE4D7] leading-snug"
            style={{ fontFamily: "var(--font-display)", textWrap: "balance" }}
          >
            {texts.closingSponsorQuote}
          </h2>
          <p className="font-mono text-xs text-[#EAE4D7]/55">
            {texts.closingSponsorHint}
          </p>
        </div>
      )}

      {is404Outro && (
        <div className="relative z-10 max-w-2xl w-full mx-6 border border-[#4ADE80]/30 bg-[#050806]/95 p-8 md:p-10 shadow-[0_0_60px_rgba(74,222,128,0.08)]">
          <div className="flex items-center justify-between border-b border-[#4ADE80]/20 pb-3 mb-6 font-mono text-xs text-[#4ADE80]/80 tabular-nums">
            <span>{texts.closing404HeaderLeft}</span>
            <span>{texts.closing404HeaderRight}</span>
          </div>
          <div className="space-y-4 font-mono">
            <p className="text-5xl md:text-7xl font-semibold tracking-tight text-[#4ADE80] tabular-nums">
              {texts.closing404Code}
            </p>
            <p className="text-base md:text-xl text-[#E5A93B] tracking-wide">
              {texts.closing404Title}
            </p>
            <p className="text-xs text-[#EAE4D7]/65 pt-2">
              {texts.closing404Note}
            </p>
          </div>
        </div>
      )}

      {isCurtainClose && (
        <div className="relative z-10 self-end mb-24 px-5 py-2 bg-[#070709]/80 border border-white/10">
          <p className="font-mono text-xs text-[#EAE4D7]/80">
            {texts.closingCurtainCaption}
          </p>
        </div>
      )}

      {isBlackout && (
        <div className="relative z-10 text-center space-y-5 pointer-events-auto px-6">
          <p className="font-mono text-xs tracking-[0.3em] text-[#EAE4D7]/40">
            {texts.closingBlackoutText}
          </p>
          <button
            type="button"
            onClick={onReplay}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-mono border border-white/20 text-[#EAE4D7]/80 hover:text-[#EAE4D7] hover:border-[#E5A93B] transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{texts.closingReplayText}</span>
          </button>
        </div>
      )}
    </section>
  );
}
