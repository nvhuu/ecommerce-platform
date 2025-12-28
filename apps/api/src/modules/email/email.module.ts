import { PrismaModule } from '@/core/prisma/prisma.module';
import { Module } from '@nestjs/common';
import { EmailTemplateService } from './application/services/email-template.service';
import { EmailService } from './application/services/email.service';
import { EMAIL_LOG_REPOSITORY_TOKEN } from './domain/repositories/email-log.repository.interface';
import { EMAIL_TEMPLATE_REPOSITORY_TOKEN } from './domain/repositories/email-template.repository.interface';
import { EmailLogRepository } from './infrastructure/repositories/email-log.repository';
import { EmailTemplateRepository } from './infrastructure/repositories/email-template.repository';
import { EmailTemplateController } from './presentation/controllers/email-template.controller';

@Module({
  imports: [PrismaModule],
  controllers: [EmailTemplateController],
  providers: [
    EmailTemplateService,
    EmailService,
    {
      provide: EMAIL_TEMPLATE_REPOSITORY_TOKEN,
      useClass: EmailTemplateRepository,
    },
    {
      provide: EMAIL_LOG_REPOSITORY_TOKEN,
      useClass: EmailLogRepository,
    },
  ],
  exports: [EmailService], // Export EmailService for use in other modules
})
export class EmailModule {}
