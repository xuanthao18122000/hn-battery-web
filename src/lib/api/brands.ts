import { getAxiosInstance } from '../axios';
import type { BaseListParams } from './params';
import type { ApiResponse, PaginatedResponse } from './products';

export interface Brand {
  id: number;
  name: string;
  slug: string;
  logoUrl?: string;
  description?: string;
  priority: number;
  status: number; // StatusCommonEnum
  createdAt: string;
  updatedAt?: string;
}

/** Params cho API list thương hiệu (CMS), kế thừa BaseListParams */
export interface ListBrandParams extends BaseListParams {
  name?: string;
  status?: number;
}

export interface CreateBrandDto {
  name: string;
  slug: string;
  logoUrl?: string;
  description?: string;
  priority?: number;
}

export interface UpdateBrandDto extends Partial<CreateBrandDto> {
  status?: number;
}

export const brandsApi = {
  // Lấy danh sách thương hiệu cho trang chủ (FE, chỉ ACTIVE)
  getListFe: async (params?: Pick<BaseListParams, 'limit' | 'getFull'>): Promise<Brand[]> => {
    const axiosInstance = getAxiosInstance();
    const response = await axiosInstance.get<ApiResponse<PaginatedResponse<Brand>>>(
      '/fe/brands',
      {
        params: {
          limit: params?.getFull ? undefined : (params?.limit ?? 50),
          getFull: params?.getFull,
        },
      },
    );
    const data = response.data?.data ?? response.data;
    const list = data?.data ?? data;
    return Array.isArray(list) ? list : [];
  },

  // Lấy danh sách thương hiệu (CMS)
  getList: async (params: ListBrandParams): Promise<PaginatedResponse<Brand>> => {
    const axiosInstance = getAxiosInstance();
    const response = await axiosInstance.get<ApiResponse<PaginatedResponse<Brand>>>(
      '/brands',
      { params },
    );
    return response.data.data;
  },

  // Lấy chi tiết thương hiệu theo ID (CMS)
  getById: async (id: number): Promise<Brand> => {
    const axiosInstance = getAxiosInstance();
    const response = await axiosInstance.get<ApiResponse<Brand>>(`/brands/${id}`);
    return response.data.data;
  },

  // Lấy chi tiết thương hiệu theo slug (CMS)
  getBySlug: async (slug: string): Promise<Brand> => {
    const axiosInstance = getAxiosInstance();
    const response = await axiosInstance.get<ApiResponse<Brand>>(`/brands/slug/${slug}`);
    return response.data.data;
  },

  // Tạo thương hiệu mới (CMS)
  create: async (data: CreateBrandDto): Promise<Brand> => {
    const axiosInstance = getAxiosInstance();
    const response = await axiosInstance.post<ApiResponse<Brand>>('/brands', data);
    return response.data.data;
  },

  // Tạo nhiều thương hiệu (CMS)
  createBulks: async (items: CreateBrandDto[]): Promise<Brand[]> => {
    const axiosInstance = getAxiosInstance();
    const response = await axiosInstance.post<ApiResponse<Brand[]>>('/brands/bulk', {
      items,
    });
    return response.data.data;
  },

  // Cập nhật thương hiệu (CMS)
  update: async (id: number, data: UpdateBrandDto): Promise<Brand> => {
    const axiosInstance = getAxiosInstance();
    const response = await axiosInstance.put<ApiResponse<Brand>>(`/brands/${id}`, data);
    return response.data.data;
  },

  // Xóa thương hiệu (soft delete)
};

