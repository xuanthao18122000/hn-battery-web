import type { Category } from "@/lib/api/categories";
import { CategoryTypeEnum } from "@/lib/api/categories";

/** Duyệt cây danh mục (depth-first). */
export function walkCategories(
  nodes: Category[] | undefined,
  visit: (c: Category) => void,
): void {
  if (!nodes?.length) return;
  for (const n of nodes) {
    visit(n);
    if (n.children?.length) walkCategories(n.children, visit);
  }
}

/** Slug danh mục loại POST “ưu tiên” (level thấp nhất, position nhỏ nhất) — link “Xem tất cả”. */
export function findPrimaryPostCategorySlug(
  roots: Category[] | undefined,
): string | null {
  if (!roots?.length) return null;
  let bestSlug: string | null = null;
  let bestLevel = Infinity;
  let bestPosition = Infinity;
  walkCategories(roots, (c) => {
    if (c.type !== CategoryTypeEnum.POST || !c.slug) return;
    const lv = c.level ?? 0;
    const pos = c.position ?? 0;
    if (
      lv < bestLevel ||
      (lv === bestLevel && pos < bestPosition)
    ) {
      bestLevel = lv;
      bestPosition = pos;
      bestSlug = c.slug;
    }
  });
  return bestSlug;
}

/** Mọi slug danh mục POST (cho sitemap). */
export function collectPostCategorySlugs(roots: Category[] | undefined): string[] {
  const out: string[] = [];
  walkCategories(roots, (c) => {
    if (c.type === CategoryTypeEnum.POST && c.slug) out.push(c.slug);
  });
  return [...new Set(out)];
}
