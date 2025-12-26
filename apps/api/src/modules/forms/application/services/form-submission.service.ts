import { MESSAGES } from '@/shared/constants/messages.constant';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IFormSubmissionRepository } from '../../domain/repositories/form-submission.repository.interface';
import { IFormRepository } from '../../domain/repositories/form.repository.interface';
import { SubmissionResponseDto } from '../dtos/submission-response.dto';
import { FormValidationService } from './form-validation.service';

interface SubmissionMetadata {
  ip?: string;
  userAgent?: string;
}

@Injectable()
export class FormSubmissionService {
  constructor(
    @Inject(IFormSubmissionRepository)
    private readonly submissionRepository: IFormSubmissionRepository,
    @Inject(IFormRepository)
    private readonly formRepository: IFormRepository,
    private readonly validationService: FormValidationService,
  ) {}

  async submit(
    formSlug: string,
    data: Record<string, any>,
    metadata: SubmissionMetadata,
  ): Promise<SubmissionResponseDto> {
    const form = await this.formRepository.findBySlug(formSlug);
    if (!form) {
      throw new NotFoundException(MESSAGES.FORM.NOT_FOUND);
    }

    const fields = JSON.parse(form.fields);
    await this.validationService.validateSubmission(fields, data);

    const sanitized = this.validationService.sanitizeData(data);

    const submission = await this.submissionRepository.create({
      form: { connect: { id: form.id } },
      data: JSON.stringify(sanitized),
      ip: metadata.ip,
      userAgent: metadata.userAgent,
    });

    // TODO: Send email notification if configured
    // if (form.notificationEmail) {
    //   await this.emailService.send(...)
    // }

    return this.toResponseDto(submission);
  }

  async findByForm(formId: string): Promise<SubmissionResponseDto[]> {
    const submissions = await this.submissionRepository.findByForm({ formId });
    return submissions.map((s) => this.toResponseDto(s));
  }

  async findById(id: string): Promise<SubmissionResponseDto> {
    const submission = await this.submissionRepository.findById(id);
    if (!submission) {
      throw new NotFoundException(MESSAGES.SUBMISSION.NOT_FOUND);
    }
    return this.toResponseDto(submission);
  }

  async updateStatus(
    id: string,
    status: string,
  ): Promise<SubmissionResponseDto> {
    const existing = await this.submissionRepository.findById(id);
    if (!existing) {
      throw new NotFoundException(MESSAGES.SUBMISSION.NOT_FOUND);
    }

    const updated = await this.submissionRepository.updateStatus(id, status);
    return this.toResponseDto(updated);
  }

  async delete(id: string): Promise<void> {
    const existing = await this.submissionRepository.findById(id);
    if (!existing) {
      throw new NotFoundException(MESSAGES.SUBMISSION.NOT_FOUND);
    }

    await this.submissionRepository.delete(id);
  }

  private toResponseDto(submission: any): SubmissionResponseDto {
    return {
      ...submission,
      data: JSON.parse(submission.data),
    };
  }
}
