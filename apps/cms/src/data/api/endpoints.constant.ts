// Centralized API endpoint paths - NO MAGIC STRINGS!
export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    LOGOUT: "/auth/logout",
    REFRESH: "/auth/refresh",
    PROFILE: "/auth/profile",
  },

  // Products
  PRODUCTS: {
    BASE: "/products",
    BY_ID: "/products/:id",
    BY_CATEGORY: "/products/category/:categoryId",
  },

  // Categories
  CATEGORIES: {
    BASE: "/categories",
    BY_ID: "/categories/:id",
    TREE: "/categories/tree",
  },

  // Orders
  ORDERS: {
    BASE: "/orders",
    BY_ID: "/orders/:id",
    BY_USER: "/orders/user/:userId",
    UPDATE_STATUS: "/orders/:id/status",
  },

  // Payments
  PAYMENTS: {
    BASE: "/payments",
    BY_ID: "/payments/:id",
    BY_ORDER: "/payments/order/:orderId",
    UPDATE_STATUS: "/payments/:id/status",
    REFUND: "/payments/:id/refund",
  },

  // Cart
  CART: {
    BASE: "/cart",
    ITEMS: "/cart/items",
    ITEM_BY_ID: "/cart/items/:itemId",
    CLEAR: "/cart/clear",
  },

  // Reviews
  REVIEWS: {
    BASE: "/reviews",
    BY_ID: "/reviews/:id",
    BY_PRODUCT: "/reviews/product/:productId",
  },

  // Users
  USERS: {
    BASE: "/users",
    BY_ID: "/users/:id",
  },

  // Media
  MEDIA: {
    BASE: "/media",
    BY_ID: "/media/:id",
    UPLOAD: "/media/upload",
  },

  // Dashboard
  DASHBOARD: {
    STATS: "/dashboard/stats",
  },

  // Blog
  BLOG: {
    POSTS: "/blog/posts",
    POST_BY_ID: "/blog/posts/:id",
    CATEGORIES: "/blog/categories",
    CATEGORY_BY_ID: "/blog/categories/:id",
  },

  // Settings
  SETTINGS: {
    BASE: "/settings",
    BY_KEY: "/settings/:key",
  },
} as const;

// Type helper to extract endpoint paths
export type ApiEndpoint = typeof API_ENDPOINTS;
