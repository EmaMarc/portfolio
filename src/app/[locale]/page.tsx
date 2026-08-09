import { notFound } from "next/navigation";
import { PortfolioHome } from "@/components/sections/portfolio-home";
import { isSupportedLocale } from "@/lib/locale";

export default async function LocalizedHomePage({
  params,
}: Readonly<{
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  if (!isSupportedLocale(locale)) {
    notFound();
  }

  return <PortfolioHome locale={locale} />;
}
