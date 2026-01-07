import { API_ROUTES } from "@/domain/constants/api-routes";
import type { CreateFolderDto, MediaFile, MediaFolder } from "@/domain/entities/media.entity";
import { apiClient } from "./api-client";

export const mediaApi = {
  getAll: async (folderId?: string): Promise<{ files: MediaFile[]; folders: MediaFolder[] }> => {
    const response = await apiClient.get<
      | { files: MediaFile[]; folders: MediaFolder[] }
      | { data: { files: MediaFile[]; folders: MediaFolder[] } }
    >({
      path: API_ROUTES.MEDIA.BASE,
      query: folderId ? { folderId } : undefined,
    });

    if ("data" in response) {
      return response.data;
    }
    return response;
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
    return await apiClient.post<MediaFolder>(API_ROUTES.MEDIA.FOLDER, data);
  },

  deleteFile: async (id: string): Promise<void> => {
    await apiClient.delete(API_ROUTES.MEDIA.DELETE("file", id));
  },

  deleteFolder: async (id: string): Promise<void> => {
    await apiClient.delete(API_ROUTES.MEDIA.DELETE("folder", id));
  },
};
