/// <reference types="multer" />
export abstract class StorageService {
  abstract upload(file: Express.Multer.File, path: string): Promise<string>;
}
