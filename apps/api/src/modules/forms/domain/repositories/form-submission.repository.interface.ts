import { FormSubmission, Prisma } from '@prisma/client';

export interface SubmissionFilters {
  formId?: string;
  status?: string;
  skip?: number;
  take?: number;
}

export abstract class IFormSubmissionRepository {
  abstract create(
    data: Prisma.FormSubmissionCreateInput,
  ): Promise<FormSubmission>;
  abstract findById(id: string): Promise<FormSubmission | null>;
  abstract findByForm(filters: SubmissionFilters): Promise<FormSubmission[]>;
  abstract updateStatus(id: string, status: string): Promise<FormSubmission>;
  abstract delete(id: string): Promise<FormSubmission>;
}
