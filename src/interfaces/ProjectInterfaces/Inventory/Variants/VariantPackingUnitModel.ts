import VariantPackingUnitSellingPriceModel from "./VariantPackingUnitSellingPriceModel";

interface VariantPackingUnitModel {
  id: string;
  variantId: string;
  packingUnitId: string;
  name?: string;
  orderNumber: number;
  partsCount: number;
  isDefaultPackingUnit: boolean;
  isDefaultSales: boolean;
  isDefaultPurchases: boolean;
  lastCostPrice: number;
  averageCostPrice: number;
  sellingPrices: VariantPackingUnitSellingPriceModel[];
  createdAt: string;
  modifiedAt: string;
}

export default VariantPackingUnitModel;











