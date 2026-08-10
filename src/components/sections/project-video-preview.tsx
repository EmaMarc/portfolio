"use client";

import { useEffect, useId, useRef, useState } from "react";

const playbackThreshold = 0.6;
const reducedMotionQuery = "(prefers-reduced-motion: reduce)";

type ProjectVideoPreviewProps = {
  enterFullscreenLabel: string;
  exitFullscreenLabel: string;
  label: string;
  pauseLabel: string;
  playLabel: string;
  posterSrc: string;
  videoSrc: string;
};

function tryPlay(video: HTMLVideoElement) {
  const playPromise = video.play();

  if (playPromise !== undefined) {
    void playPromise.catch(() => {
      // Browser autoplay policy can still reject playback; the poster remains visible.
    });
  }
}

export function ProjectVideoPreview({
  enterFullscreenLabel,
  exitFullscreenLabel,
  label,
  pauseLabel,
  playLabel,
  posterSrc,
  videoSrc,
}: ProjectVideoPreviewProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const isFullscreenPausedLockRef = useRef(false);
  const isManualPauseRef = useRef(false);
  const isSufficientlyVisibleRef = useRef(false);
  const prefersReducedMotionRef = useRef(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isFullscreenSupported, setIsFullscreenSupported] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const labelId = useId();

  useEffect(() => {
    const video = videoRef.current;

    if (!video) {
      return undefined;
    }

    const syncPlaybackState = () => {
      setIsPlaying(!video.paused && !video.ended);
    };

    video.addEventListener("play", syncPlaybackState);
    video.addEventListener("pause", syncPlaybackState);
    video.addEventListener("ended", syncPlaybackState);
    syncPlaybackState();

    return () => {
      video.removeEventListener("play", syncPlaybackState);
      video.removeEventListener("pause", syncPlaybackState);
      video.removeEventListener("ended", syncPlaybackState);
    };
  }, []);

  useEffect(() => {
    const video = videoRef.current;

    if (!video) {
      return undefined;
    }

    const mediaQuery = window.matchMedia(reducedMotionQuery);

    const syncReducedMotion = () => {
      prefersReducedMotionRef.current = mediaQuery.matches;

      if (mediaQuery.matches) {
        video.pause();
        return;
      }

      if (
        isSufficientlyVisibleRef.current &&
        !isFullscreenPausedLockRef.current &&
        !isManualPauseRef.current
      ) {
        tryPlay(video);
      }
    };

    syncReducedMotion();
    mediaQuery.addEventListener("change", syncReducedMotion);

    return () => {
      mediaQuery.removeEventListener("change", syncReducedMotion);
    };
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    const video = videoRef.current;

    if (!root || !video || !("IntersectionObserver" in window)) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        const isSufficientlyVisible =
          Boolean(entry?.isIntersecting) &&
          (entry?.intersectionRatio ?? 0) >= playbackThreshold;

        isSufficientlyVisibleRef.current = isSufficientlyVisible;

        if (!isSufficientlyVisible) {
          isManualPauseRef.current = false;
          video.pause();
          return;
        }

        if (
          prefersReducedMotionRef.current ||
          isFullscreenPausedLockRef.current ||
          isManualPauseRef.current
        ) {
          return;
        }

        tryPlay(video);
      },
      { threshold: [0, playbackThreshold, 1] },
    );

    observer.observe(root);

    return () => {
      observer.disconnect();
    };
  }, []);

  const handlePlaybackToggle = () => {
    const video = videoRef.current;

    if (!video) {
      return;
    }

    if (video.paused) {
      isFullscreenPausedLockRef.current = false;
      isManualPauseRef.current = false;
      tryPlay(video);
      return;
    }

    isManualPauseRef.current = true;
    video.pause();
  };

  useEffect(() => {
    const root = rootRef.current;

    if (!root) {
      return undefined;
    }

    const syncFullscreenState = () => {
      setIsFullscreen(document.fullscreenElement === root);
    };
    const isSupported = Boolean(
      document.fullscreenEnabled &&
        typeof root.requestFullscreen === "function" &&
        typeof document.exitFullscreen === "function",
    );

    setIsFullscreenSupported(isSupported);
    syncFullscreenState();

    if (!isSupported) {
      return undefined;
    }

    document.addEventListener("fullscreenchange", syncFullscreenState);

    return () => {
      document.removeEventListener("fullscreenchange", syncFullscreenState);
    };
  }, []);

  const handleFullscreenToggle = () => {
    const root = rootRef.current;
    const video = videoRef.current;

    if (!root || !isFullscreenSupported) {
      return;
    }

    isFullscreenPausedLockRef.current = Boolean(video?.paused);

    if (document.fullscreenElement === root) {
      void document.exitFullscreen().catch(() => {
        setIsFullscreen(document.fullscreenElement === root);
      });
      return;
    }

    void root.requestFullscreen().catch(() => {
      isFullscreenPausedLockRef.current = false;
      setIsFullscreen(document.fullscreenElement === root);
    });
  };
  const controlButtonClass =
    "grid size-11 place-items-center rounded-[4px] border border-white/15 bg-black/55 text-sm font-semibold text-zinc-100 shadow-[0_12px_36px_rgba(0,0,0,0.32)] hover:border-white/30 hover:bg-black/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-100";

  return (
    <div
      aria-labelledby={labelId}
      className={`${
        isFullscreen
          ? "fixed inset-0 h-screen w-screen bg-black"
          : "absolute inset-0"
      }`}
      ref={rootRef}
      role="group"
    >
      <span className="sr-only" id={labelId}>
        {label}
      </span>
      <video
        aria-hidden="true"
        className={`absolute inset-0 h-full w-full ${
          isFullscreen ? "object-contain" : "object-cover"
        }`}
        loop
        muted
        playsInline
        poster={posterSrc}
        preload="metadata"
        ref={videoRef}
      >
        <source src={videoSrc} type="video/mp4" />
      </video>
      <div className="absolute bottom-3 right-3 z-10 flex gap-2">
        <button
          aria-label={isPlaying ? pauseLabel : playLabel}
          className={controlButtonClass}
          onClick={handlePlaybackToggle}
          type="button"
        >
          <span aria-hidden="true">{isPlaying ? "II" : "▶"}</span>
        </button>
        {isFullscreenSupported ? (
          <button
            aria-label={
              isFullscreen ? exitFullscreenLabel : enterFullscreenLabel
            }
            aria-pressed={isFullscreen}
            className={controlButtonClass}
            onClick={handleFullscreenToggle}
            type="button"
          >
            <span aria-hidden="true">{isFullscreen ? "⤡" : "⤢"}</span>
          </button>
        ) : null}
      </div>
    </div>
  );
}
