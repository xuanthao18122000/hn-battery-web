"use client";

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { ProductCard } from "@/components/website/product/ProductCard";
import { Breadcrumbs } from "@/components/website/common";
import { ChevronDown, Filter, X } from "lucide-react";
import { ICON_SIZE } from "@/lib/icons";
import { cn } from "@/lib/utils";
import { getImageUrl } from "@/utils/image";
import { categoriesApi } from "@/lib/api/categories";

const ProductDescriptionBlock = dynamic(
  () => import("@/components/website/product/ProductDescriptionBlock"),
  {
    loading: () => (
      <div
        className="mt-6 min-h-[240px] animate-pulse rounded-lg border border-gray-200 bg-gray-50"
        aria-hidden
      />
    ),
  },
);

interface Product {
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
  voltage?: string;
  power?: string;
  brand?: string;
  type?: string;
  usage?: string;
}

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

const sortOptions = [
  { value: "default", label: "Nổi bật" },
  { value: "price-asc", label: "Giá tăng dần" },
  { value: "price-desc", label: "Giá giảm dần" },
];


function FilterSection({
  title,
  open,
  onToggle,
  children,
}: {
  title: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="border-b border-gray-200 last:border-b-0">
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between py-4 text-left font-semibold text-gray-900"
      >
        {title}
        <ChevronDown
          size={ICON_SIZE.md}
          className={cn("transition-transform text-gray-500", open && "rotate-180")}
        />
      </button>
      {open && <div className="pb-4">{children}</div>}
    </div>
  );
}

type FilterOptionsType = {
  voltage?: string[];
  power?: string[];
  brand?: string[];
  type?: string[];
  usage?: string[];
};

