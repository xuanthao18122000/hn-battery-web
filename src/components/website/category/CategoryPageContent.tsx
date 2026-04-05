"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { createPortal } from "react-dom";
import dynamic from "next/dynamic";
import Link from "next/link";
import { ProductCard } from "@/components/website/product/ProductCard";
import { Breadcrumbs } from "@/components/website/common";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import {
  ArrowDownWideNarrow,
  ArrowUpNarrowWide,
  ChevronDown,
  Filter,
  Search,
  X,
} from "lucide-react";
import { ICON_SIZE } from "@/lib/icons";
import { cn } from "@/lib/utils";
import { getImageUrl } from "@/utils/image";
import {
  categoriesApi,
  type GetProductsByCategorySlugParams,
} from "@/lib/api/categories";
import type { Product as ApiProduct } from "@/lib/api/products";
import {
  mapApiProductToCategoryCard,
  type CategoryListingProduct,
} from "@/lib/map-product-category";

const ProductDescriptionBlock = dynamic(
  () => import("@/components/website/product/ProductDescriptionBlock"),
  {
    loading: () => (
      <div
        className="mt-6 min-h-[240px] animate-pulse rounded border border-gray-200 bg-gray-50"
        aria-hidden
      />
    ),
  },
);

type Product = CategoryListingProduct;

interface CategoryPageContentProps {
  categoryInfo: {
    title: string;
    rootSlug: string;
  };
  /** HTML mô tả danh mục (TextEditor / CMS), hiển thị dưới grid SP — giống `ProductDescriptionBlock` ở PDP */
  descriptionHtml?: string | null;
  mockProducts?: Product[];
  filterOptions?: {
    voltage?: string[];
    power?: string[];
    brand?: string[];
    type?: string[];
    usage?: string[];
  };
  breadcrumbItems?: { name: string; slug: string }[];
  subCategories?: { id: number; name: string; slug: string; thumbnailUrl?: string; iconUrl?: string }[];
}

const defaultMockProducts: Product[] = [
  {
    product_id: 1001,
    product: "Ắc quy Globe 12V 60Ah",
    slug: "ac-quy-globe-12v-60ah",
    productSlug: "ac-quy-globe-12v-60ah",
    rootCategorySlug: "hang-ac-quy",
    thumbnail: "files/products/2025/5/3/1/1748962408388_xe_may_dien_vinfast_vento_neo_vang_didongviet.jpg",
    price: "1200000",
    list_price: "1500000",
    percentage_discount: 20,
    status: "A",
    voltage: "12V",
    power: "60Ah",
    brand: "Globe",
    type: "Khô",
    usage: "Xe máy",
    promotion_info: "<p>Giảm giá 20% cho sản phẩm này</p>",
  },
];

const defaultFilterOptions = {
  voltage: ["12V", "24V"],
  power: ["50Ah", "55Ah", "60Ah", "65Ah", "70Ah", "75Ah", "80Ah", "90Ah", "100Ah", "120Ah"],
  brand: ["Globe", "Varta", "Bosch", "Rocket", "Generic"],
  type: ["Khô", "Nước", "Phụ kiện"],
  usage: ["Xe máy", "Xe ô tô", "Xe tải", "Xe bus", "Tất cả"],
};

const sortOptions: { value: string; label: string }[] = [
  { value: "default", label: "Nổi bật" },
  { value: "price-asc", label: "Giá tăng dần" },
  { value: "price-desc", label: "Giá giảm dần" },
];

const PRICE_TIERS = [
  { value: "", label: "Tất cả" },
  { value: "under1m", label: "Dưới 1 triệu" },
  { value: "1-3m", label: "1 - 3 triệu" },
  { value: "over3m", label: "Trên 3 triệu" },
] as const;

const FILTER_PANEL_TITLES: Record<string, string> = {
  all: "Bộ lọc tìm kiếm",
  price: "Mức giá",
  voltage: "Điện áp",
  power: "Dung lượng (Ah)",
  brand: "Hãng",
  type: "Loại",
  usage: "Nhu cầu sử dụng",
};

