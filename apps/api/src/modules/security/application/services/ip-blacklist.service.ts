import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { BlockType } from '@prisma/client';
import { IIPBlacklistRepository } from '../../domain/repositories/ip-blacklist.repository.interface';

@Injectable()
export class IPBlacklistService {
  constructor(
    @Inject(IIPBlacklistRepository)
    private readonly repository: IIPBlacklistRepository,
  ) {}

  async blockIP(data: {
    ip: string;
    type: BlockType;
    reason: string;
    blockedBy?: string;
    expiresAt?: Date;
  }) {
    const existing = await this.repository.findByIP(data.ip);
    if (existing) {
      throw new ConflictException('IP already blocked');
    }

    return this.repository.create({
      ip: data.ip,
      type: data.type,
      reason: data.reason,
      blocker: data.blockedBy ? { connect: { id: data.blockedBy } } : undefined,
      expiresAt: data.expiresAt,
    });
  }

  async unblockIP(ip: string) {
    const existing = await this.repository.findByIP(ip);
    if (!existing) {
      throw new ConflictException('IP not found in blacklist');
    }

    return this.repository.delete(ip);
  }

  async isBlocked(ip: string): Promise<boolean> {
    const blocked = await this.repository.findByIP(ip);
    if (!blocked) return false;

    // Check if temporary block has expired
    if (blocked.type === BlockType.TEMPORARY && blocked.expiresAt) {
      if (blocked.expiresAt < new Date()) {
        await this.repository.delete(ip);
        return false;
      }
    }

    return true;
  }

  async getAll(type?: BlockType) {
    return this.repository.findAll(type);
  }

  async cleanExpired() {
    return this.repository.cleanExpired();
  }
}
