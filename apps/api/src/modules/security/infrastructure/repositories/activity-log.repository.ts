import { PrismaService } from '@/core/prisma/prisma.service';
import { SortOrder } from '@/shared/constants/sort.constant';
import { Injectable } from '@nestjs/common';
import { ActivityAction, ActivityLog, Prisma } from '@prisma/client';
import { IActivityLogRepository } from '../../domain/repositories/activity-log.repository.interface';

@Injectable()
export class ActivityLogRepository implements IActivityLogRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.ActivityLogCreateInput): Promise<ActivityLog> {
    return this.prisma.activityLog.create({ data });
  }

  async findByUserId(
    userId: string,
    skip = 0,
    take = 50,
  ): Promise<ActivityLog[]> {
    return this.prisma.activityLog.findMany({
      where: { userId },
      orderBy: { createdAt: SortOrder.DESC },
      skip,
      take,
    });
  }

  async findByResource(
    resource: string,
    resourceId?: string,
    skip = 0,
    take = 50,
  ): Promise<ActivityLog[]> {
    return this.prisma.activityLog.findMany({
      where: {
        resource,
        resourceId,
      },
      orderBy: { createdAt: SortOrder.DESC },
      skip,
      take,
    });
  }

  async findAll(filters?: {
    userId?: string;
    resource?: string;
    action?: ActivityAction;
    skip?: number;
    take?: number;
  }): Promise<ActivityLog[]> {
    return this.prisma.activityLog.findMany({
      where: {
        userId: filters?.userId,
        resource: filters?.resource,
        action: filters?.action,
      },
      orderBy: { createdAt: SortOrder.DESC },
      skip: filters?.skip,
      take: filters?.take || 50,
    });
  }

  async findById(id: string): Promise<ActivityLog | null> {
    return this.prisma.activityLog.findUnique({
      where: { id },
    });
  }
}
