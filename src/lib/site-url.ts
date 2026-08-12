import type { Locale } from "@/content/portfolio/types";

export const siteOrigin = "https://ema-marc.vercel.app";
export const siteUrl = new URL(siteOrigin);

export const sitePaths = {
  root: "/",
  localized: {
    es: "/es",
    en: "/en",
  },
} as const satisfies {
  root: "/";
  localized: Record<Locale, `/${Locale}`>;
};

export const siteLanguageAlternates = {
  es: new URL(sitePaths.localized.es, siteUrl).toString(),
  en: new URL(sitePaths.localized.en, siteUrl).toString(),
  "x-default": new URL(sitePaths.root, siteUrl).toString(),
} as const;

export const siteAbsoluteUrls = {
  root: new URL(sitePaths.root, siteUrl).toString(),
  localized: {
    es: siteLanguageAlternates.es,
    en: siteLanguageAlternates.en,
  },
  socialImage: new URL("/opengraph-image.png", siteUrl).toString(),
  sitemap: new URL("/sitemap.xml", siteUrl).toString(),
} as const;

export function getLocaleSiteUrl(locale: Locale) {
  return siteAbsoluteUrls.localized[locale];
}
