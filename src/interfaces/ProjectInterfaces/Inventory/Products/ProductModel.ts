import { DiscountType } from "./DiscountType";
import { ItemNodeType } from "../Items/ItemNodeType";
import { ProductType } from "./ProductType";
import ProductAttachmentModel from "./ProductAttachmentModel";
import ProductAttributeDefinitionModel from "./ProductAttributeDefinitionModel";
import ProductSellingPriceDiscountModel from "./ProductSellingPriceDiscountModel";
import ProductCostCenterModel from "./ProductCostCenterModel";
import ProductPackingUnitModel from "./ProductPackingUnitModel";
import { InventoryThresholdScope } from "../InventoryThresholdScope";
import { InventoryThresholdModel } from "../InventoryThresholdModel";
import { ExpiryLevelModel } from "../ExpiryLevelModel";
import VariantModel from "../Variants/VariantModel";
import VariantCombinationModel from "./VariantCombinationModel";
import AttachmentModel from "../../../BaseModels/AttachmentModel";

export interface ProductStockBalanceModel {
  branchId: string;
  packingUnitId: string;
  currentBalance: number;
}

interface ProductModel {
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
  productType: ProductType;
  name: string;
  nameSecondLanguage: string;
  nodeType: ItemNodeType;
  barCodes: string[];
  suppliersIds: string[];
  manufacturerCompaniesIds: string[];
  salesTaxIds?: string[];
  purchaseTaxIds?: string[];
  costCenters?: ProductCostCenterModel[];
  productAttachments?: ProductAttachmentModel[];
  productAttributeDefinitions?: ProductAttributeDefinitionModel[];
  sellingPriceDiscounts?: ProductSellingPriceDiscountModel[];
  packingUnits?: ProductPackingUnitModel[];
  variants?: VariantModel[];
  variantCombinations?: VariantCombinationModel[];
  productDefinitionsValues?: Record<string, string[]>;
  hasVariants: boolean;
  variantsCount: number;
  stockBalances?: ProductStockBalanceModel[];
  applyProductChanges?: boolean;
  createdAt: string;
  modifiedAt: string;
  createdByName?: string;
  createdByNameSecondLanguage?: string;
  modifiedByName?: string;
  modifiedByNameSecondLanguage?: string;
  productPicture: AttachmentModel;
  inventoryThresholdScope?: InventoryThresholdScope;
  inventoryThresholdBranchId?: string | null;
  inventoryThresholds?: InventoryThresholdModel[];
  expiryLevels?: ExpiryLevelModel[];
}

export default ProductModel;









