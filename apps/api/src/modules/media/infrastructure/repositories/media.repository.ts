import { PrismaService } from '@/core/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { MediaFolder } from '../../domain/entities/media-folder.entity';
import { Media } from '../../domain/entities/media.entity';
import { IMediaRepository } from '../../domain/repositories/media.repository.interface';

@Injectable()
export class MediaRepository implements IMediaRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAllFiles(folderId?: string): Promise<Media[]> {
    const whereCondition = folderId ? { folderId } : { folderId: null };
    const filesData = await this.prisma.media.findMany({
      where: whereCondition,
      orderBy: { createdAt: 'desc' },
    });

    return filesData
      .map((f) => Media.toDomain(f))
      .filter((f): f is Media => f !== null);
  }

  async findFileById(id: string): Promise<Media | null> {
    const data = await this.prisma.media.findUnique({
      where: { id },
    });
    return data ? Media.toDomain(data) : null;
  }

  async createFile(media: Media): Promise<Media> {
    const created = await this.prisma.media.create({
      data: {
        fileName: media.fileName,
        fileType: media.fileType,
        fileSize: media.fileSize,
        fileUrl: media.fileUrl,
        folderId: media.folderId || null,
        createdBy: media.createdBy || null,
      },
    });

    const result = Media.toDomain(created);
    if (!result) {
      throw new Error('Failed to create media file');
    }
    return result;
  }

  async deleteFile(id: string): Promise<void> {
    await this.prisma.media.delete({ where: { id } });
  }

  async findAllFolders(parentId?: string): Promise<MediaFolder[]> {
    const foldersData = await this.prisma.mediaFolder.findMany({
      where: { parentId: parentId || null },
      orderBy: { createdAt: 'desc' },
    });

    return foldersData
      .map((f) => MediaFolder.toDomain(f))
      .filter((f): f is MediaFolder => f !== null);
  }

  async findFolderById(id: string): Promise<MediaFolder | null> {
    const data = await this.prisma.mediaFolder.findUnique({
      where: { id },
    });
    return data ? MediaFolder.toDomain(data) : null;
  }

  async createFolder(folder: MediaFolder): Promise<MediaFolder> {
    const created = await this.prisma.mediaFolder.create({
      data: {
        name: folder.name,
        parentId: folder.parentId || null,
        createdBy: folder.createdBy || null,
      },
    });

    const result = MediaFolder.toDomain(created);
    if (!result) {
      throw new Error('Failed to create folder');
    }
    return result;
  }

  async deleteFolder(id: string): Promise<void> {
    await this.prisma.mediaFolder.delete({ where: { id } });
  }

  async isFolderEmpty(id: string): Promise<boolean> {
    const folder = await this.prisma.mediaFolder.findUnique({
      where: { id },
      include: { children: true, media: true },
    });

    if (!folder) return true;

    const folderData = folder as Record<string, unknown>;
    const children = folderData.children as unknown[] | undefined;
    const media = folderData.media as unknown[] | undefined;

    return !(children && children.length > 0) && !(media && media.length > 0);
  }
}
