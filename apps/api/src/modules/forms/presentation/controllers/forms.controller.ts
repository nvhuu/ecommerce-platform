import { Serialize } from '@/core/decorators/serialize.decorator';
import { Roles } from '@/modules/auth/infrastructure/decorators/roles.decorator';
import { JwtAuthGuard } from '@/modules/auth/infrastructure/guards/jwt-auth.guard';
import { RolesGuard } from '@/modules/auth/infrastructure/guards/roles.guard';
import { Role } from '@/modules/users/domain/entities/user.entity';
import { MESSAGES } from '@/shared/constants/messages.constant';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateFormDto } from '../../application/dtos/create-form.dto';
import { FormResponseDto } from '../../application/dtos/form-response.dto';
import { SubmitFormDto } from '../../application/dtos/submit-form.dto';
import { UpdateFormDto } from '../../application/dtos/update-form.dto';
import { FormSubmissionService } from '../../application/services/form-submission.service';
import { FormsService } from '../../application/services/forms.service';

@ApiTags('Forms')
@Controller('forms')
export class FormsController {
  constructor(
    private readonly formsService: FormsService,
    private readonly submissionService: FormSubmissionService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPERADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: MESSAGES.FORM.CREATED })
  @Serialize(FormResponseDto)
  create(@Body() dto: CreateFormDto) {
    return this.formsService.create(dto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPERADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: MESSAGES.FORM.LIST_RETRIEVED })
  @Serialize(FormResponseDto)
  findAll() {
    return this.formsService.findAll();
  }

  @Get('slug/:slug')
  @ApiOperation({ summary: MESSAGES.FORM.RETRIEVED })
  @Serialize(FormResponseDto)
  findBySlug(@Param('slug') slug: string) {
    return this.formsService.findBySlug(slug);
  }

  @Post(':slug/submit')
  @ApiOperation({ summary: MESSAGES.FORM.SUBMITTED })
  async submit(
    @Param('slug') slug: string,
    @Body() dto: SubmitFormDto,
    @Req() req: any,
  ) {
    return this.submissionService.submit(slug, dto.data, {
      ip: req.ip,
      userAgent: req.headers['user-agent'],
    });
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPERADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: MESSAGES.FORM.RETRIEVED })
  @Serialize(FormResponseDto)
  findOne(@Param('id') id: string) {
    return this.formsService.findById(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPERADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: MESSAGES.FORM.UPDATED })
  @Serialize(FormResponseDto)
  update(@Param('id') id: string, @Body() dto: UpdateFormDto) {
    return this.formsService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPERADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: MESSAGES.FORM.DELETED })
  remove(@Param('id') id: string) {
    return this.formsService.delete(id);
  }
}
