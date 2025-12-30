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
    BAD_REQUEST: 'Bad request',
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
    USER_NOT_FOUND: 'User not found',
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
    INSUFFICIENT_STOCK: 'Insufficient product stock',
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
    INSUFFICIENT_STOCK: 'Insufficient stock for order',
    INVALID_STATUS: 'Invalid order status',
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
    ITEM_NOT_FOUND: 'Cart item not found',
  },

  // Payment messages
  PAYMENT: {
    PROCESSED: 'Payment processed successfully',
    FAILED: 'Payment failed',
    CANCELLED: 'Payment cancelled',
    REFUNDED: 'Payment refunded successfully',
    AMOUNT_MISMATCH: 'Payment amount does not match order total',
    INVALID_METHOD: 'Invalid payment method',
  },

  // Media messages
  MEDIA: {
    UPLOADED: 'File uploaded successfully',
    DELETED: 'File deleted successfully',
    LIST_RETRIEVED: 'Media files retrieved successfully',
    FOLDER_CREATED: 'Folder created successfully',
    NOT_FOUND: 'Media file not found',
    INVALID_TYPE: 'Invalid file type',
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
    NOT_FOUND: 'Review not found',
  },

  // Page messages
  PAGE: {
    CREATED: 'Page created successfully',
    UPDATED: 'Page updated successfully',
    DELETED: 'Page deleted successfully',
    RETRIEVED: 'Page retrieved successfully',
    LIST_RETRIEVED: 'Pages retrieved successfully',
    PUBLISHED: 'Page published successfully',
    UNPUBLISHED: 'Page unpublished successfully',
    NOT_FOUND: 'Page not found',
    SLUG_EXISTS: 'Page with this slug already exists',
  },

  // Menu messages
  MENU: {
    CREATED: 'Menu created successfully',
    UPDATED: 'Menu updated successfully',
    DELETED: 'Menu deleted successfully',
    RETRIEVED: 'Menu retrieved successfully',
    LIST_RETRIEVED: 'Menus retrieved successfully',
    NOT_FOUND: 'Menu not found',
    LOCATION_EXISTS: 'Menu for this location already exists',
  },

  // Menu Item messages
  MENU_ITEM: {
    CREATED: 'Menu item created successfully',
    UPDATED: 'Menu item updated successfully',
    DELETED: 'Menu item deleted successfully',
    NOT_FOUND: 'Menu item not found',
    REORDERED: 'Menu items reordered successfully',
  },

  // Setting messages
  SETTING: {
    CREATED: 'Setting created successfully',
    UPDATED: 'Setting updated successfully',
    DELETED: 'Setting deleted successfully',
    RETRIEVED: 'Setting retrieved successfully',
    LIST_RETRIEVED: 'Settings retrieved successfully',
    NOT_FOUND: 'Setting not found',
    KEY_EXISTS: 'Setting with this key already exists',
    INVALID_TYPE: 'Invalid setting type',
    INVALID_VALUE: 'Invalid value for setting type',
  },

  // Form messages
  FORM: {
    CREATED: 'Form created successfully',
    UPDATED: 'Form updated successfully',
    DELETED: 'Form deleted successfully',
    RETRIEVED: 'Form retrieved successfully',
    LIST_RETRIEVED: 'Forms retrieved successfully',
    NOT_FOUND: 'Form not found',
    SLUG_EXISTS: 'Form with this slug already exists',
    INVALID_FIELDS: 'Invalid field definitions',
    SUBMITTED: 'Form submitted successfully',
  },

  // Submission messages
  SUBMISSION: {
    CREATED: 'Submission created successfully',
    UPDATED: 'Submission updated successfully',
    DELETED: 'Submission deleted successfully',
    RETRIEVED: 'Submission retrieved successfully',
    LIST_RETRIEVED: 'Submissions retrieved successfully',
    NOT_FOUND: 'Submission not found',
    VALIDATION_FAILED: 'Form validation failed',
  },

  // Loyalty messages
  LOYALTY: {
    POINTS_EARNED: 'Loyalty points earned successfully',
    POINTS_REDEEMED: 'Loyalty points redeemed successfully',
    INSUFFICIENT_POINTS: 'Insufficient loyalty points',
    BALANCE_RETRIEVED: 'Loyalty balance retrieved successfully',
    HISTORY_RETRIEVED: 'Transaction history retrieved successfully',
    POINTS_ADJUSTED: 'Loyalty points adjusted successfully',
    TRANSACTION_NOT_FOUND: 'Transaction not found',
  },

  LANDING_PAGE: {
    CREATED: 'Landing page created successfully',
    UPDATED: 'Landing page updated successfully',
    DELETED: 'Landing page deleted successfully',
    PUBLISHED: 'Landing page published successfully',
    ARCHIVED: 'Landing page archived successfully',
    RETRIEVED: 'Landing page retrieved successfully',
    LIST_RETRIEVED: 'Landing pages retrieved successfully',
    NOT_FOUND: 'Landing page not found',
    SLUG_EXISTS: 'A landing page with this slug already exists',
    VARIANT_CREATED: 'Variant created successfully',
    VARIANT_UPDATED: 'Variant updated successfully',
    VARIANT_DELETED: 'Variant deleted successfully',
    WINNER_SELECTED: 'Winner variant selected successfully',
    EVENT_TRACKED: 'Event tracked successfully',
    ANALYTICS_RETRIEVED: 'Analytics retrieved successfully',
  },
} as const;

// Type helper for autocomplete
export type MessageKey = typeof MESSAGES;
