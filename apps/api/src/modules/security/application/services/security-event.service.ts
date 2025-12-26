import { Inject, Injectable } from '@nestjs/common';
import { SecurityEventSeverity, SecurityEventType } from '@prisma/client';
import { ILoginHistoryRepository } from '../../domain/repositories/login-history.repository.interface';
import { ISecurityEventRepository } from '../../domain/repositories/security-event.repository.interface';

@Injectable()
export class SecurityEventService {
  private readonly BRUTE_FORCE_THRESHOLD = 5;
  private readonly BRUTE_FORCE_WINDOW_MINUTES = 15;

  constructor(
    @Inject(ISecurityEventRepository)
    private readonly eventRepository: ISecurityEventRepository,
    @Inject(ILoginHistoryRepository)
    private readonly loginHistoryRepository: ILoginHistoryRepository,
  ) {}

  async checkBruteForce(email: string, ip: string): Promise<boolean> {
    const since = new Date(
      Date.now() - this.BRUTE_FORCE_WINDOW_MINUTES * 60 * 1000,
    );
    const failedAttempts =
      await this.loginHistoryRepository.findRecentFailedAttempts(email, since);

    if (failedAttempts.length >= this.BRUTE_FORCE_THRESHOLD) {
      await this.createEvent({
        type: SecurityEventType.BRUTE_FORCE,
        severity: SecurityEventSeverity.HIGH,
        ip,
        description: `Brute force attack detected: ${failedAttempts.length} failed attempts for ${email}`,
        data: JSON.stringify({ email, attempts: failedAttempts.length }),
      });
      return true;
    }

    return false;
  }

  async createEvent(data: {
    type: SecurityEventType;
    severity: SecurityEventSeverity;
    userId?: string;
    ip: string;
    description: string;
    data?: string;
    userAgent?: string;
  }) {
    return this.eventRepository.create({
      type: data.type,
      severity: data.severity,
      user: data.userId ? { connect: { id: data.userId } } : undefined,
      ip: data.ip,
      userAgent: data.userAgent,
      description: data.description,
      data: data.data,
    });
  }

  async resolveEvent(id: string, resolvedBy: string) {
    return this.eventRepository.resolve(id, resolvedBy);
  }

  async getUnresolvedEvents() {
    return this.eventRepository.findUnresolved();
  }

  async getAllEvents(filters?: {
    type?: SecurityEventType;
    severity?: SecurityEventSeverity;
    resolved?: boolean;
    skip?: number;
    take?: number;
  }) {
    return this.eventRepository.findAll(filters);
  }
}
