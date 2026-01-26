import * as yup from "yup";
import { DiscountType } from "./DiscountType";
import { ItemNodeType } from "../Items/ItemNodeType";
import { ProductType } from "./ProductType";
import ProductAttachmentModel from "./ProductAttachmentModel";
import ProductAttributeDefinitionModel from "./ProductAttributeDefinitionModel";
import ProductSellingPriceDiscountModel from "./ProductSellingPriceDiscountModel";
import ProductCostCenterModel from "./ProductCostCenterModel";
import ProductPackingUnitModel from "./ProductPackingUnitModel";
import VariantCombinationModel from "./VariantCombinationModel";

interface ProductInputModel {
  id?: string;
  parentId?: string | null;
  code: string;
  gs1Code?: string;
  egsCode?: string;
  model?: string;
  version?: string;
  countryOfOrigin?: string;
  barCodes: string[];
  maxDiscount: number;
  conditionalDiscount: number;
  defaultDiscount: number;
  defaultDiscountType: DiscountType;
  isDiscountBasedOnSellingPrice: boolean;
  productType?: ProductType;
  name: string;
  nameSecondLanguage: string;
  nodeType: ItemNodeType;
  suppliersIds: string[];
  manufacturerCompaniesIds: string[];
  salesTaxIds?: string[];
  purchaseTaxIds?: string[];
  costCenters?: ProductCostCenterModel[];
  productAttachments?: ProductAttachmentModel[];
  productAttributeDefinitions?: ProductAttributeDefinitionModel[];
  sellingPriceDiscounts?: ProductSellingPriceDiscountModel[];
  packingUnits?: ProductPackingUnitModel[];
  variantCombinations?: VariantCombinationModel[];
}

export const buildProductValidationSchema = (
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
    packingUnits: yup.array().when("nodeType", {
      is: ItemNodeType.Domain,
      then: (schema) =>
        schema.of(
          yup.object().shape({
            packingUnitId: yup
              .string()
              .required(t("Packing unit is required")),
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
      otherwise: (schema) => schema.notRequired(),
    }),
    sellingPriceDiscounts: yup.array().when("nodeType", {
      is: ItemNodeType.Domain,
      then: (schema) =>
        schema.of(
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
      otherwise: (schema) => schema.notRequired(),
    }),
    costCenters: yup.array().when("nodeType", {
      is: ItemNodeType.Domain,
      then: (schema) =>
        schema.of(
          yup.object().shape({
            costCenterId: yup.string().required(t("Cost center is required")),
            percent: yup
              .number()
              .min(0, t("Percent must be zero or greater"))
              .max(100, t("Percent must be 100 or less")),
          }),
        ),
      otherwise: (schema) => schema.notRequired(),
    }),
  });

export default ProductInputModel;
