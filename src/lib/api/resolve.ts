import { getAxiosInstance } from '../axios';
import { ApiResponse } from './products';
import { fetchWithClientIP, getApiBaseUrl } from '@/utils/request';

/** Khớp với API: 1=PRODUCT, 2=CATEGORY, 3=POST, 4=VEHICLE */
export enum SlugTypeEnum {
  PRODUCT = 1,
  CATEGORY = 2,
  POST = 3,
  VEHICLE = 4,
}

import { Category } from './categories';

export interface ResolveSlugResponse {
  type: SlugTypeEnum;
  slug: string;
  /** Có khi type === CATEGORY (backend trả kèm trong 1 request) */
  category?: Category;
  /** Danh sách sản phẩm khi type === CATEGORY (backend trả kèm trong 1 request) */
  products?: any[];
}

export const resolveApi = {
  // Resolve slug - Check if slug is category or product
  // Returns only type and slug, FE will call appropriate API based on type
  // Supports both SSR (with req) and client-side
  resolveSlug: async (slug: string, req?: any, options?: { page?: number; limit?: number }): Promise<ResolveSlugResponse> => {
    const page = options?.page ?? 1;
    const limit = options?.limit ?? 50;
    const query = `?page=${page}&limit=${limit}`;
    // Use fetch for SSR (like ddv-web), axios for client
    if (req && typeof window === 'undefined') {
      const baseUrl = getApiBaseUrl();
      const response = await fetchWithClientIP(
        `${baseUrl}/fe/resolve/slug/${slug}${query}`,
        req
      );
      return response?.data ?? response;
    }

    const axiosInstance = getAxiosInstance();
    const response = await axiosInstance.get<ApiResponse<ResolveSlugResponse>>(
      `/fe/resolve/slug/${slug}`,
      { params: { page, limit } }
    );
    return response.data.data;
  },
};
