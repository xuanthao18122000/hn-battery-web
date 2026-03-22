import { cache } from "react";
import { categoriesApi, Category } from "@/lib/api/categories";
import type { CategoryItem } from "@/components/website/layout/Header";
import { isCategorySlugNoNavigate } from "@/lib/category-nav";

export const getCachedCategoriesTree = cache(
  async (req: { headers: Record<string, string> }): Promise<CategoryItem[]> => {
    let apiCategories: CategoryItem[] = [];
    try {
      const response = await categoriesApi.getTree({ status: 1, getFull: true }, req);
      let treeData: Category[] = [];
      if (Array.isArray(response)) {
        treeData = response;
      } else if (response && typeof response === "object" && "data" in response) {
        treeData = (response as any).data || [];
      }
      const mapNode = (cat: Category): NonNullable<CategoryItem["subCategories"]>[number] => {
        const noNav = isCategorySlugNoNavigate(cat.slug);
        return {
          id: cat.id,
          name: cat.name,
          href: noNav ? "" : `/${cat.slug}`,
          disableLink: noNav,
          children: (cat.children ?? [])
            .filter((c) => c && c.name && c.slug)
            .map(mapNode),
        };
      };

      apiCategories = treeData
        .filter((cat: Category) => cat && cat.name && cat.slug)
        .map((cat: Category) => {
          const noNav = isCategorySlugNoNavigate(cat.slug);
          return {
            id: cat.id,
            name: cat.name,
            href: noNav ? "" : `/${cat.slug}`,
            disableLink: noNav,
            iconUrl: cat.iconUrl || undefined,
            subCategories: (cat.children ?? [])
              .filter((c) => c && c.name && c.slug)
              .map(mapNode),
          };
        });
    } catch (e) {
      // intentionally ignore
    }
    return apiCategories;
  }
);
