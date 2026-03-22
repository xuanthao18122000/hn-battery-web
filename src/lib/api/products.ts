import { getAxiosInstance } from '../axios';
import { fetchWithClientIP, getApiBaseUrl } from '@/utils/request';

// API Response wrapper
export interface ApiResponse<T> {
  success: boolean;
  statusCode: string;
  data: T;
  message: string;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  sku: string;
  shortDescription?: string;
  description?: string;
  price: number;
  salePrice?: number;
  stockQuantity: number;
  thumbnailUrl?: string;
  brand?: string;
  /** battery_capacities.id — filter, không join */
  batteryCapacityId?: number;
  isFeatured?: boolean;
  isNew?: boolean;
  isBestSeller?: boolean;
  showPrice?: boolean;
  averageRating?: number;
  reviewCount?: number;
  soldCount?: number;
  status: string;
  createdAt: string;
  // Categories
  productCategories?: Array<{
    id: number;
    productId: number;
    categoryId: number;
    category?: { id: number; name: string };
  }>;
  // SEO fields
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  metaRobots?: string;
  canonicalUrl?: string;
  /** FE: breadcrumb từ API */
  breadcrumb?: {
    items: Array<{ id: number; name: string; slug: string }>;
    source: 'from_category' | 'default';
    resolvedFromCategorySlug: string | null;
  };
}

export interface ListProductParams {
  page?: number;
  limit?: number;
  name?: string;
  sku?: string;
  brand?: string;
  status?: string;
  categoryId?: number;
  batteryCapacityId?: number;
  priceFrom?: number;
  priceTo?: number;
  isFeatured?: boolean;
  isNew?: boolean;
  isBestSeller?: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CreateProductDto {
  name: string;
  slug: string;
  sku: string;
  shortDescription?: string;
  description?: string;
  price: number;
  salePrice?: number;
  costPrice?: number;
  stockQuantity?: number;
  thumbnailUrl?: string;
  brand?: string;
  status?: string;
  categoryIds?: number[];
  showPrice?: boolean;
  // SEO fields
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  metaRobots?: string;
  canonicalUrl?: string;
}

export interface UpdateProductDto extends Partial<CreateProductDto> {}

export const productsApi = {
  // Lấy danh sách sản phẩm
  getList: async (params: ListProductParams): Promise<PaginatedResponse<Product>> => {
    const axiosInstance = getAxiosInstance();
    const response = await axiosInstance.get<ApiResponse<PaginatedResponse<Product>>>('/products', { params });
    return response.data.data;
  },

  // Lấy chi tiết sản phẩm
  getById: async (id: number): Promise<Product> => {
    const axiosInstance = getAxiosInstance();
    const response = await axiosInstance.get<ApiResponse<Product>>(`/products/${id}`);
    return response.data.data;
  },

  // Lấy sản phẩm theo slug (CMS)
  getBySlug: async (
    slug: string,
    opts?: { fromCategory?: string },
  ): Promise<Product> => {
    const axiosInstance = getAxiosInstance();
    const response = await axiosInstance.get<ApiResponse<Product>>(
      `/products/slug/${slug}`,
      {
        params:
          opts?.fromCategory != null && opts.fromCategory !== ''
            ? { fromCategory: opts.fromCategory }
            : undefined,
      },
    );
    return response.data.data;
  },

  // Lấy sản phẩm theo slug (FE - Public, supports SSR)
  getBySlugFE: async (
    slug: string,
    req?: any,
    opts?: { fromCategory?: string },
  ): Promise<Product> => {
    const q =
      opts?.fromCategory != null && opts.fromCategory !== ''
        ? `?fromCategory=${encodeURIComponent(opts.fromCategory)}`
        : '';
    // Use fetch for SSR (like ddv-web), axios for client
    if (req && typeof window === 'undefined') {
      const baseUrl = getApiBaseUrl();
      const response = await fetchWithClientIP(
        `${baseUrl}/fe/products/slug/${slug}${q}`,
        req,
      );
      return response.data;
    }

    // Client-side: use axios
    const axiosInstance = getAxiosInstance();
    const response = await axiosInstance.get<ApiResponse<Product>>(
      `/fe/products/slug/${slug}`,
      {
        params:
          opts?.fromCategory != null && opts?.fromCategory !== ''
            ? { fromCategory: opts.fromCategory }
            : undefined,
      },
    );
    return response.data.data;
  },

  // Tạo sản phẩm mới
  create: async (data: CreateProductDto): Promise<Product> => {
    const axiosInstance = getAxiosInstance();
    const response = await axiosInstance.post<ApiResponse<Product>>('/products', data);
    return response.data.data;
  },

  // Cập nhật sản phẩm
  update: async (id: number, data: UpdateProductDto): Promise<Product> => {
    const axiosInstance = getAxiosInstance();
    const response = await axiosInstance.put<ApiResponse<Product>>(`/products/${id}`, data);
    return response.data.data;
  },

  // Xóa sản phẩm
  delete: async (id: number): Promise<void> => {
    const axiosInstance = getAxiosInstance();
    await axiosInstance.delete(`/products/${id}`);
  },
};


