/**
 * Single threshold row for inventory levels and notifications.
 * scope and branchId are optional in payload; backend fills from product/variant level.
 */
export interface InventoryThresholdModel {
  level: number;
  minQuantity: number;
  maxQuantity: number;
  enableNotification: boolean;
  scope?: number;
  branchId?: string | null;
}
