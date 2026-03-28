"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  Search,
  MapPin,
  FileSearch,
  Gift,
  ShoppingCart,
  ChevronDown,
  FolderTree,
} from "lucide-react";
import { getCategoryFallbackLucideIcon } from "@/lib/category-menu-icons";
import { ICON_SIZE } from "@/lib/icons";
import { SearchBox } from "../common";
import { ItemMenu } from "./ItemMenu";
import { CategoryMenu } from "./CategoryMenu";
import { CategoryNavLink } from "./CategoryNavLink";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Trang chủ", href: "/" },
  { name: "Giới thiệu", href: "/about" },
];

export interface CategoryItem {
  id: number;
  name: string;
  href: string;
  /** Slug `#` — không điều hướng */
  disableLink?: boolean;
  icon?: any; // Optional - Lucide fallback when no iconUrl
  iconUrl?: string; // CDN path or URL - shown as <img> when present
  subCategories?: CategorySubItem[];
}

export interface CategorySubItem {
  id: number;
  name: string;
  href: string;
  disableLink?: boolean;
  children?: CategorySubItem[];
}

interface HeaderProps {
  categories?: CategoryItem[];
}

export const Header = ({ categories = [] }: HeaderProps) => {
  const [isActiveMenu, setIsActiveMenu] = useState(false);
  const [isActiveSearch, setIsActiveSearch] = useState(false);
  const [cartQty, setCartQty] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  const CDN_URL = process.env.NEXT_PUBLIC_CDN_URL || "";
  /** Giữ `iconUrl` từ API; fallback Lucide theo tên/slug danh mục (không phụ thuộc thứ tự API). */
  const categoriesWithIcons = categories.map((cat) => ({
    ...cat,
    icon: getCategoryFallbackLucideIcon(cat),
  }));

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const refreshCartQty = () => {
    const raw = localStorage.getItem("carts");
    if (!raw) {
      setCartQty(0);
      return;
    }
    try {
      const cartData = JSON.parse(raw);
      const items = Array.isArray(cartData) ? cartData : [];
      setCartQty(items.reduce((sum, i) => sum + (i.amount ?? 1), 0));
    } catch {
      setCartQty(0);
    }
  };

  useEffect(() => {
    refreshCartQty();
  }, [pathname]);

  useEffect(() => {
    const handler = () => refreshCartQty();
    window.addEventListener("cart-updated", handler);
    return () => window.removeEventListener("cart-updated", handler);
  }, []);

  return (
    <>
      <header
        ref={headerRef}
        className={cn(
          "w-full z-[9999] sticky top-0 transition-all duration-300 bg-primary",
          isScrolled ? "shadow-md" : "",
        )}
      >
        <div className="page-header flex w-full min-w-full items-center justify-center h-[72px] max-md:h-[100px] transition-all duration-300">
          <div className="container mx-auto px-4">
            <div className="w-full items-center flex flex-row justify-between max-md:grid max-md:grid-cols-4 md:gap-x-4 max-md:gap-y-2">
              {/* Toggle menu mobile */}
              <div className="max-md:col-span-1 flex items-center justify-start md:hidden">
                <button
                  id="menu-mobile"
                  aria-label="Menu Mobile"
                  className="max-md:w-full"
                  onClick={() => setIsActiveMenu(!isActiveMenu)}
                >
                  <Menu className="text-white" size={ICON_SIZE.xl} />
                </button>
              </div>

              {/* Logo + wordmark */}
              <div className="md:w-[22%] lg:w-[24%] max-md:!col-span-2 flex flex-row justify-between max-md:justify-center items-center gap-4 md:gap-6">
                <div className="min-w-0 flex-1 md:flex-none">
                  <Link
                    href="/"
                    title="Ắc Quy HN Sài Gòn - Trang chủ"
                    className="flex flex-row flex-nowrap items-center justify-center md:justify-start gap-1 sm:gap-1.5 md:gap-2"
                  >
                    <span className="relative inline-flex shrink-0 items-center justify-center rounded bg-white p-1 shadow-sm ring-1 ring-black/10 h-11 w-14 sm:h-12 sm:w-16 md:h-[60px] md:w-[76px]">
                      <span className="relative inline-block shrink-0 overflow-hidden rounded-sm aspect-square h-9 w-12 sm:h-10 sm:w-10 md:h-14 md:w-18">
                        <Image
                          priority
                          fill
                          src="/logo-final.svg"
                          alt="Ắc Quy HN Sài Gòn"
                          className="object-cover object-center"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display =
                              "none";
                          }}
                        />
                      </span>
                    </span>
                    <div
                      className={cn(
                        "flex min-w-0 flex-col items-center gap-1 leading-none md:items-start",
                        "select-none drop-shadow-[0_1px_2px_rgba(0,0,0,0.15)]",
                      )}
                    >
                      <span
                        className={cn(
                          "block text-center font-black uppercase tracking-wide text-white md:text-left",
                          "text-[11px] leading-none sm:text-sm md:text-base lg:text-lg",
                        )}
                      >
                        ẮC QUY HN
                      </span>
                      <div className="flex w-full max-w-[11.5rem] items-center gap-1.5 sm:max-w-[13rem] sm:gap-2 md:max-w-[15rem]">
                        <span className="h-px min-w-[10px] flex-1 bg-white/70 sm:min-w-[14px]" />
                        <span
                          className={cn(
                            "block shrink-0 whitespace-nowrap text-center font-medium uppercase leading-none tracking-[0.12em] text-white/95",
                            "text-[8px] sm:text-[9px] md:text-[10px] lg:text-xs",
                          )}
                        >
                          Sài Gòn
                        </span>
                        <span className="h-px min-w-[10px] flex-1 bg-white/70 sm:min-w-[14px]" />
                      </div>
                    </div>
                  </Link>
                </div>
              </div>

              {/* Cart Mobile */}
              <div className="col-span-1 md:hidden flex justify-end items-center">
                <ItemMenu
                  link="/cart"
                  icon={
                    <ShoppingCart className="text-white" size={ICON_SIZE.xl} />
                  }
                  text="Giỏ hàng"
                  cartQty={cartQty}
                />
              </div>

              {/* Search Box PC */}
              <div className="w-[28%] flex gap-x-8 flex-row max-md:col-span-5 max-md:hidden">
                <SearchBox
                  isActiveSearch={isActiveSearch}
                  setIsActiveSearch={setIsActiveSearch}
                />
              </div>

              {/* Menu List PC */}
              <div className="w-[45%] max-md:hidden max-md:col-span-1">
                <div className="w-full flex items-center justify-between max-md:hidden">
                  <ItemMenu
                    link="/about"
                    icon={
                      <FileSearch className="text-white" size={ICON_SIZE.lg} />
                    }
                    text="Giới thiệu"
                  />
                  <ItemMenu
                    link="/contact"
                    icon={<MapPin className="text-white" size={ICON_SIZE.lg} />}
                    text="Liên hệ"
                  />
                  <ItemMenu
                    link="/dealer-price"
                    icon={<Gift className="text-white" size={ICON_SIZE.lg} />}
                    text="Báo giá đại lý"
                  />
                  <ItemMenu
                    icon={
                      <ShoppingCart
                        className="text-white"
                        size={ICON_SIZE.lg}
                      />
                    }
                    link="/cart"
                    cartQty={cartQty}
                    text="Giỏ hàng"
                  />
                </div>
                <Link
                  className="md:hidden"
                  href="/track-order"
                  aria-label="tra cứu"
                >
                  <div
                    style={{ height: 50 }}
                    className="relative flex items-center justify-center"
                  >
                    <Search className="text-white" size={ICON_SIZE.xl} />
                  </div>
                </Link>
              </div>

              {/* Search Box Mobile */}
              <div className="col-span-4 md:hidden w-full">
                <SearchBox
                  isActiveSearch={isActiveSearch}
                  setIsActiveSearch={setIsActiveSearch}
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Category Menu */}
      <CategoryMenu
        isMobileMenuOpen={isActiveMenu}
        categories={categoriesWithIcons}
      />

      {/* Mobile Menu */}
      {isActiveMenu && (
        <div className="fixed top-[100px] left-0 right-0 z-[9998] md:hidden bg-white shadow-lg border-b border-gray-200 max-h-[calc(100vh-100px)] overflow-y-auto">
          {/* Navigation */}
          <nav className="px-4 py-4 space-y-1">
            {/* Main Navigation */}
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "block text-gray-800 transition-colors duration-200 font-medium py-3 px-4 rounded-lg",
                  pathname === item.href ? "bg-blue-50" : "hover:bg-gray-50",
                )}
                style={
                  pathname === item.href
                    ? {
                        color: "var(--color-primary)",
                        backgroundColor: "var(--color-primary-muted)",
                      }
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
                onClick={() => {
                  setIsActiveMenu(false);
                  setExpandedCategory(null);
                }}
              >
                {item.name}
              </Link>
            ))}

            {/* Categories */}
            {categoriesWithIcons.map((category) => {
              const IconComponent = category.icon || FolderTree;
              const iconSrc = category.iconUrl
                ? category.iconUrl.startsWith("http")
                  ? category.iconUrl
                  : `${CDN_URL}/${category.iconUrl}`
                : "";
              const hasSubCategories =
                category.subCategories && category.subCategories.length > 0;
              const isExpanded = expandedCategory === String(category.id);
              const catActive =
                !category.disableLink && pathname === category.href;

              return (
                <div key={category.id}>
                  <div className="flex items-center">
                    <CategoryNavLink
                      href={category.href}
                      disableLink={category.disableLink}
                      className={cn(
                        "flex-1 flex items-center gap-2 text-gray-800 transition-colors duration-200 font-medium py-3 px-4 rounded-lg",
                        catActive ? "bg-blue-50" : "hover:bg-gray-50",
                      )}
                      style={
                        catActive
                          ? {
                              color: "var(--color-primary)",
                              backgroundColor: "var(--color-primary-muted)",
                            }
                          : { color: "" }
                      }
                      onClick={() => {
                        if (!hasSubCategories) {
                          setIsActiveMenu(false);
                          setExpandedCategory(null);
                        }
                      }}
                    >
                      {iconSrc ? (
                        <img
                          src={iconSrc}
                          alt=""
                          className="w-[18px] h-[18px] shrink-0 object-contain"
                        />
                      ) : (
                        <IconComponent
                          size={ICON_SIZE.md}
                          className="shrink-0"
                        />
                      )}
                      <span>{category.name}</span>
                    </CategoryNavLink>
                    {hasSubCategories && (
                      <button
                        type="button"
                        onClick={() => {
                          setExpandedCategory(
                            isExpanded ? null : String(category.id),
                          );
                        }}
                        className="px-4 py-3 text-gray-600 hover:text-primary transition-colors"
                      >
                        <ChevronDown
                          size={ICON_SIZE.md}
                          className={cn(
                            "transition-transform",
                            isExpanded && "rotate-180",
                          )}
                        />
                      </button>
                    )}
                  </div>

                  {/* Subcategories */}
                  {hasSubCategories && isExpanded && (
                    <div className="pl-4 pr-4 pb-2 space-y-1">
                      {category.subCategories?.map((subCategory) => {
                        const subActive =
                          !subCategory.disableLink &&
                          pathname === subCategory.href;
                        return (
                          <CategoryNavLink
                            key={subCategory.id}
                            href={subCategory.href}
                            disableLink={subCategory.disableLink}
                            className={cn(
                              "block text-sm text-gray-700 transition-colors duration-200 font-medium py-2 px-4 rounded-lg ml-6",
                              subActive ? "bg-blue-50" : "hover:bg-gray-50",
                            )}
                            style={
                              subActive
                                ? {
                                    color: "var(--color-primary)",
                                    backgroundColor:
                                      "var(--color-primary-muted)",
                                  }
                                : { color: "" }
                            }
                            onClick={() => {
                              setIsActiveMenu(false);
                              setExpandedCategory(null);
                            }}
                          >
                            {subCategory.name}
                          </CategoryNavLink>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        </div>
      )}

      {/* Overlay khi menu mobile mở */}
      {isActiveMenu && (
        <div
          className="fixed inset-0 bg-black/60 z-[9997] md:hidden"
          style={{ top: "100px" }}
          onClick={() => {
            setIsActiveMenu(false);
            setExpandedCategory(null);
          }}
        />
      )}
    </>
  );
};
