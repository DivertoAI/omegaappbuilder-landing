import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://omegaappbuilder.com";
  const routes = [
    "/",
    "/about",
    "/ai",
    "/dental-ai",
    "/pay",
    "/legal/privacy",
    "/legal/terms",
    "/legal/refunds",
    "/legal/shipping",
    "/legal/contact",
  ];

  const now = new Date().toISOString();

  return routes.map((path) => ({
    url: `${base}${path}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: path === "/" ? 1 : 0.5,
  }));
}
