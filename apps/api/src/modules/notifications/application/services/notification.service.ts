import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { INotificationRepository } from '../../domain/repositories/notification.repository.interface';
import {
  NotificationListResponseDto,
  NotificationResponseDto,
} from '../dtos/notification.dto';

@Injectable()
export class NotificationService {
  constructor(
    @Inject('INotificationRepository')
    private readonly repository: INotificationRepository,
  ) {}

  // Usually called by other services, not controllers
  async sendNotification(
    userId: string,
    type: string,
    title: string,
    message: string,
    data?: any,
  ) {
    return this.repository.create({
      userId,
      type,
      title,
      message,
      data,
    });
  }

  async getMyNotifications(
    userId: string,
    page = 1,
    limit = 20,
  ): Promise<NotificationListResponseDto> {
    const result = await this.repository.findAllByUserId(userId, page, limit);
    return {
      data: plainToInstance(NotificationResponseDto, result.data),
      total: result.total,
      unreadCount: result.unreadCount,
    };
  }

  async markAsRead(id: string, userId: string) {
    // Check ownership
    const notification = await this.repository.findById(id);
    if (!notification) throw new NotFoundException('Notification not found');
    if (notification.userId !== userId)
      throw new ForbiddenException('Access denied');

    const updated = await this.repository.markAsRead(id);
    return plainToInstance(NotificationResponseDto, updated);
  }

  async markAllAsRead(userId: string) {
    await this.repository.markAllAsRead(userId);
    return { success: true };
  }
}
