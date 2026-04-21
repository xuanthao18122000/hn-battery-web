import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { resolveApi, SlugTypeEnum } from "@/lib/api/resolve";
import { PageCategoryWrapper } from "./_components/PageCategoryWrapper";
import { PageProductWrapper } from "./_components/PageProductWrapper";
import { PagePostWrapper } from "./_components/PagePostWrapper";

interface SlugPageProps {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

const STATIC_EXT =
  /\.(png|ico|jpg|jpeg|webp|svg|gif|css|js|json|xml|txt|woff2?|ttf|eot)$/i;

/**
 * Catch-all Slug Resolver — 2-Step Flow
 *
 * Step 1: GET /fe/resolve/slug/:slug → lightweight { type, entityId, meta }
 * Step 2: Dispatch to specialized wrapper that fetches full data by id.
 */
export default async function SlugPage({ params, searchParams }: SlugPageProps) {
  const { slug: rawSlug } = await params;
  const slug = rawSlug.replace(/\.(html?)$/i, "");

  if (STATIC_EXT.test(slug)) notFound();

  const sp = (await searchParams) ?? {};
  const pageParam = Array.isArray(sp.page) ? sp.page[0] : sp.page;
  const currentPage = Math.max(1, Number(pageParam) || 1);

  const headersList = await headers();
  const req = { headers: Object.fromEntries(headersList.entries()) };

  const fromCategoryCookie = (() => {
    const m = (headersList.get("cookie") ?? "").match(
      /(?:^|;\s*)fromCategory=([^;]*)/,
    );
    if (!m) return undefined;
    try {
      return decodeURIComponent(m[1]);
    } catch {
      return m[1];
    }
  })();

  const resolved = await resolveApi.resolveSlug(slug, req).catch(() => null);
  if (!resolved?.entityId) notFound();

  switch (resolved.type) {
    case SlugTypeEnum.CATEGORY:
      return (
        <PageCategoryWrapper
          categoryId={resolved.entityId}
          req={req}
          currentPage={currentPage}
        />
      );

    case SlugTypeEnum.PRODUCT:
      return (
        <PageProductWrapper
          productId={resolved.entityId}
          req={req}
          fromCategoryCookie={fromCategoryCookie}
        />
      );

    case SlugTypeEnum.POST:
      return <PagePostWrapper postId={resolved.entityId} req={req} />;

    default:
      notFound();
  }
}
