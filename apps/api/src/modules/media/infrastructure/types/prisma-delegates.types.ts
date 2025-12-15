import { PrismaService } from '@/core/prisma/prisma.service';

/**
 * Prisma delegate interfaces for Media operations
 * These provide type-safe access to Prisma client methods
 */
export interface MediaDelegate {
  findMany(args: { where?: unknown; orderBy?: unknown }): Promise<unknown[]>;
  findUnique(args: {
    where: { id: string };
    include?: unknown;
  }): Promise<unknown>;
  create(args: { data: unknown }): Promise<unknown>;
  delete(args: { where: { id: string } }): Promise<unknown>;
}

export interface MediaFolderDelegate {
  findMany(args: { where?: unknown; orderBy?: unknown }): Promise<unknown[]>;
  findUnique(args: {
    where: { id: string };
    include?: unknown;
  }): Promise<unknown>;
  create(args: { data: unknown }): Promise<unknown>;
  delete(args: { where: { id: string } }): Promise<unknown>;
}

export interface ExtendedPrismaService extends PrismaService {
  media: MediaDelegate;
  mediaFolder: MediaFolderDelegate;
}
