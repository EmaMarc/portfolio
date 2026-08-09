import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PortfolioAtmosphere } from "@/components/visual-effects/portfolio-atmosphere";
import { SiteNavbar } from "@/components/layout/site-navbar";
import { isSupportedLocale, supportedLocales } from "@/lib/locale";
import { fontVariables } from "../fonts";
import "../globals.css";

export const dynamicParams = false;

export const metadata: Metadata = {
  title: "Ema Marc | Portfolio",
  description: "Portfolio profesional de Emanuel Marcello.",
};

export function generateStaticParams() {
  return supportedLocales.map((locale) => ({ locale }));
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
    <html lang={locale} className={`${fontVariables} h-full antialiased`}>
      <body className="relative isolate flex min-h-full flex-col bg-background text-foreground">
        <PortfolioAtmosphere />
        <div className="relative z-10 flex min-h-full flex-1 flex-col">
          <SiteNavbar locale={locale} />
          {children}
        </div>
      </body>
    </html>
  );
}
