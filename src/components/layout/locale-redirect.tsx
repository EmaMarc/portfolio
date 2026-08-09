"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  getBrowserPreferredLocale,
  isSupportedLocale,
  localeStorageKey,
} from "@/lib/locale";
import type { Locale } from "@/content/portfolio";

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

export function LocaleRedirect() {
  const router = useRouter();

  useEffect(() => {
    const locale = getStoredLocale() ?? getBrowserPreferredLocale(getNavigatorLanguages());
    const hash = window.location.hash;

    router.replace(`/${locale}${hash}`);
  }, [router]);

  return (
    <main className="grid min-h-svh place-items-center px-6 text-center">
      <div>
        <p className="text-sm font-medium uppercase tracking-[0.24em] text-zinc-400">
          Resolving language
        </p>
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
