import { Notification } from '../entities/notification.entity';

export interface INotificationRepository {
  create(data: Partial<Notification>): Promise<Notification>;
  findAllByUserId(
    userId: string,
    page?: number,
    limit?: number,
  ): Promise<{ data: Notification[]; total: number; unreadCount: number }>;
  markAsRead(id: string): Promise<Notification>;
  markAllAsRead(userId: string): Promise<void>;
  findById(id: string): Promise<Notification | null>;
}
