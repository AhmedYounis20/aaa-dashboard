export enum InventoryTransferType{
  Conditional,
  Direct 
} 

export const InventoryTransferTypeOptions = Object.entries(InventoryTransferType)
  .filter(([, value]) => typeof value === "number")
  .map(([key, value]) => ({ label: key, value }));

export interface InventoryTransferItemModel {
  id?: string;
  itemId: string;
  packingUnitId: string;
  quantity: number;
  notes?: string;
  item?: any;
  packingUnit?: any;
}

export interface InventoryTransferModel {
  id?: string;
  sourceBranchId: string;
  destinationBranchId: string;
  transferType: InventoryTransferType;
  status?: string;
  notes?: string;
  approvedBy?: string;
  approvedAt?: string;
  items: InventoryTransferItemModel[];
  sourceBranch?: any;
  destinationBranch?: any;
} 