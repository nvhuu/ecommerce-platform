import { MESSAGES } from '@/shared/constants/messages.constant';
import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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

    const updateData: any = { ...dto };
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

  private toResponseDto(form: any): FormResponseDto {
    return {
      ...form,
      fields: JSON.parse(form.fields),
    };
  }
}
