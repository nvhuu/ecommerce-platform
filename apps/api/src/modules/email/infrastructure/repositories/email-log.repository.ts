import { PrismaService } from '@/core/prisma/prisma.service';
import { SortOrder } from '@/shared/constants/sort.constant';
import { Injectable } from '@nestjs/common';
import { Prisma, EmailStatus as PrismaEmailStatus } from '@prisma/client';
import { EmailLog, EmailStatus } from '../../domain/entities/email-log.entity';
import { IEmailLogRepository } from '../../domain/repositories/email-log.repository.interface';

/**
 * Helper function to safely convert domain EmailStatus to Prisma EmailStatus
 * Both enums have the same string values, but TypeScript treats them as different types
 */
function toPrismaEmailStatus(status: EmailStatus): PrismaEmailStatus {
  return PrismaEmailStatus[status];
}

@Injectable()
export class EmailLogRepository implements IEmailLogRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Partial<EmailLog>): Promise<EmailLog> {
    const input: Prisma.EmailLogCreateInput = {
      recipient: data.recipient!,
      subject: data.subject!,
      template: data.template,
      metadata: (data.metadata || {}) as Prisma.InputJsonValue,
      status: data.status
        ? toPrismaEmailStatus(data.status)
        : PrismaEmailStatus.PENDING,
      provider: data.provider || 'console',
      error: data.error,
      messageId: data.messageId,
      sentAt: data.sentAt,
      // Handle user relation if userId is present
      user: data.userId ? { connect: { id: data.userId } } : undefined,
    };

    const created = await this.prisma.emailLog.create({
      data: input,
    });

    const result = EmailLog.toDomain(created);
    if (!result) throw new Error('Failed to create email log');
    return result;
  }

  async update(id: string, data: Partial<EmailLog>): Promise<EmailLog> {
    const input: Prisma.EmailLogUpdateInput = {
      ...(data.status && {
        status: toPrismaEmailStatus(data.status),
      }),
      ...(data.error !== undefined && { error: data.error }),
      ...(data.sentAt !== undefined && { sentAt: data.sentAt }),
      ...(data.messageId !== undefined && { messageId: data.messageId }),
    };

    const updated = await this.prisma.emailLog.update({
      where: { id },
      data: input,
    });

    const result = EmailLog.toDomain(updated);
    if (!result) throw new Error('Failed to update email log');
    return result;
  }

  async findById(id: string): Promise<EmailLog | null> {
    const result = await this.prisma.emailLog.findUnique({
      where: { id },
    });
    return EmailLog.toDomain(result);
  }

  async findByRecipient(recipient: string): Promise<EmailLog[]> {
    const results = await this.prisma.emailLog.findMany({
      where: { recipient },
      orderBy: { createdAt: SortOrder.DESC },
    });
    return results
      .map((r) => EmailLog.toDomain(r))
      .filter((l): l is EmailLog => l !== null);
  }

  async findByStatus(status: EmailStatus): Promise<EmailLog[]> {
    const results = await this.prisma.emailLog.findMany({
      where: { status: toPrismaEmailStatus(status) },
      orderBy: { createdAt: SortOrder.DESC },
    });
    return results
      .map((r) => EmailLog.toDomain(r))
      .filter((l): l is EmailLog => l !== null);
  }
}
