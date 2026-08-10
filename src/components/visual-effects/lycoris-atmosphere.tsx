"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import styles from "./lycoris-atmosphere.module.css";

const DESKTOP_QUERY = "(min-width: 1024px)";
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
const DAMPING = 0.095;
const SETTLE_DELTA = 0.45;
const LYCORIS_SRC = "/media/hero/lycoris-hero.png";

type VisualState = {
  blur: number;
  glowOpacity: number;
  glowScale: number;
  opacity: number;
  scale: number;
  x: number;
  y: number;
};

type ScrollFrame = {
  scrollY: number;
  state: VisualState;
};

type Geometry = {
  frames: readonly ScrollFrame[];
};

type MobileState = "background" | "hero";

const initialVisualState: VisualState = {
  blur: 0.2,
  glowOpacity: 0.4,
  glowScale: 1,
  opacity: 0.62,
  scale: 1.22,
  x: 0,
  y: 0,
};

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function interpolate(start: number, end: number, progress: number) {
  return start + (end - start) * progress;
}

function smoothProgress(progress: number) {
  return progress * progress * (3 - 2 * progress);
}

function interpolateState(
  start: VisualState,
  end: VisualState,
  progress: number,
): VisualState {
  const easedProgress = smoothProgress(progress);

  return {
    blur: interpolate(start.blur, end.blur, easedProgress),
    glowOpacity: interpolate(
      start.glowOpacity,
      end.glowOpacity,
      easedProgress,
    ),
    glowScale: interpolate(start.glowScale, end.glowScale, easedProgress),
    opacity: interpolate(start.opacity, end.opacity, easedProgress),
    scale: interpolate(start.scale, end.scale, easedProgress),
    x: interpolate(start.x, end.x, easedProgress),
    y: interpolate(start.y, end.y, easedProgress),
  };
}

function followState(current: VisualState, target: VisualState): VisualState {
  return {
    blur: interpolate(current.blur, target.blur, DAMPING),
    glowOpacity: interpolate(current.glowOpacity, target.glowOpacity, DAMPING),
    glowScale: interpolate(current.glowScale, target.glowScale, DAMPING),
    opacity: interpolate(current.opacity, target.opacity, DAMPING),
    scale: interpolate(current.scale, target.scale, DAMPING),
    x: interpolate(current.x, target.x, DAMPING),
    y: interpolate(current.y, target.y, DAMPING),
  };
}

function hasSettled(current: VisualState, target: VisualState) {
  return (
    Math.abs(current.x - target.x) < SETTLE_DELTA &&
    Math.abs(current.y - target.y) < SETTLE_DELTA &&
    Math.abs(current.blur - target.blur) < 0.04 &&
    Math.abs(current.scale - target.scale) < 0.001 &&
    Math.abs(current.opacity - target.opacity) < 0.002 &&
    Math.abs(current.glowOpacity - target.glowOpacity) < 0.002 &&
    Math.abs(current.glowScale - target.glowScale) < 0.002
  );
}

function getElementTop(element: Element | null, scrollY: number) {
  if (!element) {
    return null;
  }

  return element.getBoundingClientRect().top + scrollY;
}

