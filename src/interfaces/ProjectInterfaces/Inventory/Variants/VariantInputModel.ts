import * as yup from "yup";
import { DiscountType } from "../Products/DiscountType";
import VariantSellingPriceDiscountModel from "./VariantSellingPriceDiscountModel";
import VariantCostCenterModel from "./VariantCostCenterModel";
import VariantPackingUnitModel from "./VariantPackingUnitModel";
import VariantAttachmentModel from "./VariantAttachmentModel";
import VariantAttributeValueModel from "./VariantAttributeValueModel";
import { ProductType } from "../Products/ProductType";

interface VariantCreateCommand {
  id?: string;
  name: string;
  nameSecondLanguage?: string;
  description?: string;
  productId: string;
  code: string;
  gs1Code?: string;
  egsCode?: string;
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
  isActive: boolean;
  productType?: ProductType;
}

export const buildVariantValidationSchema = (
  t: (key: string) => string,
) =>
  yup.object().shape({
    name: yup.string().required(t("Name is required")),
    nameSecondLanguage: yup.string().required(t("Name Second Language is required")),
    code: yup.string().required(t("Code is required")),
    maxDiscount: yup.number().min(0).max(100),
    conditionalDiscount: yup.number().min(0).max(100),
    defaultDiscount: yup.number().when("defaultDiscountType", {
      is: DiscountType.Percent,
      then: (schema) => schema.min(0).max(100),
      otherwise: (schema) => schema.min(0),
    }),
    packingUnits: yup.array().of(
      yup.object().shape({
        packingUnitId: yup.string().required(t("Packing unit is required")),
        lastCostPrice: yup
          .number()
          .moreThan(0, t("Price must be greater than zero")),
        averageCostPrice: yup
          .number()
          .moreThan(0, t("Price must be greater than zero")),
        sellingPrices: yup.array().of(
          yup.object().shape({
            amount: yup
              .number()
              .moreThan(0, t("Price must be greater than zero")),
          }),
        ),
      }),
    ),
    sellingPriceDiscounts: yup.array().of(
      yup.object().shape({
        discount: yup
          .number()
          .when("discountType", {
            is: DiscountType.Percent,
            then: (schema) =>
              schema
                .min(0, t("Discount must be zero or greater"))
                .max(100, t("Discount must be 100 or less")),
            otherwise: (schema) =>
              schema.min(0, t("Discount must be zero or greater")),
          }),
      }),
    ),
    costCenters: yup.array().of(
      yup.object().shape({
        costCenterId: yup.string().required(t("Cost center is required")),
        percent: yup
          .number()
          .min(0, t("Percent must be zero or greater"))
          .max(100, t("Percent must be 100 or less")),
      }),
    ),
  });

export default VariantCreateCommand;


