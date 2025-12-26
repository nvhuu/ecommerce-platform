import { UsersModule } from '@/modules/users/users.module';
import { Module } from '@nestjs/common';
import { FormSubmissionService } from './application/services/form-submission.service';
import { FormValidationService } from './application/services/form-validation.service';
import { FormsService } from './application/services/forms.service';
import { IFormSubmissionRepository } from './domain/repositories/form-submission.repository.interface';
import { IFormRepository } from './domain/repositories/form.repository.interface';
import { FormSubmissionRepository } from './infrastructure/repositories/form-submission.repository';
import { FormRepository } from './infrastructure/repositories/form.repository';
import { FormSubmissionsController } from './presentation/controllers/form-submissions.controller';
import { FormsController } from './presentation/controllers/forms.controller';

@Module({
  imports: [UsersModule],
  controllers: [FormsController, FormSubmissionsController],
  providers: [
    FormsService,
    FormSubmissionService,
    FormValidationService,
    {
      provide: IFormRepository,
      useClass: FormRepository,
    },
    {
      provide: IFormSubmissionRepository,
      useClass: FormSubmissionRepository,
    },
  ],
  exports: [FormsService, FormSubmissionService],
})
export class FormsModule {}
