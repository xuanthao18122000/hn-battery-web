import { getAxiosInstance } from '../axios';
import { ApiResponse, PaginatedResponse } from './products';
import { fetchWithClientIP, getApiBaseUrl } from '@/utils/request';

export interface Category {
  id: number;
  parentId?: number;
  name: string;
  slug: string;
  description?: string;
  idPath?: string;
  priority?: number;
  position?: number;
  iconUrl?: string;
  thumbnailUrl?: string;
  level?: number;
  /** 1 = Danh mục (sản phẩm), 2 = Bài viết */
  type?: CategoryType;
  status: number; // StatusCommonEnum: 1 = ACTIVE, 0 = INACTIVE
  createdAt: string;
  updatedAt?: string;
  productCount?: number; // Số lượng sản phẩm (có thể tính từ backend hoặc frontend)
  children?: Category[]; // Children categories for tree structure
  // SEO fields
  canonicalUrl?: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  metaRobots?: string;
  seoBaseSchema?: object;
}

export interface ListCategoryParams {
  getFull?: boolean;
  page?: number;
  limit?: number;
  /** Loại: 1 = Danh mục (sản phẩm), 2 = Bài viết */
  type?: CategoryType;
  name?: string;
  parentId?: number;
  level?: number;
  status?: number;
}

/** 1 = Danh mục (sản phẩm), 2 = Bài viết */
export const CategoryTypeEnum = { CATEGORY: 1, POST: 2 } as const;
export type CategoryType = (typeof CategoryTypeEnum)[keyof typeof CategoryTypeEnum];

export interface CreateCategoryDto {
  parentId?: number;
  /** Loại: 1 = Danh mục, 2 = Bài viết */
  type?: CategoryType;
  name: string;
  slug: string;
  description?: string;
  priority?: number;
  position?: number;
  iconUrl?: string;
  thumbnailUrl?: string;
  canonicalUrl?: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  metaRobots?: string;
  seoBaseSchema?: object;
}

export interface UpdateCategoryDto extends Partial<CreateCategoryDto> {
  status?: number;
}

/** Query `GET /fe/categories/slug/:slug/products` */
export interface GetProductsByCategorySlugParams {
  page?: number;
  limit?: number;
  getFull?: boolean;
  name?: string;
  priceFrom?: number;
  priceTo?: number;
  voltageTerms?: string;
  powerTerms?: string;
  sortBy?: string;
  batteryCapacityId?: number;
}

