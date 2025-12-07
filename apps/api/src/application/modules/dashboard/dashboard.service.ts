import { Inject, Injectable } from '@nestjs/common';
import { OrderStatus } from '../../../domain/entities/order.entity';
import { ICategoryRepository } from '../../../domain/repositories/category.repository.interface';
import { IOrderRepository } from '../../../domain/repositories/order.repository.interface';
import { IProductRepository } from '../../../domain/repositories/product.repository.interface';
import { IUserRepository } from '../../../domain/repositories/user.repository.interface';
import { DashboardStatsResponseDto } from '../../dtos/response/dashboard.response.dto';
import { toDto } from '../../utils/mapper.util';

@Injectable()
export class DashboardService {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
    @Inject('IProductRepository')
    private readonly productRepository: IProductRepository,
    @Inject('ICategoryRepository')
    private readonly categoryRepository: ICategoryRepository,
    @Inject('IOrderRepository')
    private readonly orderRepository: IOrderRepository,
  ) {}

  async getStats(): Promise<DashboardStatsResponseDto> {
    const [users, products, categories, allOrders] = await Promise.all([
      this.userRepository.findAll(),
      this.productRepository.findAll(),
      this.categoryRepository.findAll(),
      this.orderRepository.findAll(),
    ]);

    const pendingOrders = allOrders.filter(
      (o: any) => o.status === OrderStatus.PENDING,
    );
    const completedOrders = allOrders.filter(
      (o: any) => o.status === OrderStatus.COMPLETED,
    );
    const totalRevenue = completedOrders.reduce(
      (sum: number, order: any) => sum + order.totalAmount,
      0,
    );

    const stats = {
      totalUsers: users.length,
      totalProducts: products.length,
      totalCategories: categories.length,
      totalOrders: allOrders.length,
      totalRevenue,
      pendingOrders: pendingOrders.length,
      completedOrders: completedOrders.length,
    };

    return toDto(DashboardStatsResponseDto, stats) as DashboardStatsResponseDto;
  }
}
