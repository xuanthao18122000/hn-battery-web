import { getAxiosInstance } from '../axios';
import { ApiResponse, PaginatedResponse } from './products';

/** Loại xe: 1 = Moto (xe máy), 2 = Ô tô */
export const VehicleTypeEnum = {
  MOTO: 1,
  CAR: 2,
} as const;
export type VehicleType = (typeof VehicleTypeEnum)[keyof typeof VehicleTypeEnum];

export interface Vehicle {
  id: number;
  name: string;
  slug: string;
  type: number; // VehicleTypeEnum
  imageUrl?: string;
  description?: string;
  priority: number;
  status: number;
  createdAt: string;
  updatedAt?: string;
}

export interface ListVehicleParams {
  page?: number;
  limit?: number;
  name?: string;
  status?: number;
  type?: number;
  getFull?: boolean;
}

export interface CreateVehicleDto {
  name: string;
  slug: string;
  type?: number;
  imageUrl?: string;
  description?: string;
  priority?: number;
  status?: number;
}

export interface UpdateVehicleDto extends Partial<CreateVehicleDto> {}

export const vehiclesApi = {
  /** Lấy danh sách xe cho FE (public, chỉ ACTIVE). type: VehicleTypeEnum.MOTO | CAR */
  getListFe: async (params?: { type?: number; getFull?: boolean }): Promise<Vehicle[]> => {
    const axiosInstance = getAxiosInstance();
    const response = await axiosInstance.get<ApiResponse<PaginatedResponse<Vehicle>>>(
      '/fe/vehicles',
      {
        params: {
          type: params?.type,
          getFull: params?.getFull ?? true,
        },
      },
    );
    const data = response.data?.data ?? response.data;
    const list = data?.data ?? data;
    return Array.isArray(list) ? list : [];
  },

  getList: async (params: ListVehicleParams): Promise<PaginatedResponse<Vehicle>> => {
    const axiosInstance = getAxiosInstance();
    const response = await axiosInstance.get<ApiResponse<PaginatedResponse<Vehicle>>>(
      '/vehicles',
      { params },
    );
    return response.data.data;
  },

  getById: async (id: number): Promise<Vehicle> => {
    const axiosInstance = getAxiosInstance();
    const response = await axiosInstance.get<ApiResponse<Vehicle>>(`/vehicles/${id}`);
    return response.data.data;
  },

  getBySlug: async (slug: string): Promise<Vehicle> => {
    const axiosInstance = getAxiosInstance();
    const response = await axiosInstance.get<ApiResponse<Vehicle>>(`/vehicles/slug/${slug}`);
    return response.data.data;
  },

  create: async (data: CreateVehicleDto): Promise<Vehicle> => {
    const axiosInstance = getAxiosInstance();
    const response = await axiosInstance.post<ApiResponse<Vehicle>>('/vehicles', data);
    return response.data.data;
  },

  update: async (id: number, data: UpdateVehicleDto): Promise<Vehicle> => {
    const axiosInstance = getAxiosInstance();
    const response = await axiosInstance.put<ApiResponse<Vehicle>>(`/vehicles/${id}`, data);
    return response.data.data;
  },

  delete: async (id: number): Promise<void> => {
    const axiosInstance = getAxiosInstance();
    await axiosInstance.delete(`/vehicles/${id}`);
  },
};
