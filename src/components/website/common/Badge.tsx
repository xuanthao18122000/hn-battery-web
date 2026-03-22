"use client";

import type React from "react";

interface BadgeProps {
  children?: React.ReactNode;
  className?: string;
}

/** Badge offer (hiển thị nhanh ưu đãi / % giảm giá) */
export function BadgeOffer({ children, className = "" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-1 py-0.5 rounded-xs text-xxs font-normal bg-gray-200 text-gray-900 ${className}`}
    >
      {children}
    </span>
  );
}

/** Badge "Mới về" */
export function BadgeNew({ children = "Mới về", className = "" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-1 py-0.5 rounded-xs text-xxs font-normal bg-primary-100 text-red-500 ${className}`}
    >
      {children}
    </span>
  );
}

/** Badge "Online giá sốc" */
export function BadgeOnline({
  children = "Online giá sốc",
  className = "",
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-1 py-0.5 rounded-xs text-xs font-medium bg-blue-50 text-blue-600 ${className}`}
    >
      {children}
    </span>
  );
}

/** Badge countdown "Còn 04 ngày 04:25:54" */
export function BadgeHotSale({ children, className = "" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0 rounded-full text-xxs font-medium bg-red-50 text-red-500 ${className}`}
    >
      <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
      {children}
    </span>
  );
}

/** Offer link "+2 ưu đãi cho bạn" */
export function BadgeOfferLink({ children, className = "" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-1 rounded-xs text-xs font-medium bg-yellow-100 text-gray-900 cursor-pointer hover:bg-yellow-400/30 transition-colors ${className}`}
    >
      {children}
      <svg
        aria-hidden="true"
        width="12"
        height="12"
        viewBox="0 0 12 12"
        fill="none"
        className="text-gray-500"
      >
        <path
          d="M4.5 2.5L8 6L4.5 9.5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}
