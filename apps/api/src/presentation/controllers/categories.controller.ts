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
import {
  CreateCategoryDto,
  UpdateCategoryDto,
} from '../../application/dtos/category.dto';
import { PaginationQueryDto } from '../../application/dtos/pagination.dto';
import { CategoryResponseDto } from '../../application/dtos/response';
import { CategoriesService } from '../../application/modules/categories/categories.service';
import { Role } from '../../domain/entities/user.entity';
import { Roles } from '../../infrastructure/auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../../infrastructure/auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../infrastructure/auth/guards/roles.guard';
import { ResponseMessage } from '../../infrastructure/decorators/response-message.decorator';
import {
  HybridPaginatedDto,
  Serialize,
} from '../../infrastructure/decorators/serialize.decorator';

@Controller('categories')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @Roles(Role.SUPERADMIN)
  @Serialize(CategoryResponseDto)
  @ResponseMessage('Category created successfully')
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  @Get()
  @Serialize(HybridPaginatedDto(CategoryResponseDto))
  @ResponseMessage('Categories retrieved successfully')
  findAll(@Query() query: PaginationQueryDto) {
    return this.categoriesService.findAll(
      query.cursor,
      query.page,
      query.limit,
    );
  }

  @Get(':id')
  @Serialize(CategoryResponseDto)
  @ResponseMessage('Category retrieved successfully')
  findOne(@Param('id') id: string) {
    return this.categoriesService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.SUPERADMIN)
  @Serialize(CategoryResponseDto)
  @ResponseMessage('Category updated successfully')
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  @Roles(Role.SUPERADMIN)
  @ResponseMessage('Category deleted successfully')
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(id);
  }
}
