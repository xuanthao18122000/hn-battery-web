"use client";

import { Minus, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { BlurImage } from "../common";
import type { CartItemData } from "@/lib/cart";

interface CartItemProps {
  item: CartItemData;
  onUpdate: (item: CartItemData, action: "incre" | "deincre") => void;
  onDelete: (item: CartItemData) => void;
}

const CDN_URL =
  process.env.NEXT_PUBLIC_CDN_URL || "https://cdn-v2.didongviet.vn";

const formatPrice = (price: number | string): string => {
  const numPrice = typeof price === "string" ? parseFloat(price) : price;
  if (isNaN(numPrice) || numPrice < 1000) {
    return "Liên hệ";
  }
  return numPrice.toLocaleString("vi-VN") + " ₫";
};

export const CartItem = ({ item, onUpdate, onDelete }: CartItemProps) => {
  const imageUrl = item.thumbnail
    ? `${CDN_URL}/${item.thumbnail}`
    : "/no-image-available.png";
  const productUrl = `/${item.productSlug}.html`;
  const itemPrice = parseFloat(item.price);
  const itemListPrice = parseFloat(item.list_price);
  const hasDiscount = itemListPrice > itemPrice && itemPrice > 0;
  const priceColorClass =
    formatPrice(itemPrice) === "Liên hệ" ? "text-yellow-600" : "text-primary";

  return (
    <div className="flex gap-4 items-start w-full py-3 first:pt-0 border-b border-gray-200 last:border-b-0">
      <Link
        href={productUrl}
        className="shrink-0 w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center"
      >
        <BlurImage
          src={imageUrl}
          alt={item.product}
          width={64}
          height={64}
          className="object-contain w-full h-full"
        />
      </Link>

      <div className="flex-1 min-w-0 flex flex-col gap-1 justify-center">
        <Link
          href={productUrl}
          className="hover:text-primary transition-colors"
        >
          <h3 className="text-sm font-medium text-gray-900 line-clamp-2 leading-5">
            {item.product}
          </h3>
        </Link>
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className={`text-base font-medium leading-6 ${priceColorClass}`}
          >
            {formatPrice(itemPrice)}
          </span>
          {hasDiscount && (
            <span className="text-sm text-gray-400 line-through">
              {formatPrice(itemListPrice)}
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-3 items-end shrink-0 w-[104px]">
        <button
          type="button"
          onClick={() => onDelete(item)}
          className="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-900 transition-colors"
          title="Xóa sản phẩm"
        >
          <Trash2 className="w-5 h-5" />
        </button>
        <div className="flex items-center border border-gray-200 rounded-lg w-full overflow-hidden">
          <button
            type="button"
            onClick={() => onUpdate(item, "deincre")}
            className="flex items-center justify-center w-8 h-8 text-gray-400 hover:text-gray-900 transition-colors shrink-0"
          >
            <Minus className="w-4 h-4" />
          </button>
          <div className="border-x border-gray-200 flex items-center justify-center w-10 h-8 shrink-0">
            <span className="text-sm text-gray-900">{item.amount}</span>
          </div>
          <button
            type="button"
            onClick={() => onUpdate(item, "incre")}
            className="flex items-center justify-center w-8 h-8 text-gray-900 hover:text-primary transition-colors shrink-0"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
