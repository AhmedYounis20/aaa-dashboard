import ProductPackingUnitSellingPriceModel from "./ProductPackingUnitSellingPriceModel";

interface ProductPackingUnitModel {
  id: string;
  productId: string;
  packingUnitId: string;
  name?: string;
  orderNumber: number;
  partsCount: number;
  isDefaultPackingUnit: boolean;
  isDefaultSales: boolean;
  isDefaultPurchases: boolean;
  lastCostPrice: number;
  averageCostPrice: number;
  sellingPrices: ProductPackingUnitSellingPriceModel[];
  createdAt: string;
  modifiedAt: string;
}

export default ProductPackingUnitModel;
