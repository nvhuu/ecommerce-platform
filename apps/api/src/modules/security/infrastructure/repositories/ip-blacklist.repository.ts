import { PrismaService } from '@/core/prisma/prisma.service';
import { SortOrder } from '@/shared/constants/sort.constant';
import { Injectable } from '@nestjs/common';
import { BlockType, Prisma } from '@prisma/client';
import { IPBlacklist } from '../../domain/entities/ip-blacklist.entity';
import { IIPBlacklistRepository } from '../../domain/repositories/ip-blacklist.repository.interface';

@Injectable()
export class IPBlacklistRepository implements IIPBlacklistRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.IPBlacklistCreateInput): Promise<IPBlacklist> {
    const result = await this.prisma.iPBlacklist.create({ data });
    return IPBlacklist.toDomain(result)!;
  }

  async findByIP(ip: string): Promise<IPBlacklist | null> {
    const result = await this.prisma.iPBlacklist.findUnique({ where: { ip } });
    return result ? IPBlacklist.toDomain(result) : null;
  }

  async findAll(type?: BlockType): Promise<IPBlacklist[]> {
    const results = await this.prisma.iPBlacklist.findMany({
      where: type ? { type } : undefined,
      orderBy: { createdAt: SortOrder.DESC },
    });
    return results.map((r) => IPBlacklist.toDomain(r)!);
  }

  async delete(ip: string): Promise<IPBlacklist> {
    const result = await this.prisma.iPBlacklist.delete({ where: { ip } });
    return IPBlacklist.toDomain(result)!;
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
