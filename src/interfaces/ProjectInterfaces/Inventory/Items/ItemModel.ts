import { NodeType } from "../../../Components/NodeType";
import { DiscountType } from "./DiscountType";
import ItemPackingUnitModel from "./ItemPackingUnitModel";
import ItemSellingPriceDiscountModel from "./ItemSellingPriceDiscountModel";
import { ItemType } from "./ItemType";

export interface ItemStockBalanceModel {
  branchId: string;
  packingUnitId: string;
  currentBalance: number;
}

interface ItemModel {
  id: string;
  parentId?: string | null;
  code: string;
  gs1Code: string;
  egsCode: string;
  model: string;
  version: string;
  countryOfOrigin: string;
  maxDiscount: number;
  conditionalDiscount: number;
  defaultDiscount: number;
  defaultDiscountType: DiscountType;
  isDiscountBasedOnSellingPrice: boolean;
  itemType: ItemType;
  name: string;
  nameSecondLanguage: string;
  nodeType: NodeType;
  barCodes: string[];
  suppliersIds: string[];
  manufacturerCompaniesIds: string[];
  sellingPriceDiscounts : Array<ItemSellingPriceDiscountModel>
  packingUnits: ItemPackingUnitModel[];
  stockBalances?: ItemStockBalanceModel[];
  subDomainCombinations?: import('./ColorSizeCombinationModel').ColorSizeCombinationModel[];
  applyDomainChanges?: boolean;
}

export default ItemModel;