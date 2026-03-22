import { getAxiosInstance } from '../axios';
import type { ApiResponse } from './products';

export const StatusCommonEnum = { ACTIVE: 1, INACTIVE: -1 } as const;
export type StatusCommon =
  (typeof StatusCommonEnum)[keyof typeof StatusCommonEnum];

export const SectionTypeEnum = { PRODUCT: 1, POST: 2 } as const;
export type SectionType = (typeof SectionTypeEnum)[keyof typeof SectionTypeEnum];

export const SectionDataSourceEnum = { MANUAL: 1, LATEST: 2 } as const;
export type SectionDataSource =
  (typeof SectionDataSourceEnum)[keyof typeof SectionDataSourceEnum];

export interface SectionItem {
  id: number;
  sectionId: number;
  refId: number;
  position: number;
  product?: {
    id: number;
    name: string;
    slug: string;
    thumbnailUrl?: string;
    price: number;
    salePrice?: number;
    showPrice?: boolean;
  };
  post?: {
    id: number;
    title: string;
    slug: string;
    excerpt?: string;
    content?: string;
    featuredImage?: string;
    publishedAt?: string;
    createdAt: string;
  };
}

export interface Section {
  id: number;
  type?: SectionType;
  dataSource?: SectionDataSource;
  /** Số hàng sản phẩm (chỉ block loại Sản phẩm), 1 hàng = 5 sản phẩm */
  productRows?: number;
  name: string;
  code: string;
  page: string;
  position: number;
  status?: StatusCommon;
  items?: SectionItem[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateSectionDto {
  type?: SectionType;
  dataSource?: SectionDataSource;
  productRows?: number;
  name: string;
  code: string;
  page?: string;
  position?: number;
  status?: StatusCommon;
}

export interface UpdateSectionDto {
  type?: SectionType;
  dataSource?: SectionDataSource;
  productRows?: number;
  name?: string;
  code?: string;
  page?: string;
  position?: number;
  status?: StatusCommon;
}

export interface AddSectionItemDto {
  refId: number;
  position?: number;
}

export const sectionsApi = {
  getSectionsByPageFe: async (page: string = 'home'): Promise<Section[]> => {
    const axiosInstance = getAxiosInstance();
    const response = await axiosInstance.get<ApiResponse<Section[]>>(
      '/fe/sections',
      { params: { page } },
    );
    return response.data?.data ?? response.data ?? [];
  },

  getList: async (page?: string): Promise<Section[]> => {
    const axiosInstance = getAxiosInstance();
    const response = await axiosInstance.get<ApiResponse<Section[]>>(
      '/sections',
      { params: page ? { page } : {} },
    );
    return response.data?.data ?? response.data ?? [];
  },

  getById: async (id: number): Promise<Section> => {
    const axiosInstance = getAxiosInstance();
    const response = await axiosInstance.get<ApiResponse<Section>>(
      `/sections/${id}`,
    );
    return response.data?.data ?? response.data;
  },

  create: async (dto: CreateSectionDto): Promise<Section> => {
    const axiosInstance = getAxiosInstance();
    const response = await axiosInstance.post<ApiResponse<Section>>(
      '/sections',
      dto,
    );
    return response.data?.data ?? response.data;
  },

  update: async (id: number, dto: UpdateSectionDto): Promise<Section> => {
    const axiosInstance = getAxiosInstance();
    const response = await axiosInstance.put<ApiResponse<Section>>(
      `/sections/${id}`,
      dto,
    );
    return response.data?.data ?? response.data;
  },

  delete: async (id: number): Promise<void> => {
    const axiosInstance = getAxiosInstance();
    await axiosInstance.delete(`/sections/${id}`);
  },

  addItem: async (
    sectionId: number,
    dto: AddSectionItemDto,
  ): Promise<SectionItem> => {
    const axiosInstance = getAxiosInstance();
    const response = await axiosInstance.post<ApiResponse<SectionItem>>(
      `/sections/${sectionId}/items`,
      dto,
    );
    return response.data?.data ?? response.data;
  },

  removeItem: async (sectionId: number, itemId: number): Promise<void> => {
    const axiosInstance = getAxiosInstance();
    await axiosInstance.delete(`/sections/${sectionId}/items/${itemId}`);
  },

  updateItemPosition: async (
    sectionId: number,
    itemId: number,
    position: number,
  ): Promise<SectionItem> => {
    const axiosInstance = getAxiosInstance();
    const response = await axiosInstance.put<ApiResponse<SectionItem>>(
      `/sections/${sectionId}/items/${itemId}`,
      { position },
    );
    return response.data?.data ?? response.data;
  },
};
