"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { PostImage } from "./PostImage";

export interface ListItem {
  title: string;
  date: string;
  excerpt: string;
  image: string;
  href: string;
}

export function stripHtml(html: string): string {
  if (!html) return "";
  const plain = html.replace(/<[^>]*>/g, "").trim();
  return plain.slice(0, 120) + (plain.length > 120 ? "..." : "");
}

export function ImageTitleCard({ item }: { item: ListItem }) {
  const description = item.excerpt?.trim();
  return (
    <Link
      href={item.href}
      className="group block bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md hover:border-gray-300 transition-all"
    >
      <div className="aspect-video w-full overflow-hidden bg-gray-100">
        <PostImage
          src={item.image}
          alt={item.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-3 md:p-4">
        <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-2 text-sm md:text-base">
          {item.title}
        </h3>
        {description && (
          <p className="mt-1 text-xs text-gray-500 line-clamp-2 break-words">
            {description.length > 120 ? description.slice(0, 120).trim() + "..." : description}
          </p>
        )}
      </div>
    </Link>
  );
}

export function ViewAllLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-1 text-primary-600 hover:text-primary-700 text-sm font-medium"
    >
      {label}
      <ChevronRight className="w-4 h-4" />
    </Link>
  );
}
