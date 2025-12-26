import { PrismaService } from '@/core/prisma/prisma.service';
import { SortOrder } from '@/shared/constants/sort.constant';
import { Injectable } from '@nestjs/common';
import {
  Prisma,
  SecurityEvent,
  SecurityEventSeverity,
  SecurityEventType,
} from '@prisma/client';
import { ISecurityEventRepository } from '../../domain/repositories/security-event.repository.interface';

@Injectable()
export class SecurityEventRepository implements ISecurityEventRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.SecurityEventCreateInput): Promise<SecurityEvent> {
    return this.prisma.securityEvent.create({ data });
  }

  async findById(id: string): Promise<SecurityEvent | null> {
    return this.prisma.securityEvent.findUnique({ where: { id } });
  }

  async findAll(filters?: {
    type?: SecurityEventType;
    severity?: SecurityEventSeverity;
    resolved?: boolean;
    skip?: number;
    take?: number;
  }): Promise<SecurityEvent[]> {
    return this.prisma.securityEvent.findMany({
      where: {
        type: filters?.type,
        severity: filters?.severity,
        resolved: filters?.resolved,
      },
      orderBy: { createdAt: SortOrder.DESC },
      skip: filters?.skip,
      take: filters?.take || 50,
    });
  }

  async resolve(id: string, resolvedBy: string): Promise<SecurityEvent> {
    return this.prisma.securityEvent.update({
      where: { id },
      data: {
        resolved: true,
        resolvedBy,
        resolvedAt: new Date(),
      },
    });
  }

  async findUnresolved(): Promise<SecurityEvent[]> {
    return this.prisma.securityEvent.findMany({
      where: { resolved: false },
      orderBy: { createdAt: SortOrder.ASC },
    });
  }
}
