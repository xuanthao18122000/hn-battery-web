import { siteUrl, apiUrl } from "@/config/site";
import type { Category } from "@/lib/api/categories";
import { CategoryTypeEnum } from "@/lib/api/categories";
import { collectPostCategorySlugs, walkCategories } from "@/lib/post-category";

/** ISR cho sitemap — revalidate mỗi giờ. */
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

function normalizeListPayload<T>(body: unknown): {
  data: T[];
  totalPages: number;
} {
  if (!body || typeof body !== "object") return { data: [], totalPages: 1 };
  const b = body as Record<string, unknown>;
  const inner = (b.data ?? b) as Record<string, unknown>;
  if (Array.isArray(inner)) return { data: inner as T[], totalPages: 1 };
  const data = Array.isArray(inner.data) ? (inner.data as T[]) : [];
  const totalPages =
    typeof inner.totalPages === "number" ? inner.totalPages : 1;
  return { data, totalPages };
}

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
    const res = await fetch(`${apiUrl}/fe/categories/tree`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    const json = await res.json();
    return normalizeTreePayload(json);
  } catch {
    return [];
  }
}

type SitemapItem = { slug: string; updatedAt?: string };

async function fetchAllPosts(): Promise<SitemapItem[]> {
  const out: SitemapItem[] = [];
  const limit = 100;
  let page = 1;
  let totalPages = 1;
  try {
    do {
      const res = await fetch(
        `${apiUrl}/fe/posts?page=${page}&limit=${limit}`,
        { next: { revalidate: 3600 } },
      );
      if (!res.ok) break;
      const json = await res.json();
      const { data, totalPages: tp } = normalizeListPayload<{
        slug: string;
        updatedAt?: string;
        publishedAt?: string;
        createdAt?: string;
      }>(json);
      for (const p of data) {
        if (p?.slug) {
          out.push({
            slug: p.slug,
            updatedAt: p.updatedAt || p.publishedAt || p.createdAt,
          });
        }
      }
      totalPages = tp;
      page += 1;
    } while (page <= totalPages && page <= 50);
  } catch {
    /* ignore */
  }
  return out;
}

async function fetchAllProducts(roots: Category[]): Promise<SitemapItem[]> {
  const productCategoryIds: number[] = [];
  walkCategories(roots, (c) => {
    if (c.type === CategoryTypeEnum.CATEGORY && !c.children?.length) {
      productCategoryIds.push(c.id);
    }
  });

  const seen = new Map<string, string | undefined>();
  const limit = 100;
  for (const categoryId of productCategoryIds) {
    let page = 1;
    let totalPages = 1;
    try {
      do {
        const res = await fetch(
          `${apiUrl}/fe/categories/${categoryId}/products?page=${page}&limit=${limit}`,
          { next: { revalidate: 3600 } },
        );
        if (!res.ok) break;
        const json = await res.json();
        const { data, totalPages: tp } = normalizeListPayload<{
          slug: string;
          updatedAt?: string;
          createdAt?: string;
        }>(json);
        for (const p of data) {
          if (p?.slug && !seen.has(p.slug)) {
            seen.set(p.slug, p.updatedAt || p.createdAt);
          }
        }
        totalPages = tp;
        page += 1;
      } while (page <= totalPages && page <= 50);
    } catch {
      /* ignore this category, continue others */
    }
  }
  return Array.from(seen.entries()).map(([slug, updatedAt]) => ({
    slug,
    updatedAt,
  }));
}

function collectAllCategorySlugs(roots: Category[] | undefined): string[] {
  const out: string[] = [];
  walkCategories(roots, (c) => {
    if (c.slug) out.push(c.slug);
  });
  return [...new Set(out)];
}

export default async function sitemap(): Promise<SitemapEntry[]> {
  const tree = await fetchCategoryTree();
  const postSectionSlugs = collectPostCategorySlugs(tree);
  const allCategorySlugs = collectAllCategorySlugs(tree);
  const productCategorySlugs = allCategorySlugs.filter(
    (s) => !postSectionSlugs.includes(s),
  );

  const [posts, products] = await Promise.all([
    fetchAllPosts(),
    fetchAllProducts(tree),
  ]);

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

  const productCategoryEntries: SitemapEntry[] = productCategorySlugs.map(
    (slug) => ({
      url: `${siteUrl}/${slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }),
  );

  const postEntries: SitemapEntry[] = posts.map(({ slug, updatedAt }) => ({
    url: `${siteUrl}/${slug}`,
    lastModified: updatedAt ? new Date(updatedAt) : new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const productEntries: SitemapEntry[] = products.map(
    ({ slug, updatedAt }) => ({
      url: `${siteUrl}/${slug}`,
      lastModified: updatedAt ? new Date(updatedAt) : new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }),
  );

  return [
    ...staticEntries,
    ...postSectionEntries,
    ...productCategoryEntries,
    ...postEntries,
    ...productEntries,
  ];
}
