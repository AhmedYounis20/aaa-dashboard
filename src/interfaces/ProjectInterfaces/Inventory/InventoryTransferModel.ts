import VariantModel from './Variants/VariantModel';
import VariantPackingUnitModel from './Variants/VariantPackingUnitModel';

export enum InventoryTransferStatus {
  Pending = 0,
  Approved = 1,
  Rejected = 2,
}

export enum InventoryTransferType {
  Conditional = 0,
  Direct = 1,
}

export const InventoryTransferTypeOptions = Object.entries(InventoryTransferType)
  .filter(([, value]) => typeof value === 'number')
  .map(([key, value]) => ({ label: key, value }));

export interface InventoryTransferLineModel {
  id?: string;
  variantId: string;
  packingUnitId: string;
  quantity: number;
  notes?: string;
  variant?: VariantModel;
  packingUnit?: VariantPackingUnitModel;
}

export interface InventoryTransferModel {
  id?: string;
  sourceBranchId: string;
  destinationBranchId: string;
  transferType: InventoryTransferType;
  status?: InventoryTransferStatus | string | number;
  notes?: string;
  approvedBy?: string;
  approvedAt?: string;
  sourceBranchName?: string;
  destinationBranchName?: string;
  items: InventoryTransferLineModel[];
  sourceBranch?: { id: string; name: string };
  destinationBranch?: { id: string; name: string };
}