function computeFilterPanelPositionStyle(anchorEl: HTMLElement): CSSProperties {
  const rect = anchorEl.getBoundingClientRect();
  const edge = 12;
  const maxAllowed = Math.max(300, window.innerWidth - edge * 2);
  const panelW = Math.min(680, Math.max(420, rect.width), maxAllowed);
  let left = rect.left;
  if (left + panelW > window.innerWidth - edge) {
    left = window.innerWidth - panelW - edge;
  }
  if (left < edge) left = edge;
  const margin = 8;
  const gap = 8;
  const spaceBelow = window.innerHeight - rect.bottom - margin;
  const spaceAbove = rect.top - margin;
  const minUseful = 160;
  const openBelow = spaceBelow >= minUseful || spaceBelow >= spaceAbove;
  if (openBelow) {
    return {
      position: "fixed",
      top: rect.bottom + gap,
      left,
      width: panelW,
      maxHeight: Math.max(120, spaceBelow - gap),
      zIndex: 100002,
    };
  }
  return {
    position: "fixed",
    bottom: window.innerHeight - rect.top + gap,
    left,
    width: panelW,
    maxHeight: Math.max(120, spaceAbove - gap),
    zIndex: 100002,
  };
}

type FilterOptionsType = {
  voltage?: string[];
  power?: string[];
  brand?: string[];
  type?: string[];
  usage?: string[];
};

type SelectedFiltersState = {
  /** Đa chọn */
  voltage?: string[];
  power?: string[];
  brand?: string[];
  type?: string[];
  usage?: string[];
  /** Chỉ chọn một khoảng */
  priceTier?: string;
};

const MULTI_FILTER_KEYS = [
  "voltage",
  "power",
  "brand",
  "type",
  "usage",
] as const;

type MultiFilterKey = (typeof MULTI_FILTER_KEYS)[number];

function buildCategoryProductsQuery(
  selectedFilters: SelectedFiltersState,
  sortBy: string,
  search: string,
): GetProductsByCategorySlugParams {
  const params: GetProductsByCategorySlugParams = {
    page: 1,
    getFull: true,
  };
  const q = search.trim();
  if (q) params.name = q;

  const tier = selectedFilters.priceTier;
  if (tier === "under1m") params.priceTo = 999_999;
  else if (tier === "1-3m") {
    params.priceFrom = 1_000_000;
    params.priceTo = 3_000_000;
  } else if (tier === "over3m") params.priceFrom = 3_000_001;

  if (selectedFilters.voltage?.length) {
    params.voltageTerms = selectedFilters.voltage.join(",");
  }
  if (selectedFilters.power?.length) {
    params.powerTerms = selectedFilters.power.join(",");
  }
  if (sortBy !== "default") params.sortBy = sortBy;
  return params;
}

function isMultiFilterKey(k: string): k is MultiFilterKey {
  return (MULTI_FILTER_KEYS as readonly string[]).includes(k);
}

function countActiveFilterSelections(s: SelectedFiltersState): number {
  let n = 0;
  if (s.priceTier) n += 1;
  for (const k of MULTI_FILTER_KEYS) {
    n += s[k]?.length ?? 0;
  }
  return n;
}

function pillClass(active: boolean) {
  return cn(
    "rounded-sm border px-3.5 py-2 text-sm font-medium transition-colors",
    active
      ? "border-blue-600 bg-white text-blue-600"
      : "border-gray-200 bg-white text-gray-800 hover:border-gray-300"
  );
}

function chipTriggerClass(active: boolean) {
  return cn(
    "inline-flex shrink-0 items-center gap-1.5 rounded border bg-white px-3 py-2 text-sm font-medium shadow-sm transition-colors",
    active
      ? "border-blue-600 text-blue-600 ring-1 ring-blue-600/25"
      : "border-gray-200 text-gray-800 hover:border-gray-300"
  );
}

function DropdownFooter({ onClose }: { onClose: () => void }) {
  return (
    <div className="mt-4 flex gap-2 border-t border-gray-100 pt-4">
      <button
        type="button"
        onClick={onClose}
        className="rounded-sm border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-800 hover:bg-gray-50"
      >
        Đóng
      </button>
      <button
        type="button"
        onClick={onClose}
        className="flex-1 rounded-sm bg-primary py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary-dark"
      >
        Xem kết quả
      </button>
    </div>
  );
}

