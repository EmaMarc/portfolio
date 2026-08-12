import type { Locale } from "./types";
import { siteAbsoluteUrls } from "@/lib/site-url";

type SeoMetadata = {
  description: string;
  title: string;
};

type SocialImageMetadata = {
  alt: string;
  height: number;
  type: "image/png";
  url: string;
  width: number;
};

export const ogLocales = {
  es: "es_AR",
  en: "en_US",
} as const satisfies Record<Locale, string>;

export const portfolioSeo = {
  siteName: "Emanuel Marcello",
  socialImage: {
    url: siteAbsoluteUrls.socialImage,
    width: 1200,
    height: 630,
    alt: "Emanuel Marcello — Frontend & Full Stack Developer",
    type: "image/png",
  },
  localized: {
    es: {
      title: "Emanuel Marcello | Frontend & Full Stack Developer",
      description:
        "Portfolio de Emanuel Marcello, desarrollador Frontend y Full Stack. Proyectos web y mobile con React, Angular, TypeScript, Node.js y tecnologías modernas.",
    },
    en: {
      title: "Emanuel Marcello | Frontend & Full Stack Developer",
      description:
        "Portfolio of Emanuel Marcello, Frontend and Full Stack Developer. Web and mobile projects built with React, Angular, TypeScript, Node.js, and modern technologies.",
    },
  },
  root: {
    title: "Emanuel Marcello | Portfolio",
    description:
      "Portfolio of Emanuel Marcello, Frontend and Full Stack Developer.",
  },
} as const satisfies {
  siteName: string;
  socialImage: SocialImageMetadata;
  localized: Record<Locale, SeoMetadata>;
  root: SeoMetadata;
};
