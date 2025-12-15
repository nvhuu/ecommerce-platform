/// <reference types="multer" />
import { Injectable } from '@nestjs/common';
import * as fs from 'fs/promises';
import * as path from 'path';
import { IStorageService } from '../../domain/services/storage.interface';

@Injectable()
export class LocalStorageService implements IStorageService {
  private readonly uploadDir = './uploads';

  constructor() {
    void this.ensureUploadDir();
  }

  private async ensureUploadDir(): Promise<void> {
    try {
      await fs.access(this.uploadDir);
    } catch {
      await fs.mkdir(this.uploadDir, { recursive: true });
    }
  }

  async upload(file: Express.Multer.File, folder: string): Promise<string> {
    const uploadPath = path.join(this.uploadDir, folder);
    await fs.mkdir(uploadPath, { recursive: true });

    const filename = `${Date.now()}-${file.originalname}`;
    const filePath = path.join(uploadPath, filename);

    await fs.writeFile(filePath, file.buffer);

    return `/${folder}/${filename}`;
  }
}
