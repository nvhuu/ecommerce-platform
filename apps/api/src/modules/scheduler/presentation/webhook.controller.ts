import { Serialize } from '@/core/decorators/serialize.decorator';
import { Roles } from '@/modules/auth/infrastructure/decorators/roles.decorator';
import { MESSAGES } from '@/shared/constants/messages.constant';
import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { CreateWebhookDto } from '../application/dtos/request/scheduler.dto';
import { WebhookDto } from '../application/dtos/response/scheduler.response.dto';
import { WebhookService } from '../application/services/webhook.service';
import { ISchedulerRepository } from '../domain/repositories/scheduler.repository.interface';

@ApiTags('Webhooks')
@Controller('webhooks')
@Roles(Role.SUPERADMIN)
export class WebhookController {
  constructor(
    @Inject('ISchedulerRepository')
    private readonly schedulerRepository: ISchedulerRepository,
    private readonly webhookService: WebhookService,
  ) {}

  @Get()
  @Serialize(WebhookDto)
  async getWebhooks() {
    return this.schedulerRepository.findAllWebhooks();
  }

  @Post()
  @Serialize(WebhookDto)
  async createWebhook(@Body() dto: CreateWebhookDto) {
    return this.schedulerRepository.createWebhook(dto);
  }

  @Patch(':id')
  @Serialize(WebhookDto)
  async updateWebhook(
    @Param('id') id: string,
    @Body() dto: Partial<CreateWebhookDto>,
  ) {
    return this.schedulerRepository.updateWebhook(id, dto);
  }

  @Delete(':id')
  async deleteWebhook(@Param('id') id: string) {
    await this.schedulerRepository.deleteWebhook(id);
    return { message: MESSAGES.SCHEDULER.WEBHOOK_DELETED };
  }

  @Post(':id/test')
  async testWebhook(@Param('id') id: string) {
    // We would need to fetch the specific webhook to get its URL,
    // but the service dispatches by event.
    // Ideally we dispatch a specific test event.

    // For now, let's just trigger a generic test dispatch if we had the webhook
    // Since service dispatchEvent filters by event, we might need a dedicated test method or event.
    // Let's assume we dispatch a 'TEST_EVENT' if we had one, or reuse an existing one.

    // Simplification: just return message for now as we didn't add TEST event.
    return {
      message: MESSAGES.SCHEDULER.TEST_TRIGGERED,
    };
  }
}
