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
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { SubmissionResponseDto } from '../../application/dtos/submission-response.dto';
import { FormSubmissionService } from '../../application/services/form-submission.service';

@ApiTags('Form Submissions')
@Controller('submissions')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.SUPERADMIN)
@ApiBearerAuth()
export class FormSubmissionsController {
  constructor(private readonly submissionService: FormSubmissionService) {}

  @Get('form/:formId')
  @ApiOperation({ summary: MESSAGES.SUBMISSION.LIST_RETRIEVED })
  @Serialize(SubmissionResponseDto)
  findByForm(@Param('formId') formId: string) {
    return this.submissionService.findByForm(formId);
  }

  @Get(':id')
  @ApiOperation({ summary: MESSAGES.SUBMISSION.RETRIEVED })
  @Serialize(SubmissionResponseDto)
  findOne(@Param('id') id: string) {
    return this.submissionService.findById(id);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: MESSAGES.SUBMISSION.UPDATED })
  @Serialize(SubmissionResponseDto)
  updateStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.submissionService.updateStatus(id, status);
  }

  @Delete(':id')
  @ApiOperation({ summary: MESSAGES.SUBMISSION.DELETED })
  remove(@Param('id') id: string) {
    return this.submissionService.delete(id);
  }
}
