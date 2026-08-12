import type { MetadataRoute } from "next";
import { siteAbsoluteUrls, siteLanguageAlternates } from "@/lib/site-url";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: siteAbsoluteUrls.localized.es,
      alternates: {
        languages: siteLanguageAlternates,
      },
    },
    {
      url: siteAbsoluteUrls.localized.en,
      alternates: {
        languages: siteLanguageAlternates,
      },
    },
  ];
}
