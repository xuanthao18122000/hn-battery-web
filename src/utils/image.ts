const CDN_URL = process.env.NEXT_PUBLIC_CDN_URL || process.env.NEXT_PUBLIC_API_URL || "";

/**
 * Resolve image URL from API (relative path like "files/posts/xxx.png") to full URL.
 * Avoids 404 when browser resolves relative path against current origin (e.g. localhost:3001).
 */
export function getImageUrl(url?: string | null): string {
  if (!url) return "/no-image-available.png";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  const base = CDN_URL.replace(/\/$/, "");
  if (base) return `${base}/${url.replace(/^\//, "")}`;
  return url;
}
