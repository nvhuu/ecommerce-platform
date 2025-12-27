import { Inject, Injectable } from '@nestjs/common';
import { LoginStatus } from '@prisma/client';
import { ILoginHistoryRepository } from '../../domain/repositories/login-history.repository.interface';

@Injectable()
export class LoginHistoryService {
  constructor(
    @Inject(ILoginHistoryRepository)
    private readonly repository: ILoginHistoryRepository,
  ) {}

  async logSuccess(
    userId: string,
    email: string,
    ip: string,
    userAgent?: string,
  ) {
    return this.repository.create({
      user: userId ? { connect: { id: userId } } : undefined,
      email,
      status: LoginStatus.SUCCESS,
      ip,
      userAgent,
    });
  }

  async logFailed(
    email: string,
    ip: string,
    reason: string,
    userAgent?: string,
  ) {
    return this.repository.create({
      email,
      status: LoginStatus.FAILED,
      failReason: reason,
      ip,
      userAgent,
    });
  }

  async logBlocked(
    email: string,
    ip: string,
    reason: string,
    userAgent?: string,
  ) {
    return this.repository.create({
      email,
      status: LoginStatus.BLOCKED,
      failReason: reason,
      ip,
      userAgent,
    });
  }

  async getRecentFailedAttempts(email: string, minutesAgo = 15) {
    const since = new Date(Date.now() - minutesAgo * 60 * 1000);
    return this.repository.findRecentFailedAttempts(email, since);
  }

  async getUserHistory(userId: string, limit = 20) {
    return this.repository.findByUserId(userId, limit);
  }

  async getEmailHistory(email: string, limit = 20) {
    return this.repository.findByEmail(email, limit);
  }

  async findAll(filters?: {
    status?: LoginStatus;
    email?: string;
    ip?: string;
    skip?: number;
    take?: number;
  }) {
    return this.repository.findAll(filters);
  }
}
