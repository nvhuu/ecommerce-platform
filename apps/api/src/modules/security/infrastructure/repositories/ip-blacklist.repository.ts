import { PrismaService } from '@/core/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { BlockType, IPBlacklist, Prisma } from '@prisma/client';
import { IIPBlacklistRepository } from '../../domain/repositories/ip-blacklist.repository.interface';

@Injectable()
export class IPBlacklistRepository implements IIPBlacklistRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.IPBlacklistCreateInput): Promise<IPBlacklist> {
    return this.prisma.iPBlacklist.create({ data });
  }

  async findByIP(ip: string): Promise<IPBlacklist | null> {
    return this.prisma.iPBlacklist.findUnique({ where: { ip } });
  }

  async findAll(type?: BlockType): Promise<IPBlacklist[]> {
    return this.prisma.iPBlacklist.findMany({
      where: type ? { type } : undefined,
      orderBy: { createdAt: 'desc' },
    });
  }

  async delete(ip: string): Promise<IPBlacklist> {
    return this.prisma.iPBlacklist.delete({ where: { ip } });
  }

  async cleanExpired(): Promise<number> {
    const result = await this.prisma.iPBlacklist.deleteMany({
      where: {
        type: BlockType.TEMPORARY,
        expiresAt: {
          lte: new Date(),
        },
      },
    });
    return result.count;
  }
}
