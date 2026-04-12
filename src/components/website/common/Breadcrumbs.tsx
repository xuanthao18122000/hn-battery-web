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
    <nav
      aria-label="Breadcrumb"
      className="py-4 overflow-x-auto scrollbar-hide [-webkit-overflow-scrolling:touch] overscroll-x-contain"
    >
      <div className="flex w-max flex-nowrap items-center gap-2 whitespace-nowrap text-sm text-gray-600">
        <Link href="/" className="shrink-0 hover:text-primary transition-colors">
          Trang chủ
        </Link>
        {items.map((item, index) => (
          <React.Fragment key={index}>
            <ChevronRight size={ICON_SIZE.sm} className="shrink-0" />
            {item.slug && !isCategoryHrefNoNavigate(item.slug) ? (
              <Link
                href={item.slug}
                className="shrink-0 hover:text-primary transition-colors"
              >
                {item.name}
              </Link>
            ) : (
              <span className="shrink-0">{item.name}</span>
            )}
          </React.Fragment>
        ))}
        <ChevronRight size={ICON_SIZE.sm} className="shrink-0" />
        <span className="shrink-0 font-semibold text-gray-900">
          {currentPage}
        </span>
      </div>
    </nav>
  );
};

