import { Injectable } from '@nestjs/common';
import { User } from '../../domain/entities/user.entity';
import { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { Role } from '../../generated/prisma/enums';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(private prisma: PrismaService) {}

  async create(user: Partial<User>): Promise<User> {
    const createdUser = await this.prisma.user.create({
      data: {
        email: user.email!,
        password: user.password!,
        role: user.role as Role,
      },
    });
    return User.toDomain(createdUser)!;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    if (!user || user.deletedAt) return null;
    return User.toDomain(user);
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    if (!user || user.deletedAt) return null;
    return User.toDomain(user);
  }

  async findAll(options: {
    cursor?: string;
    page?: number;
    limit: number;
  }): Promise<{
    data: User[];
    total?: number;
    hasMore?: boolean;
    lastId?: string;
    usedCursor: boolean;
  }> {
    if (options.cursor) {
      // Cursor pagination
      const decodedCursor = Buffer.from(options.cursor, 'base64').toString();

      const data = await this.prisma.user.findMany({
        take: options.limit + 1,
        cursor: { id: decodedCursor },
        skip: 1,
        where: { deletedAt: null },
        orderBy: { createdAt: 'desc' },
      });

      const hasMore = data.length > options.limit;
      const results = hasMore ? data.slice(0, options.limit) : data;
      const lastId =
        results.length > 0 ? results[results.length - 1].id : undefined;

      return {
        data: results
          .map((u: any) => User.toDomain(u))
          .filter((u: User | null): u is User => u !== null),
        hasMore,
        lastId,
        usedCursor: true,
      };
    } else {
      // Offset pagination
      const skip = ((options.page || 1) - 1) * options.limit;

      const [data, total] = await Promise.all([
        this.prisma.user.findMany({
          where: { deletedAt: null },
          skip,
          take: options.limit,
          orderBy: { createdAt: 'desc' },
        }),
        this.prisma.user.count({
          where: { deletedAt: null },
        }),
      ]);

      return {
        data: data
          .map((u: any) => User.toDomain(u))
          .filter((u: User | null): u is User => u !== null),
        total,
        usedCursor: false,
      };
    }
  }

  async update(id: string, data: Partial<User>): Promise<User | null> {
    const user = await this.prisma.user.update({
      where: { id },
      data: {
        email: data.email,
        password: data.password,
        role: data.role as Role,
      },
    });
    return User.toDomain(user);
  }

  async delete(id: string, deletedBy?: string): Promise<void> {
    await this.prisma.user.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        ...(deletedBy && { deletedBy }),
      },
    });
  }
}
