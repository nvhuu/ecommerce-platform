import { MESSAGES } from '@/shared/constants/messages.constant';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { EmailTemplate } from '../../domain/entities/email-template.entity';
import {
  EMAIL_TEMPLATE_REPOSITORY_TOKEN,
  IEmailTemplateRepository,
} from '../../domain/repositories/email-template.repository.interface';
import {
  CreateEmailTemplateDto,
  UpdateEmailTemplateDto,
} from '../dtos/email-template.dto';

@Injectable()
export class EmailTemplateService {
  constructor(
    @Inject(EMAIL_TEMPLATE_REPOSITORY_TOKEN)
    private readonly repository: IEmailTemplateRepository,
  ) {}

  async create(dto: CreateEmailTemplateDto): Promise<EmailTemplate> {
    return this.repository.create(dto);
  }

  async update(
    id: string,
    dto: UpdateEmailTemplateDto,
  ): Promise<EmailTemplate> {
    await this.findById(id);
    return this.repository.update(id, dto);
  }

  async delete(id: string): Promise<void> {
    await this.findById(id);
    return this.repository.delete(id);
  }

  async findById(id: string): Promise<EmailTemplate> {
    const template = await this.repository.findById(id);
    if (!template) {
      throw new NotFoundException(MESSAGES.EMAIL_TEMPLATE.NOT_FOUND);
    }
    return template;
  }

  async findBySlug(slug: string): Promise<EmailTemplate> {
    const template = await this.repository.findBySlug(slug);
    if (!template) {
      throw new NotFoundException(MESSAGES.EMAIL_TEMPLATE.NOT_FOUND);
    }
    return template;
  }

  async findAll(): Promise<EmailTemplate[]> {
    return this.repository.findAll();
  }
}
