import { Inject, Injectable } from '@nestjs/common';
import { ICategoryRepository } from '../../../domain/repositories/category.repository.interface';
import { IOrderRepository } from '../../../domain/repositories/order.repository.interface';
import { IProductRepository } from '../../../domain/repositories/product.repository.interface';
import { IUserRepository } from '../../../domain/repositories/user.repository.interface';
import { DashboardStatsResponseDto } from '../../dtos/response/dashboard.response.dto';

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
    const { data: users } = await this.userRepository.findAll({
      page: 1,
      limit: 1000,
    });
    const { data: allOrders } = await this.orderRepository.findAll({
      page: 1,
      limit: 1000,
    });
    const { data: products } = await this.productRepository.findAll({
      page: 1,
      limit: 1000,
    });

    const pendingOrders = allOrders.filter(
      (order) => order.status === 'PENDING',
    );
    const completedOrders = allOrders.filter(
      (order) => order.status === 'COMPLETED',
    );

    const { data: categories } = await this.categoryRepository.findAll({
      page: 1,
      limit: 1000,
    });

    const totalRevenue = completedOrders.reduce(
      (sum, order: any) => sum + (order.totalAmount || 0),
      0,
    );

    const stats = {
      totalUsers: users.length,
      totalOrders: allOrders.length,
      totalProducts: products.length,
      totalCategories: categories.length,
      totalRevenue,
      pendingOrders: pendingOrders.length,
      completedOrders: completedOrders.length,
    };

    return stats;
  }
}
