import { Expose } from 'class-transformer';

export class CronJob {
  @Expose()
  id!: string;

  @Expose()
  name!: string;

  @Expose()
  schedule!: string;

  @Expose()
  isEnabled!: boolean;

  @Expose()
  lastRunAt?: Date | null;

  @Expose()
  nextRunAt?: Date | null;

  @Expose()
  createdAt!: Date;

  @Expose()
  updatedAt!: Date;

  static toDomain(data: any): CronJob | null {
    if (!data) return null;

    const entity = new CronJob();
    entity.id = data.id;
    entity.name = data.name;
    entity.schedule = data.schedule;
    entity.isEnabled = data.isEnabled;
    entity.lastRunAt = data.lastRunAt;
    entity.nextRunAt = data.nextRunAt;
    entity.createdAt = data.createdAt;
    entity.updatedAt = data.updatedAt;

    return entity;
  }
}
