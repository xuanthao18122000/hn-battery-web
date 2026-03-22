import type { Metadata } from "next";
import { siteUrl } from "@/config/site";
import { PostsList } from "@/components/website/PostsList";
import { postsApi, PostTypeEnum } from "@/lib/api/posts";
import { getImageUrl } from "@/utils/image";

export const metadata: Metadata = {
  title: "Dịch vụ",
  description:
    "Các dịch vụ về ắc quy, cứu hộ, lắp đặt, bảo hành và tư vấn của chúng tôi",
  keywords:
    "dịch vụ ắc quy, cứu hộ ắc quy, lắp đặt ắc quy, bảo hành ắc quy, tư vấn ắc quy",
  alternates: {
    canonical: `${siteUrl}/dich-vu`,
  },
  openGraph: {
    title: "Dịch vụ",
    description:
      "Các dịch vụ về ắc quy, cứu hộ, lắp đặt, bảo hành và tư vấn",
    url: `${siteUrl}/dich-vu`,
    images: ["/og-image.jpg"],
  },
};

function mapPostToListItem(p: {
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
  const fromContent = p.content ? plain(p.content).slice(0, 200) + (plain(p.content).length > 200 ? "..." : "") : "";
  const excerpt = p.shortDescription?.trim() || fromContent || undefined;
  return {
    id: String(p.id),
    title: p.title,
    slug: p.slug,
    shortDescription: p.shortDescription?.trim() || undefined,
    excerpt: excerpt || undefined,
    thumbnail: getImageUrl(p.featuredImage),
    category: typeof p.category === "object" && p.category?.name ? p.category.name : (p as any).category,
    author: p.author?.fullName,
    publishedAt: p.publishedAt ? new Date(p.publishedAt) : new Date(p.createdAt),
    status: "PUBLISHED",
  };
}

export default async function DichVuPage() {
  let posts: { id: string; title: string; slug: string; excerpt?: string; thumbnail: string; category?: string; author?: string; publishedAt: Date; status: string }[] = [];
  try {
    const res = await postsApi.getListFe({ limit: 50, type: PostTypeEnum.SERVICE });
    const raw = Array.isArray(res) ? res : (res.data ?? []);
    posts = raw.map(mapPostToListItem);
  } catch {
    posts = [];
  }

  return (
    <div className="min-h-screen bg-background">
      <PostsList title="Dịch vụ" posts={posts} basePath="/dich-vu" />
    </div>
  );
}
