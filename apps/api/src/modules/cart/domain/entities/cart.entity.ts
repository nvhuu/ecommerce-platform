import { BaseEntity } from '@/shared/domain/base.entity';
import { Expose } from 'class-transformer';
import { Product } from '../../../products/domain/entities/product.entity';
import { User } from '../../../users/domain/entities/user.entity';

export class CartItem extends BaseEntity {
  @Expose()
  cartId!: string;

  @Expose()
  productId!: string;

  @Expose()
  product?: Product;

  @Expose()
  quantity!: number;
}

export class Cart extends BaseEntity {
  @Expose()
  userId!: string;

  @Expose()
  user?: User;

  @Expose()
  items!: CartItem[];
}
