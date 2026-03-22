"use client";

import { useEffect, useState } from "react";
import { postsApi, Post } from "@/lib/api/posts";
import { stripHtml, ImageTitleCard, ViewAllLink, type ListItem } from "./newsBlockShared";
import { getImageUrl } from "@/utils/image";

const MOCK_EXPERIENCE: ListItem[] = [
  {
    title: "Hiện tượng đoản mạch ắc quy – Khắc phục như thế nào hiệu quả?",
    date: "",
    excerpt: "",
    image: "/no-image-available.png",
    href: "/kinh-nghiem-hay",
  },
  {
    title: "Máy kích điện và bộ lưu điện UPS – Dùng loại nào hiệu quả?",
    date: "",
    excerpt: "",
    image: "/no-image-available.png",
    href: "/kinh-nghiem-hay",
  },
  {
    title: "Dòng khởi động lạnh ắc quy CCA là gì? Vai trò và Đo lường",
    date: "",
    excerpt: "",
    image: "/no-image-available.png",
    href: "/kinh-nghiem-hay",
  },
  {
    title: "Máy kích điện và máy phát điện nên chọn loại nào phù hợp?",
    date: "",
    excerpt: "",
    image: "/no-image-available.png",
    href: "/kinh-nghiem-hay",
  },
];

export const News = () => {
  const [experienceItems, setExperienceItems] = useState<ListItem[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await postsApi.getListFe({ limit: 4 });
        const data = Array.isArray(res) ? res : res.data ?? [];
        const items: ListItem[] = data.map((post: Post) => ({
          title: post.title,
          date: post.publishedAt
            ? new Date(post.publishedAt).toLocaleDateString("vi-VN", { weekday: "long", day: "2-digit", month: "2-digit", year: "numeric" })
            : new Date(post.createdAt).toLocaleDateString("vi-VN", { weekday: "long", day: "2-digit", month: "2-digit", year: "numeric" }),
          excerpt: (() => {
            const raw = post.shortDescription?.trim() || stripHtml(post.content || "");
            return raw.length > 120 ? raw.slice(0, 120) + "..." : raw;
          })(),
          image: getImageUrl(post.featuredImage),
          href: `/${post.slug}`,
        }));
        setExperienceItems(items);
      } catch (err) {
      }
    };
    fetchPosts();
  }, []);

  const experienceList = experienceItems.length > 0 ? experienceItems : MOCK_EXPERIENCE;

  return (
    <section id="news" className="pt-4 pb-12 bg-gray-100">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="animate-on-scroll fade-in-up stagger-1 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="block-title">
              Kinh nghiệm hay
            </h3>
            <ViewAllLink href="/kinh-nghiem-hay" label="Xem tất cả" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {experienceList.slice(0, 4).map((item, index) => (
              <ImageTitleCard key={index} item={item} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
