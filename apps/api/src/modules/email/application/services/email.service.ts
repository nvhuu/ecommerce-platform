import { Inject, Injectable, Logger } from '@nestjs/common';
import { EmailStatus } from '../../domain/entities/email-log.entity';
import {
  EMAIL_LOG_REPOSITORY_TOKEN,
  IEmailLogRepository,
} from '../../domain/repositories/email-log.repository.interface';
import {
  EMAIL_TEMPLATE_REPOSITORY_TOKEN,
  IEmailTemplateRepository,
} from '../../domain/repositories/email-template.repository.interface';
import { SendEmailDto } from '../dtos/send-email.dto';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  constructor(
    @Inject(EMAIL_LOG_REPOSITORY_TOKEN)
    private readonly logRepository: IEmailLogRepository,
    @Inject(EMAIL_TEMPLATE_REPOSITORY_TOKEN)
    private readonly templateRepository: IEmailTemplateRepository,
  ) {}

  async sendEmail(dto: SendEmailDto, userId?: string): Promise<void> {
    let content = dto.html || dto.text || '';
    let subject = dto.subject;

    // Handle template substitution
    if (dto.templateSlug) {
      const template = await this.templateRepository.findBySlug(
        dto.templateSlug,
      );
      if (template) {
        subject = template.subject; // Override subject from template if needed, or use logic to prefer DTO
        content = template.content;

        // Simple variable substitution
        if (dto.variables) {
          Object.keys(dto.variables).forEach((key) => {
            const regex = new RegExp(`{{${key}}}`, 'g');
            content = content.replace(regex, String(dto.variables![key]));
          });
        }
      } else {
        this.logger.warn(
          `Template ${dto.templateSlug} not found. Sending without template.`,
        );
      }
    }

    // MOCK SENDING (Console Log)
    // In production, integrate SendGrid/SES here
    this.logger.log(`Sending email to ${dto.to} | Subject: ${subject}`);
    // console.log(content);

    // Create Log
    await this.logRepository.create({
      recipient: dto.to,
      subject: subject,
      template: dto.templateSlug,
      metadata: dto.variables,
      status: EmailStatus.SENT, // Assume success for mock
      provider: 'console',
      userId: userId,
      sentAt: new Date(),
    });
  }
}
