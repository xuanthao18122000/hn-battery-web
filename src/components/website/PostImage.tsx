"use client";

const DEFAULT_POST_IMAGE = "/no-image-available.png";

interface PostImageProps {
  src?: string | null;
  alt: string;
  className?: string;
}

export function PostImage({ src, alt, className }: PostImageProps) {
  return (
    <img
      src={src || DEFAULT_POST_IMAGE}
      alt={alt}
      className={className}
      onError={(e) => {
        e.currentTarget.src = DEFAULT_POST_IMAGE;
      }}
    />
  );
}
