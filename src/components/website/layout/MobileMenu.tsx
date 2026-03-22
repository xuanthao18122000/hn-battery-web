"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { X } from "lucide-react";
import { ICON_SIZE } from "@/lib/icons";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Trang chủ", href: "/" },
  { name: "Giới thiệu", href: "/about" },
  { name: "Năng lực thi công", href: "/capabilities" },
  { name: "Dự án", href: "/projects" },
  { name: "Tin tức", href: "/posts" },
];

interface MobileMenuProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const MobileMenu = ({ isOpen, onClose }: MobileMenuProps) => {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (isOpen !== undefined) {
      setIsMobileMenuOpen(isOpen);
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsMobileMenuOpen(false);
    onClose?.();
  };

  if (!isMobileMenuOpen) return null;

  return (
    <div className="fixed inset-0 z-[9998] md:hidden">
      <div className="absolute top-0 left-0 right-0 bottom-0 bg-white">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200 bg-primary">
          <h2 className="text-white text-lg font-semibold">Menu</h2>
          <button
            onClick={handleClose}
            className="text-white hover:text-gray-200 transition-colors"
            aria-label="Đóng menu"
          >
            <X size={ICON_SIZE.xl} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="px-4 py-6 space-y-2">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "block text-gray-800 transition-colors duration-200 font-medium py-3 px-4 rounded-lg",
                pathname === item.href ? "bg-red-50" : "hover:bg-gray-50"
              )}
              style={
                pathname === item.href 
                  ? { color: "var(--color-primary)", backgroundColor: "var(--color-primary-muted)" } 
                  : { color: "" }
              }
              onMouseEnter={(e) => {
                if (pathname !== item.href) {
                  e.currentTarget.style.color = "var(--color-primary)";
                }
              }}
              onMouseLeave={(e) => {
                if (pathname !== item.href) {
                  e.currentTarget.style.color = "";
                }
              }}
              onClick={handleClose}
            >
              {item.name}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
};
