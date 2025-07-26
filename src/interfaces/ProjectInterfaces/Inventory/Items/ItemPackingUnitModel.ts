import ItemPackingUnitSellingPriceModel from "./ItemPackingUnitSellingPriceModel";

interface ItemPackingUnitModel {
  packingUnitId: string;
  name?: string;
  orderNumber: number;
  partsCount: number;
  isDefaultPackingUnit: boolean;
  isDefaultSales: boolean;
  isDefaultPurchases: boolean;
  lastCostPrice: number;
  averageCostPrice: number;
  sellingPrices: ItemPackingUnitSellingPriceModel[];
}

export default ItemPackingUnitModel;