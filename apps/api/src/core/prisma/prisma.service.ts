import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    super({
      errorFormat: 'minimal',
      log: [
        { emit: 'event', level: 'query' },
        { emit: 'stdout', level: 'error' },
        { emit: 'stdout', level: 'warn' },
      ],
    });

    // Log slow queries (> 1 second)
    this.$on('query' as never, (e: { duration: number; query: string }) => {
      if (e.duration > 1000) {
        console.warn(
          `[Slow Query] ${e.duration}ms: ${e.query.substring(0, 100)}...`,
        );
      }
    });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
