import { Serialize } from '@/core/decorators/serialize.decorator';
import { Roles } from '@/modules/auth/infrastructure/decorators/roles.decorator';
import { JwtAuthGuard } from '@/modules/auth/infrastructure/guards/jwt-auth.guard';
import { RolesGuard } from '@/modules/auth/infrastructure/guards/roles.guard';
import { RequestWithUser } from '@/modules/auth/types/request.types';
import { Role } from '@/modules/users/domain/entities/user.entity';
import { MESSAGES } from '@/shared/constants/messages.constant';
import { PaginationQueryDto } from '@/shared/dtos/query/pagination-query.dto';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreatePageDto } from '../../application/dtos/create-page.dto';
import { PageResponseDto } from '../../application/dtos/page-response.dto';
import { UpdatePageDto } from '../../application/dtos/update-page.dto';
import { PagesService } from '../../application/services/pages.service';

@ApiTags('Pages')
@Controller('pages')
export class PagesController {
  constructor(private readonly pagesService: PagesService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPERADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: MESSAGES.PAGE.CREATED })
  @Serialize(PageResponseDto)
  create(@Body() createPageDto: CreatePageDto, @Req() req: RequestWithUser) {
    return this.pagesService.create(createPageDto, req.user.id);
  }

  @Get()
  @ApiOperation({ summary: MESSAGES.PAGE.LIST_RETRIEVED })
  @Serialize(PageResponseDto)
  findAll(@Query() query: PaginationQueryDto) {
    return this.pagesService.findAll(query);
  }

  @Get('published')
  @ApiOperation({ summary: MESSAGES.PAGE.LIST_RETRIEVED })
  @Serialize(PageResponseDto)
  findPublished(@Query() query: PaginationQueryDto) {
    return this.pagesService.findPublished(query);
  }

  @Get(':id')
  @ApiOperation({ summary: MESSAGES.PAGE.RETRIEVED })
  @Serialize(PageResponseDto)
  findOne(@Param('id') id: string) {
    return this.pagesService.findOne(id);
  }

  @Get('slug/:slug')
  @ApiOperation({ summary: MESSAGES.PAGE.RETRIEVED })
  @Serialize(PageResponseDto)
  findBySlug(@Param('slug') slug: string) {
    return this.pagesService.findBySlug(slug);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPERADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: MESSAGES.PAGE.UPDATED })
  @Serialize(PageResponseDto)
  update(
    @Param('id') id: string,
    @Body() updatePageDto: UpdatePageDto,
    @Req() req: RequestWithUser,
  ) {
    return this.pagesService.update(id, updatePageDto, req.user.id);
  }

  @Post(':id/publish')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPERADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: MESSAGES.PAGE.PUBLISHED })
  @Serialize(PageResponseDto)
  publish(@Param('id') id: string) {
    return this.pagesService.publish(id);
  }

  @Post(':id/unpublish')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPERADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: MESSAGES.PAGE.UNPUBLISHED })
  @Serialize(PageResponseDto)
  unpublish(@Param('id') id: string) {
    return this.pagesService.unpublish(id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPERADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: MESSAGES.PAGE.DELETED })
  remove(@Param('id') id: string) {
    return this.pagesService.remove(id);
  }
}
