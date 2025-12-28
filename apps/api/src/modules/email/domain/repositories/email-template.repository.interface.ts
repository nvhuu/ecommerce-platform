import { EmailTemplate } from '../entities/email-template.entity';

export const EMAIL_TEMPLATE_REPOSITORY_TOKEN =
  'EMAIL_TEMPLATE_REPOSITORY_TOKEN';

export interface IEmailTemplateRepository {
  create(data: Partial<EmailTemplate>): Promise<EmailTemplate>;
  update(id: string, data: Partial<EmailTemplate>): Promise<EmailTemplate>;
  delete(id: string): Promise<void>;
  findById(id: string): Promise<EmailTemplate | null>;
  findBySlug(slug: string): Promise<EmailTemplate | null>;
  findAll(): Promise<EmailTemplate[]>;
}
