import { getAxiosInstance } from '../axios';
import type { ApiResponse } from './products';

export enum OrderStatus {
  NEW = 1,
  CONFIRMED = 2,
  SHIPPING = 3,
  COMPLETED = 4,
  CANCELLED = 5,
}

export enum PaymentMethod {
  COD = 1,
  BANK_TRANSFER = 2,
  OTHER = 3,
}

export interface OrderItem {
  id: number;
  orderId: number;
  productId: number;
  productName: string;
  productSlug?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Order {
  id: number;
  code: string;
  customerName: string;
  phone: string;
  email: string;
  shippingAddress: string;
  note?: string;
  totalAmount: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  createdAt: string;
  confirmedAt?: string;
  completedAt?: string;
  items?: OrderItem[];
}

export interface CreateOrderItemDto {
  productId: number;
  productName: string;
  productSlug?: string;
  quantity: number;
  unitPrice: number;
}

export interface CreateOrderDto {
  customerName: string;
  phone: string;
  email: string;
  shippingAddress: string;
  note?: string;
  totalAmount: number;
  paymentMethod?: PaymentMethod;
  items: CreateOrderItemDto[];
}

export const ordersApi = {
  /** FE public: tạo đơn hàng từ website (không cần auth) */
  createFe: async (data: CreateOrderDto): Promise<Order> => {
    const axiosInstance = getAxiosInstance();
    const response = await axiosInstance.post<ApiResponse<Order>>('/fe/orders', data);
    return response.data?.data ?? response.data;
  },

  /** FE public: lấy chi tiết đơn hàng theo id (dùng cho trang thank-you nếu cần) */
  getByIdFe: async (id: number): Promise<Order> => {
    const axiosInstance = getAxiosInstance();
    const response = await axiosInstance.get<ApiResponse<Order>>(`/fe/orders/${id}`);
    return response.data?.data ?? response.data;
  },
};

