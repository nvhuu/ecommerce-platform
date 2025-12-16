import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { mediaApi } from "@/data/api/media.api";
import type { CreateFolderDto } from "@/domain/entities/media.entity";

export const MEDIA_KEYS = {
  all: ["media"] as const,
  lists: () => [...MEDIA_KEYS.all, "list"] as const,
  list: (folderId?: string) => [...MEDIA_KEYS.lists(), folderId] as const,
};

export function useMedia(folderId?: string) {
  return useQuery({
    queryKey: MEDIA_KEYS.list(folderId),
    queryFn: () => mediaApi.getAll(folderId),
  });
}

export function useUploadFile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ file, folderId }: { file: File; folderId?: string }) =>
      mediaApi.uploadFile(file, folderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MEDIA_KEYS.lists() });
    },
  });
}

export function useCreateFolder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateFolderDto) => mediaApi.createFolder(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MEDIA_KEYS.lists() });
    },
  });
}

export function useDeleteFile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => mediaApi.deleteFile(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MEDIA_KEYS.lists() });
    },
  });
}

export function useDeleteFolder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => mediaApi.deleteFolder(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MEDIA_KEYS.lists() });
    },
  });
}
