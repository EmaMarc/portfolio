import type { Locale } from "@/content/portfolio";

export const supportedLocales = ["es", "en"] as const satisfies readonly Locale[];

export const defaultLocale: Locale = "en";

export const localeStorageKey = "ema-marc-locale";

export function isSupportedLocale(value: string): value is Locale {
  return supportedLocales.some((locale) => locale === value);
}

export function getBrowserPreferredLocale(languages: readonly string[]): Locale {
  return languages.some((language) => language.toLowerCase().startsWith("es"))
    ? "es"
    : defaultLocale;
}
