import { headers } from "next/headers";
import { postsApi, type Post } from "@/lib/api/posts";
import { getImageUrl } from "@/utils/image";
import {
  ImageTitleCard,
  ViewAllLink,
  stripHtml,
  type ListItem,
} from "./newsBlockShared";

function toListItem(post: Post): ListItem {
  const date = post.publishedAt
    ? new Date(post.publishedAt)
    : new Date(post.createdAt);
  const raw =
    post.shortDescription?.trim() || stripHtml(post.content || "");
  return {
    title: post.title,
    date: date.toLocaleDateString("vi-VN", {
      weekday: "long",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }),
    excerpt: raw.length > 120 ? raw.slice(0, 120) + "..." : raw,
    image: getImageUrl(post.featuredImage),
    href: `/${post.slug}`,
  };
}

interface HomeLatestNewsProps {
  categoryId: number;
  title: string;
  viewAllHref: string;
  sectionId?: string;
}

export async function HomeLatestNews({
  categoryId,
  title,
  viewAllHref,
  sectionId,
}: HomeLatestNewsProps) {
  const headersList = await headers();
  const req = { headers: Object.fromEntries(headersList.entries()) };

  const postsRes = await postsApi
    .getListFe({ limit: 4, categoryId }, req)
    .catch(() => null);

  const posts = Array.isArray(postsRes)
    ? postsRes
    : (postsRes?.data ?? []);

  if (posts.length === 0) return null;

  const items = posts.map(toListItem);

  return (
    <section id={sectionId} className="mb-4">
      <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-sm sm:p-4 md:p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="block-title font-semibold">{title}</h3>
          <ViewAllLink href={viewAllHref} label="Xem tất cả" />
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {items.map((item, index) => (
            <ImageTitleCard key={index} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}
