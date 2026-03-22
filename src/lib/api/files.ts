import axiosInstance from '../axios';
import { ApiResponse } from './auth';

export interface FileEntity {
  id: number;
  originalName: string;
  fileName: string;
  path: string;
  mimeType: string;
  size: number;
  fileType?: string;
  isUsed: boolean;
}

export interface UploadFileParams {
  object: string;
  object_id: string;
  object_type?: string;
}

export const filesApi = {
  // Upload một file
  upload: async (file: globalThis.File, params: UploadFileParams): Promise<FileEntity> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('object', params.object);
    formData.append('object_id', params.object_id);
    if (params.object_type) {
      formData.append('object_type', params.object_type);
    }

    const response = await axiosInstance.post<ApiResponse<FileEntity>>('/cms/files/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data;
  },

  // Upload nhiều files
  uploadMultiple: async (files: globalThis.File[], params: UploadFileParams): Promise<FileEntity[]> => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('files', file);
    });
    formData.append('object', params.object);
    formData.append('object_id', params.object_id);
    if (params.object_type) {
      formData.append('object_type', params.object_type);
    }

    const response = await axiosInstance.post<ApiResponse<FileEntity[]>>('/cms/files/uploads', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data;
  },

  // Lấy thông tin file theo ID
  getById: async (id: number): Promise<FileEntity> => {
    const response = await axiosInstance.get<ApiResponse<FileEntity>>(`/cms/files/${id}`);
    return response.data.data;
  },

  // Xóa file từ CDN
  removeFile: async (url: string): Promise<void> => {
    await axiosInstance.put('/cms/files/remove-file', { url });
  },

  // Xóa nhiều files từ CDN
  removeFiles: async (urls: string[]): Promise<void> => {
    await axiosInstance.put('/cms/files/remove-files', { urls });
  },
};
