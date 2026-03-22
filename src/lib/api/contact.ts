import axiosInstance from '../axios';
import { ApiResponse, PaginatedResponse } from './products';

export interface Store {
  id: number;
  store_name: string;
  store_address: string;
  phone: string;
  latitude: number;
  longitude: number;
  open_at: string;
  close_at: string;
  is_car_parking: number; // 1 = có, 0 = không
  iframe_location?: string;
  status?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ContactMessage {
  id?: number;
  name: string;
  email: string;
  phone: string;
  content: string;
  message?: string; // Alias for content
  product?: string;
  productId?: number | null;
  status?: string; // "new" | "contacted" | "completed" | "cancelled"
  notes?: string;
  createdAt?: string;
}

export interface ListContactParams {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
}

export interface CreateContactMessageDto {
  name: string;
  email: string;
  phone: string;
  content: string;
}

export interface UpdateContactMessageDto {
  status?: string;
  notes?: string;
}

export const contactApi = {
  // Lấy danh sách cửa hàng
  getStores: async (): Promise<Store[]> => {
    try {
      const response = await axiosInstance.get<ApiResponse<Store[]>>('/stores');
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },

  // Lấy chi tiết cửa hàng theo ID
  getStoreById: async (id: number): Promise<Store> => {
    const response = await axiosInstance.get<ApiResponse<Store>>(`/stores/${id}`);
    return response.data.data;
  },

  // Gửi tin nhắn liên hệ (Public)
  sendMessage: async (data: CreateContactMessageDto): Promise<ContactMessage> => {
    const response = await axiosInstance.post<ApiResponse<ContactMessage>>('/contacts', data);
    return response.data.data;
  },

  // Lấy danh sách tin nhắn liên hệ (CMS)
  getMessages: async (params?: ListContactParams): Promise<PaginatedResponse<ContactMessage>> => {
    const response = await axiosInstance.get<ApiResponse<PaginatedResponse<ContactMessage>>>('/contacts', { params });
    return response.data.data;
  },

  // Lấy chi tiết tin nhắn theo ID
  getMessageById: async (id: number): Promise<ContactMessage> => {
    const response = await axiosInstance.get<ApiResponse<ContactMessage>>(`/contacts/${id}`);
    return response.data.data;
  },

  // Cập nhật tin nhắn liên hệ
  updateMessage: async (id: number, data: UpdateContactMessageDto): Promise<ContactMessage> => {
    const response = await axiosInstance.put<ApiResponse<ContactMessage>>(`/contacts/${id}`, data);
    return response.data.data;
  },

  // Xóa tin nhắn liên hệ
  deleteMessage: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/contacts/${id}`);
  },
};
