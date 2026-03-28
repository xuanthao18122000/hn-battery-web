import { siteUrl, apiUrl } from "@/config/site";
import type { Category } from "@/lib/api/categories";
import { collectPostCategorySlugs } from "@/lib/post-category";

/** ISR cho sitemap (tree danh mục POST). */
export const revalidate = 3600;

type SitemapEntry = {
  url: string;
  lastModified?: Date | string;
  changeFrequency?:
    | "always"
    | "hourly"
    | "daily"
    | "weekly"
    | "monthly"
    | "yearly"
    | "never";
  priority?: number;
};

function normalizeTreePayload(body: unknown): Category[] {
  if (!body || typeof body !== "object") return [];
  const b = body as Record<string, unknown>;
  const inner = b.data;
  if (Array.isArray(inner)) return inner as Category[];
  if (inner && typeof inner === "object") {
    const d = (inner as Record<string, unknown>).data;
    if (Array.isArray(d)) return d as Category[];
  }
  return [];
}

async function fetchCategoryTree(): Promise<Category[]> {
  try {
    const res = await fetch(`${apiUrl}/fe/categories/tree`);
    if (!res.ok) return [];
    const json = await res.json();
    return normalizeTreePayload(json);
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<SitemapEntry[]> {
  const tree = await fetchCategoryTree();
  const postSectionSlugs = collectPostCategorySlugs(tree);

  const staticEntries: SitemapEntry[] = [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${siteUrl}/dich-vu`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${siteUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${siteUrl}/dieu-khoan-dich-vu`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.4,
    },
    {
      url: `${siteUrl}/faq`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${siteUrl}/chinh-sach-thanh-toan`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.4,
    },
    {
      url: `${siteUrl}/chinh-sach-bao-hanh`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.4,
    },
    {
      url: `${siteUrl}/chinh-sach-van-chuyen`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.4,
    },
    {
      url: `${siteUrl}/chinh-sach-doi-tra`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.4,
    },
    {
      url: `${siteUrl}/chinh-sach-khieu-nai`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.4,
    },
    {
      url: `${siteUrl}/chinh-sach-bao-mat`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.4,
    },
  ];

  const postSectionEntries: SitemapEntry[] = postSectionSlugs.map((slug) => ({
    url: `${siteUrl}/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [...staticEntries, ...postSectionEntries];
}
