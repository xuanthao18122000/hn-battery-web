"use client";

import { ProductCard } from "./ProductCard";

interface Product {
  product_id: number;
  product_appcore_id?: string;
  product: string;
  slug: string;
  productSlug: string;
  rootCategorySlug: string;
  root_category_slug?: string;
  thumbnail: string;
  price: string;
  list_price: string;
  percentage_discount: number;
  promotion_info?: string;
  status?: string;
  parent_product_id?: number;
  barcode?: string;
  product_code?: string;
  product_type?: string;
  product_function?: number;
  product_status?: string;
  redirect_type?: number;
  redirect_url?: string;
  discount_id?: number;
  is_installment?: string;
  is_installment_zero?: number;
  amount?: number;
  is_preorder?: number;
  is_comming_soon?: number;
  created_at?: string;
  category_id?: number;
  category_status?: string;
  category?: string;
  id_path?: string;
  level?: number;
  priority_search?: number;
  stickers?: any[];
  ratings?: any;
  flash_sale_programs?: any;
  tradein_discount_programs?: any;
}

interface TopProductsProps {
  products?: Product[];
  title?: string;
}

// Mock data
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

export const TopProducts = ({
  products = mockProducts,
  title = "TOP Sản Phẩm Ắc Quy Bán Chạy",
}: TopProductsProps) => {
  // Filter only active products (status === "A")
  const activeProducts = products.filter((item) => item.status === "A");

  if (activeProducts.length === 0) return null;

  return (
    <section className="container mx-auto px-4 max-w-7xl py-4">
      <div className="rounded-md border border-gray-200 bg-white p-3 sm:p-4 md:p-6">
        <h2 className="block-title mb-4 font-semibold">
          {title}
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {activeProducts.map((item) => (
            <ProductCard key={item.product_id} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
};
