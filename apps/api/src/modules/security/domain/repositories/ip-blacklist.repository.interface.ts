import { BlockType, Prisma } from '@prisma/client';
import { IPBlacklist } from '../entities/ip-blacklist.entity';

export abstract class IIPBlacklistRepository {
  abstract create(data: Prisma.IPBlacklistCreateInput): Promise<IPBlacklist>;
  abstract findByIP(ip: string): Promise<IPBlacklist | null>;
  abstract findAll(type?: BlockType): Promise<IPBlacklist[]>;
  abstract delete(ip: string): Promise<IPBlacklist>;
  abstract cleanExpired(): Promise<number>;
}
