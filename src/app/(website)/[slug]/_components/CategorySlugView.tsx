import { notFound } from "next/navigation";
import CategoryPageContent from "@/components/website/category/CategoryPageContent";
import { categoriesApi, CategoryTypeEnum } from "@/lib/api/categories";
import { postsApi, PostTypeEnum } from "@/lib/api/posts";
import { PostsList } from "@/components/website/PostsList";
import { mapPostToListItem } from "@/lib/map-post-list-item";
import { mapApiProductToCategoryCard } from "@/lib/map-product-category";
import type { Product } from "@/lib/api/products";

type ResolvedCategory = {
  type: number;
  category?: {
    id: number;
    name: string;
    slug: string;
    description?: string;
    parentId?: number | null;
    type?: number;
    children?: unknown[];
  };
  products?: unknown[];
};

/** Gọi từ `page.tsx` sau `await resolveSlug` — không bọc Suspense để tránh nhảy skeleton. */
export async function getCategorySlugElement({
  slug,
  resolved,
  req,
}: {
  slug: string;
  resolved: ResolvedCategory;
  req: { headers: Record<string, string> };
}) {
  try {
    let category = resolved.category;
    const hasChildren =
      category &&
      Array.isArray((category as { children?: unknown[] }).children) &&
      (category as { children?: unknown[] }).children!.length > 0;
    if (!category || !hasChildren) {
      category = await categoriesApi.getBySlug(slug, req);
    }

    if (category!.type === CategoryTypeEnum.POST) {
      let list: ReturnType<typeof mapPostToListItem>[] = [];
      try {
        const res = await postsApi.getListFe({
          limit: 50,
          type: PostTypeEnum.POST,
          categoryId: category!.id,
        });
        let raw = Array.isArray(res) ? res : (res.data ?? []);
        const isRoot =
          category!.parentId == null || category!.parentId === 0;
        if (raw.length === 0 && isRoot) {
          const fallback = await postsApi.getListFe({
            limit: 50,
            type: PostTypeEnum.POST,
          });
          raw = Array.isArray(fallback) ? fallback : (fallback.data ?? []);
        }
        list = raw.map(mapPostToListItem);
      } catch {
        list = [];
      }
      return (
        <div className="min-h-screen bg-background">
          <PostsList title={category!.name} posts={list} />
        </div>
      );
    }

    let products: unknown[] = [];
    if (Array.isArray(resolved.products)) {
      products = resolved.products;
    } else {
      const productsResponse = await categoriesApi.getProductsByCategorySlug(
        slug,
        { page: 1, limit: 50 },
        req,
      );
      products =
        (productsResponse as { data?: unknown[] })?.data ??
        productsResponse ??
        [];
    }

    const transformedProducts = (products as Product[]).map((product) =>
      mapApiProductToCategoryCard(product, category!.slug),
    );

    return (
      <CategoryPageContent
        categoryInfo={{
          title: category!.name,
          rootSlug: category!.slug,
        }}
        descriptionHtml={category!.description}
        mockProducts={transformedProducts}
        subCategories={((category!.children ?? []) as any[]).map((c: any) => ({
          id: c.id,
          name: c.name,
          slug: c.slug,
          thumbnailUrl: c.thumbnailUrl,
          iconUrl: c.iconUrl,
        }))}
      />
    );
  } catch {
    notFound();
  }
}
