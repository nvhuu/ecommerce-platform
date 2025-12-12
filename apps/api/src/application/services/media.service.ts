/// <reference types="multer" />
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { StorageService } from '../../infrastructure/storage/storage.interface';

export interface MediaResponse {
  id: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable()
export class MediaService {
  private readonly logger = new Logger(MediaService.name);

  constructor(
    private readonly storageService: StorageService,
    private readonly prisma: PrismaService,
  ) {}

  async uploadFile(
    file: Express.Multer.File,
    userId: string,
    folder: string = 'general',
  ): Promise<MediaResponse> {
    if (!file) {
      throw new BadRequestException('File is required');
    }

    const fileUrl = await this.storageService.upload(file, folder);

    // Save to DB
    const media = await (
      this.prisma as unknown as {
        media: {
          create: (args: {
            data: {
              fileName: string;
              fileType: string;
              fileSize: number;
              fileUrl: string;
              createdBy: string;
            };
          }) => Promise<unknown>;
        };
      }
    ).media.create({
      data: {
        fileName: file.filename || file.originalname,
        fileType: file.mimetype,
        fileSize: file.size,
        fileUrl: fileUrl,
        createdBy: userId,
      },
    });

    return media as MediaResponse;
  }
}
