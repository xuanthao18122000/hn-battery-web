"use client";

import type { Section } from "@/lib/api/sections";
import { SectionTypeEnum } from "@/lib/api/sections";
import { ProductCard } from "./product";

interface HomeProductSectionsProps {
  sections: Section[];
}

function sectionItemToCardItem(
  item: NonNullable<Section["items"]>[number],
): Parameters<typeof ProductCard>[0]["item"] {
  const p = item.product;
  if (!p) {
    return {
      product_id: item.refId,
      product: `SP #${item.refId}`,
      slug: "",
      productSlug: "",
      rootCategorySlug: "",
      thumbnail: "",
      price: "0",
      list_price: "0",
      percentage_discount: 0,
      status: "A",
    };
  }
  const price = p.salePrice ?? p.price;
  const listPrice = p.price;
  const percentage_discount =
    listPrice > 0 && p.salePrice != null
      ? Math.round((1 - p.salePrice / listPrice) * 100)
      : 0;
  return {
    product_id: p.id,
    product: p.name,
    slug: p.slug,
    productSlug: p.slug,
    rootCategorySlug: "",
    thumbnail: p.thumbnailUrl ?? "",
    price: String(price),
    list_price: String(listPrice),
    percentage_discount,
    showPrice: p.showPrice !== false,
    status: "A",
  };
}

export function HomeProductSections({ sections }: HomeProductSectionsProps) {
  const productSections = (sections ?? []).filter(
    (s) => (s.type ?? SectionTypeEnum.PRODUCT) === SectionTypeEnum.PRODUCT,
  );
  if (!productSections.length) return null;

  return (
    <>
      {productSections.map((section) => {
        const items = (section.items ?? []).sort(
          (a, b) => a.position - b.position,
        );
        const allProducts = items
          .filter((item) => item.product)
          .map((item) => sectionItemToCardItem(item));

        if (allProducts.length === 0) return null;

        const colsPerRow = 4;
        const rows = Math.max(1, Math.min(5, section.productRows ?? 2));
        const products = allProducts.slice(0, rows * colsPerRow);

        return (
          <section key={section.id} className="mb-4">
            <div className="rounded border border-gray-200 bg-white p-2.5 shadow-sm sm:p-4 md:p-6">
              <h2 className="block-title mb-4 border-b border-gray-200 pb-3 font-semibold text-gray-900">
                {section.name}
              </h2>
              <div className="grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-4 lg:gap-4">
                {products.map((item) => (
                  <ProductCard key={item.product_id} item={item} />
                ))}
              </div>
            </div>
          </section>
        );
      })}
    </>
  );
}
