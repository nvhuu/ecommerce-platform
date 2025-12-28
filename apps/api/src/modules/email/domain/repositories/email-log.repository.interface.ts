import { EmailLog, EmailStatus } from '../entities/email-log.entity';

export const EMAIL_LOG_REPOSITORY_TOKEN = 'EMAIL_LOG_REPOSITORY_TOKEN';

export interface IEmailLogRepository {
  create(data: Partial<EmailLog>): Promise<EmailLog>;
  update(id: string, data: Partial<EmailLog>): Promise<EmailLog>;
  findById(id: string): Promise<EmailLog | null>;
  findByRecipient(recipient: string): Promise<EmailLog[]>;
  findByStatus(status: EmailStatus): Promise<EmailLog[]>;
}
