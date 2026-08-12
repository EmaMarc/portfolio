"use client";

import Image from "next/image";
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

type SectionId = (typeof sectionLinks)[number]["key"];

const activeSectionActivationRatio = 0.44;
const activeSectionRootMargin = "-43% 0px -56% 0px";
const currentSectionLinkClass =
  "text-white [text-shadow:0_0_8px_rgba(220,38,38,0.45)] after:scale-x-100 after:bg-[rgba(220,38,38,0.96)] hover:text-white hover:after:bg-[rgba(220,38,38,0.96)]";
const brandTextClass = "font-brand font-normal";
const lycorisNavbarMark = {
  height: 128,
  src: "/brand/lycoris/lycoris-navbar-175x128.png",
  width: 175,
} as const;
const menuItemOpenDelayClasses = [
  "delay-[70ms]",
  "delay-[105ms]",
  "delay-[140ms]",
  "delay-[175ms]",
] as const;
const desktopMenuMediaQuery = "(min-width: 48rem)";
const mainContentId = "main-content";
const mobileMenuFocusableSelector = "a[href], button:not(:disabled)";

const navCopy = {
  es: {
    about: "Sobre mí",
    closeMenu: "Cerrar menu",
    contact: "Contacto",
    current: "actual",
    experience: "Experiencia",
    language: "Idioma",
    navigation: "Navegacion principal",
    openMenu: "Abrir menu",
    work: "Proyectos",
  },
  en: {
    about: "About",
    closeMenu: "Close menu",
    contact: "Contact",
    current: "current",
    experience: "Experience",
    language: "Language",
    navigation: "Primary navigation",
    openMenu: "Open menu",
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
    | "navigation"
    | "openMenu"
    | "work",
    string
  >
>;

type SiteNavbarProps = {
  locale: Locale;
};

type LanguageSelectorProps = {
  copy: (typeof navCopy)[Locale];
  isInteractive?: boolean;
  locale: Locale;
  onNavigate?: () => void;
};

function getLocalizedHref(locale: Locale, hash: string) {
  return `/${locale}${hash}`;
}

function LycorisBrandMark({ className }: { className: string }) {
  return (
    <Image
      alt=""
      aria-hidden="true"
      className={`shrink-0 opacity-100 ${className}`}
      height={lycorisNavbarMark.height}
      src={lycorisNavbarMark.src}
      unoptimized
      width={lycorisNavbarMark.width}
    />
  );
}

function LanguageSelector({
  copy,
  isInteractive = true,
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
              tabIndex={isInteractive ? undefined : -1}
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
  const mobileMenuPanelRef = useRef<HTMLDivElement>(null);
  const mobileMenuTriggerRef = useRef<HTMLButtonElement>(null);
  const navigationGroupRef = useRef<HTMLDivElement>(null);
  const topSentinelRef = useRef<HTMLDivElement>(null);
  const [hasMeasured, setHasMeasured] = useState(false);
  const [canAnimate, setCanAnimate] = useState(false);
  const [activeSection, setActiveSection] = useState<SectionId | null>(null);
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

  const focusMobileMenuTrigger = () => {
    mobileMenuTriggerRef.current?.focus({ preventScroll: true });
  };

  const closeMobileMenu = () => {
    setIsMenuOpen(false);
    focusMobileMenuTrigger();
  };

  const handleMobileMenuToggle = () => {
    if (isMenuOpen) {
      focusMobileMenuTrigger();
    }

    setIsMenuOpen((current) => !current);
  };

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
    if (!("IntersectionObserver" in window)) {
      return undefined;
    }

    const sectionTargets = sectionLinks.flatMap((link) => {
      const element = document.getElementById(link.key);

      return element ? [{ element, key: link.key }] : [];
    });

    if (sectionTargets.length === 0) {
      return undefined;
    }

    const getCurrentSection = () => {
      const activationY = window.innerHeight * activeSectionActivationRatio;
      let currentSection: SectionId | null = null;

      for (const { element, key } of sectionTargets) {
        const rect = element.getBoundingClientRect();

        if (rect.top > activationY) {
          break;
        }

        currentSection = key;
      }

      return currentSection;
    };

    const syncActiveSection = () => {
      setActiveSection(getCurrentSection());
    };

    const observer = new IntersectionObserver(
      () => {
        syncActiveSection();
      },
      {
        rootMargin: activeSectionRootMargin,
        threshold: 0,
      },
    );

    sectionTargets.forEach(({ element }) => {
      observer.observe(element);
    });
    const syncTimeout = window.setTimeout(syncActiveSection, 0);

    return () => {
      window.clearTimeout(syncTimeout);
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!isMenuOpen) {
      return undefined;
    }

    const getMobileMenuFocusTargets = () => {
      const trigger = mobileMenuTriggerRef.current;
      const panel = mobileMenuPanelRef.current;
      const panelControls = panel
        ? Array.from(
            panel.querySelectorAll<HTMLElement>(mobileMenuFocusableSelector),
          ).filter((element) => element.tabIndex >= 0)
        : [];

      return trigger ? [trigger, ...panelControls] : panelControls;
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setIsMenuOpen(false);
        mobileMenuTriggerRef.current?.focus({ preventScroll: true });
        return;
      }

      if (event.key !== "Tab") {
        return;
      }

      const focusTargets = getMobileMenuFocusTargets();

      if (focusTargets.length === 0) {
        return;
      }

      const activeTarget = document.activeElement;
      const activeIndex =
        activeTarget instanceof HTMLElement
          ? focusTargets.indexOf(activeTarget)
          : -1;
      const nextIndex = event.shiftKey
        ? activeIndex <= 0
          ? focusTargets.length - 1
          : activeIndex - 1
        : activeIndex === -1 || activeIndex === focusTargets.length - 1
          ? 0
          : activeIndex + 1;

      event.preventDefault();
      focusTargets[nextIndex]?.focus({ preventScroll: true });
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isMenuOpen]);

  useLayoutEffect(() => {
    if (!isMenuOpen) {
      return undefined;
    }

    const mainContent = document.getElementById(mainContentId);

    mainContent?.setAttribute("inert", "");
    focusMobileMenuTrigger();

    return () => {
      mainContent?.removeAttribute("inert");
    };
  }, [isMenuOpen]);

  useEffect(() => {
    const desktopQuery = window.matchMedia(desktopMenuMediaQuery);

    const closeMenuOnDesktop = () => {
      if (desktopQuery.matches) {
        setIsMenuOpen(false);

        if (
          mobileMenuTriggerRef.current === document.activeElement ||
          mobileMenuPanelRef.current?.contains(document.activeElement)
        ) {
          desktopNavRef.current
            ?.querySelector<HTMLElement>(mobileMenuFocusableSelector)
            ?.focus({ preventScroll: true });
        }
      }
    };

    closeMenuOnDesktop();
    desktopQuery.addEventListener("change", closeMenuOnDesktop);

    return () => {
      desktopQuery.removeEventListener("change", closeMenuOnDesktop);
    };
  }, []);

  return (
    <>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-0 h-8 w-px"
        ref={topSentinelRef}
      />

      <header className="sticky top-0 z-50 px-3 py-3 sm:px-5 lg:px-8">
        <span
          aria-hidden="true"
          className={`pointer-events-none fixed inset-0 z-40 bg-[rgba(20,5,9,0.32)] backdrop-blur-[10px] transition-opacity duration-[220ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none md:hidden ${
            isMenuOpen ? "opacity-100" : "opacity-0"
          }`}
        />
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
              className={`inline-flex min-h-14 shrink-0 items-center gap-2 whitespace-nowrap border-b bg-transparent text-sm font-semibold tracking-[0.08em] text-zinc-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-100 ${surfaceTransitionClass} ${
                isAtTop
                  ? "border-white/[0.1] px-1 pr-10"
                  : "border-white/[0.14] px-1 pr-8"
              }`}
              href={getLocalizedHref(locale, "#top")}
            >
              <LycorisBrandMark className="h-auto w-[38px]" />
              <span className={brandTextClass}>Ema Marc</span>
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
              className={`flex min-h-14 shrink-0 items-center justify-end whitespace-nowrap border-b bg-transparent ${surfaceTransitionClass} ${
                isAtTop
                  ? "gap-6 border-white/[0.1] py-0 pl-10 pr-1"
                  : "gap-4 border-white/[0.14] py-0 pl-8 pr-1"
              }`}
            >
              <nav
                aria-label={copy.navigation}
                className="flex shrink-0 flex-nowrap items-center gap-2 whitespace-nowrap"
              >
                {sectionLinks.map((link) => {
                  const isCurrent = activeSection === link.key;

                  return (
                    <Link
                      aria-current={isCurrent ? "location" : undefined}
                      className={`relative inline-flex shrink-0 items-center whitespace-nowrap px-2 py-2 text-[0.8125rem] font-medium tracking-[0.02em] transition-colors duration-150 after:pointer-events-none after:absolute after:inset-x-2 after:bottom-1 after:h-px after:origin-left after:scale-x-0 after:transition-transform after:duration-200 after:ease-out after:content-[''] motion-reduce:after:transition-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-zinc-100 ${
                        isCurrent
                          ? currentSectionLinkClass
                          : "text-zinc-400 after:bg-white/[0.26] hover:text-zinc-50 hover:after:scale-x-100"
                      }`}
                      href={getLocalizedHref(locale, link.href)}
                      key={link.key}
                    >
                      {copy[link.key]}
                    </Link>
                  );
                })}
              </nav>

              <div className={isAtTop ? "pl-4" : "pl-3"}>
                <LanguageSelector copy={copy} locale={locale} />
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-50 mx-auto w-full max-w-6xl md:hidden">
          <div
            className={`flex min-h-14 items-center justify-between gap-4 border-b px-2 text-zinc-100 sm:px-3 ${
              isAtTop
                ? "border-white/[0.08] bg-transparent"
                : "border-white/[0.12] bg-black/[0.18] backdrop-blur-[6px]"
            }`}
          >
            <Link
              className="inline-flex min-h-11 items-center gap-2 px-1 text-base font-semibold tracking-normal focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-100"
              href={getLocalizedHref(locale, "#top")}
            >
              <LycorisBrandMark className="h-auto w-[34px]" />
              <span className={brandTextClass}>Ema Marc</span>
            </Link>

            <button
              aria-label={isMenuOpen ? copy.closeMenu : copy.openMenu}
              aria-controls="mobile-menu"
              aria-expanded={isMenuOpen}
              className={`group relative inline-flex min-h-11 w-11 shrink-0 items-center justify-center px-1 transition-colors duration-200 ease-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-100 ${
                isMenuOpen
                  ? "text-zinc-50"
                  : "text-zinc-300 hover:text-zinc-50 focus-visible:text-zinc-50"
              }`}
              onClick={handleMobileMenuToggle}
              ref={mobileMenuTriggerRef}
              type="button"
            >
              <span
                aria-hidden="true"
                className={`absolute left-1/2 top-1/2 h-px origin-center bg-current transition-[translate,rotate,width] duration-[220ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${
                  isMenuOpen
                    ? "w-[1.125rem] -translate-x-1/2 -translate-y-1/2 rotate-45"
                    : "w-5 -translate-x-[54%] -translate-y-1.5 rotate-0"
                }`}
              />
              <span
                aria-hidden="true"
                className={`absolute left-1/2 top-1/2 h-px origin-center bg-current transition-[translate,rotate,width] duration-[220ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${
                  isMenuOpen
                    ? "w-[1.125rem] -translate-x-1/2 -translate-y-1/2 -rotate-45"
                    : "w-4 -translate-x-[38%] translate-y-1.5 rotate-0"
                }`}
              />
            </button>
          </div>

          <div
            aria-hidden={!isMenuOpen}
            className={`absolute left-1/2 top-full z-50 w-screen -translate-x-1/2 overflow-hidden text-zinc-100 transition-[clip-path,opacity,translate,visibility] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${
              isMenuOpen
                ? "visible pointer-events-auto translate-y-0 opacity-100 duration-[340ms] [clip-path:inset(0_0_0_0)]"
                : "invisible pointer-events-none -translate-y-1 opacity-0 duration-[220ms] [clip-path:inset(0_0_100%_0)]"
            }`}
            id="mobile-menu"
            ref={mobileMenuPanelRef}
          >
            <div className="mx-auto w-full max-w-6xl px-5 pb-12 pt-9 sm:px-8">
              <nav
                aria-label={copy.navigation}
                className="flex flex-col items-start gap-5"
              >
                {sectionLinks.map((link, index) => {
                  const isCurrent = activeSection === link.key;

                  return (
                    <Link
                      aria-current={isCurrent ? "location" : undefined}
                      className={`relative inline-flex min-h-14 shrink-0 items-center px-1 py-2 text-xl font-medium leading-tight tracking-normal transition-[color,opacity,translate] ease-[cubic-bezier(0.22,1,0.36,1)] after:pointer-events-none after:absolute after:inset-x-1 after:bottom-1 after:h-px after:origin-left after:scale-x-0 after:transition-transform after:duration-200 after:ease-out after:content-[''] motion-reduce:translate-y-0 motion-reduce:transition-none motion-reduce:after:transition-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-zinc-100 ${
                        isMenuOpen
                          ? `translate-y-0 opacity-100 duration-[210ms] ${menuItemOpenDelayClasses[index]}`
                          : "delay-0 -translate-y-2 opacity-0 duration-[120ms]"
                      } ${
                        isCurrent
                          ? currentSectionLinkClass
                          : "text-zinc-400 after:bg-white/[0.24] hover:text-zinc-50 hover:after:scale-x-100"
                      }`}
                      href={getLocalizedHref(locale, link.href)}
                      key={link.key}
                      onClick={closeMobileMenu}
                      tabIndex={isMenuOpen ? undefined : -1}
                    >
                      {copy[link.key]}
                    </Link>
                  );
                })}
              </nav>
              <div
                className={`mt-12 flex justify-end transition-[opacity,translate] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:translate-y-0 motion-reduce:transition-none ${
                  isMenuOpen
                    ? "translate-y-0 opacity-100 delay-[220ms] duration-[210ms]"
                    : "delay-0 -translate-y-2 opacity-0 duration-[120ms]"
                }`}
              >
                <LanguageSelector
                  copy={copy}
                  isInteractive={isMenuOpen}
                  locale={locale}
                  onNavigate={closeMobileMenu}
                />
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