function createStateMap(viewportWidth: number, viewportHeight: number) {
  return {
    about: {
      blur: 10.5,
      glowOpacity: 0.19,
      glowScale: 1.56,
      opacity: 0.32,
      scale: 1.82,
      x: viewportWidth * 0.01,
      y: viewportHeight * 0.12,
    },
    contact: {
      blur: 9.5,
      glowOpacity: 0.2,
      glowScale: 1.74,
      opacity: 0.42,
      scale: 2.04,
      x: viewportWidth * -0.01,
      y: viewportHeight * 0.11,
    },
    experience: {
      blur: 5.8,
      glowOpacity: 0.26,
      glowScale: 1.34,
      opacity: 0.42,
      scale: 1.58,
      x: viewportWidth * 0.025,
      y: viewportHeight * 0.08,
    },
    footer: {
      blur: 13.5,
      glowOpacity: 0.1,
      glowScale: 1.86,
      opacity: 0.24,
      scale: 2.14,
      x: viewportWidth * -0.015,
      y: viewportHeight * 0.15,
    },
    hero: {
      blur: 0.2,
      glowOpacity: 0.42,
      glowScale: 1.02,
      opacity: 0.64,
      scale: 1.25,
      x: viewportWidth * 0.07,
      y: viewportHeight * -0.015,
    },
    work: {
      blur: 2.8,
      glowOpacity: 0.34,
      glowScale: 1.16,
      opacity: 0.52,
      scale: 1.36,
      x: viewportWidth * 0.045,
      y: viewportHeight * 0.05,
    },
  } satisfies Record<string, VisualState>;
}

function createGeometry(): Geometry {
  const scrollY = window.scrollY || window.pageYOffset;
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  const maxScrollY = Math.max(
    0,
    document.documentElement.scrollHeight - viewportHeight,
  );
  const states = createStateMap(viewportWidth, viewportHeight);
  const workTop = getElementTop(document.getElementById("work"), scrollY);
  const experienceTop = getElementTop(
    document.getElementById("experience"),
    scrollY,
  );
  const aboutTop = getElementTop(document.getElementById("about"), scrollY);
  const contactTop = getElementTop(document.getElementById("contact"), scrollY);
  const footerTop = getElementTop(document.querySelector("footer"), scrollY);
  const rawFrames: ScrollFrame[] = [
    { scrollY: 0, state: states.hero },
    {
      scrollY: (workTop ?? viewportHeight) - viewportHeight * 0.16,
      state: states.work,
    },
    {
      scrollY:
        (experienceTop ?? viewportHeight * 2) - viewportHeight * 0.24,
      state: states.experience,
    },
    {
      scrollY: (aboutTop ?? viewportHeight * 3) - viewportHeight * 0.3,
      state: states.about,
    },
    {
      scrollY: (contactTop ?? viewportHeight * 4) - viewportHeight * 0.36,
      state: states.contact,
    },
    {
      scrollY:
        (footerTop ?? document.documentElement.scrollHeight) -
        viewportHeight * 0.35,
      state: states.footer,
    },
    { scrollY: maxScrollY, state: states.footer },
  ];
  const frames = rawFrames
    .map((frame) => ({
      ...frame,
      scrollY: clamp(frame.scrollY, 0, maxScrollY),
    }))
    .sort((a, b) => a.scrollY - b.scrollY);

  for (let index = 1; index < frames.length; index += 1) {
    if (frames[index].scrollY <= frames[index - 1].scrollY) {
      frames[index].scrollY = frames[index - 1].scrollY + 1;
    }
  }

  return { frames };
}

function getTargetState(scrollY: number, frames: readonly ScrollFrame[]) {
  if (scrollY <= frames[0].scrollY) {
    return frames[0].state;
  }

  const finalFrame = frames[frames.length - 1];

  if (scrollY >= finalFrame.scrollY) {
    return finalFrame.state;
  }

  for (let index = 0; index < frames.length - 1; index += 1) {
    const start = frames[index];
    const end = frames[index + 1];

    if (scrollY >= start.scrollY && scrollY <= end.scrollY) {
      const progress = clamp(
        (scrollY - start.scrollY) / Math.max(1, end.scrollY - start.scrollY),
        0,
        1,
      );

      return interpolateState(start.state, end.state, progress);
    }
  }

  return finalFrame.state;
}

