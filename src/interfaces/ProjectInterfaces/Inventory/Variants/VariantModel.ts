import AttachmentModel from "../../../BaseModels/AttachmentModel";
import { DiscountType } from "../Products/DiscountType";
import VariantAttachmentModel from "./VariantAttachmentModel";
import VariantAttributeValueModel from "./VariantAttributeValueModel";
import VariantPackingUnitModel from "./VariantPackingUnitModel";
import VariantSellingPriceDiscountModel from "./VariantSellingPriceDiscountModel";
import VariantCostCenterModel from "./VariantCostCenterModel";
import { InventoryThresholdScope } from "../InventoryThresholdScope";
import { InventoryThresholdModel } from "../InventoryThresholdModel";
import { ExpiryLevelModel } from "../ExpiryLevelModel";

export interface VariantStockBalanceModel {
  branchId: string;
  packingUnitId: string;
  currentBalance: number;
}

interface VariantModel {
  id: string;
  name: string;
  nameSecondLanguage?: string;
  description?: string;
  productId: string;
  productName: string;
  code: string;
  gs1Code: string;
  egsCode: string;
  barCodes: string[];
  maxDiscount: number;
  conditionalDiscount: number;
  defaultDiscount: number;
  defaultDiscountType: DiscountType;
  isDiscountBasedOnSellingPrice: boolean;
  model?: string;
  version?: string;
  countryOfOrigin?: string;
  suppliersIds: string[];
  manufacturerCompaniesIds: string[];
  salesTaxIds?: string[];
  purchaseTaxIds?: string[];
  costCenters?: VariantCostCenterModel[];
  sellingPriceDiscounts: VariantSellingPriceDiscountModel[];
  packingUnits: VariantPackingUnitModel[];
  variantAttachments?: VariantAttachmentModel[];
  variantAttributeValues?: VariantAttributeValueModel[];
  stockBalances?: VariantStockBalanceModel[];
  isActive: boolean;
  createdAt: string;
  modifiedAt: string;
  createdByName?: string;
  createdByNameSecondLanguage?: string;
  modifiedByName?: string;
  modifiedByNameSecondLanguage?: string;
  variantPicture: AttachmentModel;
  inventoryThresholdScope?: InventoryThresholdScope;
  inventoryThresholdBranchId?: string | null;
  inventoryThresholds?: InventoryThresholdModel[];
  expiryLevels?: ExpiryLevelModel[];
}

export default VariantModel;









