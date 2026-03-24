"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  PhoneCall,
  MessageCircle,
  Home as HomeIcon,
  PackageSearch,
  Store,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ICON_SIZE } from "@/lib/icons";
import { contactHotlineTel, zaloChatUrl } from "@/config/site";

const items = [
  {
    key: "call",
    label: "Gọi mua",
    href: `tel:${contactHotlineTel}`,
    icon: PhoneCall,
    isExternal: false,
  },
  {
    key: "chat",
    label: "Nhắn tin",
    href: zaloChatUrl,
    icon: MessageCircle,
    isExternal: true,
  },
  {
    key: "home",
    label: "Trang chủ",
    href: "/",
    icon: HomeIcon,
    isExternal: false,
  },
  {
    key: "products",
    label: "Sản phẩm",
    href: "/#san-pham",
    icon: PackageSearch,
    isExternal: false,
  },
  {
    key: "store",
    label: "Cửa hàng",
    href: "/contact",
    icon: Store,
    isExternal: false,
  },
];

export const MobileBottomBar = () => {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed inset-x-0 bottom-0 z-[9998] bg-white border-t border-gray-200 shadow-[0_-2px_8px_rgba(0,0,0,0.06)] pb-safe">
      <div className="flex items-stretch justify-between h-14">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.key === "home"
              ? pathname === "/"
              : item.key === "store"
              ? pathname.startsWith("/contact")
              : false;

          const content = (
            <div
              className={cn(
                "pt-2 flex flex-1 flex-col items-center justify-center gap-0.5 text-[11px] font-medium",
                "text-gray-600",
                isActive && "text-primary"
              )}
            >
              <span className="inline-flex items-center justify-center rounded-full w-6 h-6 mb-0.5 bg-primary-muted">
                <Icon size={ICON_SIZE.sm} className="text-primary" />
              </span>
              <span className="truncate">{item.label}</span>
            </div>
          );

          if (item.href.startsWith("tel:") || item.isExternal) {
            return (
              <a
                key={item.key}
                href={item.href}
                target={item.isExternal ? "_blank" : undefined}
                rel={item.isExternal ? "noopener noreferrer" : undefined}
                className="flex-1"
              >
                {content}
              </a>
            );
          }

          return (
            <Link key={item.key} href={item.href} className="flex-1">
              {content}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

