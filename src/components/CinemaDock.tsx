import {
  ChevronDown,
  ChevronUp,
  Pause,
  Pencil,
  Play,
} from "lucide-react";

interface CinemaDockProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  progress: number;
  outroProgress: number;
  inExposition: boolean;
  autoPlay: boolean;
  onToggleAutoPlay: () => void;
  onJumpToProgress: (p: number) => void;
  onJumpToChapter: (idx: number) => void;
  onJumpToClosing: () => void;
  activeChapterIndex: number;
  chapterCount: number;
  onOpenTextEditor: () => void;
}

export default function CinemaDock({
  collapsed,
  onToggleCollapse,
  progress,
  outroProgress,
  inExposition,
  autoPlay,
  onToggleAutoPlay,
  onJumpToProgress,
  onJumpToChapter,
  onJumpToClosing,
  activeChapterIndex,
  chapterCount,
  onOpenTextEditor,
}: CinemaDockProps) {
  const totalStr = String(chapterCount).padStart(2, "0");
  const activeStr = String(activeChapterIndex + 1).padStart(2, "0");
  const actLabel =
    outroProgress > 0.01
      ? outroProgress < 0.58
        ? "Cierre · Créditos & 404"
        : "Cierre · Telón Final"
      : progress < 0.2
      ? "Acto I · Telón Rojo"
      : progress < 0.41
      ? "Acto II · Acercamiento"
      : progress < 0.56
      ? "Acto III · Error 404"
      : progress < 0.65
      ? "Acto IV · Título"
      : `Pregunta ${activeStr}/${totalStr}`;

  return (
    <div
      className={`fixed left-1/2 -translate-x-1/2 z-40 w-[min(980px,95vw)] flex flex-col items-center pointer-events-none transition-[bottom] duration-200 ${
        inExposition ? "bottom-[102px] sm:bottom-[114px]" : "bottom-4"
      }`}
    >
      <button
        type="button"
        onClick={onToggleCollapse}
        className="pointer-events-auto mb-1.5 inline-flex items-center gap-1.5 px-3 py-1 text-[11px] font-mono bg-[#0F1014]/95 border border-white/15 text-[#EAE4D7]/80 hover:text-[#EAE4D7] hover:border-[#E5A93B] transition-colors cursor-pointer whitespace-nowrap"
      >
        {collapsed ? (
          <>
            <ChevronUp className="w-3.5 h-3.5" />
            <span>Mostrar controles (H)</span>
          </>
        ) : (
          <>
            <ChevronDown className="w-3.5 h-3.5" />
            <span>Ocultar controles (H)</span>
          </>
        )}
      </button>

      {!collapsed && (
        <div className="pointer-events-auto w-full bg-[#0F1014]/95 border border-white/15 px-3.5 py-2.5 shadow-2xl">
          <div className="flex flex-wrap items-center justify-between gap-2.5">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onToggleAutoPlay}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-[#A61C2B] text-[#EAE4D7] hover:bg-[#8E1623] transition-colors cursor-pointer whitespace-nowrap"
              >
                {autoPlay ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span>{autoPlay ? "Pausar cine" : "Auto-Cine"}</span>
              </button>
              <span className="font-mono text-[11px] text-[#EAE4D7]/75 hidden xl:inline tabular-nums">
                {actLabel}
              </span>
            </div>

            <div className="flex items-center gap-1 overflow-x-auto">
              {[
                { label: "Telón", p: 0.02 },
                { label: "404", p: 0.45 },
                { label: "Título", p: 0.6 },
              ].map((step) => (
                <button
                  key={step.label}
                  type="button"
                  onClick={() => onJumpToProgress(step.p)}
                  className="px-2 py-1 text-[11px] font-mono text-[#EAE4D7]/75 hover:text-[#E5A93B] border border-white/10 hover:border-[#E5A93B]/50 transition-colors cursor-pointer whitespace-nowrap"
                >
                  {step.label}
                </button>
              ))}
              {Array.from({ length: chapterCount }).map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => onJumpToChapter(idx)}
                  className={`px-2 py-1 text-[11px] font-mono border transition-colors cursor-pointer tabular-nums whitespace-nowrap ${
                    inExposition && activeChapterIndex === idx
                      ? "bg-[#EAE4D7] text-[#070709] border-[#EAE4D7] font-semibold"
                      : "text-[#EAE4D7]/70 border-white/10 hover:border-white/30"
                  }`}
                >
                  P{idx + 1}
                </button>
              ))}
              <button
                type="button"
                onClick={onJumpToClosing}
                className={`px-2 py-1 text-[11px] font-mono border transition-colors cursor-pointer whitespace-nowrap ${
                  outroProgress > 0.01
                    ? "bg-[#E5A93B] text-[#070709] border-[#E5A93B] font-semibold"
                    : "text-[#EAE4D7]/75 border-white/10 hover:border-[#E5A93B]/50"
                }`}
              >
                Cierre
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onOpenTextEditor}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-[#E5A93B]/60 text-[#E5A93B] hover:bg-[#E5A93B]/15 transition-colors cursor-pointer whitespace-nowrap"
              >
                <Pencil className="w-3.5 h-3.5" />
                <span>Editar textos</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
