import { Product } from './product.entity';
import { User } from './user.entity';

export class CartItem {
  id!: string;
  cartId!: string;
  productId!: string;
  product?: Product;
  quantity!: number;
}

export class Cart {
  id!: string;
  userId!: string;
  user?: User;
  items!: CartItem[];
  createdAt!: Date;
  updatedAt!: Date;
}
