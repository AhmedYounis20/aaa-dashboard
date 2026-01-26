import { DiscountType } from "../Products/DiscountType";
import VariantAttachmentModel from "./VariantAttachmentModel";
import VariantAttributeValueModel from "./VariantAttributeValueModel";
import VariantPackingUnitModel from "./VariantPackingUnitModel";
import VariantSellingPriceDiscountModel from "./VariantSellingPriceDiscountModel";
import VariantCostCenterModel from "./VariantCostCenterModel";

export interface VariantDto {
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
  variantCostCenters?: VariantCostCenterModel[];
  sellingPriceDiscounts: VariantSellingPriceDiscountModel[];
  packingUnits: VariantPackingUnitModel[];
  variantAttachments?: VariantAttachmentModel[];
  variantAttributeValues?: VariantAttributeValueModel[];
  isActive: boolean;
  createdAt: string;
  modifiedAt: string;
  createdByName?: string;
  createdByNameSecondLanguage?: string;
  modifiedByName?: string;
  modifiedByNameSecondLanguage?: string;
}


