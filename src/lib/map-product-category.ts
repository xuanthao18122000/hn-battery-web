import type { Product } from "@/lib/api/products";

/** Shape `ProductCard` / `CategoryPageContent` dùng cho listing danh mục */
export interface CategoryListingProduct {
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

export function mapApiProductToCategoryCard(
  product: Product,
  categorySlug: string,
): CategoryListingProduct {
  const statusStr = String(product.status);
  const isActive = statusStr === "1" || statusStr === "active";
  const rawShow = (product as { showPrice?: boolean | number }).showPrice;
  const showPrice = rawShow !== false && rawShow !== 0;

  return {
    product_id: product.id,
    product: product.name,
    slug: product.slug,
    productSlug: product.slug,
    rootCategorySlug: categorySlug,
    thumbnail: product.thumbnailUrl || "",
    price: product.salePrice?.toString() || String(product.price),
    list_price: String(product.price),
    percentage_discount:
      product.salePrice != null && product.price
        ? Math.round(
            ((Number(product.price) - Number(product.salePrice)) /
              Number(product.price)) *
              100,
          )
        : 0,
    promotion_info: "",
    status: isActive ? "A" : "D",
    brand: product.brand,
    showPrice,
  };
}
