"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  getBrowserPreferredLocale,
  isSupportedLocale,
  localeStorageKey,
} from "@/lib/locale";
import type { Locale } from "@/content/portfolio";
import styles from "./locale-redirect.module.css";

const lycorisLoaderMark = {
  height: 128,
  src: "/brand/lycoris/lycoris-navbar-175x128.png",
  width: 175,
} as const;
const minimumLoaderDuration = 2000;
const loaderExitDuration = 250;

type LocaleRedirectTarget = {
  hash: string;
  locale: Locale;
};

function getStoredLocale(): Locale | null {
  try {
    const value = window.localStorage.getItem(localeStorageKey);

    return value && isSupportedLocale(value) ? value : null;
  } catch {
    return null;
  }
}

function getNavigatorLanguages() {
  if (navigator.languages.length > 0) {
    return navigator.languages;
  }

  return [navigator.language];
}

function resolveLocaleRedirectTarget(): LocaleRedirectTarget {
  return {
    hash: window.location.hash,
    locale: getStoredLocale() ?? getBrowserPreferredLocale(getNavigatorLanguages()),
  };
}

export function LocaleRedirect() {
  const router = useRouter();
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    let isCancelled = false;
    const timers: number[] = [];

    const wait = (duration: number) =>
      new Promise<void>((resolve) => {
        const timer = window.setTimeout(resolve, duration);

        timers.push(timer);
      });

    const resolveLanguage = async () => resolveLocaleRedirectTarget();

    void Promise.all([resolveLanguage(), wait(minimumLoaderDuration)]).then(
      ([target]) => {
        if (isCancelled) {
          return;
        }

        setIsExiting(true);

        const exitTimer = window.setTimeout(() => {
          if (!isCancelled) {
            router.replace(`/${target.locale}${target.hash}`);
          }
        }, loaderExitDuration);

        timers.push(exitTimer);
      },
    );

    return () => {
      isCancelled = true;

      timers.forEach((timer) => {
        window.clearTimeout(timer);
      });
    };
  }, [router]);

  return (
    <main
      aria-busy={!isExiting}
      className={`grid min-h-svh place-items-center px-6 text-center ${
        styles.loader
      } ${isExiting ? styles.loaderExit : ""}`}
    >
      <div className={styles.loaderStack}>
        <Image
          alt=""
          aria-hidden="true"
          className={styles.loaderMark}
          height={lycorisLoaderMark.height}
          loading="eager"
          src={lycorisLoaderMark.src}
          unoptimized
          width={lycorisLoaderMark.width}
        />
        <p aria-live="polite" className={styles.loaderText} role="status">
          RESOLVING LANGUAGE
        </p>
        <div aria-hidden="true" className={styles.progressTrack}>
          <span className={styles.progressFill} />
        </div>
        <noscript>
          <p className="mt-4 text-sm text-zinc-300">
            JavaScript is required for automatic language detection.
          </p>
          <p className="mt-3 flex justify-center gap-4 text-sm font-medium">
            <Link className="underline underline-offset-4" href="/es">
              ES
            </Link>
            <Link className="underline underline-offset-4" href="/en">
              EN
            </Link>
          </p>
        </noscript>
      </div>
    </main>
  );
}
