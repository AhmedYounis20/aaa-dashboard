import * as yup from 'yup'
import { NodeType } from '../../../Components/NodeType';

export const ItemPackingUnitSellingPriceSchema = yup.object().shape({
  sellingPriceId: yup.string().required("SELLING_PRICE_IS_REQUIRED"),

  amount: yup
    .number()
    .test("greater-than-zero", "AMOUNT_IS_REQUIRED", (val) => {
      return val !== undefined && val > 0;
    }),
});

export const ItemPackingUnitSchema = yup.object().shape({
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

  sellingPrices: yup.array().of(ItemPackingUnitSellingPriceSchema).required(),
});



export const ItemSchema = yup.object().shape({
  packingUnits: yup.mixed().when("nodeType", {
    is: NodeType.Domain,
    then: () => yup.array().of(ItemPackingUnitSchema).required(),
    otherwise: () => yup.mixed().notRequired(),
  }),
  name: yup.string().required("NAME_IS_REQUIRED"),
  nameSecondLanguage: yup.string().required("NAME_SECOND_LANGUAGE_IS_REQUIRED"),
  code: yup.string().required("CODE_IS_REQUIRED"),
  // creditAccountId: string;
  // amount: number;
  // notes: string | null;
  // accountNature: AccountNature;
  // chequeBankId: string | null; // UUID format
  // chequeNumber: string | null;
  // chequeIssueDate: string | null; // ISO date string
  // chequeCollectionDate: Date | null; // ISO date string
  // collectionDate: Date | null; // ISO date string
  // number: string | null;
  // promissoryName: string | null;
  // promissoryNumber: string | null;
  // promissoryIdentityCard: string | null;
  // promissoryCollectionDate: Date | null; // ISO date string
  // wireTransferReferenceNumber: string | null;
  // creditCardLastDigits: string | null;
  // orderNumber: number;
});

export type EntrySchema = yup.InferType<typeof ItemSchema>;