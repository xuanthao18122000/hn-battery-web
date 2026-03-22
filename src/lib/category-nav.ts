/**
 * Danh mục có slug `#` = không có trang riêng, không điều hướng khi click.
 */
export function isCategorySlugNoNavigate(slug: string | undefined | null): boolean {
  return slug === "#";
}

/** Breadcrumb / layout dùng href dạng `/${slug}` → `/#` */
export function isCategoryHrefNoNavigate(href: string | undefined | null): boolean {
  if (href == null || href === "") return true;
  return href === "/#" || href === "#";
}
