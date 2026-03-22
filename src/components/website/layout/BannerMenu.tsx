"use client";

import { useMemo, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

interface BannerItem {
  image_url: string;
  link_target_url: string;
  title: string;
  status?: string;
}

interface BannerMenuProps {
  topArr?: BannerItem[];
}

const mockTopBanners: BannerItem[] = [
  { image_url: "/slider_1.webp", link_target_url: "/", title: "Banner 1", status: "A" },
  { image_url: "/slider_2.webp", link_target_url: "/", title: "Banner 2", status: "A" },
  { image_url: "/slider_3.webp", link_target_url: "/", title: "Banner 3", status: "A" },
];

const CDN_URL = process.env.NEXT_PUBLIC_CDN_URL || "https://acquytrungnguyen.com";

const BannerMenu = ({ topArr = mockTopBanners }: BannerMenuProps) => {
  const getTargetAttribute = (url: string): "_blank" | "_self" => {
    if (!url.includes("http")) return "_self";
    try {
      const hostname = typeof window !== "undefined" ? window.location.hostname : "";
      return hostname && url.includes(hostname) ? "_self" : "_blank";
    } catch {
      return "_self";
    }
  };

  const filteredTopItems = useMemo(
    () => topArr.filter((item) => item.status === "A").slice(0, 8),
    [topArr]
  );

  const autoplayPlugin = useRef(
    Autoplay({ delay: 7000, stopOnInteraction: false, stopOnMouseEnter: false })
  );

  const getImageUrl = (imageUrl: string): string => {
    if (imageUrl.startsWith("http")) return imageUrl;
    if (imageUrl.startsWith("/")) return imageUrl;
    return `${CDN_URL}/${imageUrl}`;
  };

  return (
    <div className="container mx-auto px-2 sm:px-4 pt-8 pb-4 max-w-7xl">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="w-full rounded-lg overflow-hidden">
          {filteredTopItems.length > 0 ? (
            <div className="w-full rounded-lg relative">
              <Carousel
                opts={{ align: "center", loop: true }}
                plugins={[autoplayPlugin.current]}
                className="w-full"
              >
                <CarouselContent className="ml-0">
                  {filteredTopItems.map((item, index) => (
                    <CarouselItem key={index} className="pl-0 basis-full min-w-0">
                      <Link
                        href={item.link_target_url}
                        className="block w-full relative aspect-21/9 rounded-lg overflow-hidden"
                        target={getTargetAttribute(item.link_target_url)}
                      >
                        <Image
                          src={getImageUrl(item.image_url)}
                          alt={item.title}
                          fill
                          sizes="(max-width: 768px) 100vw, 1280px"
                          className="object-cover rounded-lg"
                          priority={index === 0}
                        />
                      </Link>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="left-7 bg-white/80 hover:bg-white border-none shadow-lg" />
                <CarouselNext className="right-7 bg-white/80 hover:bg-white border-none shadow-lg" />
              </Carousel>
            </div>
          ) : (
            <div className="w-full bg-gray-200 rounded-lg flex items-center justify-center py-20">
              <p className="text-gray-500">Không có banner</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BannerMenu;
