"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
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
    about: "Sobre mí",
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

function LogoSlot() {
  return (
    <span
      aria-hidden="true"
      className="grid size-7 place-items-center border border-white/15 text-[0.62rem] font-semibold tracking-[0.08em] text-zinc-400"
    >
      EM
    </span>
  );
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
      className="flex shrink-0 flex-nowrap items-center gap-2 whitespace-nowrap text-sm font-medium"
      role="group"
    >
      {supportedLocales.map((option, index) => {
        const isActive = option === locale;

        return (
          <span className="flex shrink-0 items-center gap-2" key={option}>
            <button
              aria-pressed={isActive}
              className={`min-h-10 shrink-0 whitespace-nowrap border-b px-2 text-sm font-semibold uppercase tracking-[0.12em] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-zinc-100 ${
                isActive
                  ? "border-zinc-100 text-zinc-50"
                  : "border-transparent text-zinc-500 hover:text-zinc-50"
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
  const desktopNavRef = useRef<HTMLDivElement>(null);
  const brandGroupRef = useRef<HTMLDivElement>(null);
  const navigationGroupRef = useRef<HTMLDivElement>(null);
  const topSentinelRef = useRef<HTMLDivElement>(null);
  const [hasMeasured, setHasMeasured] = useState(false);
  const [canAnimate, setCanAnimate] = useState(false);
  const [isAtTop, setIsAtTop] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const copy = navCopy[locale];
  const isInitialTopGeometry = !hasMeasured && isAtTop;
  const transformTransitionClass = canAnimate
    ? "transition-transform duration-[580ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
    : "transition-none";
  const surfaceTransitionClass = canAnimate
    ? "transition-[background-color,border-radius,border-color] duration-[580ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
    : "transition-none";
  const desktopNavLayoutClass = isInitialTopGeometry
    ? "md:flex md:justify-center"
    : "md:block";
  const brandPositionClass = isInitialTopGeometry
    ? "relative"
    : "absolute left-0 top-0";
  const navigationPositionClass = isInitialTopGeometry
    ? "relative"
    : "absolute right-0 top-0";

  useLayoutEffect(() => {
    const desktopNav = desktopNavRef.current;
    const brandGroup = brandGroupRef.current;
    const navigationGroup = navigationGroupRef.current;
    const sentinel = topSentinelRef.current;

    if (!desktopNav || !brandGroup || !navigationGroup) {
      return undefined;
    }

    const updateTopTransforms = () => {
      const containerWidth = desktopNav.getBoundingClientRect().width;
      const brandWidth = brandGroup.getBoundingClientRect().width;
      const navigationWidth = navigationGroup.getBoundingClientRect().width;
      const availableSpace = containerWidth - brandWidth - navigationWidth;
      const inset = Math.max(0, availableSpace / 2);

      desktopNav.style.setProperty("--nav-brand-top-x", `${inset}px`);
      desktopNav.style.setProperty("--nav-links-top-x", `${inset}px`);
    };

    updateTopTransforms();
    setHasMeasured(true);

    if (sentinel) {
      const sentinelRect = sentinel.getBoundingClientRect();

      setIsAtTop(
        sentinelRect.bottom > 0 && sentinelRect.top < window.innerHeight,
      );
    }

    const animationFrame = window.requestAnimationFrame(() => {
      setCanAnimate(true);
    });

    if (!("ResizeObserver" in window)) {
      return () => {
        window.cancelAnimationFrame(animationFrame);
      };
    }

    const resizeObserver = new ResizeObserver(updateTopTransforms);

    resizeObserver.observe(desktopNav);
    resizeObserver.observe(brandGroup);
    resizeObserver.observe(navigationGroup);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      resizeObserver.disconnect();
    };
  }, []);

  useEffect(() => {
    const sentinel = topSentinelRef.current;

    if (!sentinel) {
      return undefined;
    }

    if (!("IntersectionObserver" in window)) {
      return undefined;
    }

    const observer = new IntersectionObserver((entries) => {
      const entry = entries[0];

      if (entry) {
        setIsAtTop(entry.isIntersecting);
      }
    });

    observer.observe(sentinel);

    return () => {
      observer.disconnect();
    };
  }, []);

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
    <>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-0 h-8 w-px"
        ref={topSentinelRef}
      />

      <header className="sticky top-0 z-50 px-3 py-3 sm:px-5 lg:px-8">
        <div
          className={`relative mx-auto hidden h-14 w-full max-w-none text-zinc-100 ${desktopNavLayoutClass}`}
          ref={desktopNavRef}
        >
          <div
            className={`${brandPositionClass} shrink-0 whitespace-nowrap will-change-transform ${transformTransitionClass}`}
            ref={brandGroupRef}
            style={{
              transform: isInitialTopGeometry
                ? "translate3d(0, 0, 0)"
                : isAtTop
                  ? "translate3d(var(--nav-brand-top-x, clamp(8rem, 18vw, 22rem)), 0, 0)"
                  : "translate3d(0, 0, 0)",
            }}
          >
            <Link
              className={`inline-flex min-h-14 shrink-0 items-center gap-3 whitespace-nowrap border px-4 text-base font-semibold tracking-normal shadow-[0_18px_60px_rgba(0,0,0,0.18)] backdrop-blur-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-100 ${surfaceTransitionClass} ${
                isAtTop
                  ? "rounded-l-full border-r-0 border-white/10 bg-black/45"
                  : "rounded-full border-white/[0.12] bg-black/[0.58]"
              }`}
              href={`/${locale}`}
            >
              <LogoSlot />
              Ema Marc
            </Link>
          </div>

          <div
            className={`${navigationPositionClass} shrink-0 whitespace-nowrap will-change-transform ${transformTransitionClass}`}
            ref={navigationGroupRef}
            style={{
              transform: isInitialTopGeometry
                ? "translate3d(0, 0, 0)"
                : isAtTop
                  ? "translate3d(calc(var(--nav-links-top-x, clamp(8rem, 18vw, 22rem)) * -1), 0, 0)"
                  : "translate3d(0, 0, 0)",
            }}
          >
            <div
              className={`flex min-h-14 shrink-0 items-center justify-end gap-4 whitespace-nowrap border px-4 shadow-[0_18px_60px_rgba(0,0,0,0.18)] backdrop-blur-sm lg:px-5 ${surfaceTransitionClass} ${
                isAtTop
                  ? "rounded-r-full border-l-0 border-white/10 bg-black/45"
                  : "rounded-full border-white/[0.12] bg-black/[0.58]"
              }`}
            >
              <nav
                aria-label={copy.navigation}
                className="flex shrink-0 flex-nowrap items-center gap-1 whitespace-nowrap"
              >
                {sectionLinks.map((link) => (
                  <Link
                    className="shrink-0 whitespace-nowrap px-3 py-2 text-sm font-medium text-zinc-300 transition-colors hover:text-zinc-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-zinc-100"
                    href={getLocalizedHref(locale, link.href)}
                    key={link.key}
                  >
                    {copy[link.key]}
                  </Link>
                ))}
              </nav>

              <LanguageSelector copy={copy} locale={locale} />
            </div>
          </div>
        </div>

        <div className="mx-auto flex min-h-14 w-full max-w-6xl items-center justify-between gap-3 rounded-full border border-white/10 bg-black/55 px-3 text-zinc-100 shadow-[0_18px_60px_rgba(0,0,0,0.24)] backdrop-blur-md sm:px-4 md:hidden">
          <Link
            className="inline-flex min-h-11 items-center rounded-full px-2 text-base font-semibold tracking-normal focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-100"
            href={`/${locale}`}
          >
            Ema Marc
          </Link>

          <button
            aria-controls="mobile-menu"
            aria-expanded={isMenuOpen}
            className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/10 px-4 text-sm font-medium text-zinc-100 transition-colors hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-100"
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
    </>
  );
}
