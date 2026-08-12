import type { Metadata } from "next";
import { portfolioSeo } from "@/content/portfolio";
import { siteAbsoluteUrls, siteLanguageAlternates, siteUrl } from "@/lib/site-url";
import { fontVariables } from "../fonts";
import "../globals.css";

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: portfolioSeo.root.title,
  description: portfolioSeo.root.description,
  alternates: {
    canonical: siteAbsoluteUrls.root,
    languages: siteLanguageAlternates,
  },
  openGraph: {
    title: portfolioSeo.root.title,
    description: portfolioSeo.root.description,
    type: "website",
    url: siteAbsoluteUrls.root,
    siteName: portfolioSeo.siteName,
    images: [portfolioSeo.socialImage],
  },
  twitter: {
    card: "summary_large_image",
    title: portfolioSeo.root.title,
    description: portfolioSeo.root.description,
    images: [portfolioSeo.socialImage],
  },
};

export default function RootRedirectLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${fontVariables} h-full antialiased`}>
      <body className="min-h-full bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
