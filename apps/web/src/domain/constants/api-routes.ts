// API Routes Constants

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002";

export const API_ROUTES = {
  // Auth
  AUTH: {
    BASE: "/auth",
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    LOGOUT: "/auth/logout",
    ME: "/auth/me",
  },

  // Products
  PRODUCTS: {
    BASE: "/products",
    BY_ID: (id: string) => `/products/${id}`,
    BY_CATEGORY: (categoryId: string) => `/products?categoryId=${categoryId}`,
    FEATURED: "/products?featured=true",
  },

  // Categories
  CATEGORIES: {
    BASE: "/categories",
    BY_ID: (id: string) => `/categories/${id}`,
  },

  // Cart
  CART: {
    BASE: "/cart",
    ITEMS: "/cart/items",
    ITEM: (itemId: string) => `/cart/items/${itemId}`,
    CLEAR: "/cart/clear",
  },

  // Orders
  ORDERS: {
    BASE: "/orders",
    BY_ID: (id: string) => `/orders/${id}`,
    MY_ORDERS: "/orders/my-orders",
  },

  // Reviews
  REVIEWS: {
    BASE: "/reviews",
    BY_PRODUCT: (productId: string) => `/reviews?productId=${productId}`,
    BY_ID: (id: string) => `/reviews/${id}`,
  },
} as const;

export { API_BASE };
