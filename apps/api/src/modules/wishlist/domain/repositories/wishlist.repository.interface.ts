import { WishlistItem } from '../entities/wishlist-item.entity';
import { Wishlist } from '../entities/wishlist.entity';

export abstract class IWishlistRepository {
  abstract findByUserId(userId: string): Promise<Wishlist | null>;
  abstract createForUser(userId: string): Promise<Wishlist>;
  abstract addItem(
    wishlistId: string,
    productId: string,
    variantId?: string,
  ): Promise<WishlistItem>;
  abstract removeItem(itemId: string): Promise<void>;
  abstract clearItems(wishlistId: string): Promise<void>;
  abstract generateShareToken(wishlistId: string): Promise<string>;
  abstract findByShareToken(token: string): Promise<Wishlist | null>;
  abstract findItemById(itemId: string): Promise<WishlistItem | null>;
  abstract isProductInWishlist(
    wishlistId: string,
    productId: string,
    variantId?: string,
  ): Promise<boolean>;
}
