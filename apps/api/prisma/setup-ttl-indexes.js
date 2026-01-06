/**
 * MongoDB TTL Index Setup Script
 *
 * This script creates TTL (Time-To-Live) indexes for analytics collections.
 * These indexes automatically delete documents after a specified time period (90 days).
 *
 * Note: Prisma doesn't natively support TTL index syntax in schema.prisma for MongoDB,
 * so we create them directly via MongoDB shell or this script.
 *
 * Run this script ONCE after deploying the schema:
 * ```
 * mongosh <connection-string> < setup-ttl-indexes.js
 * ```
 */

// Connect to your database (adjust connection if needed)
const dbName = process.env.DATABASE_NAME || 'ecommerce';

// TTL duration: 90 days in seconds
const TTL_SECONDS = 90 * 24 * 60 * 60; // 7776000 seconds

print('Setting up TTL indexes for analytics collections...');

// ProductView: Auto-delete after 90 days
db.product_views.createIndex(
  { viewedAt: 1 },
  {
    expireAfterSeconds: TTL_SECONDS,
    name: 'productview_ttl_index',
  },
);
print('✓ Created TTL index on product_views.viewedAt');

// SearchLog: Auto-delete after 90 days
db.search_logs.createIndex(
  { searchedAt: 1 },
  {
    expireAfterSeconds: TTL_SECONDS,
    name: 'searchlog_ttl_index',
  },
);
print('✓ Created TTL index on search_logs.searchedAt');

// CheckoutStep: Auto-delete after 90 days
db.checkout_steps.createIndex(
  { completedAt: 1 },
  {
    expireAfterSeconds: TTL_SECONDS,
    name: 'checkoutstep_ttl_index',
  },
);
print('✓ Created TTL index on checkout_steps.completedAt');

// CartAbandonment: Auto-delete after 90 days
db.cart_abandonments.createIndex(
  { abandonedAt: 1 },
  {
    expireAfterSeconds: TTL_SECONDS,
    name: 'cartabandonment_ttl_index',
  },
);
print('✓ Created TTL index on cart_abandonments.abandonedAt');

// ActivityLog: Auto-delete after 90 days
db.activity_logs.createIndex(
  { createdAt: 1 },
  {
    expireAfterSeconds: TTL_SECONDS,
    name: 'activitylog_ttl_index',
  },
);
print('✓ Created TTL index on activity_logs.createdAt');

// LoginHistory: Auto-delete after 90 days
db.login_history.createIndex(
  { createdAt: 1 },
  {
    expireAfterSeconds: TTL_SECONDS,
    name: 'loginhistory_ttl_index',
  },
);
print('✓ Created TTL index on login_history.createdAt');

print('\nAll TTL indexes created successfully!');
print('Documents older than 90 days will be automatically deleted.');
