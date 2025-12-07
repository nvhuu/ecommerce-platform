import { Inject, Injectable } from '@nestjs/common';
import { IProductRepository } from '../../../domain/repositories/product.repository.interface';
import { CreateProductDto, UpdateProductDto } from '../../dtos/product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @Inject('IProductRepository')
    private productRepository: IProductRepository,
  ) {}

  create(createProductDto: CreateProductDto) {
    return this.productRepository.create(createProductDto);
  }

  findAll() {
    return this.productRepository.findAll();
  }

  findOne(id: string) {
    return this.productRepository.findById(id);
  }

  findByCategory(categoryId: string) {
    return this.productRepository.findByCategory(categoryId);
  }

  update(id: string, updateProductDto: UpdateProductDto) {
    return this.productRepository.update(id, updateProductDto);
  }

  remove(id: string) {
    return this.productRepository.delete(id);
  }
}
