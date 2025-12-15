import { MediaFolder } from '../entities/media-folder.entity';
import { Media } from '../entities/media.entity';

export interface IMediaRepository {
  // Media operations
  findAllFiles(folderId?: string): Promise<Media[]>;
  findFileById(id: string): Promise<Media | null>;
  createFile(media: Media): Promise<Media>;
  deleteFile(id: string): Promise<void>;

  // Folder operations
  findAllFolders(parentId?: string): Promise<MediaFolder[]>;
  findFolderById(id: string): Promise<MediaFolder | null>;
  createFolder(folder: MediaFolder): Promise<MediaFolder>;
  deleteFolder(id: string): Promise<void>;

  // Check if folder is empty
  isFolderEmpty(id: string): Promise<boolean>;
}
