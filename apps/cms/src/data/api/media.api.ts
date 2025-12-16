import { API_ROUTES } from "@/domain/constants/api-routes";
import type { CreateFolderDto, MediaFile, MediaFolder } from "@/domain/entities/media.entity";
import { apiClient, deleteApi, postApi } from "./api-client";

export const mediaApi = {
  getAll: async (folderId?: string): Promise<{ files: MediaFile[]; folders: MediaFolder[] }> => {
    const params = folderId ? { folderId } : undefined;
    const response = await apiClient.get<any>(API_ROUTES.MEDIA.BASE, params);
    return response.data || response;
  },

  uploadFile: async (file: File, folderId?: string): Promise<MediaFile> => {
    const formData = new FormData();
    formData.append("file", file);
    if (folderId) {
      formData.append("folderId", folderId);
    }

    const response = await apiClient.uploadFile<{ data: MediaFile }>(
      API_ROUTES.MEDIA.UPLOAD,
      formData
    );
    return response.data;
  },

  createFolder: async (data: CreateFolderDto): Promise<MediaFolder> => {
    const response = await postApi<MediaFolder>(API_ROUTES.MEDIA.FOLDER, data);
    return response.data;
  },

  deleteFile: async (id: string): Promise<void> => {
    await deleteApi(API_ROUTES.MEDIA.DELETE("file", id));
  },

  deleteFolder: async (id: string): Promise<void> => {
    await deleteApi(API_ROUTES.MEDIA.DELETE("folder", id));
  },
};
