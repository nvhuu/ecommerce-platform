import { Serialize } from '@/core/decorators/serialize.decorator';
import { Roles } from '@/modules/auth/infrastructure/decorators/roles.decorator';
import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import {
  CreateScheduledContentDto,
  CreateScheduledEmailDto,
  UpdateCronJobDto,
} from '../application/dtos/request/scheduler.dto';
import {
  CronJobDto,
  ScheduledContentDto,
  ScheduledEmailDto,
} from '../application/dtos/response/scheduler.response.dto';
import { SchedulerService } from '../application/services/scheduler.service';
import { ISchedulerRepository } from '../domain/repositories/scheduler.repository.interface';

@ApiTags('Scheduler')
@Controller('scheduler')
@Roles(Role.SUPERADMIN)
export class SchedulerController {
  constructor(
    @Inject('ISchedulerRepository')
    private readonly schedulerRepository: ISchedulerRepository,
    private readonly schedulerService: SchedulerService,
  ) {}

  // ==========================================
  // Cron Jobs
  // ==========================================

  @Get('cron-jobs')
  @Serialize(CronJobDto)
  async getCronJobs() {
    return this.schedulerRepository.findAllCronJobs();
  }

  @Patch('cron-jobs/:id')
  @Serialize(CronJobDto)
  async updateCronJob(@Param('id') id: string, @Body() dto: UpdateCronJobDto) {
    const job = await this.schedulerRepository.updateCronJob(id, dto);

    // Reload if schedule changed
    if (dto.schedule) {
      this.schedulerService.deleteCronJob(job.name);
      if (job.isEnabled) {
        this.schedulerService.addCronJob(job.name, job.schedule);
      }
    }

    return job;
  }

  // ==========================================
  // Queues (Read-only for monitoring)
  // ==========================================

  @Get('queue/content')
  @Serialize(ScheduledContentDto)
  async getContentQueue() {
    return this.schedulerRepository.findDueContent();
  }

  @Get('queue/emails')
  @Serialize(ScheduledEmailDto)
  async getEmailQueue() {
    return this.schedulerRepository.findDueEmails();
  }

  // ==========================================
  // Manual Scheduling (Testing)
  // ==========================================

  @Post('content')
  @Serialize(ScheduledContentDto)
  async scheduleContent(@Body() dto: CreateScheduledContentDto) {
    return this.schedulerRepository.createScheduledContent(dto);
  }

  @Post('email')
  @Serialize(ScheduledEmailDto)
  async scheduleEmail(@Body() dto: CreateScheduledEmailDto) {
    return this.schedulerRepository.createScheduledEmail(dto);
  }
}
