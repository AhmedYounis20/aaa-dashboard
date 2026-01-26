import * as yup from 'yup'
import { NodeType } from '../../../Components/NodeType';

export const ProductPackingUnitSellingPriceSchema = yup.object().shape({
  currencyId: yup.string().required("CURRENCY_IS_REQUIRED"),
  sellingPrice: yup
    .number()
    .test("greater-than-zero", "SELLING_PRICE_IS_REQUIRED", (val) => {
      return val !== undefined && val > 0;
    }),
});

export const ProductPackingUnitSchema = yup.object().shape({
  packingUnitId: yup.string().required("PACKING_UNIT_IS_REQUIRED"),
  partsCount: yup
    .number()
    .test("greater-than-zero", "PARTS_COUNT_IS_REQUIRED", (val) => {
      return val !== undefined && val > 0;
    }),
  lastCostPrice: yup
    .number()
    .test("greater-than-zero", "LAST_COST_PRICE_IS_REQUIRED", (val) => {
      return val !== undefined && val > 0;
    }),
  averageCostPrice: yup
    .number()
    .test("greater-than-zero", "AVERAGE_COST_PRICE_IS_REQUIRED", (val) => {
      return val !== undefined && val > 0;
    }),
  sellingPrices: yup.array().of(ProductPackingUnitSellingPriceSchema).required(),
});

export const ProductSellingPriceDiscountSchema = yup.object().shape({
  minQuantity: yup
    .number()
    .test("greater-than-zero", "MIN_QUANTITY_IS_REQUIRED", (val) => {
      return val !== undefined && val > 0;
    }),
  maxQuantity: yup
    .number()
    .test("greater-than-zero", "MAX_QUANTITY_IS_REQUIRED", (val) => {
      return val !== undefined && val > 0;
    }),
  discountValue: yup
    .number()
    .test("greater-than-zero", "DISCOUNT_VALUE_IS_REQUIRED", (val) => {
      return val !== undefined && val > 0;
    }),
});

export const ProductSchema = yup.object().shape({
  packingUnits: yup.mixed().when("nodeType", {
    is: NodeType.Domain,
    then: () => yup.array().of(ProductPackingUnitSchema).required(),
    otherwise: () => yup.mixed().notRequired(),
  }),
  sellingPriceDiscounts: yup.mixed().when("nodeType", {
    is: NodeType.Domain,
    then: () => yup.array().of(ProductSellingPriceDiscountSchema).required(),
    otherwise: () => yup.mixed().notRequired(),
  }),
  name: yup.string().required("NAME_IS_REQUIRED"),
  nameSecondLanguage: yup.string().required("NAME_SECOND_LANGUAGE_IS_REQUIRED"),
  code: yup.string().required("CODE_IS_REQUIRED"),
});

export type ProductSchema = yup.InferType<typeof ProductSchema>;


