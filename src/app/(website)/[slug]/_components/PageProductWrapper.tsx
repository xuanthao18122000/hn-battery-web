import { notFound } from "next/navigation";
import dynamic from "next/dynamic";
import { Breadcrumbs } from "@/components/website/common/Breadcrumbs";
import ProductInfo from "@/components/website/product/ProductInfo";
import { ProductDetailLeft } from "@/components/website/product/ProductDetailLeft";
import { ProductDetailRight } from "@/components/website/product/ProductDetailRight";
import { ProductSpecs } from "@/components/website/product/ProductSpecs";
import { productsApi } from "@/lib/api/products";
import { isCategorySlugNoNavigate } from "@/lib/category-nav";
import { ClearFromCategoryCookie } from "@/components/website/product/ClearFromCategoryCookie";

const ProductDescriptionBlock = dynamic(
  () => import("@/components/website/product/ProductDescriptionBlock"),
  { loading: () => null },
);

/** Gọi từ `page.tsx` sau khi resolve slug → type=PRODUCT. */
export async function PageProductWrapper({
  productId,
  req,
  fromCategoryCookie,
}: {
  productId: number;
  req: { headers: Record<string, string> };
  fromCategoryCookie?: string;
}) {
  try {
    const product = await productsApi.getByIdFE(productId, req, {
      fromCategory: fromCategoryCookie,
    });

    const apiCrumb = product.breadcrumb?.items;
    const parentCategories =
      apiCrumb?.length
        ? apiCrumb.map((c) => ({
            name: c.name,
            slug: isCategorySlugNoNavigate(c.slug)
              ? undefined
              : `/${c.slug}`,
          }))
        : product.productCategories
            ?.map((pc) => pc.category)
            .filter(Boolean)
            .map((cat: any) => ({
              name: cat.name,
              slug: isCategorySlugNoNavigate(cat.slug)
                ? undefined
                : `/${cat.slug}`,
            })) || [];

    const raw = (product as { showPrice?: boolean | number }).showPrice;
    const showPrice = raw !== false && raw !== 0;
    const statusStr = String(product.status);
    const transformedProduct = {
      product_id: product.id,
      product: product.name,
      slug: product.slug,
      productSlug: product.slug,
      root_category_slug: parentCategories[0]?.slug?.replace("/", "") || "",
      rootCategorySlug: parentCategories[0]?.slug?.replace("/", "") || "",
      thumbnail: product.thumbnailUrl || "",
      images: (product as { images?: string[] }).images || [
        product.thumbnailUrl || "",
      ],
      price: product.salePrice?.toString() || product.price.toString(),
      list_price: product.price.toString(),
      percentage_discount:
        product.salePrice && product.price
          ? Math.round(
              ((Number(product.price) - Number(product.salePrice)) /
                Number(product.price)) *
                100,
            )
          : 0,
      promotion_info: "",
      status: statusStr === "1" || statusStr === "active" ? "A" : "D",
      brand: product.brand || "GS",
      showPrice,
      ratings: {
        count: product.reviewCount || 0,
        avg_point: product.averageRating || 0,
      },
      parentCategories,
    };

    const descriptionHtml = (product as { description?: string }).description;

    return (
      <main className="min-h-screen bg-secondary">
        <ClearFromCategoryCookie />
        <div className="container mx-auto px-4 py-4 max-w-7xl">
          {parentCategories.length > 0 && (
            <Breadcrumbs
              items={parentCategories}
              currentPage={product.name}
            />
          )}

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 md:gap-6">
            <div className="md:col-span-3">
              <div className="flex flex-col gap-6 rounded-lg border border-gray-200 bg-white p-3 sm:p-4 md:p-6">
                <ProductInfo
                  product={transformedProduct}
                  selectedItem={{ barcode: product.sku }}
                />
                <div>
                  <ProductDetailLeft
                    images={transformedProduct.images || []}
                    productName={product.name}
                  />
                </div>
                <div id="thong-so" className="border-t border-gray-200 pt-6">
                  <ProductSpecs />
                </div>
              </div>
            </div>

            <div className="md:col-span-2">
              <div className="md:sticky md:top-24">
                <ProductDetailRight
                  price={transformedProduct.price}
                  listPrice={transformedProduct.list_price}
                  percentageDiscount={transformedProduct.percentage_discount}
                  promotionInfo={transformedProduct.promotion_info}
                  showPrice={transformedProduct.showPrice}
                  product={transformedProduct}
                />
              </div>
            </div>
          </div>

          <ProductDescriptionBlock descriptionHtml={descriptionHtml} />
        </div>
      </main>
    );
  } catch {
    notFound();
  }
}
