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
import { PaginationQueryDto } from '../../application/dtos/pagination.dto';
import {
  CreateProductDto,
  UpdateProductDto,
} from '../../application/dtos/product.dto';
import { ProductResponseDto } from '../../application/dtos/response';
import { ProductsService } from '../../application/modules/products/products.service';
import { Role } from '../../domain/entities/user.entity';
import { Roles } from '../../infrastructure/auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../../infrastructure/auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../infrastructure/auth/guards/roles.guard';
import { ResponseMessage } from '../../infrastructure/decorators/response-message.decorator';
import {
  HybridPaginatedDto,
  Serialize,
} from '../../infrastructure/decorators/serialize.decorator';

@Controller('products')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @Roles(Role.SUPERADMIN)
  @Serialize(ProductResponseDto)
  @ResponseMessage('Product created successfully')
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get()
  @Serialize(HybridPaginatedDto(ProductResponseDto))
  @ResponseMessage('Products retrieved successfully')
  findAll(@Query() query: PaginationQueryDto) {
    return this.productsService.findAll(query.cursor, query.page, query.limit);
  }

  @Get('category/:categoryId')
  @Serialize(HybridPaginatedDto(ProductResponseDto))
  @ResponseMessage('Products retrieved successfully')
  findByCategory(
    @Param('categoryId') categoryId: string,
    @Query() query: PaginationQueryDto,
  ) {
    return this.productsService.findByCategory(
      categoryId,
      query.cursor,
      query.page,
      query.limit,
    );
  }

  @Get(':id')
  @Serialize(ProductResponseDto)
  @ResponseMessage('Product retrieved successfully')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.SUPERADMIN)
  @Serialize(ProductResponseDto)
  @ResponseMessage('Product updated successfully')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  @Roles(Role.SUPERADMIN)
  @ResponseMessage('Product deleted successfully')
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }
}
