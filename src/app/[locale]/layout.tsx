import type { Metadata } from "next";
import { notFound } from "next/navigation";
import "lenis/dist/lenis.css";
import { SiteNavbar } from "@/components/layout/site-navbar";
import { SmoothScroll } from "@/components/layout/smooth-scroll";
import { LycorisAtmosphere } from "@/components/visual-effects/lycoris-atmosphere";
import { PortfolioAtmosphere } from "@/components/visual-effects/portfolio-atmosphere";
import { ogLocales, portfolioSeo } from "@/content/portfolio";
import type { Locale } from "@/content/portfolio";
import { isSupportedLocale, supportedLocales } from "@/lib/locale";
import {
  getLocaleSiteUrl,
  siteLanguageAlternates,
  siteUrl,
} from "@/lib/site-url";
import { fontVariables } from "../fonts";
import "../globals.css";

export const dynamicParams = false;

export function generateStaticParams() {
  return supportedLocales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: Readonly<{
  params: Promise<{ locale: string }>;
}>): Promise<Metadata> {
  const { locale } = await params;

  if (!isSupportedLocale(locale)) {
    notFound();
  }

  const seo = portfolioSeo.localized[locale];
  const localeUrl = getLocaleSiteUrl(locale);
  const alternateLocale = supportedLocales.find(
    (supportedLocale) => supportedLocale !== locale,
  ) as Locale;

  return {
    metadataBase: siteUrl,
    ...seo,
    alternates: {
      canonical: localeUrl,
      languages: siteLanguageAlternates,
    },
    openGraph: {
      title: seo.title,
      description: seo.description,
      type: "website",
      url: localeUrl,
      siteName: portfolioSeo.siteName,
      locale: ogLocales[locale],
      alternateLocale: ogLocales[alternateLocale],
      images: [portfolioSeo.socialImage],
    },
    twitter: {
      card: "summary_large_image",
      title: seo.title,
      description: seo.description,
      images: [portfolioSeo.socialImage],
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  if (!isSupportedLocale(locale)) {
    notFound();
  }

  return (
    <html
      lang={locale}
      data-scroll-behavior="smooth"
      className={`${fontVariables} h-full antialiased`}
    >
      <body className="relative isolate flex min-h-full flex-col bg-background text-foreground">
        <PortfolioAtmosphere />
        <LycorisAtmosphere />
        <SmoothScroll />
        <div className="relative z-10 flex min-h-full flex-1 flex-col">
          <SiteNavbar locale={locale} />
          {children}
        </div>
      </body>
    </html>
  );
}
