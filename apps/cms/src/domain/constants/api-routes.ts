export const API_ROUTES = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    LOGOUT: "/auth/logout",
    ME: "/auth/me",
  },
  PRODUCTS: {
    BASE: "/products",
    BY_ID: (id: string) => `/products/${id}`,
    BY_CATEGORY: (categoryId: string) => `/products/category/${categoryId}`,
  },
  CATEGORIES: {
    BASE: "/categories",
    BY_ID: (id: string) => `/categories/${id}`,
  },
  ORDERS: {
    BASE: "/orders",
    BY_ID: (id: string) => `/orders/${id}`,
    STATUS: (id: string) => `/orders/${id}/status`,
    MY_ORDERS: "/orders/my-orders",
  },
  USERS: {
    BASE: "/users",
    BY_ID: (id: string) => `/users/${id}`,
  },
  MEDIA: {
    BASE: "/media",
    UPLOAD: "/media/upload",
    FOLDER: "/media/folder",
    DELETE: (type: "file" | "folder", id: string) => `/media/${type}/${id}`,
  },
  DASHBOARD: {
    STATS: "/dashboard/stats",
  },
} as const;
