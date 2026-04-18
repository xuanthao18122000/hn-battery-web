import { getAxiosInstance } from '../axios';
import type { BaseListParams } from './params';
import type { ApiResponse, PaginatedResponse } from './products';
import type { Order } from './orders';
import type { ContactInformation } from './contact-informations';

export interface Customer {
  id: number;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderedAt?: string;
  status: number; // StatusCommonEnum: 1=ACTIVE, -1=INACTIVE
  createdAt: string;
  updatedAt?: string;
}

export interface ListCustomerParams extends BaseListParams {
  search?: string;
  status?: number;
}

export interface UpdateCustomerDto {
  name?: string;
  phone?: string;
  email?: string;
  address?: string;
  status?: number;
}

export const customersApi = {
  // Danh sách khách hàng
  getList: async (
    params: ListCustomerParams,
  ): Promise<PaginatedResponse<Customer>> => {
    const axiosInstance = getAxiosInstance();
    const response = await axiosInstance.get<
      ApiResponse<PaginatedResponse<Customer>>
    >('/customers', { params });
    return response.data.data;
  },

  // Chi tiết khách hàng
  getById: async (id: number): Promise<Customer> => {
    const axiosInstance = getAxiosInstance();
    const response = await axiosInstance.get<ApiResponse<Customer>>(
      `/customers/${id}`,
    );
    return response.data.data;
  },

  // Danh sách đơn hàng của khách
  getOrders: async (
    id: number,
    params?: BaseListParams,
  ): Promise<PaginatedResponse<Order>> => {
    const axiosInstance = getAxiosInstance();
    const response = await axiosInstance.get<
      ApiResponse<PaginatedResponse<Order>>
    >(`/customers/${id}/orders`, { params });
    return response.data.data;
  },

  // Danh sách yêu cầu liên hệ của khách
  getContacts: async (
    id: number,
    params?: BaseListParams,
  ): Promise<PaginatedResponse<ContactInformation>> => {
    const axiosInstance = getAxiosInstance();
    const response = await axiosInstance.get<
      ApiResponse<PaginatedResponse<ContactInformation>>
    >(`/customers/${id}/contacts`, { params });
    return response.data.data;
  },

  update: async (id: number, data: UpdateCustomerDto): Promise<Customer> => {
    const axiosInstance = getAxiosInstance();
    const response = await axiosInstance.put<ApiResponse<Customer>>(
      `/customers/${id}`,
      data,
    );
    return response.data.data;
  },

  softDelete: async (id: number): Promise<void> => {
    const axiosInstance = getAxiosInstance();
    await axiosInstance.delete(`/customers/${id}`);
  },
};
