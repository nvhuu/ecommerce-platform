import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { ActivityLogService } from './application/services/activity-log.service';
import { IPBlacklistService } from './application/services/ip-blacklist.service';
import { LoginHistoryService } from './application/services/login-history.service';
import { SecurityEventService } from './application/services/security-event.service';
import { IActivityLogRepository } from './domain/repositories/activity-log.repository.interface';
import { IIPBlacklistRepository } from './domain/repositories/ip-blacklist.repository.interface';
import { ILoginHistoryRepository } from './domain/repositories/login-history.repository.interface';
import { ISecurityEventRepository } from './domain/repositories/security-event.repository.interface';
import { ActivityLogRepository } from './infrastructure/repositories/activity-log.repository';
import { IPBlacklistRepository } from './infrastructure/repositories/ip-blacklist.repository';
import { LoginHistoryRepository } from './infrastructure/repositories/login-history.repository';
import { SecurityEventRepository } from './infrastructure/repositories/security-event.repository';
import { ActivityLogsController } from './presentation/controllers/activity-logs.controller';
import { IPBlacklistController } from './presentation/controllers/ip-blacklist.controller';
import { LoginHistoryController } from './presentation/controllers/login-history.controller';
import { SecurityEventsController } from './presentation/controllers/security-events.controller';

@Module({
  imports: [UsersModule],
  controllers: [
    SecurityEventsController,
    LoginHistoryController,
    ActivityLogsController,
    IPBlacklistController,
  ],
  providers: [
    // Services
    LoginHistoryService,
    SecurityEventService,
    ActivityLogService,
    IPBlacklistService,

    // Repositories
    {
      provide: ILoginHistoryRepository,
      useClass: LoginHistoryRepository,
    },
    {
      provide: ISecurityEventRepository,
      useClass: SecurityEventRepository,
    },
    {
      provide: IActivityLogRepository,
      useClass: ActivityLogRepository,
    },
    {
      provide: IIPBlacklistRepository,
      useClass: IPBlacklistRepository,
    },
  ],
  exports: [
    LoginHistoryService,
    SecurityEventService,
    ActivityLogService,
    IPBlacklistService,
  ],
})
export class SecurityModule {}
