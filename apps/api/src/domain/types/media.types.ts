export interface MediaModel {
  id: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  fileUrl: string;
  folderId: string | null;
  createdAt: Date;
  createdBy: string | null;
}

export interface MediaFolderModel {
  id: string;
  name: string;
  parentId: string | null;
  children?: MediaFolderModel[];
  media?: MediaModel[];
  createdAt: Date;
  createdBy: string | null;
}
