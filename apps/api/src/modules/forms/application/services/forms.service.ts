import { MESSAGES } from '@/shared/constants/messages.constant';
import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Form, Prisma } from '@prisma/client';
import { FieldDefinition } from '../../domain/entities/field-definition';
import { IFormRepository } from '../../domain/repositories/form.repository.interface';
import { CreateFormDto } from '../dtos/create-form.dto';
import { FormResponseDto } from '../dtos/form-response.dto';
import { UpdateFormDto } from '../dtos/update-form.dto';

@Injectable()
export class FormsService {
  constructor(
    @Inject(IFormRepository)
    private readonly formRepository: IFormRepository,
  ) {}

  async create(dto: CreateFormDto): Promise<FormResponseDto> {
    const existing = await this.formRepository.findBySlug(dto.slug);
    if (existing) {
      throw new ConflictException(MESSAGES.FORM.SLUG_EXISTS);
    }

    const form = await this.formRepository.create({
      ...dto,
      fields: JSON.stringify(dto.fields),
    });

    return this.toResponseDto(form);
  }

  async findAll(filters?: { status?: string }): Promise<FormResponseDto[]> {
    const forms = await this.formRepository.findAll(filters);
    return forms.map((f) => this.toResponseDto(f));
  }

  async findById(id: string): Promise<FormResponseDto> {
    const form = await this.formRepository.findById(id);
    if (!form) {
      throw new NotFoundException(MESSAGES.FORM.NOT_FOUND);
    }
    return this.toResponseDto(form);
  }

  async findBySlug(slug: string): Promise<FormResponseDto> {
    const form = await this.formRepository.findBySlug(slug);
    if (!form) {
      throw new NotFoundException(MESSAGES.FORM.NOT_FOUND);
    }
    return this.toResponseDto(form);
  }

  async update(id: string, dto: UpdateFormDto): Promise<FormResponseDto> {
    const existing = await this.formRepository.findById(id);
    if (!existing) {
      throw new NotFoundException(MESSAGES.FORM.NOT_FOUND);
    }

    const updateData: Prisma.FormUpdateInput = {};
    if (dto.name) {
      updateData.name = dto.name;
    }
    if (dto.slug) {
      updateData.slug = dto.slug;
    }
    if (dto.description !== undefined) {
      updateData.description = dto.description;
    }
    if (dto.status) {
      updateData.status = dto.status;
    }
    if (dto.notificationEmail !== undefined) {
      updateData.notificationEmail = dto.notificationEmail;
    }
    if (dto.successMessage !== undefined) {
      updateData.successMessage = dto.successMessage;
    }
    if (dto.redirectUrl !== undefined) {
      updateData.redirectUrl = dto.redirectUrl;
    }
    if (dto.fields) {
      updateData.fields = JSON.stringify(dto.fields);
    }

    const updated = await this.formRepository.update(id, updateData);
    return this.toResponseDto(updated);
  }

  async delete(id: string): Promise<void> {
    const existing = await this.formRepository.findById(id);
    if (!existing) {
      throw new NotFoundException(MESSAGES.FORM.NOT_FOUND);
    }

    await this.formRepository.delete(id);
  }

  private toResponseDto(form: Form): FormResponseDto {
    return {
      id: form.id,
      name: form.name,
      slug: form.slug,
      description: form.description ?? undefined,
      fields: JSON.parse(form.fields) as FieldDefinition[],
      status: form.status,
      notificationEmail: form.notificationEmail ?? undefined,
      successMessage: form.successMessage ?? undefined,
      redirectUrl: form.redirectUrl ?? undefined,
      createdAt: form.createdAt,
      updatedAt: form.updatedAt,
    };
  }
}