function CategoryFilterToolbar({
  filterOptions,
  selectedFilters,
  handleFilterChange,
  clearFilters,
  hasActiveFilters,
  sortBy,
  setSortBy,
  searchQuery,
  setSearchQuery,
}: {
  filterOptions: FilterOptionsType;
  selectedFilters: SelectedFiltersState;
  handleFilterChange: (type: string, value: string) => void;
  clearFilters: () => void;
  hasActiveFilters: boolean;
  sortBy: string;
  setSortBy: (v: string) => void;
  searchQuery: string;
  setSearchQuery: (v: string) => void;
}) {
  const [menu, setMenu] = useState<string | null>(null);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [panelStyle, setPanelStyle] = useState<CSSProperties>({});
  const panelRef = useRef<HTMLDivElement>(null);
  const toolbarRef = useRef<HTMLDivElement>(null);

  const closeMenu = useCallback(() => {
    setMenu(null);
    setAnchorEl(null);
    setPanelStyle({});
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const onChange = () => {
      closeMenu();
      if (mq.matches) setMobileFilterOpen(false);
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [closeMenu]);

  const toggleFilterPanel = (key: string, el: HTMLButtonElement) => {
    if (menu === key) {
      closeMenu();
      return;
    }
    setAnchorEl(el);
    setMenu(key);
  };

  useLayoutEffect(() => {
    if (!menu || !anchorEl) {
      const clearId = requestAnimationFrame(() => setPanelStyle({}));
      return () => cancelAnimationFrame(clearId);
    }
    const id = requestAnimationFrame(() =>
      setPanelStyle(computeFilterPanelPositionStyle(anchorEl))
    );
    return () => cancelAnimationFrame(id);
  }, [menu, anchorEl]);

  useEffect(() => {
    if (!menu || !anchorEl) return;
    const onScrollOrResize = () => {
      setPanelStyle(computeFilterPanelPositionStyle(anchorEl));
    };
    window.addEventListener("scroll", onScrollOrResize, true);
    window.addEventListener("resize", onScrollOrResize);
    return () => {
      window.removeEventListener("scroll", onScrollOrResize, true);
      window.removeEventListener("resize", onScrollOrResize);
    };
  }, [menu, anchorEl]);

  useEffect(() => {
    if (!menu) return;
    const onDocClick = (e: MouseEvent) => {
      const t = e.target as Node;
      if (panelRef.current?.contains(t)) return;
      if (toolbarRef.current?.contains(t)) return;
      closeMenu();
    };
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, [menu, closeMenu]);

  useEffect(() => {
    if (!menu) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeMenu();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menu, closeMenu]);

  const priceActive = Boolean(selectedFilters.priceTier);
  const voltageActive = (selectedFilters.voltage?.length ?? 0) > 0;
  const powerActive = (selectedFilters.power?.length ?? 0) > 0;
  const brandActive = (selectedFilters.brand?.length ?? 0) > 0;
  const typeActive = (selectedFilters.type?.length ?? 0) > 0;
  const usageActive = (selectedFilters.usage?.length ?? 0) > 0;

  const filterPillRow = (
    label: string,
    filterKey: MultiFilterKey,
    options: string[],
    selected?: string[]
  ) => (
    <div>
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
        {label}
      </p>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => handleFilterChange(filterKey, opt)}
            className={pillClass(selected?.includes(opt) ?? false)}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );

  const renderAllFiltersContent = () => (
    <div className="space-y-6">
      <div>
        <p className="mb-2 text-sm font-semibold text-gray-900">Mức giá</p>
        <div className="flex flex-wrap gap-2">
          {PRICE_TIERS.map((t) => (
            <button
              key={t.value || "all"}
              type="button"
              onClick={() =>
                handleFilterChange("priceTier", t.value || "__clear__")
              }
              className={pillClass(
                t.value === ""
                  ? !selectedFilters.priceTier
                  : selectedFilters.priceTier === t.value
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>
      {filterOptions.voltage && filterOptions.voltage.length > 0 &&
        filterPillRow(
          "Điện áp",
          "voltage",
          filterOptions.voltage,
          selectedFilters.voltage
        )}
      {filterOptions.power && filterOptions.power.length > 0 &&
        filterPillRow(
          "Dung lượng (Ah)",
          "power",
          filterOptions.power,
          selectedFilters.power
        )}
      {filterOptions.brand && filterOptions.brand.length > 0 &&
        filterPillRow(
          "Hãng",
          "brand",
          filterOptions.brand,
          selectedFilters.brand
        )}
      {filterOptions.type && filterOptions.type.length > 0 &&
        filterPillRow(
          "Loại",
          "type",
          filterOptions.type,
          selectedFilters.type
        )}
      {filterOptions.usage && filterOptions.usage.length > 0 &&
        filterPillRow(
          "Nhu cầu sử dụng",
          "usage",
          filterOptions.usage,
          selectedFilters.usage
        )}
    </div>
  );

  const renderFilterPanelBody = () => {
    if (!menu) return null;
    if (menu === "price") {
      return (
        <div className="flex flex-wrap gap-2">
          {PRICE_TIERS.map((t) => (
            <button
              key={t.value || "all"}
              type="button"
              onClick={() =>
                handleFilterChange("priceTier", t.value || "__clear__")
              }
              className={pillClass(
                t.value === ""
                  ? !selectedFilters.priceTier
                  : selectedFilters.priceTier === t.value
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
      );
    }
    if (menu === "voltage" && filterOptions.voltage?.length) {
      return (
        <div className="flex flex-wrap gap-2">
          {filterOptions.voltage.map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => handleFilterChange("voltage", v)}
              className={pillClass(selectedFilters.voltage?.includes(v) ?? false)}
            >
              {v}
            </button>
          ))}
        </div>
      );
    }
    if (menu === "power" && filterOptions.power?.length) {
      return (
        <div className="flex max-h-[min(50vh,320px)] flex-wrap gap-2 overflow-y-auto pr-1">
          {filterOptions.power.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => handleFilterChange("power", p)}
              className={pillClass(selectedFilters.power?.includes(p) ?? false)}
            >
              {p}
            </button>
          ))}
        </div>
      );
    }
    if (menu === "brand" && filterOptions.brand?.length) {
      return (
        <div className="flex flex-wrap gap-2">
          {filterOptions.brand.map((b) => (
            <button
              key={b}
              type="button"
              onClick={() => handleFilterChange("brand", b)}
              className={pillClass(selectedFilters.brand?.includes(b) ?? false)}
            >
              {b}
            </button>
          ))}
        </div>
      );
    }
    if (menu === "type" && filterOptions.type?.length) {
      return (
        <div className="flex flex-wrap gap-2">
          {filterOptions.type.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => handleFilterChange("type", t)}
              className={pillClass(selectedFilters.type?.includes(t) ?? false)}
            >
              {t}
            </button>
          ))}
        </div>
      );
    }
    if (menu === "usage" && filterOptions.usage?.length) {
      return (
        <div className="flex flex-wrap gap-2">
          {filterOptions.usage.map((u) => (
            <button
              key={u}
              type="button"
              onClick={() => handleFilterChange("usage", u)}
              className={pillClass(selectedFilters.usage?.includes(u) ?? false)}
            >
              {u}
            </button>
          ))}
        </div>
      );
    }
    if (menu === "all") return renderAllFiltersContent();
    return null;
  };

  return (
    <div id="bo-loc" className="mt-6 border-t border-gray-200 pt-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <h2 className="hidden shrink-0 text-lg font-bold text-gray-900 md:block md:pt-1">
          Bộ lọc tìm kiếm
        </h2>
        <div className="min-w-0 flex-1 md:overflow-x-auto scrollbar-hide [-webkit-overflow-scrolling:touch]">
          <div
            ref={toolbarRef}
            className="flex w-full flex-col gap-2 md:w-max md:flex-row md:items-center md:gap-2 md:pb-1"
            data-filter-toolbar
          >
            <button
              type="button"
              onClick={() => setMobileFilterOpen(true)}
              className={cn(
                chipTriggerClass(hasActiveFilters),
                "w-full justify-center py-2.5 md:hidden"
              )}
            >
              <Filter size={ICON_SIZE.sm} className="text-gray-600" />
              Lọc
              {hasActiveFilters && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-sm bg-blue-600 px-1 text-[11px] font-bold text-white">
                  {countActiveFilterSelections(selectedFilters)}
                </span>
              )}
            </button>
            <div className="hidden w-max items-center gap-2 md:flex">
              <button
                type="button"
                onClick={(e) => toggleFilterPanel("all", e.currentTarget)}
                className={chipTriggerClass(hasActiveFilters)}
              >
                <Filter size={ICON_SIZE.sm} className="text-gray-600" />
                Lọc
                {hasActiveFilters && (
                  <span className="flex h-5 min-w-5 items-center justify-center rounded-sm bg-blue-600 px-1 text-[11px] font-bold text-white">
                    {countActiveFilterSelections(selectedFilters)}
                  </span>
                )}
              </button>
              <button
                type="button"
                onClick={(e) => toggleFilterPanel("price", e.currentTarget)}
                className={chipTriggerClass(priceActive)}
              >
                Mức giá
                <ChevronDown size={ICON_SIZE.sm} className="text-gray-500" />
              </button>
              {filterOptions.voltage && filterOptions.voltage.length > 0 && (
                <button
                  type="button"
                  onClick={(e) => toggleFilterPanel("voltage", e.currentTarget)}
                  className={chipTriggerClass(voltageActive)}
                >
                  Điện áp
                  <ChevronDown size={ICON_SIZE.sm} className="text-gray-500" />
                </button>
              )}
              {filterOptions.power && filterOptions.power.length > 0 && (
                <button
                  type="button"
                  onClick={(e) => toggleFilterPanel("power", e.currentTarget)}
                  className={chipTriggerClass(powerActive)}
                >
                  Dung lượng
                  <ChevronDown size={ICON_SIZE.sm} className="text-gray-500" />
                </button>
              )}
              {filterOptions.brand && filterOptions.brand.length > 0 && (
                <button
                  type="button"
                  onClick={(e) => toggleFilterPanel("brand", e.currentTarget)}
                  className={chipTriggerClass(brandActive)}
                >
                  Hãng
                  <ChevronDown size={ICON_SIZE.sm} className="text-gray-500" />
                </button>
              )}
              {filterOptions.type && filterOptions.type.length > 0 && (
                <button
                  type="button"
                  onClick={(e) => toggleFilterPanel("type", e.currentTarget)}
                  className={chipTriggerClass(typeActive)}
                >
                  Loại
                  <ChevronDown size={ICON_SIZE.sm} className="text-gray-500" />
                </button>
              )}
              {filterOptions.usage && filterOptions.usage.length > 0 && (
                <button
                  type="button"
                  onClick={(e) => toggleFilterPanel("usage", e.currentTarget)}
                  className={chipTriggerClass(usageActive)}
                >
                  Nhu cầu sử dụng
                  <ChevronDown size={ICON_SIZE.sm} className="text-gray-500" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-3 border-t border-gray-100 pt-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
          <span className="shrink-0 text-sm font-medium text-gray-600">
            Sắp xếp theo:
          </span>
          {sortOptions.map((opt) => (
            <button
              key={opt.value}
              type="button"
              title={opt.label}
              aria-label={opt.label}
              onClick={() => setSortBy(opt.value)}
              className={cn(
                "inline-flex shrink-0 items-center gap-1 whitespace-nowrap rounded-sm border px-2.5 py-2 text-sm font-medium transition-colors md:px-3.5",
                sortBy === opt.value
                  ? "border-blue-600 bg-white text-blue-600"
                  : "border-gray-200 bg-white text-gray-800 hover:border-gray-300"
              )}
            >
              {opt.value === "default" && opt.label}
              {opt.value === "price-asc" && (
                <>
                  <span className="hidden items-center gap-1 md:inline-flex">
                    <ArrowUpNarrowWide
                      size={14}
                      className="shrink-0 opacity-90"
                      aria-hidden
                    />
                    {opt.label}
                  </span>
                  <span className="inline-flex items-center gap-0.5 md:hidden">
                    Giá
                    <ArrowUpNarrowWide
                      size={ICON_SIZE.sm}
                      className="shrink-0 opacity-90"
                      aria-hidden
                    />
                  </span>
                </>
              )}
              {opt.value === "price-desc" && (
                <>
                  <span className="hidden items-center gap-1 md:inline-flex">
                    <ArrowDownWideNarrow
                      size={14}
                      className="shrink-0 opacity-90"
                      aria-hidden
                    />
                    {opt.label}
                  </span>
                  <span className="inline-flex items-center gap-0.5 md:hidden">
                    Giá
                    <ArrowDownWideNarrow
                      size={ICON_SIZE.sm}
                      className="shrink-0 opacity-90"
                      aria-hidden
                    />
                  </span>
                </>
              )}
            </button>
          ))}
        </div>
        <div className="relative w-full shrink-0 lg:max-w-sm">
          <Search
            size={ICON_SIZE.sm}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            aria-hidden
          />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Nhập tên sản phẩm bạn..."
            className="w-full rounded border border-gray-200 bg-white py-2.5 pl-10 pr-3 text-sm text-gray-900 placeholder:text-gray-400 shadow-sm focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
            autoComplete="off"
          />
        </div>
      </div>

      {menu &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            ref={panelRef}
            role="dialog"
            aria-modal="false"
            aria-label={menu ? FILTER_PANEL_TITLES[menu] : undefined}
            style={panelStyle}
            className="flex min-h-0 flex-col overflow-hidden rounded-sm border border-gray-200 bg-white shadow-lg outline-none"
          >
            <div className="shrink-0 border-b border-gray-100 px-4 py-3">
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-left text-base font-bold leading-snug text-gray-900">
                  {FILTER_PANEL_TITLES[menu] ?? ""}
                </h3>
                {menu === "all" && hasActiveFilters && (
                  <button
                    type="button"
                    onClick={() => clearFilters()}
                    className="shrink-0 text-sm font-medium text-blue-600 hover:text-blue-700"
                  >
                    Xóa bộ lọc
                  </button>
                )}
              </div>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-4">
              {renderFilterPanelBody()}
            </div>
            <div className="shrink-0 border-t border-gray-100 bg-white px-4 pb-4 pt-3">
              <DropdownFooter onClose={closeMenu} />
            </div>
          </div>,
          document.body
        )}

      <Drawer
        open={mobileFilterOpen}
        onOpenChange={setMobileFilterOpen}
        direction="left"
        shouldScaleBackground={false}
      >
        <DrawerContent
          variant="left"
          className="flex h-full min-h-0 flex-col border-0 px-0 pb-0"
        >
          <DrawerHeader className="shrink-0 border-b border-gray-100 px-4 pb-3 pt-3 text-left">
            <div className="flex items-start justify-end gap-2 md:justify-between">
              <DrawerTitle className="hidden min-w-0 flex-1 text-left text-base font-bold leading-snug text-gray-900 md:block">
                Bộ lọc tìm kiếm
              </DrawerTitle>
              <div className="flex shrink-0 items-center gap-1">
                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={() => clearFilters()}
                    className="text-sm font-medium text-blue-600 hover:text-blue-700"
                  >
                    Xóa
                  </button>
                )}
                <DrawerClose
                  type="button"
                  className="rounded-sm p-2 text-gray-600 hover:bg-gray-100"
                  aria-label="Đóng bộ lọc"
                >
                  <X size={ICON_SIZE.lg} />
                </DrawerClose>
              </div>
            </div>
          </DrawerHeader>
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-4">
            {renderAllFiltersContent()}
          </div>
          <DrawerFooter className="shrink-0 border-t border-gray-100 bg-white p-0 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3">
            <DropdownFooter onClose={() => setMobileFilterOpen(false)} />
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
}

export default function CategoryPageContent({
  categoryInfo,
  descriptionHtml,
  mockProducts = defaultMockProducts,
  filterOptions = defaultFilterOptions,
  breadcrumbItems = [],
  subCategories = [],
}: CategoryPageContentProps) {
  const [apiSubCategories, setApiSubCategories] = useState<
    NonNullable<CategoryPageContentProps["subCategories"]>
  >([]);

  const resolvedSubCategories =
    subCategories.length > 0 ? subCategories : apiSubCategories;

  useEffect(() => {
    if (subCategories.length > 0) return;

    const clearId = requestAnimationFrame(() => setApiSubCategories([]));
    let cancelled = false;
    (async () => {
      try {
        const category = await categoriesApi.getBySlug(categoryInfo.rootSlug);

        const next = (category.children ?? []).map(
          (c: {
            id: number;
            name: string;
            slug: string;
            thumbnailUrl?: string;
            iconUrl?: string;
          }) => ({
            id: c.id,
            name: c.name,
            slug: c.slug,
            thumbnailUrl: c.thumbnailUrl,
            iconUrl: c.iconUrl,
          }),
        );
        if (!cancelled) setApiSubCategories(next);
      } catch {
        if (!cancelled) setApiSubCategories([]);
      }
    })();

    return () => {
      cancelled = true;
      cancelAnimationFrame(clearId);
    };
  }, [categoryInfo.rootSlug, subCategories]);

  const [selectedFilters, setSelectedFilters] = useState<SelectedFiltersState>(
    {}
  );
  const [sortBy, setSortBy] = useState("default");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const t = window.setTimeout(() => setDebouncedSearch(searchQuery), 300);
    return () => window.clearTimeout(t);
  }, [searchQuery]);

  const categoryProducts = useMemo(() => {
    return mockProducts.filter((p) => p.rootCategorySlug === categoryInfo.rootSlug && p.status === "A");
  }, [mockProducts, categoryInfo.rootSlug]);

  const voltageKey = (selectedFilters.voltage ?? []).join("\0");
  const powerKey = (selectedFilters.power ?? []).join("\0");

  const needsRemoteFetch = useMemo(() => {
    if (debouncedSearch.trim()) return true;
    if (sortBy !== "default") return true;
    if (selectedFilters.priceTier) return true;
    if ((selectedFilters.voltage?.length ?? 0) > 0) return true;
    if ((selectedFilters.power?.length ?? 0) > 0) return true;
    return false;
  }, [
    debouncedSearch,
    sortBy,
    selectedFilters.priceTier,
    voltageKey,
    powerKey,
  ]);

  const [remoteProducts, setRemoteProducts] = useState<Product[] | null>(null);
  const [listLoading, setListLoading] = useState(false);

  useEffect(() => {
    if (!needsRemoteFetch) {
      setRemoteProducts(null);
      setListLoading(false);
      return;
    }
    let cancelled = false;
    setListLoading(true);
    const params = buildCategoryProductsQuery(
      selectedFilters,
      sortBy,
      debouncedSearch,
    );
    categoriesApi
      .getProductsByCategorySlug(categoryInfo.rootSlug, params)
      .then((res) => {
        const raw = Array.isArray(res?.data)
          ? res.data
          : Array.isArray(res)
            ? res
            : [];
        const mapped = (raw as ApiProduct[]).map((p) =>
          mapApiProductToCategoryCard(p, categoryInfo.rootSlug),
        );
        if (!cancelled) {
          setRemoteProducts(mapped);
          setListLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setRemoteProducts([]);
          setListLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [
    needsRemoteFetch,
    categoryInfo.rootSlug,
    debouncedSearch,
    sortBy,
    selectedFilters.priceTier,
    voltageKey,
    powerKey,
  ]);

  const serverList = remoteProducts ?? categoryProducts;

  const filteredProducts = useMemo(() => {
    let filtered = [...serverList];
    if (selectedFilters.brand?.length) {
      const set = new Set(selectedFilters.brand);
      filtered = filtered.filter((p) => p.brand && set.has(p.brand));
    }
    if (selectedFilters.type?.length) {
      const set = new Set(selectedFilters.type);
      filtered = filtered.filter((p) => p.type && set.has(p.type));
    }
    if (selectedFilters.usage?.length) {
      const set = new Set(selectedFilters.usage);
      filtered = filtered.filter((p) => p.usage && set.has(p.usage));
    }
    return filtered;
  }, [serverList, selectedFilters.brand, selectedFilters.type, selectedFilters.usage]);

  const handleFilterChange = (filterType: string, value: string) => {
    if (filterType === "priceTier") {
      setSelectedFilters((prev) => {
        if (value === "__clear__" || value === "") {
          const next = { ...prev };
          delete next.priceTier;
          return next;
        }
        if (prev.priceTier === value) {
          const next = { ...prev };
          delete next.priceTier;
          return next;
        }
        return { ...prev, priceTier: value };
      });
      return;
    }
    if (!isMultiFilterKey(filterType)) return;
    setSelectedFilters((prev) => {
      const key = filterType;
      const prevArr = prev[key] ?? [];
      const nextArr = prevArr.includes(value)
        ? prevArr.filter((x) => x !== value)
        : [...prevArr, value];
      const next = { ...prev };
      if (nextArr.length === 0) delete next[key];
      else next[key] = nextArr;
      return next;
    });
  };

  const clearFilters = () => setSelectedFilters({});
  const hasActiveFilters = countActiveFilterSelections(selectedFilters) > 0;

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto max-w-7xl px-2 py-3 sm:px-4 sm:py-4">
        <Breadcrumbs items={breadcrumbItems} currentPage={categoryInfo.title} />
        <div className="rounded border border-gray-200 bg-white p-2.5 shadow-sm sm:p-4 md:p-6">
              <div className="mb-5 pb-4 border-b border-gray-200">
                <h2 className="text-xl md:text-2xl font-semibold text-gray-900">
                  {categoryInfo.title}
                </h2>
                <p className="mt-2 text-sm md:text-base text-gray-600">
                  Ắc quy HN Sài Gòn kinh doanh ắc quy chất lượng cao, phù hợp cho nhiều dòng xe
                  máy, ô tô, xe tải và ứng dụng công nghiệp. Dưới đây là các dòng sản phẩm tiêu biểu
                  trong danh mục này.
                </p>
                {resolvedSubCategories.length > 0 && (
                  <div className="mt-4 -mx-1 overflow-x-auto">
                    <div className="flex w-max gap-3 px-1">
                    {resolvedSubCategories.map((cate) => (
                      <Link
                        key={cate.id}
                        href={`/${cate.slug}`}
                        className="group flex w-28 shrink-0 flex-col items-center justify-between gap-2 rounded-md border border-gray-200 bg-gray-50 px-3 py-3 hover:border-accent hover:bg-white transition-colors sm:w-32"
                      >
                        <div className="flex h-12 w-full items-center justify-center rounded border border-gray-100 overflow-hidden bg-white">
                          <img
                            src={getImageUrl(cate.thumbnailUrl || cate.iconUrl)}
                            alt={cate.name}
                            className="h-full w-full object-contain"
                          />
                        </div>
                        <span className="text-xs sm:text-sm font-medium text-gray-800 text-center leading-snug">
                          {cate.name}
                        </span>
                      </Link>
                    ))}
                    </div>
                  </div>
                )}
              </div>

              <CategoryFilterToolbar
                filterOptions={filterOptions}
                selectedFilters={selectedFilters}
                handleFilterChange={handleFilterChange}
                clearFilters={clearFilters}
                hasActiveFilters={hasActiveFilters}
                sortBy={sortBy}
                setSortBy={setSortBy}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
              />

              <div className="mb-4 mt-6">
                <p className="text-sm text-gray-600">
                  {listLoading ? (
                    "Đang lọc sản phẩm…"
                  ) : (
                    <>
                      Tìm thấy{" "}
                      <span className="font-semibold text-gray-900">
                        {filteredProducts.length}
                      </span>{" "}
                      kết quả
                    </>
                  )}
                </p>
              </div>

              {filteredProducts.length > 0 ? (
                <div
                  className={cn(
                    "grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-4 lg:gap-4",
                    listLoading && "pointer-events-none opacity-50",
                  )}
                >
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.product_id} item={product} />
                  ))}
                </div>
              ) : listLoading ? (
                <div className="py-12 text-center text-gray-500">Đang tải…</div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">Không tìm thấy sản phẩm nào</p>
                  {hasActiveFilters && (
                    <button
                      onClick={clearFilters}
                      className="mt-4 rounded-sm bg-primary px-4 py-2 text-primary-foreground transition-colors hover:bg-primary-dark"
                    >
                      Xóa bộ lọc
                    </button>
                  )}
                </div>
              )}
        </div>

        <ProductDescriptionBlock
          descriptionHtml={descriptionHtml}
          title="Mô tả danh mục"
        />

      </div>
    </div>
  );
}
