import type { MetadataRoute } from "next";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://dev-nexus-academy.vercel.app";

const routes = [
  "",
  "/courses",
  "/books",
  "/articles",
  "/roadmaps",
  "/about",
  "/account",
  "/faq",
  "/contact",
  "/content-policy",
  "/accessibility",
  "/privacy",
  "/terms",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return routes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: now,
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : route.startsWith("/courses") ? 0.9 : 0.7,
  }));
}
