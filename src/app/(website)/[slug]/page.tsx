import type { ReactElement } from "react";
import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { resolveApi, SlugTypeEnum } from "@/lib/api/resolve";
import { getCategorySlugElement } from "./_components/CategorySlugView";
import { getProductSlugElement } from "./_components/ProductSlugView";
import { getPostArticleSlugElement } from "./_components/PostArticleSlugView";

interface SlugPageProps {
  params: Promise<{
    slug: string;
  }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

const STATIC_EXT = /\.(png|ico|jpg|jpeg|webp|svg|gif|css|js|json|xml|txt|woff2?|ttf|eot)$/i;
function looksLikeStaticFile(s: string) {
  return STATIC_EXT.test(s);
}

/**
 * Một request duy nhất: await resolveSlug → await fetch theo type → render.
 * Không dùng route `loading.tsx` và không bọc Suspense quanh từng view
 * (tránh stream fallback sai / nhảy skeleton category → product).
 */
export default async function SlugPage({ params }: SlugPageProps) {
  const { slug: rawSlug } = await params;
  const headersList = await headers();
  const cookieHeader = headersList.get("cookie") ?? "";
  const fromCategoryCookie = (() => {
    const m = cookieHeader.match(/(?:^|;\s*)fromCategory=([^;]*)/);
    if (!m) return undefined;
    try {
      return decodeURIComponent(m[1]);
    } catch {
      return m[1];
    }
  })();

  const slug = rawSlug.replace(/\.(html?)$/i, "");

  if (looksLikeStaticFile(slug)) {
    notFound();
  }

  const req = {
    headers: Object.fromEntries(headersList.entries()),
  };

  let resolved: Awaited<ReturnType<typeof resolveApi.resolveSlug>>;
  try {
    resolved = await resolveApi.resolveSlug(slug, req);
  } catch {
    notFound();
  }

  if (resolved.type === SlugTypeEnum.CATEGORY) {
    return (await getCategorySlugElement({
      slug,
      resolved,
      req,
    })) as ReactElement;
  }

  if (resolved.type === SlugTypeEnum.POST) {
    return (await getPostArticleSlugElement({ slug, req })) as ReactElement;
  }

  if (resolved.type === SlugTypeEnum.PRODUCT) {
    return (await getProductSlugElement({
      slug,
      req,
      fromCategoryCookie,
    })) as ReactElement;
  }

  if (resolved.type === SlugTypeEnum.VEHICLE) {
    notFound();
  }

  notFound();
}
