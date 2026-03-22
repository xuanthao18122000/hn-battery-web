"use client";

import Link from "next/link";
import { ReactNode } from "react";

interface ItemMenuProps {
  link: string;
  icon: ReactNode;
  text: string;
  cartQty?: number;
}

export const ItemMenu = ({ link, icon, text, cartQty }: ItemMenuProps) => {
  const isExternal = link.startsWith("http") || link.startsWith("tel:") || link.startsWith("mailto:");
  
  const content = (
    <div className="w-full h-full flex items-center justify-start hover:opacity-80 transition-opacity gap-2 p-1 overflow-hidden">
      <div className="relative">
        {icon}
        {cartQty !== undefined && cartQty > 0 && (
          <div
            style={{ top: -4, left: 10 }}
            className="absolute bg-yellow-200 rounded-full w-4 h-4 flex justify-center items-center"
          >
            <p className="text-[10px] leading-none font-bold text-primary">
              {cartQty}
            </p>
          </div>
        )}
      </div>
      <div className="max-md:hidden">
        <div className="flex justify-center items-center overflow-hidden">
          <p className="text-xs text-white truncate line-clamp-2">{text}</p>
        </div>
      </div>
    </div>
  );

  if (isExternal) {
    return (
      <a href={link} title={text} target={link.startsWith("http") ? "_blank" : undefined} rel={link.startsWith("http") ? "noopener noreferrer" : undefined}>
        {content}
      </a>
    );
  }

  return (
    <Link href={link} title={text}>
      {content}
    </Link>
  );
};

