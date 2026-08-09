"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { Locale } from "@/content/portfolio";
import { localeStorageKey, supportedLocales } from "@/lib/locale";

const sectionLinks = [
  { href: "#work", key: "work" },
  { href: "#experience", key: "experience" },
  { href: "#about", key: "about" },
  { href: "#contact", key: "contact" },
] as const;

const navCopy = {
  es: {
    about: "Sobre mi",
    closeMenu: "Cerrar menu",
    contact: "Contacto",
    current: "actual",
    experience: "Experiencia",
    language: "Idioma",
    menu: "Menu",
    navigation: "Navegacion principal",
    work: "Proyectos",
  },
  en: {
    about: "About",
    closeMenu: "Close menu",
    contact: "Contact",
    current: "current",
    experience: "Experience",
    language: "Language",
    menu: "Menu",
    navigation: "Primary navigation",
    work: "Work",
  },
} satisfies Record<
  Locale,
  Record<
    | "about"
    | "closeMenu"
    | "contact"
    | "current"
    | "experience"
    | "language"
    | "menu"
    | "navigation"
    | "work",
    string
  >
>;

type SiteNavbarProps = {
  locale: Locale;
};

type LanguageSelectorProps = {
  copy: (typeof navCopy)[Locale];
  locale: Locale;
  onNavigate?: () => void;
};

function getLocalizedHref(locale: Locale, hash: string) {
  return `/${locale}${hash}`;
}

function LanguageSelector({
  copy,
  locale,
  onNavigate,
}: LanguageSelectorProps) {
  const router = useRouter();

  const handleLocaleChange = (nextLocale: Locale) => {
    try {
      window.localStorage.setItem(localeStorageKey, nextLocale);
    } catch {
      // Local storage may be unavailable in private or restricted contexts.
    }

    onNavigate?.();

    if (nextLocale === locale) {
      return;
    }

    router.push(`/${nextLocale}${window.location.hash}`);
  };

  return (
    <div
      aria-label={copy.language}
      className="flex items-center gap-2 text-sm font-medium"
      role="group"
    >
      {supportedLocales.map((option, index) => {
        const isActive = option === locale;

        return (
          <span className="flex items-center gap-2" key={option}>
            <button
              aria-pressed={isActive}
              className={`min-h-10 rounded-full px-3 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-100 ${
                isActive
                  ? "bg-zinc-100 text-zinc-950"
                  : "text-zinc-300 hover:bg-white/10 hover:text-zinc-50"
              }`}
              onClick={() => handleLocaleChange(option)}
              type="button"
            >
              {option.toUpperCase()}
              {isActive ? (
                <span className="sr-only"> {copy.current}</span>
              ) : null}
            </button>
            {index === 0 ? (
              <span aria-hidden="true" className="text-zinc-600">
                |
              </span>
            ) : null}
          </span>
        );
      })}
    </div>
  );
}

export function SiteNavbar({ locale }: SiteNavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const copy = navCopy[locale];

  useEffect(() => {
    if (!isMenuOpen) {
      return undefined;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isMenuOpen]);

  return (
    <header className="sticky top-0 z-50 px-3 py-3 sm:px-5 lg:px-8">
      <div className="mx-auto flex min-h-14 w-full max-w-6xl items-center justify-between gap-3 rounded-full border border-white/10 bg-black/45 px-3 text-zinc-100 shadow-[0_18px_60px_rgba(0,0,0,0.24)] backdrop-blur-md sm:px-4 lg:px-5">
        <Link
          className="inline-flex min-h-11 items-center rounded-full px-2 text-base font-semibold tracking-normal focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-100"
          href={`/${locale}`}
        >
          Ema Marc
        </Link>

        <nav
          aria-label={copy.navigation}
          className="hidden items-center gap-1 md:flex"
        >
          {sectionLinks.map((link) => (
            <Link
              className="rounded-full px-3 py-2 text-sm font-medium text-zinc-300 transition-colors hover:bg-white/10 hover:text-zinc-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-100"
              href={getLocalizedHref(locale, link.href)}
              key={link.key}
            >
              {copy[link.key]}
            </Link>
          ))}
        </nav>

        <div className="hidden md:block">
          <LanguageSelector copy={copy} locale={locale} />
        </div>

        <button
          aria-controls="mobile-menu"
          aria-expanded={isMenuOpen}
          className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/10 px-4 text-sm font-medium text-zinc-100 transition-colors hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-100 md:hidden"
          onClick={() => setIsMenuOpen((current) => !current)}
          type="button"
        >
          {isMenuOpen ? copy.closeMenu : copy.menu}
        </button>
      </div>

      {isMenuOpen ? (
        <div
          className="mx-auto mt-2 w-full max-w-6xl rounded-3xl border border-white/10 bg-black/70 p-3 text-zinc-100 shadow-[0_18px_60px_rgba(0,0,0,0.26)] backdrop-blur-md md:hidden"
          id="mobile-menu"
        >
          <nav aria-label={copy.navigation} className="flex flex-col gap-1">
            {sectionLinks.map((link) => (
              <Link
                className="rounded-2xl px-4 py-3 text-base font-medium text-zinc-200 transition-colors hover:bg-white/10 hover:text-zinc-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-100"
                href={getLocalizedHref(locale, link.href)}
                key={link.key}
                onClick={() => setIsMenuOpen(false)}
              >
                {copy[link.key]}
              </Link>
            ))}
          </nav>
          <div className="mt-3 border-t border-white/10 pt-3">
            <LanguageSelector
              copy={copy}
              locale={locale}
              onNavigate={() => setIsMenuOpen(false)}
            />
          </div>
        </div>
      ) : null}
    </header>
  );
}