export const categoriesApi = {
  // Lấy danh sách danh mục
  getList: async (params: ListCategoryParams): Promise<PaginatedResponse<Category>> => {
    const axiosInstance = getAxiosInstance();
    const response = await axiosInstance.get<ApiResponse<PaginatedResponse<Category>>>('/categories', { params });
    return response.data.data;
  },

  // Download template import (Excel)
  downloadImportTemplate: async (): Promise<Blob> => {
    const axiosInstance = getAxiosInstance();
    const response = await axiosInstance.get('/categories/import/template', {
      responseType: 'blob',
    });
    return response.data;
  },

  // Import danh mục từ Excel (multipart/form-data)
  importExcel: async (file: File): Promise<any> => {
    const axiosInstance = getAxiosInstance();
    const formData = new FormData();
    formData.append('file', file);
    const response = await axiosInstance.post('/categories/import', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data?.data ?? response.data;
  },

  /**
   * Cây danh mục cho **website** (menu, layout SSR).
   * Gọi `/fe/categories/tree` — backend có **Redis cache** (OK cho public).
   * Trang **admin CMS** dùng `getTreeCms` (axios + Bearer, không qua FE cache).
   */
  getTree: async (params?: ListCategoryParams, req?: any): Promise<Category[] | PaginatedResponse<Category>> => {
    if (req && typeof window === 'undefined') {
      const baseUrl = getApiBaseUrl();
      const queryString = params ? '?' + new URLSearchParams(params as any).toString() : '';
      try {
        const response = await fetchWithClientIP(
          `${baseUrl}/fe/categories/tree${queryString}`,
          req
        );
        if (response && typeof response === 'object' && 'data' in response) {
          return response.data;
        }
        return response;
      } catch (error: any) {
        throw error;
      }
    }

    const axiosInstance = getAxiosInstance();
    const response = await axiosInstance.get<ApiResponse<Category[] | PaginatedResponse<Category>>>('/fe/categories/tree', { params });
    const resData = (response.data as any)?.data;
    return Array.isArray(resData) ? resData : (resData && Array.isArray(resData.data) ? resData.data : []);
  },

  // Lấy cây danh mục (CMS - cần auth)
  getTreeCms: async (params?: ListCategoryParams): Promise<Category[] | PaginatedResponse<Category>> => {
    const axiosInstance = getAxiosInstance();
    const response = await axiosInstance.get<ApiResponse<Category[] | PaginatedResponse<Category>>>(
      '/categories/tree',
      { params },
    );
    return response.data.data;
  },

  // Lấy chi tiết danh mục theo ID
  getById: async (id: number): Promise<Category> => {
    const axiosInstance = getAxiosInstance();
    const response = await axiosInstance.get<ApiResponse<Category>>(`/categories/${id}`);
    return response.data.data;
  },

  // Lấy chi tiết danh mục theo slug (supports SSR with req parameter)
  getBySlug: async (slug: string, req?: any): Promise<Category> => {
    // Use fetch for SSR (like ddv-web), axios for client
    if (req && typeof window === 'undefined') {
      const baseUrl = getApiBaseUrl();
      const response = await fetchWithClientIP(
        `${baseUrl}/fe/categories/slug/${slug}`,
        req
      );
      return response.data;
    }
    
    // Client-side: use axios
    const axiosInstance = getAxiosInstance();
    const response = await axiosInstance.get<ApiResponse<Category>>(`/fe/categories/slug/${slug}`);
    return response.data.data;
  },

  // Lấy danh sách danh mục con
  getChildren: async (id: number): Promise<Category[]> => {
    const axiosInstance = getAxiosInstance();
    const response = await axiosInstance.get<ApiResponse<Category[]>>(`/categories/${id}/children`);
    return response.data.data;
  },

  // Tạo danh mục mới
  create: async (data: CreateCategoryDto): Promise<Category> => {
    const axiosInstance = getAxiosInstance();
    const response = await axiosInstance.post<ApiResponse<Category>>('/categories', data);
    return response.data.data;
  },

  // Cập nhật danh mục
  update: async (id: number, data: UpdateCategoryDto): Promise<Category> => {
    const axiosInstance = getAxiosInstance();
    const response = await axiosInstance.put<ApiResponse<Category>>(`/categories/${id}`, data);
    return response.data.data;
  },

  // Xóa danh mục (soft delete)
  delete: async (id: number): Promise<void> => {
    const axiosInstance = getAxiosInstance();
    await axiosInstance.delete(`/categories/${id}`);
  },

  // Lấy danh sách sản phẩm theo category slug (Public - FE, supports SSR)
  getProductsByCategorySlug: async (
    slug: string,
    params?: GetProductsByCategorySlugParams,
    req?: any,
  ): Promise<any> => {
    // Use fetch for SSR (like ddv-web), axios for client
    if (req && typeof window === 'undefined') {
      const baseUrl = getApiBaseUrl();
      const sp = new URLSearchParams();
      if (params) {
        for (const [k, v] of Object.entries(params)) {
          if (v === undefined || v === null) continue;
          sp.set(k, String(v));
        }
      }
      const qs = sp.toString();
      const queryString = qs ? `?${qs}` : '';
      const response = await fetchWithClientIP(
        `${baseUrl}/fe/categories/slug/${slug}/products${queryString}`,
        req
      );
      return response.data;
    }
    
    // Client-side: use axios
    const axiosInstance = getAxiosInstance();
    const response = await axiosInstance.get<ApiResponse<any>>(`/fe/categories/slug/${slug}/products`, { params });
    return response.data.data;
  },
};
