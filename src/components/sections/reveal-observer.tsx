"use client";

import { useEffect } from "react";

const revealRootSelector = "[data-reveal-root]";
const revealSelector = "[data-reveal]";
const reducedMotionQuery = "(prefers-reduced-motion: reduce)";
const revealThreshold = 0.12;

export function RevealObserver() {
  useEffect(() => {
    if (!("IntersectionObserver" in window)) {
      return undefined;
    }

    const motionQuery = window.matchMedia(reducedMotionQuery);

    if (motionQuery.matches) {
      return undefined;
    }

    const root = document.querySelector<HTMLElement>(revealRootSelector);

    if (!root) {
      return undefined;
    }

    const targets = Array.from(
      root.querySelectorAll<HTMLElement>(revealSelector),
    ).filter((target) => target.dataset.revealed !== "true");

    if (targets.length === 0) {
      return undefined;
    }

    let remainingTargets = targets.length;
    let observer: IntersectionObserver | null = null;

    const revealTarget = (target: HTMLElement) => {
      if (target.dataset.revealed === "true") {
        observer?.unobserve(target);
        return;
      }

      target.dataset.revealed = "true";
      observer?.unobserve(target);
      remainingTargets -= 1;

      if (remainingTargets === 0) {
        observer?.disconnect();
        observer = null;
      }
    };

    const revealAll = () => {
      targets.forEach((target) => {
        target.dataset.revealed = "true";
        observer?.unobserve(target);
      });
      remainingTargets = 0;
      observer?.disconnect();
      observer = null;
      delete root.dataset.revealEnabled;
    };

    const handleMotionPreferenceChange = () => {
      if (motionQuery.matches) {
        revealAll();
      }
    };

    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const isReadyToReveal =
            entry.isIntersecting && entry.intersectionRatio >= revealThreshold;

          if (isReadyToReveal) {
            revealTarget(entry.target as HTMLElement);
          }
        });
      },
      {
        rootMargin: "0px 0px -12% 0px",
        threshold: revealThreshold,
      },
    );

    targets.forEach((target) => {
      observer?.observe(target);
    });
    root.dataset.revealEnabled = "true";
    motionQuery.addEventListener("change", handleMotionPreferenceChange);

    return () => {
      motionQuery.removeEventListener("change", handleMotionPreferenceChange);
      observer?.disconnect();
      delete root.dataset.revealEnabled;
    };
  }, []);

  return null;
}
