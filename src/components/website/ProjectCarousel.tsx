"use client";

import { useRef, useMemo } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { ProductCard } from "./product";

interface Product {
  product_id: number;
  product: string;
  slug: string;
  productSlug: string;
  root_category_slug?: string;
  rootCategorySlug: string;
  thumbnail: string;
  price: string;
  list_price: string;
  percentage_discount: number;
  promotion_info?: string;
  status?: string;
  product_appcore_id?: string;
  [key: string]: any; // Allow additional properties
}

// Mock data - same as TopProducts
const mockProducts: Product[] = [
  {
    product_id: 44131,
    product: "Xe máy điện VinFast Vento Neo",
    slug: "vento-neo-393b28",
    productSlug: "xe-may-dien-vinfast-vento-neo",
    root_category_slug: "xe-dien",
    thumbnail:
      "files/products/2025/5/3/1/1748962408388_xe_may_dien_vinfast_vento_neo_vang_didongviet.jpg",
    price: "32000000",
    list_price: "39990000",
    percentage_discount: 20,
    parent_product_id: 0,
    barcode: "33000000044917",
    product_code: "VENTONEO01",
    product_type: "2",
    product_function: 1,
    product_status: "1",
    redirect_type: 300,
    redirect_url: "xe-may-dien-vinfast-vento-neo",
    discount_id: 0,
    is_installment: "Y",
    is_installment_zero: 0,
    amount: 0,
    is_preorder: 0,
    is_comming_soon: 1,
    promotion_info:
      "<p><span style=_quotfont-size: 10pt;_quot>1.11 - 31.12:<span style=_quotcolor: #e03e2d;_quot><strong> Ưu Đãi 12% + Trả Góp 0Đ</strong></span></span></p>",
    status: "A",
    created_at: "2025-05-30T08:44:23.000Z",
    category_id: 2072,
    category_status: "A",
    category: "Xe Điện",
    id_path: "2072",
    level: 0,
    priority_search: 10,
    rootCategorySlug: "xe-dien",
    stickers: [],
    ratings: null,
    flash_sale_programs: null,
    tradein_discount_programs: null,
  },
  {
    product_id: 44116,
    product: "Xe máy điện Vinfast Feliz Neo",
    slug: "feliz-neo-30e0f1",
    productSlug: "xe-may-dien-vinfast-feliz-neo",
    root_category_slug: "xe-dien",
    thumbnail:
      "files/products/2025/5/3/1/1748922728828_xe_may_dien_vinfast_feliz_neo_xam.png",
    price: "22400000",
    list_price: "28000000",
    percentage_discount: 20,
    parent_product_id: 0,
    barcode: "33000000044902",
    product_code: "ESMDBLHH",
    product_type: "2",
    product_function: 1,
    product_status: "1",
    redirect_type: 300,
    redirect_url: "xe-may-dien-vinfast-feliz-neo",
    discount_id: 0,
    is_installment: "Y",
    is_installment_zero: 0,
    amount: 0,
    is_preorder: 0,
    is_comming_soon: 1,
    promotion_info:
      "<p><span style=_quotfont-size: 10pt;_quot>1.11 - 31.12:<span style=_quotcolor: #e03e2d;_quot><strong> Ưu Đãi 12% + Trả Góp 0Đ</strong></span></span></p>",
    status: "A",
    created_at: "2025-05-30T04:59:40.000Z",
    category_id: 2072,
    category_status: "A",
    category: "Xe Điện",
    id_path: "2072",
    level: 0,
    priority_search: 10,
    rootCategorySlug: "xe-dien",
    stickers: [],
    ratings: null,
    flash_sale_programs: null,
    tradein_discount_programs: null,
  },
  {
    product_id: 44087,
    product_appcore_id: "50028839",
    product: "Xe máy điện VinFast Motio",
    slug: "motio-7ed0bf",
    productSlug: "xe-may-dien-vinfast-motio",
    root_category_slug: "xe-dien",
    thumbnail:
      "files/products/2025/5/2/1/1748847371803_xe_may_dien_vinfast_motio_trang_didongviet.jpg",
    price: "12000000",
    list_price: "14990000",
    percentage_discount: 20,
    parent_product_id: 0,
    barcode: "33000000044873",
    product_code: "ESMD9SHL",
    product_type: "2",
    product_function: 1,
    product_status: "1",
    redirect_type: 300,
    redirect_url: "xe-may-dien-vinfast-motio",
    discount_id: 0,
    is_installment: "Y",
    is_installment_zero: 0,
    amount: 0,
    is_preorder: 0,
    is_comming_soon: 1,
    promotion_info:
      "<p><span style=_quotfont-size: 10pt;_quot>1.11 - 31.12:<span style=_quotcolor: #e03e2d;_quot><strong> Ưu Đãi 12% + Trả Góp 0Đ</strong></span></span></p>",
    status: "A",
    created_at: "2025-05-30T04:59:32.000Z",
    category_id: 2072,
    category_status: "A",
    category: "Xe Điện",
    id_path: "2072",
    level: 0,
    priority_search: 10,
    rootCategorySlug: "xe-dien",
    stickers: [],
    ratings: null,
    flash_sale_programs: null,
    tradein_discount_programs: null,
  },
  {
    product_id: 44106,
    product: "Xe máy điện VinFast Klara Neo",
    slug: "klara-neo-4167ac",
    productSlug: "xe-may-dien-vinfast-klara-neo",
    root_category_slug: "xe-dien",
    thumbnail:
      "files/products/2025/5/3/1/1748932383881_xe_may_dien_vinfast_klara_neo_do_didongviet.jpg",
    price: "28800000",
    list_price: "33900000",
    percentage_discount: 15,
    parent_product_id: 0,
    barcode: "33000000044892",
    product_code: "ESMD7LHH",
    product_type: "2",
    product_function: 1,
    product_status: "1",
    redirect_type: 300,
    redirect_url: "xe-may-dien-vinfast-klara-neo",
    discount_id: 0,
    is_installment: "Y",
    is_installment_zero: 0,
    amount: 0,
    is_preorder: 0,
    is_comming_soon: 1,
    promotion_info:
      "<p><span style=_quotfont-size: 10pt;_quot>1.11 - 31.12:<span style=_quotcolor: #e03e2d;_quot><strong> Ưu Đãi 12% + Trả Góp 0Đ</strong></span></span></p>",
    status: "A",
    created_at: "2025-05-30T04:59:38.000Z",
    category_id: 2072,
    category_status: "A",
    category: "Xe Điện",
    id_path: "2072",
    level: 0,
    priority_search: 10,
    rootCategorySlug: "xe-dien",
    stickers: [],
    ratings: null,
    flash_sale_programs: null,
    tradein_discount_programs: null,
  },
  {
    product_id: 42214,
    product: "Xe máy điện VinFast Evo200",
    slug: "xe-may-dien-vinfast-evo-200-79a436",
    productSlug: "xe-may-dien-vinfast-evo-200",
    root_category_slug: "xe-dien",
    thumbnail: "files/products/2025/2/26/1/1742973975360_evo200_den_min.png",
    price: "15000000",
    list_price: "25990000",
    percentage_discount: 42,
    promotion_info: "<p><span style=_quotfont-size: 10pt;_quot>1.11 - 31.12:<span style=_quotcolor: #e03e2d;_quot><strong> Ưu Đãi 12% + Trả Góp 0Đ</strong></span></span></p>",
    status: "A",
    rootCategorySlug: "xe-dien",
  },
  {
    product_id: 42226,
    product: "Xe máy điện VinFast Klara S",
    slug: "xe-may-dien-vinfast-klara-s-e05cfe",
    productSlug: "xe-may-dien-vinfast-klara-s",
    root_category_slug: "xe-dien",
    thumbnail: "files/products/2025/2/26/1/1742980628458_klaras_den_5.png",
    price: "36500000",
    list_price: "42990000",
    percentage_discount: 15,
    promotion_info: "<p><span style=_quotfont-size: 10px;_quot>Duy nhất 06.06: Tặng voucher trị giá <span style=_quotcolor: #e03e2d;_quot><strong>500K</strong></span></span></p>",
    status: "D",
    rootCategorySlug: "xe-dien",
  },
];

