import { Roles } from '@/modules/auth/infrastructure/decorators/roles.decorator';
import { JwtAuthGuard } from '@/modules/auth/infrastructure/guards/jwt-auth.guard';
import { RolesGuard } from '@/modules/auth/infrastructure/guards/roles.guard';
import {
  CreateEmailTemplateDto,
  UpdateEmailTemplateDto,
} from '@/modules/email/application/dtos/email-template.dto';
import { EmailTemplateService } from '@/modules/email/application/services/email-template.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';

@ApiTags('Email Templates')
@Controller('email-templates')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class EmailTemplateController {
  constructor(private readonly service: EmailTemplateService) {}

  @Post()
  @Roles(Role.SUPERADMIN)
  @ApiOperation({ summary: 'Create email template' })
  create(@Body() dto: CreateEmailTemplateDto) {
    return this.service.create(dto);
  }

  @Get()
  @Roles(Role.SUPERADMIN)
  @ApiOperation({ summary: 'List all email templates' })
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @Roles(Role.SUPERADMIN)
  @ApiOperation({ summary: 'Get email template by ID' })
  findById(@Param('id') id: string) {
    return this.service.findById(id);
  }

  @Put(':id')
  @Roles(Role.SUPERADMIN)
  @ApiOperation({ summary: 'Update email template' })
  update(@Param('id') id: string, @Body() dto: UpdateEmailTemplateDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @Roles(Role.SUPERADMIN)
  @ApiOperation({ summary: 'Delete email template' })
  delete(@Param('id') id: string) {
    return this.service.delete(id);
  }
}
