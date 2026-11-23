import { DiscountType } from "@/interfaces/ProjectInterfaces/Inventory/Products/DiscountType";
import { ProductNodeType } from "@/interfaces/ProjectInterfaces/Inventory/Products/ProductNodeType";
import { ProductType } from "@/interfaces/ProjectInterfaces/Inventory/Products/ProductType";

export type ItemKind = "product" | "variant";

export interface ItemCostCenter {
  id?: string;
  costCenterId: string | null;
  percent: number;
  name?: string;
  nameSecondLanguage?: string;
}

export interface ItemSellingPriceDiscount {
  sellingPriceId: string;
  discount: number;
  discountType: DiscountType;
  name: string;
  nameSecondLanguage: string;
}

/** Fields shared by Product and Variant forms that Item* cards read/write. */
export interface ItemSharedFormFields {
  name: string;
  nameSecondLanguage?: string;
  code: string;
  gs1Code?: string;
  egsCode?: string;
  barCodes: string[];
  productType?: ProductType;
  nodeType?: ProductNodeType;
  model?: string;
  version?: string;
  countryOfOrigin?: string;
  suppliersIds: string[];
  manufacturerCompaniesIds: string[];
  salesTaxIds?: string[];
  purchaseTaxIds?: string[];
  costCenters?: ItemCostCenter[];
  maxDiscount: number;
  conditionalDiscount: number;
  defaultDiscount: number;
  defaultDiscountType: DiscountType;
  isDiscountBasedOnSellingPrice: boolean;
  sellingPriceDiscounts?: ItemSellingPriceDiscount[];
}
