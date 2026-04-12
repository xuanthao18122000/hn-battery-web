"use client";

import { useState } from "react";

const DEFAULT_POST_IMAGE = "/logo.jpg";

interface PostImageProps {
  src?: string | null;
  alt: string;
  className?: string;
  /** Class áp dụng khi đang hiển thị fallback (vd: object-contain, p-6) */
  fallbackClassName?: string;
}

export function PostImage({
  src,
  alt,
  className,
  fallbackClassName = "object-contain p-6 bg-white",
}: PostImageProps) {
  const initialIsFallback = !src;
  const [isFallback, setIsFallback] = useState(initialIsFallback);

  return (
    <img
      src={src || DEFAULT_POST_IMAGE}
      alt={alt}
      className={`${className ?? ""} ${isFallback ? fallbackClassName : ""}`}
      onError={(e) => {
        if (!isFallback) {
          e.currentTarget.src = DEFAULT_POST_IMAGE;
          setIsFallback(true);
        }
      }}
    />
  );
}
