import { notFound, redirect } from "next/navigation";
import { headers } from "next/headers";
import dynamic from "next/dynamic";
import { resolveApi, SlugTypeEnum } from "@/lib/api/resolve";
import CategoryPageContent from "@/components/website/category/CategoryPageContent";
import { Breadcrumbs } from "@/components/website/common/Breadcrumbs";
import ProductInfo from "@/components/website/product/ProductInfo";
import { ProductDetailLeft } from "@/components/website/product/ProductDetailLeft";
import { ProductDetailRight } from "@/components/website/product/ProductDetailRight";
import { ProductSpecs } from "@/components/website/product/ProductSpecs";
import { Product } from "@/lib/api/products";
import { categoriesApi } from "@/lib/api/categories";
import { productsApi } from "@/lib/api/products";
import { isCategorySlugNoNavigate } from "@/lib/category-nav";

/** Tách chunk — HTML mô tả dài, không chặn JS phần trên fold */
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

interface SlugPageProps {
  params: Promise<{
    slug: string;
  }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

/**
 * Dynamic slug route handler
 * Resolves slug type (CATEGORY or PRODUCT) and renders accordingly
 * 
 * Examples:
 * - /hang-ac-quy -> resolves to CATEGORY -> renders CategoryPageContent
 * - /iphone-15-promax -> resolves to PRODUCT -> renders ProductDetail
 */
// Slugs trông như file tĩnh (PWA icon, favicon, v.v.) → không gọi API resolve
const STATIC_EXT = /\.(png|ico|jpg|jpeg|webp|svg|gif|css|js|json|xml|txt|woff2?|ttf|eot)$/i;
function looksLikeStaticFile(s: string) {
  return STATIC_EXT.test(s);
}

export default async function SlugPage({
  params,
  searchParams,
}: SlugPageProps) {
  const { slug: rawSlug } = await params;
  const sp = searchParams != null ? await searchParams : {};
  const rawFrom = sp.fromCategory;
  const fromCategoryQuery =
    typeof rawFrom === 'string'
      ? rawFrom
      : Array.isArray(rawFrom)
        ? rawFrom[0]
        : undefined;

  const slug = rawSlug.replace(/\.(html?)$/i, "");

  if (looksLikeStaticFile(slug)) {
    notFound();
  }

  // Get request headers for SSR
  const headersList = await headers();
  const req = {
    headers: Object.fromEntries(headersList.entries()),
  };

  // Resolve slug to get type
  let resolved;
  try {
    resolved = await resolveApi.resolveSlug(slug, req);
  } catch (error: any) {
    notFound();
  }

  // Render Category Page
  if (resolved.type === SlugTypeEnum.CATEGORY) {
    try {
      const category = resolved.category ?? await categoriesApi.getBySlug(slug, req);

      // Dùng products từ resolve (1 request) nếu có, không gọi thêm GET /fe/categories/slug/.../products
      let products: any[] = [];
      if (Array.isArray(resolved.products)) {
        products = resolved.products;
      } else {
        const productsResponse = await categoriesApi.getProductsByCategorySlug(slug, {
          page: 1,
          limit: 50,
        }, req);
        products = productsResponse?.data ?? productsResponse ?? [];
      }

      // Transform products to match CategoryPageContent format
      const transformedProducts = products.map((product: Product) => {
        // Normalize status: API có thể trả số 1 hoặc string "1"/"active"
        const statusStr = String(product.status);
        const isActive = statusStr === "1" || statusStr === "active";
        
        return {
          product_id: product.id,
          product: product.name,
          slug: product.slug,
          productSlug: product.slug,
          rootCategorySlug: category.slug,
          thumbnail: product.thumbnailUrl || "",
          price: product.salePrice?.toString() || product.price.toString(),
          list_price: product.price.toString(),
          percentage_discount: product.salePrice && product.price
            ? Math.round(((Number(product.price) - Number(product.salePrice)) / Number(product.price)) * 100)
            : 0,
          promotion_info: "",
          status: isActive ? "A" : "D",
          brand: product.brand,
          showPrice:
            (product as any).showPrice !== false && (product as any).showPrice !== 0,
        };
      });

      return (
        <CategoryPageContent
          categoryInfo={{
            title: category.name,
            rootSlug: category.slug,
          }}
          descriptionHtml={category.description}
          mockProducts={transformedProducts}
        />
      );
    } catch (error: any) {
      notFound();
    }
  }

  // Redirect POST → /kinh-nghiem-hay/{slug}
  if (resolved.type === SlugTypeEnum.POST) {
    redirect(`/kinh-nghiem-hay/${slug}`);
  }

  // Render Product Page
  if (resolved.type === SlugTypeEnum.PRODUCT) {
    try {
      // Fetch product details (with req for SSR)
      const product = await productsApi.getBySlugFE(slug, req, {
        fromCategory: fromCategoryQuery,
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

      // API có thể trả showPrice dạng 0/1; 0 hoặc false = hiện "Liên hệ", còn lại = hiện giá
      const raw = (product as any).showPrice;
      const showPrice = raw !== false && raw !== 0;
      // Transform product to match ProductInfo format
      const statusStr = String(product.status);
      const transformedProduct = {
        product_id: product.id,
        product: product.name,
        slug: product.slug,
        productSlug: product.slug,
        root_category_slug: parentCategories[0]?.slug?.replace("/", "") || "",
        rootCategorySlug: parentCategories[0]?.slug?.replace("/", "") || "",
        thumbnail: product.thumbnailUrl || "",
        images: (product as any).images || [product.thumbnailUrl || ""],
        price: product.salePrice?.toString() || product.price.toString(),
        list_price: product.price.toString(),
        percentage_discount: product.salePrice && product.price
          ? Math.round(((Number(product.price) - Number(product.salePrice)) / Number(product.price)) * 100)
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

      const descriptionHtml = (product as any).description as string | undefined;

      return (
        <main className="min-h-screen bg-secondary">
          <div className="container mx-auto px-4 py-4 max-w-7xl">
            {/* Breadcrumbs */}
            {parentCategories.length > 0 && (
              <Breadcrumbs
                items={parentCategories}
                currentPage={product.name}
              />
            )}

            {/* Product Detail: 2 cột - Trái: 1 khối trắng (tên + hình + Thông số + Cam kết) | Phải: giá + CTA */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 md:gap-6">
              {/* Cột trái - một khối nền trắng chung */}
              <div className="md:col-span-3">
                <div className="bg-white rounded-lg border border-gray-200 p-4 md:p-6 flex flex-col gap-6">
                  <ProductInfo product={transformedProduct} selectedItem={{ barcode: product.sku }} />
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

              {/* Cột phải - sticky */}
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

            {/* Mô tả sản phẩm (từ TextEditor) */}
            <ProductDescriptionBlock descriptionHtml={descriptionHtml} />

          </div>
        </main>
      );
    } catch (error: any) {
      notFound();
    }
  }

  // VEHICLE (4): chưa có trang riêng, trả 404
  if (resolved.type === SlugTypeEnum.VEHICLE) {
    notFound();
  }

  notFound();
}
