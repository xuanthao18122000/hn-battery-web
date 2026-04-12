import type { Metadata } from "next";
import { siteUrl } from "@/config/site";
import { PostsList } from "@/components/website/PostsList";
import { postsApi } from "@/lib/api/posts";
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

interface DichVuPageProps {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

const POSTS_PER_PAGE = 9;

export default async function DichVuPage({ searchParams }: DichVuPageProps) {
  const sp = (await searchParams) ?? {};
  const pageParam = Array.isArray(sp.page) ? sp.page[0] : sp.page;
  const currentPage = Math.max(1, Number(pageParam) || 1);

  let posts: ReturnType<typeof mapPostToListItem>[] = [];
  let totalPages = 1;
  try {
    const res = await postsApi.getListFe({
      page: currentPage,
      limit: POSTS_PER_PAGE,
    });
    const raw = Array.isArray(res) ? res : (res.data ?? []);
    posts = raw.map(mapPostToListItem);
    if (!Array.isArray(res) && res.totalPages) {
      totalPages = res.totalPages;
    }
  } catch {
    posts = [];
  }

  return (
    <div className="min-h-screen bg-background">
      <PostsList
        title="Dịch vụ"
        posts={posts}
        breadcrumbItems={[]}
        currentPage={currentPage}
        totalPages={totalPages}
        basePath="/dich-vu"
      />
    </div>
  );
}
