"use client";

import { useState, useEffect } from "react";
import CategoryPageContent from "@/components/website/category/CategoryPageContent";
import { categoriesApi } from "@/lib/api/categories";
import { Product } from "@/lib/api/products";

interface TransformedProduct {
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
  voltage?: string;
  power?: string;
  brand?: string;
  type?: string;
  usage?: string;
}

interface CategoryPageWithAPIProps {
  categorySlug: string;
  defaultTitle?: string;
  filterOptions?: {
    voltage?: string[];
    power?: string[];
    brand?: string[];
    type?: string[];
    usage?: string[];
  };
}

export default function CategoryPageWithAPI({
  categorySlug,
  defaultTitle,
  filterOptions = {
    voltage: ["12V", "24V"],
    power: ["50Ah", "55Ah", "60Ah", "65Ah", "70Ah", "75Ah", "80Ah", "90Ah", "100Ah", "120Ah"],
    brand: ["Globe", "Varta", "Bosch", "Rocket"],
    type: ["Khô", "Nước"],
    usage: ["Xe máy", "Xe ô tô", "Xe tải", "Xe bus"],
  },
}: CategoryPageWithAPIProps) {
  const [products, setProducts] = useState<TransformedProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryName, setCategoryName] = useState(defaultTitle || categorySlug.toUpperCase());
  const [descriptionHtml, setDescriptionHtml] = useState<string | null | undefined>(undefined);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        // Call API to get products by category slug
        const response = await categoriesApi.getProductsByCategorySlug(categorySlug, {
          page: 1,
          limit: 10,
        });

        // Transform products to match CategoryPageContent format
        const transformedProducts: TransformedProduct[] = (response.data || []).map((product: Product) => ({
          product_id: product.id,
          product: product.name,
          slug: product.slug,
          productSlug: product.slug,
          rootCategorySlug: categorySlug,
          thumbnail: product.thumbnailUrl || "",
          price: product.salePrice?.toString() || product.price.toString(),
          list_price: product.price.toString(),
          percentage_discount: product.salePrice
            ? Math.round(((product.price - product.salePrice) / product.price) * 100)
            : 0,
          promotion_info: "",
          status: product.status === "active" ? "A" : "D",
          brand: product.brand,
        }));

        setProducts(transformedProducts);

        // Try to get category name from API
        try {
          const category = await categoriesApi.getBySlug(categorySlug);
          setCategoryName(category.name.toUpperCase());
          setDescriptionHtml(category.description);
        } catch (err) {
          // Keep default name
        }
      } catch (error) {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [categorySlug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-secondary">
        <div className="container mx-auto px-4 py-4 max-w-7xl">
          <div className="text-center py-12">
            <p className="text-gray-500">Đang tải sản phẩm...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <CategoryPageContent
      categoryInfo={{
        title: categoryName,
        rootSlug: categorySlug,
      }}
      descriptionHtml={descriptionHtml}
      mockProducts={products}
      filterOptions={filterOptions}
    />
  );
}
