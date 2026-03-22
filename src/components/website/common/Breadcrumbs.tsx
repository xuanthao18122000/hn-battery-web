"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { ICON_SIZE } from "@/lib/icons";
import { isCategoryHrefNoNavigate } from "@/lib/category-nav";

interface BreadcrumbItem {
  name: string;
  slug?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  currentPage: string;
}

export const Breadcrumbs = ({ items, currentPage }: BreadcrumbsProps) => {
  return (
    <nav className="flex items-center gap-2 text-sm text-gray-600 py-2 pb-6">
      <Link href="/" className="hover:text-primary transition-colors">
        Trang chủ
      </Link>
      {items.map((item, index) => (
        <React.Fragment key={index}>
          <ChevronRight size={ICON_SIZE.sm} />
          {item.slug && !isCategoryHrefNoNavigate(item.slug) ? (
            <Link
              href={item.slug}
              className="hover:text-primary transition-colors"
            >
              {item.name}
            </Link>
          ) : (
            <span>{item.name}</span>
          )}
        </React.Fragment>
      ))}
      <ChevronRight size={ICON_SIZE.sm} />
      <span className="text-gray-900 font-semibold">{currentPage}</span>
    </nav>
  );
};

