import { PrismaService } from '@/core/prisma/prisma.service';
import { SortOrder } from '@/shared/constants/sort.constant';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Notification } from '../../domain/entities/notification.entity';
import { INotificationRepository } from '../../domain/repositories/notification.repository.interface';

@Injectable()
export class NotificationRepository implements INotificationRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Partial<Notification>): Promise<Notification> {
    const created = await this.prisma.notification.create({
      data: {
        userId: data.userId!,
        type: data.type!,
        title: data.title!,
        message: data.message!,
        data: (data.data || {}) as Prisma.InputJsonValue,
        isRead: data.isRead || false,
      },
    });
    const result = Notification.toDomain(created);
    if (!result) throw new Error('Failed to create notification');
    return result;
  }

  async findAllByUserId(
    userId: string,
    page = 1,
    limit = 20,
  ): Promise<{ data: Notification[]; total: number; unreadCount: number }> {
    const skip = (page - 1) * limit;

    const [notifications, total, unreadCount] = await Promise.all([
      this.prisma.notification.findMany({
        where: { userId },
        skip,
        take: limit,
        orderBy: { createdAt: SortOrder.DESC },
      }),
      this.prisma.notification.count({ where: { userId } }),
      this.prisma.notification.count({ where: { userId, isRead: false } }),
    ]);

    return {
      data: notifications
        .map((n) => Notification.toDomain(n))
        .filter((n): n is Notification => n !== null),
      total,
      unreadCount,
    };
  }

  async markAsRead(id: string): Promise<Notification> {
    const updated = await this.prisma.notification.update({
      where: { id },
      data: { isRead: true },
    });
    const result = Notification.toDomain(updated);
    if (!result) throw new Error('Failed to update notification');
    return result;
  }

  async markAllAsRead(userId: string): Promise<void> {
    await this.prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });
  }

  async findById(id: string): Promise<Notification | null> {
    const notification = await this.prisma.notification.findUnique({
      where: { id },
    });
    return notification ? Notification.toDomain(notification) : null;
  }
}
