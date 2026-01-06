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
    PASSWORD_RESET_EMAIL_SENT: 'If email exists, a reset link has been sent',
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
    INVALID_TRANSITION: 'Invalid order status transition',
    CANNOT_CANCEL: 'Only pending orders can be cancelled',
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
    NOT_FOUND: 'Payment not found',
    CREATED: 'Payment created successfully',
    UPDATED: 'Payment status updated successfully',
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
    NOT_FOUND: 'Review not found',
    ALREADY_REVIEWED: 'You have already reviewed this product',
    CREATED: 'Review submitted successfully',
    UPDATED: 'Review updated successfully',
    DELETED: 'Review deleted successfully',
    LIST_RETRIEVED: 'Reviews retrieved successfully',
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
    VALUE_MUST_BE_NUMBER: 'Value must be a number',
    VALUE_MUST_BE_BOOLEAN: 'Value must be true or false',
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

  ANALYTICS: {
    PRODUCT_VIEW_TRACKED: 'Product view tracked successfully',
    SEARCH_TRACKED: 'Search tracked successfully',
    CHECKOUT_STEP_TRACKED: 'Checkout step tracked successfully',
    CART_ABANDONMENT_TRACKED: 'Cart abandonment tracked successfully',
    RECOVERY_EMAIL_SENT: 'Recovery email sent successfully',
    CART_RECOVERED: 'Cart marked as recovered',
    CART_NOT_FOUND: 'Cart not found',
    ALREADY_RECOVERED: 'Cart already recovered',
  },

  PRODUCT_VARIANT: {
    NOT_FOUND: 'Product variant not found',
    SKU_EXISTS: 'SKU already exists',
    CREATED: 'Product variant created successfully',
    UPDATED: 'Product variant updated successfully',
    DELETED: 'Product variant deleted successfully',
  },

  COUPON: {
    NOT_FOUND: 'Coupon not found',
    CODE_EXISTS: 'Coupon code already exists',
    INVALID_DATE_RANGE: 'End date must be after start date',
    NOT_ACTIVE: 'Coupon is not active',
    NOT_YET_VALID: 'Coupon not yet valid',
    EXPIRED: 'Coupon has expired',
    USAGE_LIMIT_REACHED: 'Coupon usage limit reached',
    USER_LIMIT_REACHED: 'You have reached the usage limit for this coupon',
    MIN_ORDER_NOT_MET: 'Minimum order amount not met',
    APPLIED: 'Coupon applied successfully',
    VALIDATED: 'Coupon validated successfully',
  },

  EMAIL_TEMPLATE: {
    NOT_FOUND: 'Email template not found',
    CREATED: 'Email template created successfully',
    UPDATED: 'Email template updated successfully',
    DELETED: 'Email template deleted successfully',
  },

  WISHLIST: {
    PRODUCT_EXISTS: 'Product already in wishlist',
    ITEM_NOT_FOUND: 'Wishlist item not found',
    ITEM_ADDED: 'Item added to wishlist',
    ITEM_REMOVED: 'Item removed from wishlist',
    RETRIEVED: 'Wishlist retrieved successfully',
  },

  IP_BLACKLIST: {
    ALREADY_BLOCKED: 'IP address already blocked',
    NOT_FOUND: 'IP address not found in blacklist',
    ADDED: 'IP address added to blacklist',
    REMOVED: 'IP address removed from blacklist',
  },

  REVIEW_REPORT: {
    NOT_FOUND: 'Review report not found',
    ALREADY_PROCESSED: 'Report has already been processed',
    SUBMITTED: 'Report submitted successfully',
    RESOLVED: 'Report resolved successfully',
    DISMISSED: 'Dismissed as invalid',
  },

  POPUP: {
    NOT_FOUND: 'Popup not found',
    CREATED: 'Popup created successfully',
    UPDATED: 'Popup updated successfully',
    DELETED: 'Popup deleted successfully',
    LIST_RETRIEVED: 'Popups retrieved successfully',
  },

  BANNER: {
    NOT_FOUND: 'Banner not found',
    CREATED: 'Banner created successfully',
    UPDATED: 'Banner updated successfully',
    DELETED: 'Banner deleted successfully',
    LIST_RETRIEVED: 'Banners retrieved successfully',
  },

  SCHEDULER: {
    CONTENT_SCHEDULED: 'Content scheduled successfully',
    EMAIL_SCHEDULED: 'Email scheduled successfully',
    WEBHOOK_CREATED: 'Webhook created successfully',
    WEBHOOK_UPDATED: 'Webhook updated successfully',
    WEBHOOK_DELETED: 'Webhook deleted successfully',
    CRON_UPDATED: 'Cron job updated successfully',
    DOMAIN_CONVERSION_FAILED: 'Failed to convert to domain entity',
    TEST_TRIGGERED: 'Test functionality triggered (placeholder)',
    UNKNOWN_ERROR: 'Unknown error',
    DEFAULT_EMAIL_SUBJECT: 'Scheduled Email',
  },
} as const;

// Type helper for autocomplete
export type MessageKey = typeof MESSAGES;
