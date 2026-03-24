import type { LucideIcon } from "lucide-react";
import { Bike, Car, FolderTree, Newspaper, Tags } from "lucide-react";

/** Chuẩn hoá để so khớp tên tiếng Việt không dấu. */
function norm(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Icon Lucide fallback khi category không có `iconUrl` từ API.
 * Khớp theo tên / slug (thứ tự API không cố định).
 */
export function getCategoryFallbackLucideIcon(cat: {
  name: string;
  href?: string;
}): LucideIcon {
  const name = norm(cat.name);
  const href = norm(cat.href ?? "");

  // Mô tô / xe máy — phải trước "ô tô" vì "mo to" chứa "o to"
  if (
    name.includes("mo to") ||
    name.includes("moto") ||
    name.includes("xe may") ||
    href.includes("mo-to") ||
    href.includes("xe-may")
  ) {
    return Bike;
  }

  // Ô tô
  if (name.includes("o to") || name.includes(" oto") || href.includes("o-to")) {
    return Car;
  }

  // Thương hiệu
  if (name.includes("thuong hieu") || href.includes("thuong-hieu")) {
    return Tags;
  }

  // Tin tức / blog
  if (
    name.includes("tin tuc") ||
    name.includes("kinh nghiem") ||
    href.includes("tin-tuc") ||
    href.includes("kinh-nghiem")
  ) {
    return Newspaper;
  }

  return FolderTree;
}
