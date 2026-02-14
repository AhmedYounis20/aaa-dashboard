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
import { InventoryThresholdScope } from "../InventoryThresholdScope";
import { InventoryThresholdModel } from "../InventoryThresholdModel";
import { ExpiryLevelModel } from "../ExpiryLevelModel";
import { TrackedBy } from "./TrackedBy";

interface ProductInputModel {
  id?: string;
  parentId?: string | null;
  code: string;
  notes?: string;
  gs1Code?: string;
  egsCode?: string;
  isSales: boolean;
  isPurchases: boolean;
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
  trackedBy?: TrackedBy;
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
  inventoryThresholdScope?: InventoryThresholdScope;
  inventoryThresholdBranchId?: string | null;
  inventoryThresholds?: InventoryThresholdModel[];
  expiryLevels?: ExpiryLevelModel[];
}

export const buildProductValidationSchema = (t: (key: string) => string) =>
  yup.object().shape({
    name: yup.string().required(t("Name is required")),
    nameSecondLanguage: yup
      .string()
      .required(t("Name Second Language is required")),
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
      otherwise: (schema) => schema.notRequired(),
    }),
    sellingPriceDiscounts: yup.array().when("nodeType", {
      is: ItemNodeType.Domain,
      then: (schema) =>
        schema.of(
          yup.object().shape({
            discount: yup.number().when("discountType", {
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
    inventoryThresholdBranchId: yup.string().when("inventoryThresholdScope", {
      is: InventoryThresholdScope.Branch,
      then: (schema) =>
        schema.required(t("Branch is required when scope is Branch")),
      otherwise: (schema) => schema.nullable().notRequired(),
    }),
    inventoryThresholds: yup.array().of(
      yup.object().shape({
        level: yup.number().required(),
        minQuantity: yup.number().required(),
        maxQuantity: yup
          .number()
          .required()
          .test(
            "min-less-than-max",
            t("Quantity To must be greater than Quantity From"),
            function (value) {
              const { minQuantity } = this.parent;
              return (
                value != null && minQuantity != null && value > minQuantity
              );
            },
          ),
        enableNotification: yup.boolean().required(),
      }),
    ),
    expiryLevels: yup
      .array()
      .of(
        yup.object().shape({
          level: yup.number().required(),
          daysFrom: yup.number().required(),
          daysTo: yup
            .number()
            .required()
            .test(
              "days-from-less-than-days-to",
              t("EXPIRY_LEVEL_DAYS_FROM_MUST_BE_LESS_THAN_DAYS_TO"),
              function (value) {
                const { daysFrom } = this.parent;
                return value != null && daysFrom != null && value > daysFrom;
              },
            ),
          enableNotification: yup.boolean().required(),
        }),
      )
      .test(
        "expiry-levels-no-overlap",
        t("EXPIRY_LEVEL_RANGES_MUST_NOT_OVERLAP"),
        function (levels) {
          if (!levels || levels.length <= 1) return true;
          const sorted = [...levels].sort((a, b) => a.level - b.level);
          for (let i = 0; i < sorted.length; i++) {
            if (i > 0 && sorted[i].level !== sorted[i - 1].level + 1)
              return false;
            for (let j = i + 1; j < sorted.length; j++) {
              const a = sorted[i];
              const b = sorted[j];
              if (
                a.daysFrom != null &&
                a.daysTo != null &&
                b.daysFrom != null &&
                b.daysTo != null
              ) {
                if (a.daysFrom <= b.daysTo && b.daysFrom <= a.daysTo)
                  return false;
              }
            }
          }
          return true;
        },
      ),
  });

export default ProductInputModel;
