/** Pull zone hiển thị ảnh — không dùng NEXT_PUBLIC_API_URL (không phải CDN). */
const CDN_URL =
  process.env.NEXT_PUBLIC_CDN_URL?.trim() || "https://cdn-v2.didongviet.vn";

/**
 * Resolve image URL from API (relative path like "files/posts/xxx.png") to full URL.
 * Nếu đã là absolute (http/https) hoặc protocol-relative — giữ/ghép đúng, không nối thêm CDN.
 */
export function getImageUrl(url?: string | null): string {
  if (url == null) return "/no-image-available.png";
  const u = String(url).trim();
  if (!u) return "/no-image-available.png";
  if (u.startsWith("http://") || u.startsWith("https://")) return u;
  if (u.startsWith("//")) return `https:${u}`;
  if (u.startsWith("data:")) return u;
  const base = CDN_URL.replace(/\/$/, "");
  if (base) return `${base}/${u.replace(/^\//, "")}`;
  return u;
}
