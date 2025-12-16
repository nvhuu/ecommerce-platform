import { API_ROUTES } from "@/domain/constants/api-routes";
import type { AddToCartDto, Cart, UpdateCartItemDto } from "@/domain/entities/cart.entity";
import { deleteApi, getApi, patchApi, postApi } from "./api-client";

export const cartApi = {
  getCart: async (): Promise<Cart> => {
    const response = await getApi<Cart>(API_ROUTES.CART.BASE);
    return response.data;
  },

  addItem: async (dto: AddToCartDto): Promise<Cart> => {
    const response = await postApi<Cart>(API_ROUTES.CART.ITEMS, dto);
    return response.data;
  },

  updateItem: async (itemId: string, dto: UpdateCartItemDto): Promise<Cart> => {
    const response = await patchApi<Cart>(API_ROUTES.CART.ITEM(itemId), dto);
    return response.data;
  },

  removeItem: async (itemId: string): Promise<Cart> => {
    const response = await deleteApi<Cart>(API_ROUTES.CART.ITEM(itemId));
    return response.data;
  },

  clearCart: async (): Promise<void> => {
    await deleteApi(API_ROUTES.CART.CLEAR);
  },
};
