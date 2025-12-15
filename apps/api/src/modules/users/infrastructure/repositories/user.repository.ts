import { PrismaService } from '@/core/prisma/prisma.service';
import {
  PaginatedResult,
  PaginationOptions,
} from '@/shared/interfaces/repository.interface';
import { Injectable } from '@nestjs/common';
import { Prisma, Role } from '@prisma/client';
import { User } from '../../domain/entities/user.entity';
import { IUserRepository } from '../../domain/repositories/user.repository.interface';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(private prisma: PrismaService) {}

  async findAll(options: PaginationOptions): Promise<PaginatedResult<User>> {
    const page = options.page || 1;
    const limit = options.limit || 10;
    const skip = (page - 1) * limit;

    const where: Prisma.UserWhereInput = {
      deletedAt: null,
      ...(options.search
        ? {
            OR: [{ email: { contains: options.search, mode: 'insensitive' } }],
          }
        : {}),
    };

    const [data, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.user.count({ where }),
    ]);

    const users = data
      .map((u) => User.toDomain(u))
      .filter((u): u is User => u !== null);

    return {
      data: users,
      page,
      limit,
      total,
    };
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    if (!user || user.deletedAt) return null;
    return User.toDomain(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    if (!user || user.deletedAt) return null;
    return User.toDomain(user);
  }

  async create(user: Partial<User>): Promise<User> {
    const created = await this.prisma.user.create({
      data: {
        email: user.email!,
        password: user.password!,
        role: user.role as Role,
      },
    });
    const result = User.toDomain(created);
    if (!result) throw new Error('Failed to create user');
    return result;
  }

  async update(id: string, data: Partial<User>): Promise<User | null> {
    const updated = await this.prisma.user.update({
      where: { id },
      data: {
        ...(data.email && { email: data.email }),
        ...(data.password && { password: data.password }),
        ...(data.role && { role: data.role as Role }),
      },
    });
    return User.toDomain(updated);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.user.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
