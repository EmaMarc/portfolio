import type { MetadataRoute } from "next";
import { siteAbsoluteUrls } from "@/lib/site-url";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: siteAbsoluteUrls.sitemap,
  };
}
