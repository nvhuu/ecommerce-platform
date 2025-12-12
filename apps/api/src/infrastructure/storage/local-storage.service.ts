/// <reference types="multer" />
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';
import { StorageService } from './storage.interface';

@Injectable()
export class LocalStorageService implements StorageService {
  private readonly uploadDir: string;
  private readonly logger = new Logger(LocalStorageService.name);

  constructor(private readonly configService: ConfigService) {
    this.uploadDir = this.configService.get<string>(
      'storage.uploadDir',
      'uploads',
    );
    this.ensureUploadDirExists();
  }

  private ensureUploadDirExists() {
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  async upload(
    file: Express.Multer.File,
    folder: string = 'general',
  ): Promise<string> {
    this.ensureUploadDirExists();

    // Create subfolder if needed
    const targetFolder = path.join(this.uploadDir, folder);
    if (!fs.existsSync(targetFolder)) {
      fs.mkdirSync(targetFolder, { recursive: true });
    }

    const fileName = `${Date.now()}_${file.originalname.replace(/\s/g, '_')}`;
    const filePath = path.join(targetFolder, fileName);

    try {
      await fs.promises.writeFile(filePath, file.buffer);
      // Construct public URL - assuming served from root/uploads
      // We return the relative path that the frontend can append to the base URL
      return `/uploads/${folder}/${fileName}`;
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to save file: ${msg}`);
    }
  }
}
