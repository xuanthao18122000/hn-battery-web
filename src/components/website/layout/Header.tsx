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
  Car,
  Building2,
  Package,
  FolderTree
} from "lucide-react";
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

  const MENU_ICONS = [Car, Building2, Package];
  const CDN_URL = process.env.NEXT_PUBLIC_CDN_URL || "";
  /** Giữ `iconUrl` từ API; gán fallback Lucide `icon` theo thứ tự menu. */
  const categoriesWithIcons = categories.map((cat, i) => ({
    ...cat,
    icon: MENU_ICONS[i] ?? Package,
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
          isScrolled ? "shadow-md" : ""
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

              {/* Logo */}
              <div className="md:w-[15%] max-md:!col-span-2 flex flex-row justify-between max-md:justify-center items-center gap-8">
                <div>
                  <Link
                    href="/"
                    title="Ắc quy Trung Nguyên - Trang chủ"
                  >
                    <div className="md:hidden text-center">
                      <Image
                        priority
                        width={126}
                        height={36}
                        className="mx-auto object-contain"
                        src="/logo-web-1.png"
                        alt="Ắc quy Trung Nguyên"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = "none";
                          if (target.nextElementSibling) {
                            (target.nextElementSibling as HTMLElement).style.display = "block";
                          }
                        }}
                      />
                      <span className="text-white text-xl font-bold" style={{ display: "none" }}>
                        Ắc quy Trung Nguyên
                      </span>
                    </div>

                    <div className="max-md:hidden">
                      <Image
                        priority
                        width={180}
                        height={48}
                        style={{ objectFit: "contain" }}
                        src="/logo-web-1.png"
                        alt="Ắc quy Trung Nguyên"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = "none";
                          if (target.nextElementSibling) {
                            (target.nextElementSibling as HTMLElement).style.display = "block";
                          }
                        }}
                      />
                      <span className="text-white text-2xl font-bold" style={{ display: "none" }}>
                        Trung Nguyên
                      </span>
                    </div>
                  </Link>
                </div>
              </div>

              {/* Cart Mobile */}
              <div className="col-span-1 md:hidden flex justify-end items-center">
                <ItemMenu
                  link="/cart"
                  icon={<ShoppingCart className="text-white" size={ICON_SIZE.xl} />}
                  text="Giỏ hàng"
                  cartQty={cartQty}
                />
              </div>

              {/* Search Box PC */}
              <div className="w-[28%] flex gap-x-8 flex-row max-md:col-span-5 max-md:hidden">
                <SearchBox isActiveSearch={isActiveSearch} setIsActiveSearch={setIsActiveSearch} />
              </div>

              {/* Menu List PC */}
              <div className="w-[45%] max-md:hidden max-md:col-span-1">
                <div className="w-full flex items-center justify-between max-md:hidden">
                    <ItemMenu
                      link="/about"
                      icon={<FileSearch className="text-white" size={ICON_SIZE.lg} />}
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
                      icon={<ShoppingCart className="text-white" size={ICON_SIZE.lg} />}
                      link="/cart"
                      cartQty={cartQty}
                      text="Giỏ hàng"
                    />
                </div>
                <Link className="md:hidden" href="/track-order" aria-label="tra cứu">
                  <div style={{ height: 50 }} className="relative flex items-center justify-center">
                    <Search className="text-white" size={ICON_SIZE.xl} />
                  </div>
                </Link>
              </div>

              {/* Search Box Mobile */}
              <div className="col-span-4 md:hidden w-full">
                <SearchBox isActiveSearch={isActiveSearch} setIsActiveSearch={setIsActiveSearch} />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Category Menu */}
      <CategoryMenu isMobileMenuOpen={isActiveMenu} categories={categoriesWithIcons} />

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
                  pathname === item.href ? "bg-blue-50" : "hover:bg-gray-50"
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
                ? (category.iconUrl.startsWith("http") ? category.iconUrl : `${CDN_URL}/${category.iconUrl}`)
                : "";
              const hasSubCategories = category.subCategories && category.subCategories.length > 0;
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
                        catActive ? "bg-blue-50" : "hover:bg-gray-50"
                      )}
                      style={
                        catActive
                          ? { color: "var(--color-primary)", backgroundColor: "var(--color-primary-muted)" } 
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
                        <img src={iconSrc} alt="" className="w-[18px] h-[18px] shrink-0 object-contain" />
                      ) : (
                        <IconComponent size={ICON_SIZE.md} className="shrink-0" />
                      )}
                      <span>{category.name}</span>
                    </CategoryNavLink>
                    {hasSubCategories && (
                      <button
                        type="button"
                        onClick={() => {
                          setExpandedCategory(isExpanded ? null : String(category.id));
                        }}
                        className="px-4 py-3 text-gray-600 hover:text-primary transition-colors"
                      >
                        <ChevronDown 
                          size={ICON_SIZE.md} 
                          className={cn(
                            "transition-transform",
                            isExpanded && "rotate-180"
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
                          !subCategory.disableLink && pathname === subCategory.href;
                        return (
                          <CategoryNavLink
                            key={subCategory.id}
                            href={subCategory.href}
                            disableLink={subCategory.disableLink}
                            className={cn(
                              "block text-sm text-gray-700 transition-colors duration-200 font-medium py-2 px-4 rounded-lg ml-6",
                              subActive ? "bg-blue-50" : "hover:bg-gray-50"
                            )}
                            style={
                              subActive
                                ? { color: "var(--color-primary)", backgroundColor: "var(--color-primary-muted)" } 
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
