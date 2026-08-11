"use client";

import Lenis from "lenis";
import { useEffect } from "react";

export function SmoothScroll() {
  useEffect(() => {
    const finePointer = window.matchMedia("(pointer: fine)");

    if (!finePointer.matches) {
      return undefined;
    }

    const lenis = new Lenis({
      anchors: true,
      autoRaf: true,
      lerp: 0.035,
      respectReducedMotion: true,
      smoothWheel: true,
      stopInertiaOnNavigate: true,
      syncTouch: false,
      wheelMultiplier: 0.95,
    });

    return () => {
      lenis.destroy();
    };
  }, []);

  return null;
}
