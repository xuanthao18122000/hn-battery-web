export interface MockProduct {
  product_id: number;
  product: string;
  slug: string;
  productSlug: string;
  rootCategorySlug: string;
  thumbnail: string;
  price: string;
  list_price?: string;
  percentage_discount: number;
  promotion_info?: string;
  status: string;
  brand?: string;
  type?: string;
}

export const allMockProducts: MockProduct[] = [
  // Add mock products here if needed
  // For now, empty array to prevent errors
];
