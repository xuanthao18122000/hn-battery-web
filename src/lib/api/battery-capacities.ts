import { getAxiosInstance } from '../axios';
import type { BaseListParams } from './params';
import type { ApiResponse, PaginatedResponse } from './products';

export interface BatteryCapacity {
  id: number;
  name: string;
  position: number;
  status: number;
  createdAt: string;
  updatedAt?: string;
}

export interface ListBatteryCapacityParams extends BaseListParams {
  name?: string;
  status?: number;
}

export interface CreateBatteryCapacityDto {
  name: string;
  position?: number;
  status?: number;
}

export type UpdateBatteryCapacityDto = Partial<CreateBatteryCapacityDto> & {
  status?: number;
};

export const batteryCapacitiesApi = {
  /** FE public — chỉ ACTIVE; `getFull: true` lấy toàn bộ không phân trang */
  getListFe: async (
    params?: Pick<BaseListParams, 'limit' | 'getFull' | 'name'>,
  ): Promise<BatteryCapacity[]> => {
    const axiosInstance = getAxiosInstance();
    const response = await axiosInstance.get<
      ApiResponse<PaginatedResponse<BatteryCapacity>>
    >('/fe/battery-capacities', {
      params: {
        name: params?.name,
        limit: params?.getFull ? undefined : (params?.limit ?? 50),
        getFull: params?.getFull,
      },
    });
    const data = response.data?.data ?? response.data;
    const list = data?.data ?? data;
    return Array.isArray(list) ? list : [];
  },

  getList: async (
    params: ListBatteryCapacityParams,
  ): Promise<PaginatedResponse<BatteryCapacity>> => {
    const axiosInstance = getAxiosInstance();
    const response = await axiosInstance.get<
      ApiResponse<PaginatedResponse<BatteryCapacity>>
    >('/battery-capacities', { params });
    return response.data.data;
  },

  getById: async (id: number): Promise<BatteryCapacity> => {
    const axiosInstance = getAxiosInstance();
    const response = await axiosInstance.get<ApiResponse<BatteryCapacity>>(
      `/battery-capacities/${id}`,
    );
    return response.data.data;
  },

  create: async (data: CreateBatteryCapacityDto): Promise<BatteryCapacity> => {
    const axiosInstance = getAxiosInstance();
    const response = await axiosInstance.post<ApiResponse<BatteryCapacity>>(
      '/battery-capacities',
      data,
    );
    return response.data.data;
  },

  createBulk: async (
    items: CreateBatteryCapacityDto[],
  ): Promise<BatteryCapacity[]> => {
    const axiosInstance = getAxiosInstance();
    const response = await axiosInstance.post<
      ApiResponse<BatteryCapacity[]>
    >('/battery-capacities/bulk', { items });
    return response.data.data;
  },

  update: async (
    id: number,
    data: UpdateBatteryCapacityDto,
  ): Promise<BatteryCapacity> => {
    const axiosInstance = getAxiosInstance();
    const response = await axiosInstance.put<ApiResponse<BatteryCapacity>>(
      `/battery-capacities/${id}`,
      data,
    );
    return response.data.data;
  },
};
