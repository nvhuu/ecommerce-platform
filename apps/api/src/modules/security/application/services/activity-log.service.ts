import { Inject, Injectable } from '@nestjs/common';
import { ActivityAction, Prisma } from '@prisma/client';
import { IActivityLogRepository } from '../../domain/repositories/activity-log.repository.interface';

@Injectable()
export class ActivityLogService {
  constructor(
    @Inject(IActivityLogRepository)
    private readonly repository: IActivityLogRepository,
  ) {}

  async log(data: {
    userId: string;
    action: ActivityAction;
    resource: string;
    resourceId?: string;
    changes?: Prisma.JsonObject;
    ip: string;
    userAgent?: string;
  }) {
    return this.repository.create({
      user: { connect: { id: data.userId } },
      action: data.action,
      resource: data.resource,
      resourceId: data.resourceId,
      changes: data.changes ? JSON.stringify(data.changes) : undefined,
      ip: data.ip,
      userAgent: data.userAgent,
    });
  }

  async getUserLogs(userId: string, skip = 0, take = 50) {
    return this.repository.findByUserId(userId, skip, take);
  }

  async getResourceLogs(
    resource: string,
    resourceId?: string,
    skip = 0,
    take = 50,
  ) {
    return this.repository.findByResource(resource, resourceId, skip, take);
  }

  async getAllLogs(filters?: {
    userId?: string;
    resource?: string;
    action?: ActivityAction;
    skip?: number;
    take?: number;
  }) {
    return this.repository.findAll(filters);
  }

  async findAll(filters?: {
    userId?: string;
    resource?: string;
    action?: ActivityAction;
    skip?: number;
    take?: number;
  }) {
    return this.repository.findAll(filters);
  }

  async findByUser(userId: string, limit = 50) {
    return this.repository.findByUserId(userId, 0, limit);
  }

  async findByResource(resource: string, limit = 50) {
    return this.repository.findByResource(resource, undefined, 0, limit);
  }

  async findById(id: string) {
    return this.repository.findById(id);
  }
}
