"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { Search } from "lucide-react";
import { ICON_SIZE } from "@/lib/icons";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { allMockProducts, MockProduct } from "@/data/mockProducts";
import BlurImage from "./BlurImage";

interface SearchBoxProps {
  isActiveSearch?: boolean;
  setIsActiveSearch?: (active: boolean) => void;
}

const CDN_URL = process.env.NEXT_PUBLIC_CDN_URL || "https://cdn-v2.didongviet.vn";

const formatPrice = (price: number | string): string => {
  const numPrice = typeof price === "string" ? parseFloat(price) : price;
  if (isNaN(numPrice) || numPrice < 1000) {
    return "Liên hệ";
  }
  return numPrice.toLocaleString("vi-VN") + " đ";
};

export const SearchBox = ({ isActiveSearch, setIsActiveSearch }: SearchBoxProps) => {
  const router = useRouter();
  const [searchText, setSearchText] = useState("");
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Filter products based on search text
  const filteredProducts = useMemo(() => {
    if (!searchText.trim()) return [];
    
    const query = searchText.toLowerCase().trim();
    return allMockProducts
      .filter((product: MockProduct) => {
        if (product.status !== "A") return false;
        const productName = product.product.toLowerCase();
        const brand = product.brand?.toLowerCase() || "";
        const type = product.type?.toLowerCase() || "";
        return (
          productName.includes(query) ||
          brand.includes(query) ||
          type.includes(query)
        );
      })
      .slice(0, 8); // Limit to 8 results
  }, [searchText]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
        setIsActiveSearch?.(false);
      }
    };

    if (showResults) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [showResults, setIsActiveSearch]);

  // Close on ESC key
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setShowResults(false);
        setIsActiveSearch?.(false);
      }
    };

    if (showResults) {
      document.addEventListener("keydown", handleEsc);
      return () => document.removeEventListener("keydown", handleEsc);
    }
  }, [showResults, setIsActiveSearch]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchText.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchText.trim())}`);
      setShowResults(false);
      setIsActiveSearch?.(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
    setShowResults(e.target.value.trim().length > 0);
    setIsActiveSearch?.(true);
  };

  const handleProductClick = () => {
    setShowResults(false);
    setIsActiveSearch?.(false);
    setSearchText("");
  };

  return (
    <div ref={searchRef} className="relative w-full">
      <form onSubmit={handleSearch} className="relative">
        <input
          type="text"
          value={searchText}
          onChange={handleInputChange}
          placeholder="Bạn muốn tìm gì..."
          className={cn(
            "w-full h-9 px-4 pr-10 rounded-lg border-0 bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
          )}
          onFocus={() => {
            if (searchText.trim()) {
              setShowResults(true);
            }
            setIsActiveSearch?.(true);
          }}
        />
        <button
          type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2 transition-colors text-primary hover:opacity-80"
          aria-label="Tìm kiếm"
        >
          <Search size={ICON_SIZE.md} />
        </button>
      </form>

      {/* Search Results Dropdown */}
      {showResults && filteredProducts.length > 0 && (
        <div className="absolute top-full left-[-8px] right-[-8px] mt-2 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-96 overflow-y-auto">
          <div className="p-2">
            <div className="text-xs text-gray-500 px-3 py-2 font-medium">
              Kết quả tìm kiếm ({filteredProducts.length})
            </div>
            {filteredProducts.map((product: MockProduct) => {
              const imageUrl = product.thumbnail
                ? `${CDN_URL}/${product.thumbnail}`
                : "/no-image-available.png";
              const productUrl = `/${product.productSlug}.html`;

              return (
                <Link
                  key={product.product_id}
                  href={productUrl}
                  onClick={handleProductClick}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors group"
                >
                  {/* Product Image */}
                  <div className="shrink-0 w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
                    <BlurImage
                      src={imageUrl}
                      alt={product.product}
                      width={48}
                      height={48}
                      className="object-contain"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-gray-900 line-clamp-1 group-hover:text-primary transition-colors">
                      {product.product}
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-sm font-bold ${(product as any).showPrice === false ? "text-yellow-600" : "text-red-600"}`}>
                        {(product as any).showPrice === false
                          ? "Liên hệ"
                          : formatPrice(product.price)}
                      </span>
                      {(product as any).showPrice !== false &&
                        product.list_price &&
                        parseFloat(product.list_price) > parseFloat(product.price) && (
                        <span className="text-xs text-gray-500 line-through">
                          {formatPrice(product.list_price)}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* No Results */}
      {showResults && searchText.trim() && filteredProducts.length === 0 && (
        <div className="absolute top-full left-[-8px] right-[-8px] mt-2 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          <div className="p-4 text-center text-sm text-gray-500">
            Không tìm thấy sản phẩm nào
          </div>
        </div>
      )}
    </div>
  );
};

