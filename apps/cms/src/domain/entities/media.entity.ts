export interface MediaFile {
  id: string;
  filename: string;
  mimeType: string;
  size: number;
  url: string;
  folderId?: string | null;
  uploadedBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface MediaFolder {
  id: string;
  name: string;
  parentId?: string | null;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateFolderDto {
  name: string;
  parentId?: string | null;
}

export interface UploadFileDto {
  file: File;
  folderId?: string | null;
}