export const ProjectCarousel = () => {
  const plugin = useRef(
    Autoplay({ delay: 2000, stopOnInteraction: true })
  );

  // Filter active products and duplicate data x2
  const products = useMemo(() => {
    const activeProducts = mockProducts.filter((item) => item.status === "A");
    return [...activeProducts, ...activeProducts];
  }, []);

  return (
    <section >
      <div className="container mx-auto px-2 sm:px-4 max-w-7xl mb-10">
        <div className="bg-white rounded-lg p-3 sm:p-5">
        <div className="mb-8">
          <h2 className="text-4xl md:text-5xl font-bold text-accent mb-2">
            Sản phẩm nổi bật
          </h2>
          <div className="w-full h-1 bg-gradient-to-r from-accent via-accent/50 to-transparent"></div>
        </div>

        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          plugins={[plugin.current]}
          className="w-full"
          onMouseEnter={plugin.current.stop}
          onMouseLeave={plugin.current.reset}
        >
          <CarouselContent className="-ml-1 sm:-ml-2 md:-ml-4">
            {products.map((product, index) => (
              <CarouselItem key={`${product.product_id}-${index}`} className="pl-1 sm:pl-2 md:pl-4 basis-1/2 sm:basis-1/3 md:basis-1/2 lg:basis-1/4 xl:basis-1/5">
                <ProductCard item={product} />
              </CarouselItem>
            ))}
          </CarouselContent>
          
          {/* Navigation Buttons */}
          <CarouselPrevious className="left-2 md:left-4 bg-white/90 hover:bg-white border-none shadow-lg" />
          <CarouselNext className="right-2 md:right-4 bg-white/90 hover:bg-white border-none shadow-lg" />
        </Carousel>
        </div>
      </div>
    </section>
  );
};

