"use client";

import { useState, useEffect, useRef } from "react";
import Image, { ImageProps } from "next/image";

interface BlurImageProps extends Omit<ImageProps, "onLoadingComplete"> {
  onLoadingComplete?: () => void;
}

const DEFAULT_IMAGE = "/no-image-available.png";

const BlurImage: React.FC<BlurImageProps> = ({
  src,
  alt,
  width,
  height,
  fill,
  className = "",
  quality = 75,
  priority = false,
  ...props
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isInView, setIsInView] = useState(priority);
  const [imageSrc, setImageSrc] = useState(src);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current || priority) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: "50px" }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [priority]);

  // Reset imageSrc when src prop changes
  useEffect(() => {
    setImageSrc(src);
    setIsLoading(true);
  }, [src]);

  const handleError = () => {
    // Only fallback if current image is not already the default
    if (imageSrc !== DEFAULT_IMAGE) {
      setImageSrc(DEFAULT_IMAGE);
      setIsLoading(false);
    }
  };

  return (
    <div ref={ref} className={`relative ${className}`}>
      <Image
        src={imageSrc}
        alt={alt || "No image available"}
        fill={fill}
        width={width}
        height={height}
        loading={isInView ? undefined : "lazy"}
        priority={isInView}
        placeholder="blur"
        blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR4nGP4////fwAJ+wP9KobjigAAAABJRU5ErkJggg=="
        className={`transition-opacity duration-300 ${
          isLoading && !isInView && !priority ? "blur-md" : "blur-0"
        }`}
        onLoad={() => setIsLoading(false)}
        onError={handleError}
        quality={quality}
        {...props}
      />
    </div>
  );
};

export default BlurImage;

