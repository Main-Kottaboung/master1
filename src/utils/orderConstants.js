/**
 * Order Status Constants & State Machine
 * Defines valid status transitions and helper functions
 */

const OrderStatus = {
  PENDING: 'pending',
  PAID: 'paid',
  SHIPPED: 'shipped',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
};

/**
 * Valid transitions: defines which statuses can transition to which
 * e.g., PENDING can go to PAID or CANCELLED
 * PAID can go to SHIPPED or CANCELLED
 * etc.
 */
const ValidTransitions = {
  [OrderStatus.PENDING]: [OrderStatus.PAID, OrderStatus.CANCELLED],
  [OrderStatus.PAID]: [OrderStatus.SHIPPED, OrderStatus.CANCELLED],
  [OrderStatus.SHIPPED]: [OrderStatus.COMPLETED],
  [OrderStatus.COMPLETED]: [], // terminal state
  [OrderStatus.CANCELLED]: [], // terminal state
};

/**
 * Check if a transition is valid
 * @param {string} fromStatus - current status
 * @param {string} toStatus - desired status
 * @returns {boolean} true if transition is allowed
 */
function isValidTransition(fromStatus, toStatus) {
  if (!ValidTransitions[fromStatus]) {
    return false;
  }
  return ValidTransitions[fromStatus].includes(toStatus);
}

/**
 * Get allowed next statuses for current status
 * @param {string} currentStatus
 * @returns {array} allowed statuses
 */
function getAllowedTransitions(currentStatus) {
  return ValidTransitions[currentStatus] || [];
}

/**
 * All available statuses
 */
const AllStatuses = Object.values(OrderStatus);

module.exports = {
  OrderStatus,
  ValidTransitions,
  isValidTransition,
  getAllowedTransitions,
  AllStatuses,
};