function applyState(
  imageFrame: HTMLDivElement,
  glow: HTMLDivElement,
  state: VisualState,
) {
  imageFrame.style.transform = `translate3d(-50%, 0, 0) translate3d(${state.x.toFixed(2)}px, ${state.y.toFixed(2)}px, 0) scale(${state.scale.toFixed(4)})`;
  imageFrame.style.opacity = state.opacity.toFixed(3);
  imageFrame.style.filter = `blur(${state.blur.toFixed(2)}px)`;

  glow.style.transform = `translate3d(-50%, 0, 0) translate3d(${(state.x * 0.72).toFixed(2)}px, ${(state.y * 0.72).toFixed(2)}px, 0) scale(${state.glowScale.toFixed(4)})`;
  glow.style.opacity = state.glowOpacity.toFixed(3);
}

function clearInlineStyles(imageFrame: HTMLDivElement, glow: HTMLDivElement) {
  imageFrame.removeAttribute("style");
  glow.removeAttribute("style");
}

export function LycorisAtmosphere() {
  const rootRef = useRef<HTMLDivElement>(null);
  const imageFrameRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const geometryRef = useRef<Geometry | null>(null);
  const currentRef = useRef(initialVisualState);
  const targetRef = useRef(initialVisualState);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    const imageFrame = imageFrameRef.current;
    const glow = glowRef.current;

    if (!root || !imageFrame || !glow) {
      return undefined;
    }

    const desktopQuery = window.matchMedia(DESKTOP_QUERY);
    const reducedMotionQuery = window.matchMedia(REDUCED_MOTION_QUERY);
    let isActive = false;
    let isListeningToScroll = false;
    let isListeningToResize = false;
    let isListeningToVisibility = false;
    let hasMeasuredActiveMode = false;
    let resizeObserver: ResizeObserver | null = null;
    let mobileHeroObserver: IntersectionObserver | null = null;

    const setMobileState = (state: MobileState) => {
      root.dataset.mobileState = state;
    };

    const disconnectMobileHeroObserver = () => {
      mobileHeroObserver?.disconnect();
      mobileHeroObserver = null;
    };

    const getHeroMobileState = (hero: Element): MobileState => {
      const heroRect = hero.getBoundingClientRect();
      const activeViewportHeight = window.innerHeight * 0.65;
      const visibleHeight = Math.max(
        0,
        Math.min(heroRect.bottom, activeViewportHeight) -
          Math.max(heroRect.top, 0),
      );
      const visibleRatio = visibleHeight / Math.max(1, heroRect.height);

      return visibleRatio >= 0.34 ? "hero" : "background";
    };

    const observeMobileHero = () => {
      disconnectMobileHeroObserver();

      if (
        desktopQuery.matches ||
        reducedMotionQuery.matches ||
        !("IntersectionObserver" in window)
      ) {
        setMobileState("background");
        return;
      }

      const hero = document.querySelector("#main-content > section");

      if (!hero) {
        setMobileState("background");
        return;
      }

      setMobileState(getHeroMobileState(hero));
      mobileHeroObserver = new IntersectionObserver(
        ([entry]) => {
          if (!entry) {
            return;
          }

          setMobileState(
            entry.isIntersecting && entry.intersectionRatio >= 0.34
              ? "hero"
              : "background",
          );
        },
        {
          rootMargin: "0px 0px -35% 0px",
          threshold: [0, 0.34, 0.6],
        },
      );
      mobileHeroObserver.observe(hero);
    };

    const stopFrame = () => {
      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
    };

    const tick = () => {
      const nextState = followState(currentRef.current, targetRef.current);

      if (hasSettled(nextState, targetRef.current)) {
        currentRef.current = targetRef.current;
        applyState(imageFrame, glow, targetRef.current);
        frameRef.current = null;
        return;
      }

      currentRef.current = nextState;
      applyState(imageFrame, glow, nextState);
      frameRef.current = window.requestAnimationFrame(tick);
    };

    const startFrame = () => {
      if (frameRef.current === null && !document.hidden) {
        frameRef.current = window.requestAnimationFrame(tick);
      }
    };

    const updateTarget = (syncCurrent: boolean) => {
      if (!isActive) {
        return;
      }

      const geometry = geometryRef.current ?? createGeometry();
      geometryRef.current = geometry;
      const targetState = getTargetState(
        window.scrollY || window.pageYOffset,
        geometry.frames,
      );
      targetRef.current = targetState;

      if (syncCurrent || hasSettled(currentRef.current, targetState)) {
        stopFrame();
        currentRef.current = targetState;
        applyState(imageFrame, glow, targetState);
        return;
      }

      startFrame();
    };

    const observeGeometry = () => {
      resizeObserver?.disconnect();
      resizeObserver =
        "ResizeObserver" in window
          ? new ResizeObserver(() => {
              geometryRef.current = createGeometry();
              updateTarget(false);
            })
          : null;

      if (!resizeObserver) {
        return;
      }

      const targets = [
        document.getElementById("main-content"),
        document.getElementById("work"),
        document.getElementById("experience"),
        document.getElementById("about"),
        document.getElementById("contact"),
        document.querySelector("footer"),
      ].filter((target): target is HTMLElement => target !== null);

      targets.forEach((target) => resizeObserver?.observe(target));
    };

    const measure = (syncCurrent: boolean) => {
      geometryRef.current = createGeometry();
      updateTarget(syncCurrent || !hasMeasuredActiveMode);
      hasMeasuredActiveMode = true;
    };

    const handleScroll = () => {
      updateTarget(false);
    };

    const handleResize = () => {
      measure(true);
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopFrame();
        return;
      }

      if (isActive) {
        measure(false);
      }
    };

    const addActiveListeners = () => {
      if (!isListeningToScroll) {
        window.addEventListener("scroll", handleScroll, { passive: true });
        isListeningToScroll = true;
      }

      if (!isListeningToResize) {
        window.addEventListener("resize", handleResize);
        isListeningToResize = true;
      }

      if (!isListeningToVisibility) {
        document.addEventListener("visibilitychange", handleVisibilityChange);
        isListeningToVisibility = true;
      }
    };

    const removeActiveListeners = () => {
      if (isListeningToScroll) {
        window.removeEventListener("scroll", handleScroll);
        isListeningToScroll = false;
      }

      if (isListeningToResize) {
        window.removeEventListener("resize", handleResize);
        isListeningToResize = false;
      }

      if (isListeningToVisibility) {
        document.removeEventListener(
          "visibilitychange",
          handleVisibilityChange,
        );
        isListeningToVisibility = false;
      }
    };

    const syncMode = () => {
      const shouldAnimate = desktopQuery.matches && !reducedMotionQuery.matches;

      if (!shouldAnimate) {
        isActive = false;
        hasMeasuredActiveMode = false;
        geometryRef.current = null;
        stopFrame();
        resizeObserver?.disconnect();
        resizeObserver = null;
        removeActiveListeners();
        observeMobileHero();
        clearInlineStyles(imageFrame, glow);
        return;
      }

      isActive = true;
      disconnectMobileHeroObserver();
      root.removeAttribute("data-mobile-state");
      addActiveListeners();
      observeGeometry();
      measure(!hasMeasuredActiveMode);
    };

    syncMode();
    desktopQuery.addEventListener("change", syncMode);
    reducedMotionQuery.addEventListener("change", syncMode);

    return () => {
      stopFrame();
      disconnectMobileHeroObserver();
      resizeObserver?.disconnect();
      removeActiveListeners();
      desktopQuery.removeEventListener("change", syncMode);
      reducedMotionQuery.removeEventListener("change", syncMode);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className={styles.root}
      data-mobile-state="hero"
      ref={rootRef}
    >
      <div className={styles.glow} ref={glowRef} />
      <div className={styles.imageFrame} ref={imageFrameRef}>
        <Image
          alt=""
          className={styles.image}
          draggable={false}
          fill
          loading="lazy"
          sizes="(max-width: 639px) 168vw, (max-width: 1023px) 46rem, (max-width: 1279px) 44rem, (max-width: 1535px) 54vw, 66rem"
          src={LYCORIS_SRC}
        />
      </div>
    </div>
  );
}
