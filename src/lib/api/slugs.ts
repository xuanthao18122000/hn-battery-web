import axiosInstance from "../axios";
import type { ApiResponse } from "./products";

/** Khớp với API: 1=PRODUCT, 2=CATEGORY, 3=POST, 4=VEHICLE */
export enum SlugTypeEnum {
  PRODUCT = 1,
  CATEGORY = 2,
  POST = 3,
  VEHICLE = 4,
}

export interface Slug {
  id: number;
  type: SlugTypeEnum;
  slug: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ListSlugParams {
  page?: number;
  limit?: number;
  slug?: string;
  type?: SlugTypeEnum;
}

export interface CreateSlugDto {
  type: SlugTypeEnum;
  slug: string;
}

export interface UpdateSlugDto extends Partial<CreateSlugDto> {}

export const slugsApi = {
  getList: async (params: ListSlugParams): Promise<PaginatedResponse<Slug>> => {
    const response = await axiosInstance.get<ApiResponse<PaginatedResponse<Slug>>>(
      "/slugs",
      { params }
    );
    return response.data.data;
  },

  getById: async (id: number): Promise<Slug> => {
    const response = await axiosInstance.get<ApiResponse<Slug>>(`/slugs/${id}`);
    return response.data.data;
  },

  getBySlug: async (slug: string): Promise<Slug> => {
    const response = await axiosInstance.get<ApiResponse<Slug>>(`/slugs/slug/${slug}`);
    return response.data.data;
  },

  create: async (data: CreateSlugDto): Promise<Slug> => {
    const response = await axiosInstance.post<ApiResponse<Slug>>("/slugs", data);
    return response.data.data;
  },

  update: async (id: number, data: UpdateSlugDto): Promise<Slug> => {
    const response = await axiosInstance.put<ApiResponse<Slug>>(`/slugs/${id}`, data);
    return response.data.data;
  },

  delete: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/slugs/${id}`);
  },

  deleteBySlug: async (slug: string): Promise<void> => {
    await axiosInstance.delete(`/slugs/slug/${slug}`);
  },
};

