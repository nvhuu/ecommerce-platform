import { Serialize } from '@/core/decorators/serialize.decorator';
import { Roles } from '@/modules/auth/infrastructure/decorators/roles.decorator';
import { JwtAuthGuard } from '@/modules/auth/infrastructure/guards/jwt-auth.guard';
import { RolesGuard } from '@/modules/auth/infrastructure/guards/roles.guard';
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
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import {
  CreateBlogCategoryDto,
  UpdateBlogCategoryDto,
} from '../../application/dtos/blog-category.dto';
import { BlogCategoryResponseDto } from '../../application/dtos/response/blog-category.response.dto';
import { BlogCategoryService } from '../../application/services/blog-category.service';

@ApiTags('blog-categories')
@Controller('blog/categories')
export class BlogCategoryController {
  constructor(private readonly categoryService: BlogCategoryService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPERADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create blog category (Admin)' })
  @Serialize(BlogCategoryResponseDto)
  create(@Body() dto: CreateBlogCategoryDto) {
    return this.categoryService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all blog categories' })
  @Serialize(BlogCategoryResponseDto) // Simplified for list view
  findAll(@Query() query: PaginationQueryDto) {
    // We'll need to handle paginated response serialization properly
    // For now returning the service result which contains data array
    // The @Serialize decorator usually expects a DTO class, or we wrap it
    // Let's rely on standard serialization for pagination wrapper
    return this.categoryService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get blog category by ID' })
  @Serialize(BlogCategoryResponseDto)
  findOne(@Param('id') id: string) {
    return this.categoryService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPERADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update blog category (Admin)' })
  @Serialize(BlogCategoryResponseDto)
  update(@Param('id') id: string, @Body() dto: UpdateBlogCategoryDto) {
    return this.categoryService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPERADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete blog category (Admin)' })
  remove(@Param('id') id: string) {
    return this.categoryService.remove(id);
  }
}
