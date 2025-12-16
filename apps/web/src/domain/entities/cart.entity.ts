// Cart domain entity

export interface CartItem {
  id: string;
  productId: string;
  product: {
    id: string;
    name: string;
    price: number;
    imageUrls: string[];
    stock: number;
  };
  quantity: number;
  price: number;
  createdAt: string;
}

export interface Cart {
  items: CartItem[];
  total: number;
  itemCount: number;
}

export interface AddToCartDto {
  productId: string;
  quantity: number;
}

export interface UpdateCartItemDto {
  quantity: number;
}

export interface CartTotal {
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
}
