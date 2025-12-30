import { Inject, Injectable, Logger } from '@nestjs/common';
import { WebhookEvent } from '@prisma/client';
import { ISchedulerRepository } from '../../domain/repositories/scheduler.repository.interface';

@Injectable()
export class WebhookService {
  private readonly logger = new Logger(WebhookService.name);

  constructor(
    @Inject('ISchedulerRepository')
    private readonly schedulerRepository: ISchedulerRepository,
  ) {}

  async dispatchEvent(event: WebhookEvent, payload: any): Promise<void> {
    const webhooks = await this.schedulerRepository.findWebhooksByEvent(event);

    if (webhooks.length === 0) {
      return;
    }

    this.logger.log(
      `Dispatching event ${event} to ${webhooks.length} webhooks`,
    );

    const promises = webhooks.map(async (webhook) => {
      try {
        const response = await fetch(webhook.url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Webhook-Secret': webhook.secret,
            'X-Webhook-Event': event,
          },
          body: JSON.stringify({
            event,
            timestamp: new Date().toISOString(),
            data: payload,
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        // Update last triggered
        await this.schedulerRepository.updateWebhook(webhook.id, {
          lastTriggeredAt: new Date(),
        });
      } catch (error) {
        this.logger.error(
          `Failed to send webhook to ${webhook.url}: ${error instanceof Error ? error.message : error}`,
        );
        // Increment failure count
        await this.schedulerRepository.updateWebhook(webhook.id, {
          failureCount: webhook.failureCount + 1,
        });
      }
    });

    await Promise.allSettled(promises);
  }
}
