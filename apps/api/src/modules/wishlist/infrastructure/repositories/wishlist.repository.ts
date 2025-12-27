import { PrismaService } from '@/core/prisma/prisma.service';
import { SortOrder } from '@/shared/constants/sort.constant';
import { Injectable } from '@nestjs/common';
import { randomBytes } from 'crypto';
import { WishlistItem } from '../../domain/entities/wishlist-item.entity';
import { Wishlist } from '../../domain/entities/wishlist.entity';
import { IWishlistRepository } from '../../domain/repositories/wishlist.repository.interface';

@Injectable()
export class WishlistRepository implements IWishlistRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByUserId(userId: string): Promise<Wishlist | null> {
    const result = await this.prisma.wishlist.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: true,
            variant: true,
          },
          orderBy: { addedAt: SortOrder.DESC },
        },
      },
    });
    return result ? Wishlist.toDomain(result) : null;
  }

  async createForUser(userId: string): Promise<Wishlist> {
    const result = await this.prisma.wishlist.create({
      data: { userId },
      include: { items: true },
    });
    return Wishlist.toDomain(result)!;
  }

  async addItem(
    wishlistId: string,
    productId: string,
    variantId?: string,
  ): Promise<WishlistItem> {
    const result = await this.prisma.wishlistItem.create({
      data: {
        wishlistId,
        productId,
        variantId,
      },
      include: {
        product: true,
        variant: true,
      },
    });
    return WishlistItem.toDomain(result)!;
  }

  async removeItem(itemId: string): Promise<void> {
    await this.prisma.wishlistItem.delete({
      where: { id: itemId },
    });
  }

  async clearItems(wishlistId: string): Promise<void> {
    await this.prisma.wishlistItem.deleteMany({
      where: { wishlistId },
    });
  }

  async generateShareToken(wishlistId: string): Promise<string> {
    const token = randomBytes(16).toString('hex');
    await this.prisma.wishlist.update({
      where: { id: wishlistId },
      data: {
        shareToken: token,
        isPublic: true,
      },
    });
    return token;
  }

  async findByShareToken(token: string): Promise<Wishlist | null> {
    const result = await this.prisma.wishlist.findUnique({
      where: { shareToken: token },
      include: {
        items: {
          include: {
            product: true,
            variant: true,
          },
        },
      },
    });
    return result ? Wishlist.toDomain(result) : null;
  }

  async findItemById(itemId: string): Promise<WishlistItem | null> {
    const result = await this.prisma.wishlistItem.findUnique({
      where: { id: itemId },
    });
    return result ? WishlistItem.toDomain(result) : null;
  }

  async isProductInWishlist(
    wishlistId: string,
    productId: string,
    variantId?: string,
  ): Promise<boolean> {
    const item = await this.prisma.wishlistItem.findFirst({
      where: {
        wishlistId,
        productId,
        variantId: variantId || null,
      },
    });
    return !!item;
  }
}
