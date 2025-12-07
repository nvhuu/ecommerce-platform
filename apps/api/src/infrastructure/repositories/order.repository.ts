import { Injectable } from '@nestjs/common';
import { Order, OrderStatus } from '../../domain/entities/order.entity';
import { IOrderRepository } from '../../domain/repositories/order.repository.interface';
import { Prisma } from '../../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class OrderRepository implements IOrderRepository {
  constructor(private prisma: PrismaService) {}

  async create(order: Partial<Order>): Promise<Order> {
    const created = await this.prisma.order.create({
      data: {
        userId: order.userId!,
        totalAmount: order.totalAmount as unknown as Prisma.Decimal, // Cast to any/Decimal. Using unknown avoids type mismatch if number passed
        status: order.status as any, // Enum mapping
        items: {
          create: order.items?.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price as unknown as Prisma.Decimal,
          })),
        },
      },
      include: { items: true },
    });
    return this.mapToEntity(created);
  }

  async findAll(): Promise<Order[]> {
    const orders = await this.prisma.order.findMany({
      include: { items: true },
    });
    return orders.map((o: any) => this.mapToEntity(o));
  }

  async findById(id: string): Promise<Order | null> {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: { items: true },
    });
    if (!order) return null;
    return this.mapToEntity(order);
  }

  async findByUser(userId: string): Promise<Order[]> {
    const orders = await this.prisma.order.findMany({
      where: { userId },
      include: { items: true },
    });
    return orders.map((o: any) => this.mapToEntity(o));
  }

  async updateStatus(id: string, status: string): Promise<Order> {
    const updated = await this.prisma.order.update({
      where: { id },
      data: { status: status as any },
      include: { items: true },
    });
    return this.mapToEntity(updated);
  }

  private mapToEntity(prismaOrder: any): Order {
    const o = new Order();
    o.id = prismaOrder.id;
    o.userId = prismaOrder.userId;
    o.totalAmount = prismaOrder.totalAmount.toNumber();
    o.status = prismaOrder.status as OrderStatus;
    o.createdAt = prismaOrder.createdAt;
    o.updatedAt = prismaOrder.updatedAt;
    if (prismaOrder.items) {
      o.items = prismaOrder.items.map((i: any) => ({
        id: i.id,
        orderId: i.orderId,
        productId: i.productId,
        quantity: i.quantity,
        price: i.price.toNumber(),
      }));
    }
    return o;
  }
}
