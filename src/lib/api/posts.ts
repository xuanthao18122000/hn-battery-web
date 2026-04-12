import { getAxiosInstance } from '../axios';
import { ApiResponse, PaginatedResponse } from './products';
import { fetchWithClientIP, getApiBaseUrl } from '@/utils/request';

export interface Post {
  id: number;
  title: string;
  slug: string;
  content?: string;
  shortDescription?: string;
  featuredImage?: string;
  categoryId?: number;
  category?: { id: number; name: string; slug: string };
  views: number;
  status: number; // StatusCommonEnum: 1 = ACTIVE, -1 = INACTIVE
  authorId?: number;
  author?: {
    id: number;
    fullName?: string;
    email?: string;
    avatar?: string;
  };
  publishedAt?: string;
  createdAt: string;
  updatedAt?: string;
  // SEO fields
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  metaRobots?: string;
  canonicalUrl?: string;
}

export interface ListPostParams {
  page?: number;
  limit?: number;
  title?: string;
  categoryId?: number;
  status?: number;
  authorId?: number;
}

export interface CreatePostDto {
  title: string;
  slug: string;
  content?: string;
  shortDescription?: string;
  featuredImage?: string;
  categoryId?: number;
  status?: number;
  publishedAt?: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  metaRobots?: string;
  canonicalUrl?: string;
}

export interface UpdatePostDto extends Partial<CreatePostDto> {}

export const postsApi = {
  /** FE public: lấy chi tiết bài viết theo id (chỉ ACTIVE), hỗ trợ SSR */
  getByIdFe: async (id: number, req?: any): Promise<Post> => {
    if (req && typeof window === 'undefined') {
      const baseUrl = getApiBaseUrl();
      const response = await fetchWithClientIP(
        `${baseUrl}/fe/posts/${id}`,
        req,
      );
      return response?.data ?? response;
    }

    const axiosInstance = getAxiosInstance();
    const response = await axiosInstance.get<ApiResponse<Post>>(
      `/fe/posts/${id}`,
    );
    return response.data?.data ?? response.data;
  },

  /** FE public: lấy chi tiết bài viết theo slug (chỉ ACTIVE), hỗ trợ SSR */
  getBySlugFe: async (slug: string, req?: any): Promise<Post> => {
    if (req && typeof window === 'undefined') {
      const baseUrl = getApiBaseUrl();
      const response = await fetchWithClientIP(
        `${baseUrl}/fe/posts/slug/${encodeURIComponent(slug)}`,
        req,
      );
      return response?.data ?? response;
    }

    const axiosInstance = getAxiosInstance();
    const response = await axiosInstance.get<ApiResponse<Post>>(
      `/fe/posts/slug/${encodeURIComponent(slug)}`,
    );
    return response.data?.data ?? response.data;
  },

  /** FE public: lấy danh sách bài viết (chỉ ACTIVE, không cần auth), hỗ trợ SSR */
  getListFe: async (
    params?: ListPostParams,
    req?: any,
  ): Promise<PaginatedResponse<Post>> => {
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
        `${baseUrl}/fe/posts${queryString}`,
        req,
      );
      return response?.data ?? response;
    }

    const axiosInstance = getAxiosInstance();
    const response = await axiosInstance.get<
      ApiResponse<PaginatedResponse<Post>>
    >('/fe/posts', { params });
    return response.data?.data ?? response.data;
  },

  // Lấy danh sách bài viết (CMS, cần auth)
  getList: async (params?: ListPostParams): Promise<PaginatedResponse<Post>> => {
    const axiosInstance = getAxiosInstance();
    const response = await axiosInstance.get<ApiResponse<PaginatedResponse<Post>>>('/posts', { params });
    return response.data.data;
  },

  // Lấy chi tiết bài viết theo ID
  getById: async (id: number): Promise<Post> => {
    const axiosInstance = getAxiosInstance();
    const response = await axiosInstance.get<ApiResponse<Post>>(`/posts/${id}`);
    return response.data?.data ?? response.data;
  },

  // Lấy chi tiết bài viết theo slug
  getBySlug: async (slug: string): Promise<Post> => {
    const axiosInstance = getAxiosInstance();
    const response = await axiosInstance.get<ApiResponse<Post>>(`/posts/slug/${slug}`);
    return response.data.data;
  },

  // Tạo bài viết mới
  create: async (data: CreatePostDto): Promise<Post> => {
    const axiosInstance = getAxiosInstance();
    const response = await axiosInstance.post<ApiResponse<Post>>('/posts', data);
    return response.data.data;
  },

  // Cập nhật bài viết
  update: async (id: number, data: UpdatePostDto): Promise<Post> => {
    const axiosInstance = getAxiosInstance();
    const response = await axiosInstance.put<ApiResponse<Post>>(`/posts/${id}`, data);
    return response.data.data;
  },

  // Xóa bài viết (soft delete)
  delete: async (id: number): Promise<void> => {
    const axiosInstance = getAxiosInstance();
    await axiosInstance.delete(`/posts/${id}`);
  },
};
