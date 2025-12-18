import { Serialize } from '@/core/decorators/serialize.decorator';
import { Roles } from '@/modules/auth/infrastructure/decorators/roles.decorator';
import { JwtAuthGuard } from '@/modules/auth/infrastructure/guards/jwt-auth.guard';
import { RolesGuard } from '@/modules/auth/infrastructure/guards/roles.guard';
import { RequestWithUser } from '@/modules/auth/types/request.types';
import { PaginationQueryDto } from '@/shared/dtos/query/pagination-query.dto';
import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import {
  CreateReturnDto,
  ReturnResponseDto,
  UpdateReturnStatusDto,
} from '../../application/dtos/return.dto';
import { ReturnService } from '../../application/services/return.service';

@ApiTags('returns')
@Controller('returns')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ReturnController {
  constructor(private readonly returnService: ReturnService) {}

  @Post()
  @ApiOperation({ summary: 'Create a return request' })
  @Serialize(ReturnResponseDto)
  create(@Req() req: RequestWithUser, @Body() dto: CreateReturnDto) {
    return this.returnService.createReturn(req.user.id, dto);
  }

  @Get('my-returns')
  @ApiOperation({ summary: 'Get my returns' })
  findMyReturns(
    @Req() req: RequestWithUser,
    @Query() query: PaginationQueryDto,
  ) {
    return this.returnService.getMyReturns(
      req.user.id,
      query.page,
      query.limit,
    );
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles(Role.SUPERADMIN)
  @ApiOperation({ summary: 'List all returns (Admin only)' })
  findAll(@Query() query: PaginationQueryDto) {
    return this.returnService.getAllReturns(query.page, query.limit);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get return details' })
  @Serialize(ReturnResponseDto)
  findOne(@Param('id') id: string) {
    return this.returnService.getReturn(id);
  }

  @Patch(':id/status')
  @UseGuards(RolesGuard)
  @Roles(Role.SUPERADMIN)
  @ApiOperation({ summary: 'Update return status (Admin only)' })
  @Serialize(ReturnResponseDto)
  updateStatus(
    @Req() req: RequestWithUser,
    @Param('id') id: string,
    @Body() dto: UpdateReturnStatusDto,
  ) {
    return this.returnService.updateStatus(id, dto, req.user.id);
  }
}
