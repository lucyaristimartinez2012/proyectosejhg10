import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowDown } from "lucide-react";
import TheaterStageCanvas from "./components/TheaterStageCanvas";
import Crt404Sequence from "./components/Crt404Sequence";
import FilmstripExposition from "./components/FilmstripExposition";
import ClosingSequence from "./components/ClosingSequence";
import CinemaDock from "./components/CinemaDock";
import TextEditorModal from "./components/TextEditorModal";
import {
  clearPresentationData,
  EditablePresentationData,
  getDefaultPresentationData,
  loadPresentationData,
  savePresentationData,
} from "./data/siteContent";

const INTRO_SCROLL_VH = 300;
const CLOSING_SCROLL_VH = 320;

export default function App() {
  const [presentationData, setPresentationData] = useState<EditablePresentationData>(() =>
    loadPresentationData()
  );

  const [progress, setProgress] = useState(0);
  const [outroProgress, setOutroProgress] = useState(0);
  const progressRef = useRef(0);
  const outroProgressRef = useRef(0);
  const [curtainIntroProgress, setCurtainIntroProgress] = useState(0);

  const [activeChapterIndex, setActiveChapterIndex] = useState(0);
  const [dockCollapsed, setDockCollapsed] = useState(false);
  const [autoPlay, setAutoPlay] = useState(false);
  const [textEditorOpen, setTextEditorOpen] = useState(false);

  const stageTrackRef = useRef<HTMLDivElement | null>(null);
  const closingTrackRef = useRef<HTMLDivElement | null>(null);
  const chaptersCountRef = useRef(presentationData.chapters.length);

  useEffect(() => {
    chaptersCountRef.current = presentationData.chapters.length;
  }, [presentationData.chapters.length]);

  const handleUpdatePresentationData = useCallback((next: EditablePresentationData) => {
    setPresentationData(next);
    savePresentationData(next);
  }, []);

  const handleResetPresentationData = useCallback(() => {
    clearPresentationData();
    setPresentationData(getDefaultPresentationData());
    setActiveChapterIndex(0);
  }, []);

  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const duration = 2600;
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setCurtainIntroProgress(eased);
      if (t < 1) {
        raf = requestAnimationFrame(step);
      }
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const introEl = stageTrackRef.current;
      const closingEl = closingTrackRef.current;
      if (!introEl || !closingEl) return;

      const introMaxY = Math.max(1, introEl.offsetHeight - window.innerHeight);
      const y = window.scrollY;

      let nextProgress = 0;
      if (y < introMaxY) {
        nextProgress = (y / introMaxY) * 0.68;
      } else {
        nextProgress = 0.72;
      }

      const closingStartY = Math.max(0, closingEl.offsetTop - 80);
      const closingRange = Math.max(1, closingEl.offsetHeight - window.innerHeight + 80);
      let nextOutro = 0;
      if (y >= closingStartY) {
        nextOutro = Math.max(0, Math.min(1, (y - closingStartY) / closingRange));
      }

      progressRef.current = nextProgress;
      outroProgressRef.current = nextOutro;
      setProgress(nextProgress);
      setOutroProgress(nextOutro);

      if (nextProgress >= 0.68 && nextOutro < 0.02) {
        const viewportMid = y + window.innerHeight * 0.45;
        for (let i = chaptersCountRef.current - 1; i >= 0; i--) {
          const el = document.getElementById(`chapter-${i}`);
          if (el && el.offsetTop <= viewportMid) {
            setActiveChapterIndex(i);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!autoPlay) return;

    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.1);
      last = now;

      const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
      const inExpo = progressRef.current >= 0.68 && outroProgressRef.current < 0.02;
      const speedPxPerSec = inExpo ? 115 : 190;
      const nextY = window.scrollY + dt * speedPxPerSec;

      if (nextY >= maxScroll) {
        window.scrollTo({ top: maxScroll, behavior: "auto" });
        setAutoPlay(false);
        return;
      }
      window.scrollTo({ top: nextY, behavior: "auto" });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [autoPlay]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.tagName === "SELECT")
      ) {
        return;
      }
      if (e.key === "h" || e.key === "H") {
        setDockCollapsed((prev) => !prev);
      } else if (progressRef.current >= 0.65 && outroProgressRef.current < 0.02) {
        if (e.key === "ArrowRight") {
          const nextIdx = Math.min(chaptersCountRef.current - 1, activeChapterIndex + 1);
          document.getElementById(`chapter-${nextIdx}`)?.scrollIntoView({ behavior: "smooth" });
        } else if (e.key === "ArrowLeft") {
          const prevIdx = Math.max(0, activeChapterIndex - 1);
          document.getElementById(`chapter-${prevIdx}`)?.scrollIntoView({ behavior: "smooth" });
        }
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeChapterIndex]);

  const jumpToProgress = useCallback((targetProgress: number) => {
    setAutoPlay(false);
    const trackEl = stageTrackRef.current;
    if (!trackEl) return;
    const maxIntroScroll = Math.max(1, trackEl.offsetHeight - window.innerHeight);
    if (targetProgress >= 0.68) {
      window.scrollTo({ top: maxIntroScroll + 20, behavior: "smooth" });
    } else {
      const y = (targetProgress / 0.68) * maxIntroScroll;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  }, []);

  const jumpToChapter = useCallback((idx: number) => {
    setAutoPlay(false);
    setActiveChapterIndex(idx);
    const el = document.getElementById(`chapter-${idx}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  const jumpToClosing = useCallback(() => {
    setAutoPlay(false);
    const closingEl = closingTrackRef.current;
    if (!closingEl) return;
    window.scrollTo({ top: closingEl.offsetTop + 40, behavior: "smooth" });
  }, []);

  const inExposition = progress >= 0.68 && outroProgress <= 0.01;
  const { texts, chapters, gallery } = presentationData;
  const safeActiveChapterIndex = Math.min(activeChapterIndex, Math.max(0, chapters.length - 1));

  return (
    <div className="relative min-h-screen bg-[#070709] text-[#EAE4D7]">
      <TheaterStageCanvas
        progressRef={progressRef}
        outroProgressRef={outroProgressRef}
        curtainIntroProgress={curtainIntroProgress}
      />

      {progress < 0.65 && outroProgress <= 0.01 && (
        <div className="fixed top-5 left-6 z-20 pointer-events-none">
          <p
            className="text-sm md:text-base font-semibold tracking-wide text-[#EAE4D7]/90"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {texts.brandTitle}
          </p>
          <p className="font-mono text-[11px] text-[#E5A93B]/85 mt-0.5">
            {texts.brandSubtitle}
          </p>
        </div>
      )}

      {progress < 0.14 && outroProgress <= 0.01 && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-20 text-center flex flex-col items-center gap-3 px-4 pointer-events-none">
          <div className="inline-flex flex-col items-center gap-1.5 px-4 py-2 bg-[#070709]/85 border border-white/10">
            <span className="font-mono text-xs text-[#EAE4D7]/85">
              {texts.introScrollPrompt}
            </span>
            <ArrowDown className="w-4 h-4 text-[#E5A93B] animate-bounce" />
          </div>
        </div>
      )}

      <Crt404Sequence
        progress={outroProgress > 0.01 ? 0 : progress}
        texts={texts}
        onAdvanceToTitle={() => jumpToProgress(0.58)}
        onAdvanceToFilmstrip={() => jumpToProgress(0.72)}
      />

      <div
        ref={stageTrackRef}
        style={{ height: `${INTRO_SCROLL_VH}vh` }}
        className="relative z-0 pointer-events-none"
        aria-hidden="true"
      />

      <FilmstripExposition
        showPinnedStrips={inExposition}
        texts={texts}
        chapters={chapters}
        gallery={gallery}
        activeChapterIndex={safeActiveChapterIndex}
        onSelectChapter={jumpToChapter}
        onOpenTextEditor={() => setTextEditorOpen(true)}
        onJumpToAct={jumpToProgress}
        onJumpToClosing={jumpToClosing}
      />

      <div
        ref={closingTrackRef}
        style={{ height: `${CLOSING_SCROLL_VH}vh` }}
        className="relative z-0 pointer-events-none"
        aria-hidden="true"
      />

      <ClosingSequence
        outroProgress={outroProgress}
        texts={texts}
        onReplay={() => {
          setAutoPlay(false);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
      />

      {outroProgress < 0.9 && (
        <CinemaDock
          collapsed={dockCollapsed}
          onToggleCollapse={() => setDockCollapsed((c) => !c)}
          progress={progress}
          outroProgress={outroProgress}
          inExposition={inExposition}
          autoPlay={autoPlay}
          onToggleAutoPlay={() => setAutoPlay((prev) => !prev)}
          onJumpToProgress={jumpToProgress}
          onJumpToChapter={jumpToChapter}
          onJumpToClosing={jumpToClosing}
          activeChapterIndex={safeActiveChapterIndex}
          chapterCount={chapters.length}
          onOpenTextEditor={() => setTextEditorOpen(true)}
        />
      )}

      <TextEditorModal
        open={textEditorOpen}
        onClose={() => setTextEditorOpen(false)}
        data={presentationData}
        onChange={handleUpdatePresentationData}
        onResetDefaults={handleResetPresentationData}
      />
    </div>
  );
}
