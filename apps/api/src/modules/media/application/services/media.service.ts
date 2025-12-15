import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { MediaFolder } from '../../domain/entities/media-folder.entity';
import { Media } from '../../domain/entities/media.entity';
import { IMediaRepository } from '../../domain/repositories/media.repository.interface';
import { IStorageService } from '../../domain/services/storage.interface';
import { CreateFolderDto } from '../dtos/media.dto';

@Injectable()
export class MediaService {
  private readonly logger = new Logger(MediaService.name);

  constructor(
    @Inject('IStorageService')
    private readonly storageService: IStorageService,
    @Inject('IMediaRepository')
    private readonly mediaRepository: IMediaRepository,
  ) {}

  async findAll(folderId?: string) {
    const [files, folders] = await Promise.all([
      this.mediaRepository.findAllFiles(folderId),
      this.mediaRepository.findAllFolders(folderId),
    ]);

    return { files, folders };
  }

  async createFolder(
    dto: CreateFolderDto,
    userId: string,
  ): Promise<MediaFolder> {
    if (dto.parentId) {
      const parent = await this.mediaRepository.findFolderById(dto.parentId);
      if (!parent) {
        throw new NotFoundException('Parent folder not found');
      }
    }

    const folder = new MediaFolder();
    folder.name = dto.name;
    folder.parentId = dto.parentId;
    folder.createdBy = userId;

    return this.mediaRepository.createFolder(folder);
  }

  async delete(id: string, type: 'file' | 'folder'): Promise<void> {
    if (type === 'folder') {
      const folder = await this.mediaRepository.findFolderById(id);
      if (!folder) {
        throw new NotFoundException('Folder not found');
      }

      const isEmpty = await this.mediaRepository.isFolderEmpty(id);
      if (!isEmpty) {
        throw new BadRequestException('Folder is not empty');
      }

      await this.mediaRepository.deleteFolder(id);
    } else {
      const media = await this.mediaRepository.findFileById(id);
      if (!media) {
        throw new NotFoundException('File not found');
      }

      await this.mediaRepository.deleteFile(id);
    }
  }

  async uploadFile(
    file: Express.Multer.File,
    userId: string,
    folderId?: string,
  ): Promise<Media> {
    if (!file) {
      throw new BadRequestException('File is required');
    }

    if (folderId) {
      const folder = await this.mediaRepository.findFolderById(folderId);
      if (!folder) {
        throw new NotFoundException('Folder not found');
      }
    }

    const storageFolder = 'uploads';
    const fileUrl = await this.storageService.upload(file, storageFolder);

    const media = new Media();
    media.fileName = file.filename || file.originalname;
    media.fileType = file.mimetype;
    media.fileSize = file.size;
    media.fileUrl = fileUrl;
    media.folderId = folderId || null;
    media.createdBy = userId;

    return this.mediaRepository.createFile(media);
  }
}
