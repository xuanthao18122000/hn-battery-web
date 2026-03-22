"use client";

import type { Section, SectionItem } from "@/lib/api/sections";
import { ImageTitleCard, ViewAllLink } from "./newsBlockShared";
import { getImageUrl } from "@/utils/image";

function postItemToListItem(item: SectionItem): { title: string; date: string; excerpt: string; image: string; href: string } {
  const post = item.post;
  const title = post?.title ?? `Bài viết #${item.refId}`;
  const slug = post?.slug ?? "";
  const date = post?.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString("vi-VN", {
        weekday: "long",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
    : post?.createdAt
      ? new Date(post.createdAt).toLocaleDateString("vi-VN", {
          weekday: "long",
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        })
      : "";
  const excerpt = post?.content
    ? post.content.replace(/<[^>]*>/g, "").trim().slice(0, 120) + (post.content.length > 120 ? "..." : "")
    : "";
  const image = getImageUrl(post?.featuredImage);
  const href = slug ? `/${slug}` : "#";
  return { title, date, excerpt, image, href };
}

interface HomePostSectionBlockProps {
  section: Section;
}

export function HomePostSectionBlock({ section }: HomePostSectionBlockProps) {
  const postItems = (section.items ?? []).sort((a, b) => a.position - b.position);
  const listItems = postItems.map(postItemToListItem);
  if (listItems.length === 0) return null;

  const viewAllHref = section.code ? `/${section.code}` : "#";

  return (
    <section className="pb-4 bg-gray-100">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="animate-on-scroll fade-in-up bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="block-title">{section.name}</h3>
            <ViewAllLink href={viewAllHref} label="Xem tất cả" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {listItems.map((item, index) => (
              <ImageTitleCard key={item.href + index} item={item} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
