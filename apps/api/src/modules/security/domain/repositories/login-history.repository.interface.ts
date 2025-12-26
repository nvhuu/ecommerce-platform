import { LoginHistory, LoginStatus, Prisma } from '@prisma/client';

export abstract class ILoginHistoryRepository {
  abstract create(data: Prisma.LoginHistoryCreateInput): Promise<LoginHistory>;
  abstract findByUserId(
    userId: string,
    limit?: number,
  ): Promise<LoginHistory[]>;
  abstract findByEmail(email: string, limit?: number): Promise<LoginHistory[]>;
  abstract findByIP(ip: string, limit?: number): Promise<LoginHistory[]>;
  abstract findRecentFailedAttempts(
    email: string,
    since: Date,
  ): Promise<LoginHistory[]>;
  abstract findByStatus(
    status: LoginStatus,
    skip?: number,
    take?: number,
  ): Promise<LoginHistory[]>;
}
