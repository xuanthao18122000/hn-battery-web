"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { ChevronDown, FolderTree } from "lucide-react";
import { cn } from "@/lib/utils";
import { ICON_SIZE } from "@/lib/icons";
import type { CategoryItem } from "./Header";
import { CategoryNavLink } from "./CategoryNavLink";

const CDN_URL = process.env.NEXT_PUBLIC_CDN_URL || "";

function getIconSrc(iconUrl?: string) {
  if (!iconUrl) return "";
  return iconUrl.startsWith("http") ? iconUrl : `${CDN_URL}/${iconUrl}`;
}

interface CategoryMenuProps {
  isMobileMenuOpen?: boolean;
  categories?: CategoryItem[];
}

export const CategoryMenu = ({ isMobileMenuOpen = false, categories = [] }: CategoryMenuProps) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [dropdownRect, setDropdownRect] = useState<{ top: number; left: number } | null>(null);
  const triggerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const closeTimeoutRef = useRef<number | null>(null);
  const [subHoverPath, setSubHoverPath] = useState<number[]>([]);
  const [isMobile, setIsMobile] = useState(false);

  const hoveredCategory = hoveredIndex !== null ? categories[hoveredIndex] : null;
  const hasSubCategories = hoveredCategory?.subCategories && hoveredCategory.subCategories.length > 0;

  useEffect(() => {
    if (hoveredIndex === null || !hasSubCategories) {
      setDropdownRect(null);
      setSubHoverPath([]);
      return;
    }
    setSubHoverPath([]);
    const el = triggerRefs.current[hoveredIndex];
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setDropdownRect({
      top: rect.bottom,
      left: rect.left,
    });
  }, [hoveredIndex, hasSubCategories]);

  const clearCloseTimeout = () => {
    if (closeTimeoutRef.current) {
      window.clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
  };

  const scheduleClose = () => {
    clearCloseTimeout();
    closeTimeoutRef.current = window.setTimeout(() => {
      setHoveredIndex(null);
    }, 120);
  };

  useEffect(() => {
    return () => clearCloseTimeout();
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mql = window.matchMedia("(max-width: 767px)");
    const onChange = () => setIsMobile(mql.matches);
    onChange();

    // Safari fallback
    // eslint-disable-next-line deprecation/deprecation
    if (typeof mql.addEventListener === "function") {
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    }
    // eslint-disable-next-line deprecation/deprecation
    mql.addListener(onChange);
    // eslint-disable-next-line deprecation/deprecation
    return () => mql.removeListener(onChange);
  }, []);

  if (categories.length === 0) return null;
  if (isMobile) return null;

  const activeIndex = hoveredIndex;

  type SubCategory = NonNullable<CategoryItem["subCategories"]>[number];

  const getPanelItems = (depth: number): SubCategory[] => {
    const base = hoveredCategory?.subCategories ?? [];
    let cur: SubCategory[] = base;
    for (let d = 0; d < depth; d += 1) {
      const idx = subHoverPath[d];
      const item = cur[idx];
      if (!item?.children?.length) return [];
      cur = item.children as SubCategory[];
    }
    return cur;
  };

  const getPanels = (): SubCategory[][] => {
    const panels: SubCategory[][] = [];
    // panel 0 luôn có
    const first = getPanelItems(0);
    if (!first.length) return panels;
    panels.push(first);

    // Không handle cate con cấp 3 (nested dropdown). Chỉ render 1 panel con.
    return panels;
  };

  const renderPanel = (panelItems: SubCategory[], depth: number) => {
    const ROWS_PER_COL = 8;
    const columnCount = Math.max(1, Math.ceil(panelItems.length / ROWS_PER_COL));

    return (
      <div
        key={depth}
        className={cn(
          "bg-white shadow-lg border border-gray-200 py-2",
          depth === 0 ? "rounded-b-lg" : "rounded-lg ml-1",
          // Base width like before, but allow expanding to the right for multi-column
          columnCount === 1 ? "w-64" : "w-auto"
        )}
      >
        <div
          className={cn("grid", columnCount === 1 ? "grid-cols-1" : "auto-cols-[16rem] grid-flow-col")}
          style={columnCount === 1 ? undefined : { gridTemplateRows: `repeat(${ROWS_PER_COL}, minmax(0, 1fr))` }}
        >
          {panelItems.map((subCategory, index) => {
            const isActive = subHoverPath[depth] === index;
            return (
              <div
                key={subCategory.id}
                className={cn(
                  "flex items-center justify-between gap-3 px-4 py-2 text-sm transition-colors cursor-pointer min-w-0",
                  isActive ? "bg-gray-50 text-primary" : "text-gray-700 hover:bg-gray-50 hover:text-primary"
                )}
                onMouseEnter={() => {
                  clearCloseTimeout();
                  setSubHoverPath((prev) => {
                    const next = prev.slice(0, depth);
                    next[depth] = index;
                    return next;
                  });
                }}
              >
                <CategoryNavLink
                  href={subCategory.href}
                  disableLink={subCategory.disableLink}
                  className="flex-1 min-w-0"
                  onClick={() => setHoveredIndex(null)}
                >
                  <span className="block truncate">{subCategory.name}</span>
                </CategoryNavLink>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <>
      <div
        className={cn(
          "w-full z-[9996] sticky top-[72px] max-md:top-[100px] shadow-sm border-b border-gray-100 bg-white hidden md:block"
        )}
      >
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex items-center justify-center md:justify-between gap-6 md:gap-4 overflow-x-auto no-scrollbar">
            {categories.map((category, index) => {
              const IconComponent = category.icon || FolderTree;
              const iconSrc = getIconSrc(category.iconUrl);
              const isHovered = hoveredIndex === index;
              const hasSubs = category.subCategories && category.subCategories.length > 0;

              return (
                <div
                  key={category.id}
                  ref={(el) => {
                    triggerRefs.current[index] = el;
                  }}
                  className="relative group shrink-0"
                  onMouseEnter={() => {
                    clearCloseTimeout();
                    setHoveredIndex(index);
                  }}
                  onMouseLeave={() => {
                    // dropdown đang render qua portal nên cần delay để user rê chuột xuống
                    scheduleClose();
                  }}
                >
                  <CategoryNavLink
                    href={category.href}
                    disableLink={category.disableLink}
                    className={cn(
                      "flex items-center gap-2 py-3 px-2 text-sm md:text-base font-medium transition-colors",
                      "text-gray-800 hover:text-primary"
                    )}
                  >
                    {iconSrc ? (
                      <img src={iconSrc} alt="" className="w-[18px] h-[18px] shrink-0 object-contain" />
                    ) : (
                      <IconComponent size={ICON_SIZE.md} className="shrink-0" />
                    )}
                    <span className="whitespace-nowrap">{category.name}</span>
                    {hasSubs && <ChevronDown size={ICON_SIZE.sm} className="shrink-0" />}
                  </CategoryNavLink>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Dropdown render qua portal vào body để không bị overflow cắt */}
      {typeof document !== "undefined" &&
        hasSubCategories &&
        hoveredCategory &&
        dropdownRect &&
        createPortal(
          <div
            className="fixed z-[99999]"
            style={{
              top: dropdownRect.top + 4,
              left: dropdownRect.left,
            }}
            onMouseEnter={() => {
              clearCloseTimeout();
              // giữ nguyên activeIndex hiện tại
              if (activeIndex !== null) setHoveredIndex(activeIndex);
            }}
            onMouseLeave={() => {
              scheduleClose();
            }}
          >
            <div className="relative">
              <div className="flex items-start">
                {getPanels().map((panelItems, depth) => renderPanel(panelItems, depth))}
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
};

