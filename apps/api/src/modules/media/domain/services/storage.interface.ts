/// <reference types="multer" />

/**
 * Storage service interface for handling file uploads
 * This belongs in domain as it's a port that infrastructure implements
 */
export interface IStorageService {
  upload(file: Express.Multer.File, path: string): Promise<string>;
  delete?(fileUrl: string): Promise<void>;
}
