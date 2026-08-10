"use client";

import type { ReactNode } from "react";
import { useEffect, useRef } from "react";

const DESKTOP_QUERY = "(min-width: 1024px)";
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
const FOLLOW_DAMPING = 0.11;
const SETTLE_DELTA = 0.35;

type PortraitContactMotionProps = {
  children: ReactNode;
  className?: string;
};

type MotionMetrics = {
  contactHeight: number;
  contactTop: number;
  portraitHeight: number;
  rootBottom: number;
  stickyTop: number;
};

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function PortraitContactMotion({
  children,
  className,
}: PortraitContactMotionProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const moverRef = useRef<HTMLDivElement>(null);
  const metricsRef = useRef<MotionMetrics | null>(null);
  const targetYRef = useRef(0);
  const currentYRef = useRef(0);
  const frameRef = useRef<number | null>(null);
  const isDesktopRef = useRef(false);
  const reducedMotionRef = useRef(false);

  useEffect(() => {
    const root = rootRef.current;
    const sticky = stickyRef.current;
    const mover = moverRef.current;
    const contact = document.getElementById("contact");

    if (!root || !sticky || !mover || !contact) {
      return undefined;
    }

    const desktopQuery = window.matchMedia(DESKTOP_QUERY);
    const reducedMotionQuery = window.matchMedia(REDUCED_MOTION_QUERY);
    let isListeningToScroll = false;

    const applyTransform = (value: number) => {
      mover.style.transform =
        Math.abs(value) < SETTLE_DELTA
          ? ""
          : `translate3d(0, ${value.toFixed(2)}px, 0)`;
    };

    const calculateMotion = () => {
      const metrics = metricsRef.current;

      if (!metrics || !isDesktopRef.current) {
        return { maxTravel: 0, targetY: 0 };
      }

      const scrollY = window.scrollY || window.pageYOffset;
      const viewportHeight = window.innerHeight;
      const contactTopInViewport = metrics.contactTop - scrollY;
      const startLine = viewportHeight * 0.72;
      const endLine = viewportHeight * 0.38;
      const progressRange = Math.max(
        1,
        metrics.contactHeight + startLine - endLine,
      );
      const progress = clamp(
        (startLine - contactTopInViewport) / progressRange,
        0,
        1,
      );
      const footerGap = viewportHeight * 0.04;
      const rootBottomInViewport = metrics.rootBottom - scrollY;
      const viewportTravel = Math.max(
        0,
        viewportHeight - metrics.stickyTop - metrics.portraitHeight - footerGap,
      );
      const boundaryTravel = Math.max(
        0,
        rootBottomInViewport -
          metrics.stickyTop -
          metrics.portraitHeight -
          footerGap,
      );
      const maxTravel = Math.min(viewportTravel, boundaryTravel);

      return {
        maxTravel,
        targetY: progress * maxTravel,
      };
    };

    const stopFrame = () => {
      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
    };

    const tick = () => {
      const targetY = targetYRef.current;
      const currentY = currentYRef.current;
      const nextY = reducedMotionRef.current
        ? targetY
        : currentY + (targetY - currentY) * FOLLOW_DAMPING;

      if (Math.abs(targetY - nextY) < SETTLE_DELTA) {
        currentYRef.current = targetY;
        applyTransform(targetY);
        frameRef.current = null;
        return;
      }

      currentYRef.current = nextY;
      applyTransform(nextY);
      frameRef.current = window.requestAnimationFrame(tick);
    };

    const startFrame = () => {
      if (frameRef.current === null) {
        frameRef.current = window.requestAnimationFrame(tick);
      }
    };

    const updateTarget = () => {
      const { maxTravel, targetY } = calculateMotion();
      targetYRef.current = targetY;

      if (currentYRef.current > maxTravel) {
        currentYRef.current = maxTravel;
        applyTransform(maxTravel);
      }

      if (!isDesktopRef.current || reducedMotionRef.current) {
        stopFrame();
        currentYRef.current = targetY;
        applyTransform(targetY);
        return;
      }

      if (Math.abs(targetY - currentYRef.current) < SETTLE_DELTA) {
        currentYRef.current = targetY;
        applyTransform(targetY);
        return;
      }

      startFrame();
    };

    const measure = () => {
      const scrollY = window.scrollY || window.pageYOffset;
      const contactRect = contact.getBoundingClientRect();
      const rootRect = root.getBoundingClientRect();
      const moverRect = mover.getBoundingClientRect();
      const computedStickyTop = Number.parseFloat(
        window.getComputedStyle(sticky).top,
      );

      metricsRef.current = {
        contactHeight: contactRect.height,
        contactTop: contactRect.top + scrollY,
        portraitHeight: moverRect.height,
        rootBottom: rootRect.bottom + scrollY,
        stickyTop: Number.isFinite(computedStickyTop)
          ? computedStickyTop
          : 96,
      };

      updateTarget();
    };

    const handleScroll = () => {
      updateTarget();
    };

    const handleResize = () => {
      measure();
    };

    const syncScrollListener = () => {
      if (isDesktopRef.current && !isListeningToScroll) {
        window.addEventListener("scroll", handleScroll, { passive: true });
        isListeningToScroll = true;
        return;
      }

      if (!isDesktopRef.current && isListeningToScroll) {
        window.removeEventListener("scroll", handleScroll);
        isListeningToScroll = false;
      }
    };

    const refreshMode = () => {
      isDesktopRef.current = desktopQuery.matches;
      reducedMotionRef.current = reducedMotionQuery.matches;
      syncScrollListener();
      measure();
    };

    const resizeObserver =
      "ResizeObserver" in window ? new ResizeObserver(measure) : null;

    resizeObserver?.observe(root);
    resizeObserver?.observe(contact);
    resizeObserver?.observe(mover);

    refreshMode();
    window.addEventListener("resize", handleResize);
    desktopQuery.addEventListener("change", refreshMode);
    reducedMotionQuery.addEventListener("change", refreshMode);

    return () => {
      stopFrame();
      resizeObserver?.disconnect();
      if (isListeningToScroll) {
        window.removeEventListener("scroll", handleScroll);
      }
      window.removeEventListener("resize", handleResize);
      desktopQuery.removeEventListener("change", refreshMode);
      reducedMotionQuery.removeEventListener("change", refreshMode);
    };
  }, []);

  return (
    <div className={className} ref={rootRef}>
      <div className="lg:sticky lg:top-24" ref={stickyRef}>
        <div className="lg:will-change-transform" ref={moverRef}>
          {children}
        </div>
      </div>
    </div>
  );
}
