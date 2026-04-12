import { notFound } from "next/navigation";
import CategoryPageContent from "@/components/website/category/CategoryPageContent";
import { PostsList } from "@/components/website/PostsList";
import { categoriesApi, CategoryTypeEnum } from "@/lib/api/categories";
import { postsApi } from "@/lib/api/posts";
import { mapApiProductToCategoryCard } from "@/lib/map-product-category";
import { mapPostToListItem } from "@/lib/map-post-list-item";
import type { Product } from "@/lib/api/products";

interface PageCategoryWrapperProps {
  categoryId: number;
  req: { headers: Record<string, string> };
}

export async function PageCategoryWrapper({
  categoryId,
  req,
}: PageCategoryWrapperProps) {
  const category = await categoriesApi.getByIdFe(categoryId, req).catch(() => null);
  if (!category) notFound();

  if (category.type === CategoryTypeEnum.POST) {
    const res = await postsApi
      .getListFe({ limit: 9, categoryId: category.id }, req)
      .catch(() => null);
    const raw = Array.isArray(res) ? res : (res?.data ?? []);
    const posts = raw.map(mapPostToListItem);

    const breadcrumbItems: { name: string; slug?: string }[] = [];
    if (category.parentId) {
      const parent = await categoriesApi.getById(category.parentId).catch(() => null);
      if (parent) {
        breadcrumbItems.push({ name: parent.name, slug: `/${parent.slug}` });
      }
    }

    return (
      <div className="min-h-screen bg-background">
        <PostsList
          title={category.name}
          posts={posts}
          breadcrumbItems={breadcrumbItems}
        />
      </div>
    );
  }

  const productsResponse = await categoriesApi
    .getProductsByCategoryIdFe(category.id, { page: 1, limit: 12 }, req)
    .catch(() => null);
  const products: Product[] =
    (productsResponse as { data?: Product[] })?.data ??
    (productsResponse as Product[]) ??
    [];

  const transformedProducts = products.map((product) =>
    mapApiProductToCategoryCard(product, category.slug),
  );

  return (
    <CategoryPageContent
      categoryInfo={{ title: category.name, rootSlug: category.slug }}
      descriptionHtml={category.description}
      mockProducts={transformedProducts}
      subCategories={((category.children ?? []) as any[]).map((c: any) => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
        thumbnailUrl: c.thumbnailUrl,
        iconUrl: c.iconUrl,
      }))}
    />
  );
}
