import * as yup from "yup";

/** Complex / combined / payment / receipt line (paired debit+credit accounts). */
export const FinancialTransactionSchema = yup.object().shape({
  debitAccountId: yup.string().required("DEBIT_ACCOUNT_IS_REQUIRED"),
  creditAccountId: yup.string().required("CREDIT_ACCOUNT_IS_REQUIRED"),
  amount: yup.number().test("greater-than-zero", "AMOUNT_IS_REQUIRED", (val) => {
    return val !== undefined && val > 0;
  }),
});

/** Journal / opening line (single account + nature). */
export const SimpleFinancialTransactionSchema = yup.object().shape({
  chartOfAccountId: yup.string().required("ACCOUNT_IS_REQUIRED"),
  amount: yup.number().test("greater-than-zero", "AMOUNT_IS_REQUIRED", (val) => {
    return val !== undefined && val > 0;
  }),
});

export const EntryCostCenterSchema = yup.object().shape({
  costCenterId: yup.string().nullable(),
  amount: yup
    .number()
    .min(0, "MUST_BE_0_OR_MORE")
    .when("costCenterId", {
      is: (val: string | null) => val != null && val.trim() !== "",
      then: (schema) => schema.moreThan(0, "MUST_BE_GREATER_THAN_0"),
    }),
});

const entryHeaderShape = {
  currencyId: yup.string().required("CURRENCY_IS_REQUIRED"),
  exchangeRate: yup.number().required("EXCHANGE_RATE_IS_REQUIRED"),
  financialPeriodId: yup.string().required("FINANCIAL_PERIOD_ID_IS_REQUIRED"),
  financialPeriodNumber: yup.string().required("FINANCIAL_NUMBER_IS_REQUIRED"),
  entryDate: yup.date().required("ENTRY_DATE_IS_REQUIRED"),
  branchId: yup.string().required("BRANCH_ID_IS_REQUIRED"),
};

export const EntrySchema = yup.object().shape({
  financialTransactions: yup.array().of(FinancialTransactionSchema).required(),
  costCenters: yup.array().of(EntryCostCenterSchema).default([]),
  ...entryHeaderShape,
});

export const SimpleEntrySchema = yup.object().shape({
  financialTransactions: yup
    .array()
    .of(SimpleFinancialTransactionSchema)
    .min(1, "AT_LEAST_ONE_TRANSACTION_IS_REQUIRED")
    .required(),
  ...entryHeaderShape,
});

export type FinancialTransactionSchema = yup.InferType<typeof FinancialTransactionSchema>;
export type EntrySchema = yup.InferType<typeof EntrySchema>;
export type SimpleEntrySchema = yup.InferType<typeof SimpleEntrySchema>;
