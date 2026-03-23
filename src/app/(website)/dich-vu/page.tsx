import type { Metadata } from "next";
import { siteUrl } from "@/config/site";
import { PostsList } from "@/components/website/PostsList";
import { postsApi, PostTypeEnum } from "@/lib/api/posts";
import { mapPostToListItem } from "@/lib/map-post-list-item";

export const metadata: Metadata = {
  title: "Dịch vụ",
  description:
    "Các dịch vụ về ắc quy, cứu hộ, lắp đặt, bảo hành và tư vấn của chúng tôi",
  keywords:
    "dịch vụ ắc quy, cứu hộ ắc quy, lắp đặt ắc quy, bảo hành ắc quy, tư vấn ắc quy, Ắc Quy HN, acquyhn, Ắc Quy HN Sài Gòn",
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
      <PostsList title="Dịch vụ" posts={posts} />
    </div>
  );
}
