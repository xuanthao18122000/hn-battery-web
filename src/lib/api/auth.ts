import axiosInstance from '../axios';

export interface SignInRequest {
  email: string;
  password: string;
}

export interface UserResponse {
  id: number;
  email: string;
  fullName: string;
  phoneNumber?: string;
  avatar?: string;
  status: number;
  createdAt: string;
  updatedAt: string;
}

export interface SignInData {
  accessToken: string;
  user: UserResponse;
}

export interface ApiResponse<T> {
  success: boolean;
  statusCode: string;
  data: T;
  message: string;
}

export const authApi = {
  signIn: async (data: SignInRequest): Promise<SignInData> => {
    const response = await axiosInstance.post<ApiResponse<SignInData>>('/auth/sign-in', data);
    return response.data.data;
  },

  signOut: async (): Promise<void> => {
    await axiosInstance.post('/auth/sign-out');
  },
};

