import { getImageUrl } from "@/utils/image";

/** Map API Post → item cho PostsList / News (client & server). */
export function mapPostToListItem(p: {
  id: number;
  title: string;
  slug: string;
  content?: string;
  shortDescription?: string;
  featuredImage?: string;
  category?: { id: number; name: string; slug: string };
  author?: { fullName?: string };
  publishedAt?: string;
  createdAt: string;
}) {
  const plain = (s: string) => s?.replace(/<[^>]*>/g, "").trim() || "";
  const fromContent = p.content
    ? plain(p.content).slice(0, 200) +
      (plain(p.content).length > 200 ? "..." : "")
    : "";
  const excerpt = p.shortDescription?.trim() || fromContent || undefined;
  return {
    id: String(p.id),
    title: p.title,
    slug: p.slug,
    shortDescription: p.shortDescription?.trim() || undefined,
    excerpt: excerpt || undefined,
    thumbnail: p.featuredImage ? getImageUrl(p.featuredImage) : "",
    category:
      typeof p.category === "object" && p.category?.name
        ? p.category.name
        : (p as { category?: string }).category,
    author: p.author?.fullName,
    publishedAt: p.publishedAt
      ? new Date(p.publishedAt)
      : new Date(p.createdAt),
    status: "PUBLISHED",
  };
}
