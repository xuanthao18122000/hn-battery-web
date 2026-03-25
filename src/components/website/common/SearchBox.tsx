"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Search, Loader2 } from "lucide-react";
import { ICON_SIZE } from "@/lib/icons";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { productsApi, Product } from "@/lib/api/products";
import { getImageUrl } from "@/utils/image";
import { formatPrice } from "@/utils/format";
import BlurImage from "./BlurImage";

interface SearchBoxProps {
  isActiveSearch?: boolean;
  setIsActiveSearch?: (active: boolean) => void;
}


export const SearchBox = ({ isActiveSearch, setIsActiveSearch }: SearchBoxProps) => {
  const router = useRouter();
  const [searchText, setSearchText] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const fetchResults = useCallback(async (query: string) => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    try {
      const data = await productsApi.search(query, 10);
      if (!controller.signal.aborted) {
        setResults(data);
        setShowResults(true);
      }
    } catch {
      if (!controller.signal.aborted) {
        setResults([]);
      }
    } finally {
      if (!controller.signal.aborted) {
        setLoading(false);
      }
    }
  }, []);

  // Debounced search
  const debouncedSearch = useCallback(
    (query: string) => {
      clearTimeout(debounceRef.current);
      if (!query.trim()) {
        setResults([]);
        setShowResults(false);
        setLoading(false);
        return;
      }
      setLoading(true);
      debounceRef.current = setTimeout(() => fetchResults(query.trim()), 300);
    },
    [fetchResults]
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearTimeout(debounceRef.current);
      abortRef.current?.abort();
    };
  }, []);

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
    const value = e.target.value;
    setSearchText(value);
    setIsActiveSearch?.(true);
    debouncedSearch(value);
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
            if (results.length > 0 && searchText.trim()) {
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
          {loading ? (
            <Loader2 size={ICON_SIZE.md} className="animate-spin" />
          ) : (
            <Search size={ICON_SIZE.md} />
          )}
        </button>
      </form>

      {/* Search Results Dropdown */}
      {showResults && results.length > 0 && (
        <div className="absolute top-full -left-2 -right-2 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-96 overflow-y-auto">
          <div className="p-2">
            <div className="text-xs text-gray-500 px-3 py-2 font-medium">
              Kết quả tìm kiếm ({results.length})
            </div>
            {results.map((product) => {
              const imageUrl = getImageUrl(product.thumbnailUrl);
              const productUrl = `/${product.slug}.html`;

              return (
                <Link
                  key={product.id}
                  href={productUrl}
                  onClick={handleProductClick}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors group"
                >
                  {/* Product Image */}
                  <div className="shrink-0 w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
                    <BlurImage
                      src={imageUrl}
                      alt={product.name}
                      width={48}
                      height={48}
                      className="object-contain"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-gray-900 line-clamp-1 group-hover:text-primary transition-colors">
                      {product.name}
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-sm font-bold ${product.showPrice === false ? "text-yellow-600" : "text-red-600"}`}>
                        {product.showPrice === false
                          ? "Liên hệ"
                          : formatPrice(product.salePrice || product.price)}
                      </span>
                      {product.showPrice !== false &&
                        product.salePrice &&
                        product.price > product.salePrice && (
                        <span className="text-xs text-gray-500 line-through">
                          {formatPrice(product.price)}
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
      {showResults && searchText.trim() && !loading && results.length === 0 && (
        <div className="absolute top-full -left-2 -right-2 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          <div className="p-4 text-center text-sm text-gray-500">
            Không tìm thấy sản phẩm nào
          </div>
        </div>
      )}
    </div>
  );
};
