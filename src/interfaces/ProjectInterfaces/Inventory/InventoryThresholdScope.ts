/**
 * Inventory Threshold Scope: applies once per product/variant to all threshold rows.
 * 0 = All branches, 1 = Specific branch (inventoryThresholdBranchId required).
 */
export enum InventoryThresholdScope {
  All = 0,
  Branch = 1,
}
