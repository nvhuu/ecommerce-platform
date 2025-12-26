import {
  Prisma,
  SecurityEvent,
  SecurityEventSeverity,
  SecurityEventType,
} from '@prisma/client';

export abstract class ISecurityEventRepository {
  abstract create(
    data: Prisma.SecurityEventCreateInput,
  ): Promise<SecurityEvent>;
  abstract findById(id: string): Promise<SecurityEvent | null>;
  abstract findAll(filters?: {
    type?: SecurityEventType;
    severity?: SecurityEventSeverity;
    resolved?: boolean;
    skip?: number;
    take?: number;
  }): Promise<SecurityEvent[]>;
  abstract resolve(id: string, resolvedBy: string): Promise<SecurityEvent>;
  abstract findUnresolved(): Promise<SecurityEvent[]>;
}
