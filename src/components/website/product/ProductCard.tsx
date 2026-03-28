"use client";

import Link from "next/link";
import Image from "next/image";
import {
  BadgeHotSale,
  BadgeNew,
  BadgeOffer,
  BadgeOfferLink,
  BadgeOnline,
} from "@/components/website/common";
import { isCategorySlugNoNavigate } from "@/lib/category-nav";
import { formatPrice } from "@/utils/format";

export interface Product {
  product_id: number;
  product: string;
  slug: string;
  productSlug: string;
  rootCategorySlug: string;
  thumbnail: string;
  price: string;
  list_price: string;
  percentage_discount: number;
  promotion_info?: string;
  status?: string;
  showPrice?: boolean;
}

interface ProductCardProps {
  item: Product;
}

const formatPromotionInfo = (html?: string): string => {
  if (!html) return "";
  return html.replace(/<[^>]*>/g, "").trim().slice(0, 50);
};

export function ProductCard({ item }: ProductCardProps) {
  const showPrice = item.showPrice !== false;
  const price = parseFloat(item.price);
  const listPrice = parseFloat(item.list_price);
  const hasDiscount = showPrice && listPrice > price && price > 0;
  const discountPercent = item.percentage_discount || 0;
  const CDN_URL = process.env.NEXT_PUBLIC_CDN_URL || "";
  const imageUrl = item.thumbnail
    ? item.thumbnail.startsWith("http")
      ? item.thumbnail
      : `${CDN_URL}/${item.thumbnail}`.replace(/^\/\//, "https://")
    : "/no-image-available.png";
  const productUrl =
    item.rootCategorySlug?.length &&
    !isCategorySlugNoNavigate(item.rootCategorySlug)
      ? `/${item.productSlug}.html?fromCategory=${encodeURIComponent(item.rootCategorySlug)}`
      : `/${item.productSlug}.html`;

  const showLabelOffer = hasDiscount && discountPercent > 0;
  const offerText = item.promotion_info
    ? formatPromotionInfo(item.promotion_info)
    : "+2 ưu đãi cho bạn";
  const showOffer = !!item.promotion_info;

  return (
    <Link
      href={productUrl}
      title={item.product}
      className="group flex flex-col bg-white border border-sky-200 rounded-sm overflow-hidden hover:shadow-card hover:border-sky-300 transition-[box-shadow,border-color] duration-300 cursor-pointer w-full h-full"
    >
      {/* Labels row */}
      <div className="flex min-h-5 items-center gap-1.5 px-2 pt-2 md:gap-2">
        {showLabelOffer && (
          <BadgeOffer>{`-${discountPercent}%`}</BadgeOffer>
        )}
      </div>

      {/* Image — zoom on card hover */}
      <div className="relative flex aspect-square items-center justify-center overflow-hidden px-1 py-2 md:px-2 md:py-2">
        {imageUrl && imageUrl !== "/no-image-available.png" ? (
          <Image
            src={imageUrl}
            alt={item.product}
            width={200}
            height={200}
            className="w-full h-full object-contain transition-transform duration-300 ease-out will-change-transform group-hover:scale-[1.07]"
            unoptimized={imageUrl.startsWith("http")}
          />
        ) : (
          <div className="w-full h-full bg-gray-100 rounded-xs flex items-center justify-center transition-transform duration-300 ease-out group-hover:scale-[1.03]">
            <svg
              aria-hidden="true"
              width="48"
              height="48"
              viewBox="0 0 48 48"
              fill="none"
              className="text-gray-300"
            >
              <rect
                width="48"
                height="48"
                rx="8"
                fill="currentColor"
                fillOpacity="0.3"
              />
              <path
                d="M18 30L22 26L25 29L30 24L34 30H18Z"
                fill="currentColor"
              />
              <circle cx="21" cy="21" r="3" fill="currentColor" />
            </svg>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-1.5 px-2 pb-2 pt-0.5 md:gap-2 md:px-2 md:pb-2">
        {/* Product name */}
        <p className="line-clamp-2 min-h-9 text-sm font-normal leading-snug text-gray-900 md:min-h-10">
          {item.product}
        </p>

        {/* Price */}
        <div className="flex flex-col gap-0.5">
          <span
            className={`text-base font-semibold ${showPrice ? "text-primary-600" : "text-yellow-600"}`}
          >
            {showPrice ? formatPrice(price) : "Liên hệ"}
          </span>
          {showPrice && hasDiscount && (
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-gray-400 line-through md:text-sm">
                {formatPrice(listPrice)}
              </span>
              {discountPercent > 0 && (
                <span className="text-xs font-medium text-red-400 md:text-sm">
                  -{discountPercent}%
                </span>
              )}
            </div>
          )}
        </div>

        {/* Offer */}
        {showOffer && <BadgeOfferLink>{offerText}</BadgeOfferLink>}

        {/* Rating placeholder - có thể bật khi API có rating */}
        <div className="flex items-center gap-1 mt-auto pt-1">
          <svg
            aria-hidden="true"
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
          >
            <path
              d="M6 1L7.545 4.13L11 4.635L8.5 7.07L9.09 10.51L6 8.885L2.91 10.51L3.5 7.07L1 4.635L4.455 4.13L6 1Z"
              className="fill-yellow-500"
            />
          </svg>
          <span className="text-xs font-medium text-gray-600">—</span>
          <span className="text-xs font-normal text-gray-400">(0)</span>
        </div>
      </div>
    </Link>
  );
}
