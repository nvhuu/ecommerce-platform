import { ActivityAction, ActivityLog, Prisma } from '@prisma/client';

export abstract class IActivityLogRepository {
  abstract create(data: Prisma.ActivityLogCreateInput): Promise<ActivityLog>;
  abstract findByUserId(
    userId: string,
    skip?: number,
    take?: number,
  ): Promise<ActivityLog[]>;
  abstract findByResource(
    resource: string,
    resourceId?: string,
    skip?: number,
    take?: number,
  ): Promise<ActivityLog[]>;
  abstract findAll(filters?: {
    userId?: string;
    resource?: string;
    action?: ActivityAction;
    skip?: number;
    take?: number;
  }): Promise<ActivityLog[]>;
  abstract findById(id: string): Promise<ActivityLog | null>;
}
