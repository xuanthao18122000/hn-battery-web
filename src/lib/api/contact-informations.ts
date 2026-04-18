import axiosInstance, { getAxiosInstance } from '../axios';
import { ApiResponse, PaginatedResponse } from './products';

export enum ContactStatus {
  NEW = 'new',
  CONTACTED = 'contacted',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export interface ContactInformation {
  id: number;
  customerId?: number;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  productId?: number;
  status: ContactStatus;
  /** Ghi chú (do khách gửi kèm hoặc admin ghi bổ sung) */
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ListContactInformationParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: ContactStatus;
}

export interface CreateContactInformationDto {
  name: string;
  phone: string;
  email?: string;
  address?: string;
  productId?: number;
  status?: ContactStatus;
  notes?: string;
}

export interface UpdateContactInformationDto extends Partial<CreateContactInformationDto> {}

export const contactInformationsApi = {
  // Lấy danh sách thông tin liên hệ
  getList: async (params?: ListContactInformationParams): Promise<PaginatedResponse<ContactInformation>> => {
    const response = await axiosInstance.get<ApiResponse<PaginatedResponse<ContactInformation>>>('/contact-informations', { params });
    return response.data.data;
  },

  // Lấy chi tiết thông tin liên hệ theo ID
  getById: async (id: number): Promise<ContactInformation> => {
    const response = await axiosInstance.get<ApiResponse<ContactInformation>>(`/contact-informations/${id}`);
    return response.data.data;
  },

  // Tạo thông tin liên hệ mới
  create: async (data: CreateContactInformationDto): Promise<ContactInformation> => {
    const response = await axiosInstance.post<ApiResponse<ContactInformation>>('/contact-informations', data);
    return response.data.data;
  },

  // FE public: tạo thông tin liên hệ / đơn hàng từ website (không cần auth)
  createFe: async (data: CreateContactInformationDto): Promise<ContactInformation> => {
    const axiosFe = getAxiosInstance();
    const response = await axiosFe.post<ApiResponse<ContactInformation>>('/fe/contact-informations', data);
    return response.data?.data ?? response.data;
  },

  // Cập nhật thông tin liên hệ
  update: async (id: number, data: UpdateContactInformationDto): Promise<ContactInformation> => {
    const response = await axiosInstance.put<ApiResponse<ContactInformation>>(`/contact-informations/${id}`, data);
    return response.data.data;
  },

  // Xóa thông tin liên hệ
  delete: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/contact-informations/${id}`);
  },
};
