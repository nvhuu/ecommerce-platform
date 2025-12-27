import { PrismaService } from '@/core/prisma/prisma.service';
import { SortOrder } from '@/shared/constants/sort.constant';
import { Injectable } from '@nestjs/common';
import { LoginHistory, LoginStatus, Prisma } from '@prisma/client';
import { ILoginHistoryRepository } from '../../domain/repositories/login-history.repository.interface';

@Injectable()
export class LoginHistoryRepository implements ILoginHistoryRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.LoginHistoryCreateInput): Promise<LoginHistory> {
    return this.prisma.loginHistory.create({ data });
  }

  async findByUserId(userId: string, limit = 20): Promise<LoginHistory[]> {
    return this.prisma.loginHistory.findMany({
      where: { userId },
      orderBy: { createdAt: SortOrder.DESC },
      take: limit,
    });
  }

  async findByEmail(email: string, limit = 20): Promise<LoginHistory[]> {
    return this.prisma.loginHistory.findMany({
      where: { email },
      orderBy: { createdAt: SortOrder.DESC },
      take: limit,
    });
  }

  async findByIP(ip: string, limit = 20): Promise<LoginHistory[]> {
    return this.prisma.loginHistory.findMany({
      where: { ip },
      orderBy: { createdAt: SortOrder.DESC },
      take: limit,
    });
  }

  async findRecentFailedAttempts(
    email: string,
    since: Date,
  ): Promise<LoginHistory[]> {
    return this.prisma.loginHistory.findMany({
      where: {
        email,
        status: LoginStatus.FAILED,
        createdAt: { gte: since },
      },
      orderBy: { createdAt: SortOrder.DESC },
    });
  }

  async findByStatus(
    status: LoginStatus,
    skip = 0,
    take = 50,
  ): Promise<LoginHistory[]> {
    return this.prisma.loginHistory.findMany({
      where: { status },
      orderBy: { createdAt: SortOrder.DESC },
      skip,
      take,
    });
  }

  async findAll(filters?: {
    status?: LoginStatus;
    email?: string;
    ip?: string;
    skip?: number;
    take?: number;
  }): Promise<LoginHistory[]> {
    return this.prisma.loginHistory.findMany({
      where: {
        status: filters?.status,
        email: filters?.email,
        ip: filters?.ip,
      },
      orderBy: { createdAt: SortOrder.DESC },
      skip: filters?.skip || 0,
      take: filters?.take || 50,
    });
  }
}
