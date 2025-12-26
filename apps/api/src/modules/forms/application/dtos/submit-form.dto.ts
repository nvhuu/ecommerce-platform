import { ApiProperty } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { IsObject } from 'class-validator';

export class SubmitFormDto {
  @ApiProperty({ example: { name: 'John', email: 'john@example.com' } })
  @IsObject()
  data!: Prisma.JsonObject;
}