function FilterPanelContent({
  filterOptions,
  selectedFilters,
  handleFilterChange,
  openSections,
  toggleSection,
  clearFilters,
  hasActiveFilters,
}: {
  filterOptions: FilterOptionsType;
  selectedFilters: Record<string, string | undefined>;
  handleFilterChange: (type: string, value: string) => void;
  openSections: Record<string, boolean>;
  toggleSection: (key: string) => void;
  clearFilters: () => void;
  hasActiveFilters: boolean;
}) {
  return (
    <>
      {hasActiveFilters && (
        <button
          onClick={clearFilters}
          className="text-sm text-accent hover:text-accent/90 font-medium mb-2"
        >
          Xóa bộ lọc
        </button>
      )}
      <FilterSection
        title="Mức giá"
        open={openSections.price}
        onToggle={() => toggleSection("price")}
      >
        <div className="space-y-2 text-sm">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="radio" name="price" defaultChecked className="rounded-full" />
            <span>Tất cả</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="radio" name="price" className="rounded-full" />
            <span>Dưới 1 triệu</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="radio" name="price" className="rounded-full" />
            <span>1 - 3 triệu</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="radio" name="price" className="rounded-full" />
            <span>Trên 3 triệu</span>
          </label>
        </div>
      </FilterSection>
      {filterOptions.voltage && filterOptions.voltage.length > 0 && (
        <FilterSection
          title="Điện áp"
          open={openSections.voltage}
          onToggle={() => toggleSection("voltage")}
        >
          <div className="flex flex-wrap gap-2">
            {filterOptions.voltage.map((v) => (
              <button
                key={v}
                onClick={() => handleFilterChange("voltage", v)}
                className={cn(
                  "px-3 py-1.5 rounded-lg border text-sm transition-colors",
                  selectedFilters.voltage === v
                    ? "bg-accent text-accent-foreground border-accent"
                    : "bg-gray-50 border-gray-200 text-gray-700 hover:border-gray-300"
                )}
              >
                {v}
              </button>
            ))}
          </div>
        </FilterSection>
      )}
      {filterOptions.power && filterOptions.power.length > 0 && (
        <FilterSection
          title="Công suất (Ah)"
          open={openSections.power}
          onToggle={() => toggleSection("power")}
        >
          <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto">
            {filterOptions.power.map((p) => (
              <button
                key={p}
                onClick={() => handleFilterChange("power", p)}
                className={cn(
                  "px-3 py-1.5 rounded-lg border text-sm transition-colors",
                  selectedFilters.power === p
                    ? "bg-accent text-accent-foreground border-accent"
                    : "bg-gray-50 border-gray-200 text-gray-700 hover:border-gray-300"
                )}
              >
                {p}
              </button>
            ))}
          </div>
        </FilterSection>
      )}
      {filterOptions.brand && filterOptions.brand.length > 0 && (
        <FilterSection
          title="Hãng"
          open={openSections.brand}
          onToggle={() => toggleSection("brand")}
        >
          <div className="space-y-1.5">
            {filterOptions.brand.map((b) => (
              <label key={b} className="flex items-center gap-2 cursor-pointer text-sm">
                <input
                  type="radio"
                  name="brand"
                  checked={selectedFilters.brand === b}
                  onChange={() => handleFilterChange("brand", b)}
                  className="rounded-full"
                />
                {b}
              </label>
            ))}
          </div>
        </FilterSection>
      )}
      {filterOptions.type && filterOptions.type.length > 0 && (
        <FilterSection
          title="Loại"
          open={openSections.type}
          onToggle={() => toggleSection("type")}
        >
          <div className="space-y-1.5">
            {filterOptions.type.map((t) => (
              <label key={t} className="flex items-center gap-2 cursor-pointer text-sm">
                <input
                  type="radio"
                  name="type"
                  checked={selectedFilters.type === t}
                  onChange={() => handleFilterChange("type", t)}
                  className="rounded-full"
                />
                {t}
              </label>
            ))}
          </div>
        </FilterSection>
      )}
      {filterOptions.usage && filterOptions.usage.length > 0 && (
        <FilterSection
          title="Sử dụng"
          open={openSections.usage}
          onToggle={() => toggleSection("usage")}
        >
          <div className="space-y-1.5">
            {filterOptions.usage.map((u) => (
              <label key={u} className="flex items-center gap-2 cursor-pointer text-sm">
                <input
                  type="radio"
                  name="usage"
                  checked={selectedFilters.usage === u}
                  onChange={() => handleFilterChange("usage", u)}
                  className="rounded-full"
                />
                {u}
              </label>
            ))}
          </div>
        </FilterSection>
      )}
    </>
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
  const [resolvedSubCategories, setResolvedSubCategories] = useState(subCategories);

  useEffect(() => {
    // Prefer server-provided subCategories; fallback to API when empty.
    if (subCategories.length > 0) {
      setResolvedSubCategories(subCategories);
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        const category = await categoriesApi.getBySlug(categoryInfo.rootSlug);

        const next = (category.children ?? []).map((c: any) => ({
          id: c.id,
          name: c.name,
          slug: c.slug,
          thumbnailUrl: c.thumbnailUrl,
          iconUrl: c.iconUrl,
        }));
        if (!cancelled) setResolvedSubCategories(next);
      } catch (err) {
        if (!cancelled) setResolvedSubCategories([]);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [categoryInfo.rootSlug, subCategories]);

  const [selectedFilters, setSelectedFilters] = useState<{
    voltage?: string;
    power?: string;
    brand?: string;
    type?: string;
    usage?: string;
  }>({});
  const [sortBy, setSortBy] = useState("default");
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    price: true,
    voltage: true,
    power: true,
    brand: true,
    type: true,
    usage: true,
  });

  const toggleSection = (key: string) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const categoryProducts = useMemo(() => {
    return mockProducts.filter((p) => p.rootCategorySlug === categoryInfo.rootSlug && p.status === "A");
  }, [mockProducts, categoryInfo.rootSlug]);

  const filteredProducts = useMemo(() => {
    let filtered = [...categoryProducts];
    if (selectedFilters.voltage) filtered = filtered.filter((p) => p.voltage === selectedFilters.voltage);
    if (selectedFilters.power) filtered = filtered.filter((p) => p.power === selectedFilters.power);
    if (selectedFilters.brand) filtered = filtered.filter((p) => p.brand === selectedFilters.brand);
    if (selectedFilters.type) filtered = filtered.filter((p) => p.type === selectedFilters.type);
    if (selectedFilters.usage) filtered = filtered.filter((p) => p.usage === selectedFilters.usage);
    switch (sortBy) {
      case "price-asc":
        filtered.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
        break;
      case "price-desc":
        filtered.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
        break;
      case "name-asc":
        filtered.sort((a, b) => a.product.localeCompare(b.product));
        break;
      case "name-desc":
        filtered.sort((a, b) => b.product.localeCompare(a.product));
        break;
      default:
        break;
    }
    return filtered;
  }, [categoryProducts, selectedFilters, sortBy]);

  const handleFilterChange = (filterType: string, value: string) => {
    setSelectedFilters((prev) => {
      if (prev[filterType as keyof typeof prev] === value) {
        const next = { ...prev };
        delete next[filterType as keyof typeof next];
        return next;
      }
      return { ...prev, [filterType]: value };
    });
  };

  const clearFilters = () => setSelectedFilters({});
  const hasActiveFilters = Object.keys(selectedFilters).length > 0;

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 max-w-7xl py-4">
        <Breadcrumbs items={breadcrumbItems} currentPage={categoryInfo.title} />
        <div className="flex gap-4 md:gap-6">
          {/* Left: Bộ lọc tìm kiếm */}
          <aside
            id="bo-loc"
            className="w-full md:w-64 shrink-0 hidden md:block"
          >
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm sticky top-24">
              <div className="px-4 pt-4 pb-2">
                <h2 className="font-semibold text-gray-900 text-lg">Bộ lọc tìm kiếm</h2>
              </div>
              <div className="px-4 pb-4">
                <FilterPanelContent
                  filterOptions={filterOptions}
                  selectedFilters={selectedFilters}
                  handleFilterChange={handleFilterChange}
                  openSections={openSections}
                  toggleSection={toggleSection}
                  clearFilters={clearFilters}
                  hasActiveFilters={hasActiveFilters}
                />
              </div>
            </div>
          </aside>

          {/* Right: Kết quả + grid */}
          <div className="flex-1 min-w-0">
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 md:p-6">
              <div className="mb-5 pb-4 border-b border-gray-200">
                <h2 className="text-xl md:text-2xl font-semibold text-gray-900">
                  {categoryInfo.title}
                </h2>
                <p className="mt-2 text-sm md:text-base text-gray-600">
                  Ắc quy GS là thương hiệu ắc quy axit chì chất lượng cao, phù hợp cho nhiều dòng xe
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
                        className="group flex w-28 shrink-0 flex-col items-center justify-between gap-2 rounded-xl border border-gray-200 bg-gray-50 px-3 py-3 hover:border-accent hover:bg-white transition-colors sm:w-32"
                      >
                        <div className="flex h-12 w-full items-center justify-center rounded-lg overflow-hidden bg-white">
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

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm text-gray-600">
                    Tìm thấy <span className="font-semibold text-gray-900">{filteredProducts.length}</span> kết quả
                  </p>
                  <button
                    type="button"
                    onClick={() => setFilterModalOpen(true)}
                    className="md:hidden inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-300 bg-white text-gray-700 text-sm font-medium hover:bg-gray-50"
                  >
                    <Filter size={ICON_SIZE.sm} />
                    Bộ lọc
                    {hasActiveFilters && (
                      <span className="min-w-4 h-4 rounded-full bg-accent text-accent-foreground text-xs flex items-center justify-center">
                        {Object.keys(selectedFilters).length}
                      </span>
                    )}
                  </button>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {sortOptions.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setSortBy(opt.value)}
                      className={cn(
                        "px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
                        sortBy === opt.value
                          ? "bg-accent text-accent-foreground"
                          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                      )}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.product_id} item={product} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">Không tìm thấy sản phẩm nào</p>
                  {hasActiveFilters && (
                    <button
                      onClick={clearFilters}
                      className="mt-4 px-4 py-2 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 transition-colors"
                    >
                      Xóa bộ lọc
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <ProductDescriptionBlock
          descriptionHtml={descriptionHtml}
          title="Mô tả danh mục"
        />

        {/* Modal Bộ lọc - mobile/tablet */}
        {filterModalOpen && (
          <div className="fixed inset-0 z-10000 md:hidden" aria-modal="true" role="dialog">
            <div
              className="absolute inset-0 bg-black/50"
              onClick={() => setFilterModalOpen(false)}
            />
            <div className="absolute right-0 top-0 bottom-0 w-full max-w-sm bg-white shadow-xl flex flex-col">
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 shrink-0">
                <h2 className="font-semibold text-lg text-gray-900">Bộ lọc tìm kiếm</h2>
                <button
                  type="button"
                  onClick={() => setFilterModalOpen(false)}
                  className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                  aria-label="Đóng"
                >
                  <X size={ICON_SIZE.lg} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto px-4 py-4">
                <FilterPanelContent
                  filterOptions={filterOptions}
                  selectedFilters={selectedFilters}
                  handleFilterChange={handleFilterChange}
                  openSections={openSections}
                  toggleSection={toggleSection}
                  clearFilters={clearFilters}
                  hasActiveFilters={hasActiveFilters}
                />
              </div>
              <div className="p-4 border-t border-gray-200 shrink-0">
                <button
                  type="button"
                  onClick={() => setFilterModalOpen(false)}
                  className="w-full py-3 rounded-lg bg-accent text-accent-foreground font-semibold hover:bg-accent/90 transition-colors"
                >
                  Áp dụng
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
