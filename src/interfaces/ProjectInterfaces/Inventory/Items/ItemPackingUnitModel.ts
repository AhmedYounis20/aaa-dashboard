import ItemPackingUnitSellingPriceModel from "./ItemPackingUnitSellingPriceModel";

interface ItemPackingUnitModel {
  packingUnitId: string;
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