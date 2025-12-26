import { PrismaService } from '@/core/prisma/prisma.service';
import { SortOrder } from '@/shared/constants/sort.constant';
import { Injectable } from '@nestjs/common';
import { FormSubmission, Prisma } from '@prisma/client';
import {
  IFormSubmissionRepository,
  SubmissionFilters,
} from '../../domain/repositories/form-submission.repository.interface';

@Injectable()
export class FormSubmissionRepository implements IFormSubmissionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    data: Prisma.FormSubmissionCreateInput,
  ): Promise<FormSubmission> {
    return this.prisma.formSubmission.create({ data });
  }

  async findById(id: string): Promise<FormSubmission | null> {
    return this.prisma.formSubmission.findUnique({ where: { id } });
  }

  async findByForm(filters: SubmissionFilters): Promise<FormSubmission[]> {
    return this.prisma.formSubmission.findMany({
      where: {
        formId: filters.formId,
        status: filters.status as any,
      },
      orderBy: { createdAt: SortOrder.DESC },
      skip: filters.skip,
      take: filters.take,
    });
  }

  async updateStatus(id: string, status: string): Promise<FormSubmission> {
    return this.prisma.formSubmission.update({
      where: { id },
      data: { status: status as any },
    });
  }

  async delete(id: string): Promise<FormSubmission> {
    return this.prisma.formSubmission.delete({ where: { id } });
  }
}
