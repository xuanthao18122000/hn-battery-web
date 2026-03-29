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
    <section className="mb-4">
      <div className="animate-on-scroll fade-in-up rounded border border-gray-200 bg-white p-2.5 shadow-sm sm:p-4 md:p-6">
        <div className="mb-4 flex flex-col gap-3 border-b border-gray-200 pb-3 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="block-title text-gray-900">{section.name}</h3>
          <ViewAllLink href={viewAllHref} label="Xem tất cả" />
        </div>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
            {listItems.map((item, index) => (
              <ImageTitleCard key={item.href + index} item={item} />
            ))}
        </div>
      </div>
    </section>
  );
}
