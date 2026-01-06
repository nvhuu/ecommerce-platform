import { MESSAGES } from '@/shared/constants/messages.constant';
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { IWishlistRepository } from '../../domain/repositories/wishlist.repository.interface';

@Injectable()
export class WishlistService {
  constructor(private readonly repository: IWishlistRepository) {}

  async getOrCreateUserWishlist(userId: string) {
    let wishlist = await this.repository.findByUserId(userId);

    if (!wishlist) {
      wishlist = await this.repository.createForUser(userId);
    }

    return wishlist;
  }

  async getUserWishlist(userId: string) {
    return this.getOrCreateUserWishlist(userId);
  }

  async addItem(userId: string, productId: string, variantId?: string) {
    const wishlist = await this.getOrCreateUserWishlist(userId);

    // Check if product already in wishlist
    const exists = await this.repository.isProductInWishlist(
      wishlist.id,
      productId,
      variantId,
    );

    if (exists) {
      throw new ConflictException(MESSAGES.WISHLIST.PRODUCT_EXISTS);
    }

    return this.repository.addItem(wishlist.id, productId, variantId);
  }

  async removeItem(userId: string, itemId: string) {
    const item = await this.repository.findItemById(itemId);

    if (!item) {
      throw new NotFoundException(MESSAGES.WISHLIST.ITEM_NOT_FOUND);
    }

    // Verify item belongs to user's wishlist
    const wishlist = await this.repository.findByUserId(userId);
    if (!wishlist || item.wishlistId !== wishlist.id) {
      throw new NotFoundException(MESSAGES.WISHLIST.ITEM_NOT_FOUND);
    }

    await this.repository.removeItem(itemId);
  }

  async clearWishlist(userId: string) {
    const wishlist = await this.getOrCreateUserWishlist(userId);
    await this.repository.clearItems(wishlist.id);
  }

  async shareWishlist(userId: string) {
    const wishlist = await this.getOrCreateUserWishlist(userId);

    if (wishlist.shareToken) {
      return { shareToken: wishlist.shareToken };
    }

    const token = await this.repository.generateShareToken(wishlist.id);
    return { shareToken: token };
  }

  async getSharedWishlist(shareToken: string) {
    const wishlist = await this.repository.findByShareToken(shareToken);

    if (!wishlist || !wishlist.isPublic) {
      throw new NotFoundException(MESSAGES.WISHLIST.ITEM_NOT_FOUND);
    }

    return wishlist;
  }

  async isInWishlist(userId: string, productId: string, variantId?: string) {
    const wishlist = await this.repository.findByUserId(userId);

    if (!wishlist) {
      return false;
    }

    return this.repository.isProductInWishlist(
      wishlist.id,
      productId,
      variantId,
    );
  }
}
