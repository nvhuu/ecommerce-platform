import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import {
  CreateProductDto,
  UpdateProductDto,
} from '../../application/dtos/product.dto';
import { ProductsService } from '../../application/modules/products/products.service';
import { ResponseMessage } from '../../infrastructure/decorators/response-message.decorator';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @ResponseMessage('Product created successfully')
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @Get('category/:categoryId')
  findByCategory(@Param('categoryId') categoryId: string) {
    return this.productsService.findByCategory(categoryId);
  }

  @Patch(':id')
  @ResponseMessage('Product updated successfully')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  @ResponseMessage('Product deleted successfully')
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }
}
