/**
 * Centralized message constants for API responses
 * Makes it easy to manage, update, and potentially internationalize messages
 */

export const MESSAGES = {
  // Common messages
  COMMON: {
    SUCCESS: 'Operation completed successfully',
    NOT_FOUND: 'Resource not found',
    UNAUTHORIZED: 'Unauthorized access',
    FORBIDDEN: 'Access forbidden',
    VALIDATION_ERROR: 'Validation failed',
    INTERNAL_ERROR: 'Internal server error',
  },

  // Auth messages
  AUTH: {
    LOGIN_SUCCESS: 'Logged in successfully',
    LOGOUT_SUCCESS: 'Logged out successfully',
    REGISTER_SUCCESS: 'Registration successful',
    TOKEN_REFRESH_SUCCESS: 'Token refreshed successfully',
    INVALID_CREDENTIALS: 'Invalid credentials',
    EMAIL_ALREADY_EXISTS: 'Email already exists',
    PASSWORD_RESET_SUCCESS: 'Password reset successful',
  },

  // Category messages
  CATEGORY: {
    CREATED: 'Category created successfully',
    UPDATED: 'Category updated successfully',
    DELETED: 'Category deleted successfully',
    RETRIEVED: 'Category retrieved successfully',
    LIST_RETRIEVED: 'Categories retrieved successfully',
    NOT_FOUND: 'Category not found',
  },

  // Product messages
  PRODUCT: {
    CREATED: 'Product created successfully',
    UPDATED: 'Product updated successfully',
    DELETED: 'Product deleted successfully',
    RETRIEVED: 'Product retrieved successfully',
    LIST_RETRIEVED: 'Products retrieved successfully',
    NOT_FOUND: 'Product not found',
    STOCK_UPDATED: 'Product stock updated successfully',
  },

  // Order messages
  ORDER: {
    CREATED: 'Order created successfully',
    UPDATED: 'Order updated successfully',
    CANCELLED: 'Order cancelled successfully',
    RETRIEVED: 'Order retrieved successfully',
    LIST_RETRIEVED: 'Orders retrieved successfully',
    STATUS_UPDATED: 'Order status updated successfully',
    NOT_FOUND: 'Order not found',
    EMPTY_CART: 'Cart is empty',
    INSUFFICIENT_STOCK: 'Insufficient stock',
  },

  // User messages
  USER: {
    CREATED: 'User created successfully',
    UPDATED: 'User updated successfully',
    DELETED: 'User deleted successfully',
    RETRIEVED: 'User retrieved successfully',
    LIST_RETRIEVED: 'Users retrieved successfully',
    NOT_FOUND: 'User not found',
    PROFILE_UPDATED: 'Profile updated successfully',
  },

  // Cart messages
  CART: {
    RETRIEVED: 'Cart retrieved successfully',
    ITEM_ADDED: 'Item added to cart',
    ITEM_UPDATED: 'Cart item updated',
    ITEM_REMOVED: 'Item removed from cart',
    CLEARED: 'Cart cleared successfully',
  },

  // Payment messages
  PAYMENT: {
    PROCESSED: 'Payment processed successfully',
    FAILED: 'Payment failed',
    CANCELLED: 'Payment cancelled',
    REFUNDED: 'Payment refunded successfully',
  },

  // Media messages
  MEDIA: {
    UPLOADED: 'File uploaded successfully',
    DELETED: 'File deleted successfully',
    LIST_RETRIEVED: 'Media files retrieved successfully',
    FOLDER_CREATED: 'Folder created successfully',
  },

  // Dashboard messages
  DASHBOARD: {
    STATS_RETRIEVED: 'Dashboard statistics retrieved successfully',
    REPORT_GENERATED: 'Report generated successfully',
  },

  // Review messages
  REVIEW: {
    CREATED: 'Review created successfully',
    UPDATED: 'Review updated successfully',
    DELETED: 'Review deleted successfully',
    LIST_RETRIEVED: 'Reviews retrieved successfully',
  },
} as const;

// Type helper for autocomplete
export type MessageKey = typeof MESSAGES;
