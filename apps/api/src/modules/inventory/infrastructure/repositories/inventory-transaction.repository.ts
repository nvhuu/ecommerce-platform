import { PrismaService } from '@/core/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { InventoryTransaction } from '../../domain/entities/inventory-transaction.entity';
import { IInventoryTransactionRepository } from '../../domain/repositories/inventory-transaction.repository.interface';

@Injectable()
export class InventoryTransactionRepository implements IInventoryTransactionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    transaction: Partial<InventoryTransaction>,
  ): Promise<InventoryTransaction> {
    const created = await this.prisma.inventoryTransaction.create({
      data: {
        productId: transaction.productId!,
        variantId: transaction.variantId,
        type: transaction.type!,
        quantity: transaction.quantity!,
        reference: transaction.reference,
        note: transaction.note,
        createdBy: transaction.createdBy,
      },
    });

    const result = InventoryTransaction.toDomain(created);
    if (!result) throw new Error('Failed to create transaction');
    return result;
  }

  async findByProduct(
    productId: string,
    variantId?: string,
  ): Promise<InventoryTransaction[]> {
    const transactions = await this.prisma.inventoryTransaction.findMany({
      where: {
        productId,
        ...(variantId && { variantId }),
      },
      orderBy: { createdAt: 'desc' },
    });

    return transactions
      .map((t) => InventoryTransaction.toDomain(t))
      .filter((t): t is InventoryTransaction => t !== null);
  }
}
