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
import { ProductQueryDto } from '../../application/dtos/product-query.dto';
import {
  CreateProductVariantDto,
  UpdateProductVariantDto,
} from '../../application/dtos/product-variant.dto';
import {
  CreateProductDto,
  UpdateProductDto,
} from '../../application/dtos/product.dto';
import { ProductVariantResponseDto } from '../../application/dtos/response/product-variant.response.dto';
import { ProductResponseDto } from '../../application/dtos/response/product.response.dto';
import { ProductVariantService } from '../../application/services/product-variant.service';
import { ProductsService } from '../../application/services/products.service';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly productVariantService: ProductVariantService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPERADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new product' })
  @Serialize(ProductResponseDto)
  create(@Body() dto: CreateProductDto) {
    return this.productsService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all products with pagination and filters' })
  findAll(@Query() query: ProductQueryDto) {
    return this.productsService.findAll(query);
  }

  @Get(':id/related')
  @ApiOperation({ summary: 'Get related products' })
  @Serialize(ProductResponseDto)
  getRelated(@Param('id') id: string) {
    return this.productsService.getRelatedProducts(id);
  }

  @Get('category/:categoryId')
  @ApiOperation({ summary: 'Get products by category' })
  findByCategory(
    @Param('categoryId') categoryId: string,
    @Query() query: PaginationQueryDto,
  ) {
    return this.productsService.findByCategory(
      categoryId,
      query.page,
      query.limit,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get product by ID' })
  @Serialize(ProductResponseDto)
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPERADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update product' })
  @Serialize(ProductResponseDto)
  update(@Param('id') id: string, @Body() dto: UpdateProductDto) {
    return this.productsService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPERADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete product' })
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }

  // ==================== PRODUCT VARIANTS ====================

  @Post(':id/variants')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPERADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a product variant' })
  @Serialize(ProductVariantResponseDto)
  async createVariant(
    @Param('id') productId: string,
    @Body() createDto: CreateProductVariantDto,
  ): Promise<ProductVariantResponseDto> {
    createDto.productId = productId;
    return this.productVariantService.create(createDto);
  }

  @Get(':id/variants')
  @ApiOperation({ summary: 'Get all variants for a product' })
  @Serialize(ProductVariantResponseDto)
  async getProductVariants(
    @Param('id') productId: string,
  ): Promise<ProductVariantResponseDto[]> {
    return this.productVariantService.findAllByProduct(productId);
  }

  @Patch('variants/:variantId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPERADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a product variant' })
  @Serialize(ProductVariantResponseDto)
  async updateVariant(
    @Param('variantId') variantId: string,
    @Body() updateDto: UpdateProductVariantDto,
  ): Promise<ProductVariantResponseDto> {
    return this.productVariantService.update(variantId, updateDto);
  }

  @Delete('variants/:variantId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPERADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a product variant' })
  async deleteVariant(@Param('variantId') variantId: string): Promise<void> {
    await this.productVariantService.remove(variantId);
  }
}
