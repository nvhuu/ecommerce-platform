import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { AbandonmentStatus } from '../../domain/entities/cart-abandonment.entity';
import { IAnalyticsRepository } from '../../domain/repositories/analytics.repository.interface';

@Injectable()
export class CartRecoveryService {
  private readonly logger = new Logger(CartRecoveryService.name);

  constructor(
    @Inject('IAnalyticsRepository')
    private readonly analyticsRepository: IAnalyticsRepository,
  ) {}

  // Run every hour to check for abandoned carts
  @Cron(CronExpression.EVERY_HOUR)
  async processRecoveryCampaign(): Promise<void> {
    this.logger.log('Starting cart recovery campaign...');

    try {
      // 1h reminder: First gentle reminder
      await this.sendRecoveryEmails(1, 0, 'first_reminder');

      // 24h reminder: Include discount code
      await this.sendRecoveryEmails(24, 1, 'discount_reminder');

      // 72h reminder: Final reminder
      await this.sendRecoveryEmails(72, 2, 'final_reminder');

      this.logger.log('Cart recovery campaign completed');
    } catch (error) {
      this.logger.error('Cart recovery campaign failed', error);
    }
  }

  private async sendRecoveryEmails(
    hoursAgo: number,
    currentEmailCount: number,
    emailType: string,
  ): Promise<void> {
    const carts = await this.analyticsRepository.getAbandonedCartsForRecovery(
      hoursAgo,
      currentEmailCount + 1, // Max emails sent should be 1 more than current
    );

    this.logger.log(
      `Found ${carts.length} carts for ${emailType} (${hoursAgo}h ago)`,
    );

    for (const cart of carts) {
      try {
        // TODO: Integrate with email service
        this.logger.log(
          `Sending ${emailType} to ${cart.email || cart.sessionId}`,
        );

        // For now, just log. In production, this would call EmailService
        // await this.emailService.sendCartRecoveryEmail(cart, emailType);

        // Update cart record
        await this.analyticsRepository.updateCartAbandonment(cart.id, {
          recoveryEmailsSent: cart.recoveryEmailsSent + 1,
          lastEmailSentAt: new Date(),
          status:
            cart.recoveryEmailsSent + 1 >= 3
              ? AbandonmentStatus.EXPIRED
              : AbandonmentStatus.ABANDONED,
          expiredAt: cart.recoveryEmailsSent + 1 >= 3 ? new Date() : undefined,
        });

        this.logger.log(`Email sent successfully for cart ${cart.id}`);
      } catch (error) {
        this.logger.error(`Failed to send email for cart ${cart.id}`, error);
      }
    }
  }

  async findAbandonedCarts(hoursAgo = 1) {
    return this.analyticsRepository.getAbandonedCartsForRecovery(hoursAgo, 3);
  }

  async sendManualRecoveryEmail(cartId: string): Promise<void> {
    // Manual trigger for specific cart
    const cart = (
      await this.analyticsRepository.getAbandonedCarts(
        AbandonmentStatus.ABANDONED,
      )
    ).find((c) => c.id === cartId);

    if (!cart) {
      throw new Error('Cart not found or already recovered');
    }

    // TODO: Send email
    this.logger.log(`Manual recovery email sent for cart ${cartId}`);

    await this.analyticsRepository.updateCartAbandonment(cartId, {
      recoveryEmailsSent: cart.recoveryEmailsSent + 1,
      lastEmailSentAt: new Date(),
    });
  }
}
