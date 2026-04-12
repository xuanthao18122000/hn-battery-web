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

export interface ResolveSlugMeta {
  name: string;
  metaTitle?: string;
  metaDescription?: string;
  canonicalUrl?: string;
  thumbnailUrl?: string;
}

/** Lightweight resolve: chỉ trả type + entityId + meta để FE gọi API chi tiết theo id. */
export interface ResolveSlugResponse {
  type: SlugTypeEnum;
  entityId: number;
  slug: string;
  /** Chỉ có khi type === CATEGORY: 1 = CATEGORY (sản phẩm), 2 = POST (bài viết) */
  categoryType?: number;
  meta?: ResolveSlugMeta;
}

export const resolveApi = {
  /**
   * Resolve slug (lightweight). FE sẽ switch-case theo `type` và gọi API chi tiết
   * bằng `entityId` thay vì truyền slug xuống backend.
   */
  resolveSlug: async (slug: string, req?: any): Promise<ResolveSlugResponse> => {
    if (req && typeof window === 'undefined') {
      const baseUrl = getApiBaseUrl();
      const response = await fetchWithClientIP(
        `${baseUrl}/fe/resolve/slug/${encodeURIComponent(slug)}`,
        req,
      );
      return response?.data ?? response;
    }

    const axiosInstance = getAxiosInstance();
    const response = await axiosInstance.get<ApiResponse<ResolveSlugResponse>>(
      `/fe/resolve/slug/${encodeURIComponent(slug)}`,
    );
    return response.data.data;
  },
};
