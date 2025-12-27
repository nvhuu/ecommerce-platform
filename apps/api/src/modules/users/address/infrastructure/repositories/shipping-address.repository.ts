import { PrismaService } from '@/core/prisma/prisma.service';
import { SortOrder } from '@/shared/constants/sort.constant';
import { Injectable } from '@nestjs/common';
import { ShippingAddress } from '../../domain/entities/shipping-address.entity';
import { IShippingAddressRepository } from '../../domain/repositories/shipping-address.repository.interface';

@Injectable()
export class ShippingAddressRepository implements IShippingAddressRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Partial<ShippingAddress>): Promise<ShippingAddress> {
    const created = await this.prisma.shippingAddress.create({
      data: {
        userId: data.userId!,
        fullName: data.fullName!,
        phoneNumber: data.phoneNumber!,
        addressLine1: data.addressLine1!,
        addressLine2: data.addressLine2,
        city: data.city!,
        state: data.state,
        postalCode: data.postalCode,
        country: data.country!,
        isDefault: data.isDefault ?? false,
      },
    });
    const result = ShippingAddress.toDomain(created);
    if (!result) throw new Error('Failed to create address');
    return result;
  }

  async findAllByUserId(userId: string): Promise<ShippingAddress[]> {
    const addresses = await this.prisma.shippingAddress.findMany({
      where: { userId },
      orderBy: { isDefault: SortOrder.DESC }, // Defaults first
    });
    return addresses
      .map((a) => ShippingAddress.toDomain(a))
      .filter((a): a is ShippingAddress => a !== null);
  }

  async findById(id: string): Promise<ShippingAddress | null> {
    const address = await this.prisma.shippingAddress.findUnique({
      where: { id },
    });
    return address ? ShippingAddress.toDomain(address) : null;
  }

  async update(
    id: string,
    data: Partial<ShippingAddress>,
  ): Promise<ShippingAddress> {
    const updated = await this.prisma.shippingAddress.update({
      where: { id },
      data: {
        fullName: data.fullName,
        phoneNumber: data.phoneNumber,
        addressLine1: data.addressLine1,
        addressLine2: data.addressLine2,
        city: data.city,
        state: data.state,
        postalCode: data.postalCode,
        country: data.country,
        isDefault: data.isDefault,
      },
    });
    const result = ShippingAddress.toDomain(updated);
    if (!result) throw new Error('Failed to update address');
    return result;
  }

  async delete(id: string): Promise<void> {
    await this.prisma.shippingAddress.delete({ where: { id } });
  }

  async unsetDefault(userId: string): Promise<void> {
    await this.prisma.shippingAddress.updateMany({
      where: { userId, isDefault: true },
      data: { isDefault: false },
    });
  }
}
