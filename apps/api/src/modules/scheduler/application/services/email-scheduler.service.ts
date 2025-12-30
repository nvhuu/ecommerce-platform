import { MESSAGES } from '@/shared/constants/messages.constant';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ScheduleStatus } from '@prisma/client';
import { ISchedulerRepository } from '../../domain/repositories/scheduler.repository.interface';
// Assuming EmailService exists and is exported
import { EmailService } from '../../../email/application/services/email.service';

@Injectable()
export class EmailSchedulerService {
  private readonly logger = new Logger(EmailSchedulerService.name);

  constructor(
    @Inject('ISchedulerRepository')
    private readonly schedulerRepository: ISchedulerRepository,
    private readonly emailService: EmailService,
  ) {}

  async processDueEmails(): Promise<void> {
    const dueEmails = await this.schedulerRepository.findDueEmails();

    if (dueEmails.length === 0) return;

    this.logger.log(`Processing ${dueEmails.length} due emails`);

    for (const email of dueEmails) {
      try {
        // Send email using EmailService
        // EmailService expects SendEmailDto: { to, subject, templateSlug, variables }
        // We iterate over recipients if multiple

        for (const recipient of email.recipients) {
          await this.emailService.sendEmail({
            to: recipient,
            subject: MESSAGES.SCHEDULER.DEFAULT_EMAIL_SUBJECT, // Subject can be overridden by template
            templateSlug: email.templateKey,
            variables: email.data || {},
          });
        }

        await this.schedulerRepository.updateScheduledEmail(email.id, {
          status: ScheduleStatus.PROCESSED,
          processedAt: new Date(),
        });
      } catch (error) {
        this.logger.error(`Failed to send email ${email.id}`, error);
        await this.schedulerRepository.updateScheduledEmail(email.id, {
          status: ScheduleStatus.FAILED,
          error:
            error instanceof Error
              ? error.message
              : MESSAGES.SCHEDULER.UNKNOWN_ERROR,
        });
      }
    }
  }
}
