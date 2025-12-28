import { PrismaService } from '@/core/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { EmailTemplate } from '../../domain/entities/email-template.entity';
import { IEmailTemplateRepository } from '../../domain/repositories/email-template.repository.interface';

@Injectable()
export class EmailTemplateRepository implements IEmailTemplateRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Partial<EmailTemplate>): Promise<EmailTemplate> {
    const created = await this.prisma.emailTemplate.create({
      data: {
        slug: data.slug!,
        name: data.name!,
        subject: data.subject!,
        content: data.content!,
        variables: data.variables || [],
      },
    });

    const result = EmailTemplate.toDomain(created);
    if (!result) throw new Error('Failed to create email template');
    return result;
  }

  async update(
    id: string,
    data: Partial<EmailTemplate>,
  ): Promise<EmailTemplate> {
    const updated = await this.prisma.emailTemplate.update({
      where: { id },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.slug && { slug: data.slug }),
        ...(data.subject && { subject: data.subject }),
        ...(data.content && { content: data.content }),
        ...(data.variables && { variables: data.variables }),
      },
    });

    const result = EmailTemplate.toDomain(updated);
    if (!result) throw new Error('Failed to update email template');
    return result;
  }

  async delete(id: string): Promise<void> {
    await this.prisma.emailTemplate.delete({
      where: { id },
    });
  }

  async findById(id: string): Promise<EmailTemplate | null> {
    const result = await this.prisma.emailTemplate.findUnique({
      where: { id },
    });
    return EmailTemplate.toDomain(result);
  }

  async findBySlug(slug: string): Promise<EmailTemplate | null> {
    const result = await this.prisma.emailTemplate.findUnique({
      where: { slug },
    });
    return EmailTemplate.toDomain(result);
  }

  async findAll(): Promise<EmailTemplate[]> {
    const results = await this.prisma.emailTemplate.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return results
      .map((r) => EmailTemplate.toDomain(r))
      .filter((t): t is EmailTemplate => t !== null);
  }
}
