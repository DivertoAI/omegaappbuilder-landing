import type { MetadataRoute } from "next";

const base = process.env.NEXT_PUBLIC_SITE_URL || "https://omegaappbuilder.com";

const now = new Date();

const routes: Array<{ path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] }> = [
  { path: "/", priority: 1.0, changeFrequency: "weekly" },
  { path: "/ai", priority: 0.9, changeFrequency: "weekly" },
  { path: "/pricing", priority: 0.9, changeFrequency: "monthly" },
  { path: "/workflow", priority: 0.8, changeFrequency: "monthly" },
  { path: "/voice-ai", priority: 0.8, changeFrequency: "monthly" },
  { path: "/omegareceptionist", priority: 0.8, changeFrequency: "monthly" },
  { path: "/omega-reach", priority: 0.8, changeFrequency: "monthly" },
  { path: "/omega-chat-api", priority: 0.8, changeFrequency: "monthly" },
  { path: "/about", priority: 0.6, changeFrequency: "monthly" },
  { path: "/contact", priority: 0.6, changeFrequency: "monthly" },
  { path: "/omega-reach/whatsapp", priority: 0.5, changeFrequency: "monthly" },
  { path: "/pay", priority: 0.4, changeFrequency: "monthly" },
  { path: "/legal/privacy", priority: 0.3, changeFrequency: "yearly" },
  { path: "/legal/terms", priority: 0.3, changeFrequency: "yearly" },
  { path: "/legal/refunds", priority: 0.3, changeFrequency: "yearly" },
  { path: "/legal/shipping", priority: 0.3, changeFrequency: "yearly" },
  { path: "/legal/contact", priority: 0.3, changeFrequency: "yearly" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map(({ path, priority, changeFrequency }) => ({
    url: `${base}${path}`,
    lastModified: now,
    changeFrequency,
    priority,
  }));
}
