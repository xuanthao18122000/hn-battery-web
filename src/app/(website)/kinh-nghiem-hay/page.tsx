import type { Metadata } from "next";
import { siteUrl } from "@/config/site";
import { PostsList } from "@/components/website/PostsList";
import { postsApi, PostTypeEnum } from "@/lib/api/posts";
import { getImageUrl } from "@/utils/image";

export const metadata: Metadata = {
  title: "Kinh nghiệm hay",
  description:
    "Cập nhật tin tức, dự án mới, kiến thức và hoạt động của Ắc quy Trung Nguyên.",
  keywords:
    "tin tức ắc quy, kinh nghiệm ắc quy, blog ắc quy, kiến thức ắc quy, ắc quy Trung Nguyên",
  alternates: {
    canonical: `${siteUrl}/kinh-nghiem-hay`,
  },
  openGraph: {
    title: "Kinh nghiệm hay",
    description:
      "Cập nhật tin tức mới nhất về các dự án và hoạt động của Ắc quy Trung Nguyên",
    url: `${siteUrl}/kinh-nghiem-hay`,
    images: ["/og-image.jpg"],
  },
};

/** Map API Post -> PostsList item (id string, thumbnail, author, publishedAt Date). */
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
    excerpt: excerpt,
    thumbnail: getImageUrl(p.featuredImage),
    category: typeof p.category === "object" && p.category?.name ? p.category.name : (p as any).category,
    author: p.author?.fullName,
    publishedAt: p.publishedAt ? new Date(p.publishedAt) : new Date(p.createdAt),
    status: "PUBLISHED",
  };
}

export default async function PostsPage() {
  let list: { id: string; title: string; slug: string; excerpt?: string; thumbnail: string; category?: string; author?: string; publishedAt: Date; status: string }[] = [];
  try {
    const res = await postsApi.getListFe({ limit: 20, type: PostTypeEnum.POST });
    const raw = Array.isArray(res) ? res : (res.data ?? []);
    list = raw.map(mapPostToListItem);
  } catch {
    list = [];
  }

  return (
    <div className="min-h-screen bg-background">
      <PostsList
        title="Kinh nghiệm hay"
        posts={list}
        basePath="/kinh-nghiem-hay"
      />
    </div>
  );
}
