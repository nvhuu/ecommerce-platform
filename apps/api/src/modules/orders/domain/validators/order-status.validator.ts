import { OrderStatus } from '@prisma/client';

/**
 * Valid order status transitions map
 * Defines which status transitions are allowed to prevent invalid state changes
 */
export const VALID_ORDER_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  [OrderStatus.PENDING]: [OrderStatus.CONFIRMED, OrderStatus.CANCELLED],
  [OrderStatus.CONFIRMED]: [OrderStatus.PROCESSING, OrderStatus.CANCELLED],
  [OrderStatus.PROCESSING]: [OrderStatus.SHIPPED, OrderStatus.CANCELLED],
  [OrderStatus.SHIPPED]: [OrderStatus.DELIVERED],
  [OrderStatus.DELIVERED]: [OrderStatus.COMPLETED],
  [OrderStatus.COMPLETED]: [OrderStatus.REFUNDED],
  [OrderStatus.CANCELLED]: [], // No transitions from cancelled
  [OrderStatus.REFUNDED]: [], // No transitions from refunded
};

/**
 * Validates if a status transition is allowed
 * @param currentStatus Current order status
 * @param newStatus Desired new status
 * @returns true if transition is valid, false otherwise
 */
export function isValidTransition(
  currentStatus: OrderStatus,
  newStatus: OrderStatus,
): boolean {
  return VALID_ORDER_TRANSITIONS[currentStatus]?.includes(newStatus) ?? false;
}
