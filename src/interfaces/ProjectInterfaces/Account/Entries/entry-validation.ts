import * as yup from 'yup'

export const FinancialTransactionSchema = yup.object().shape({
  debitAccountId: yup.string().required("DEBIT_ACCOUNT_IS_REQUIRED"),

  creditAccountId: yup.string().required("CREDIT_ACCOUNT_IS_REQUIRED"),
  amount: yup
    .number()
    .test("greater-than-zero", "AMOUNT_IS_REQUIRED", (val) => {
      return val !== undefined && val > 0;
    }),

  // debitAccountId: string;
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

export const EntryCostCenterSchema = yup.object().shape({

  costCenterId: yup.string().nullable(),
  amount: yup
    .number()
    .min(0, 'MUST_BE_0_OR_MORE') // base rule
    .when('costCenterId', {
      is: (val: string | null) => val != null && val.trim() !== '',
      then: (schema) => schema.moreThan(0, 'MUST_BE_GREATER_THAN_0'),
    }),

  // debitAccountId: string;
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

export const EntrySchema = yup.object().shape({
  financialTransactions: yup.array().of(FinancialTransactionSchema).required(),
  costCenters : yup.array().of(EntryCostCenterSchema).required(),
  currencyId: yup.string().required("CURRENCY_IS_REQUIRED"),
  exchangeRate: yup
    .number()
    .required("EXCHANGE_RATE_IS_REQUIRED"),
  financialPeriodId: yup.string().required("FINANCIAL_PERIOD_ID_IS_REQUIRED"),
  financialPeriodNumber: yup.string().required("FINANCIAL_NUMBER_IS_REQUIRED"),
  entryDate: yup.date().required("ENTRY_DATE_IS_REQUIRED"),
  branchId: yup.string().required("BRANCH_ID_IS_REQUIRED"),
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
export type FinancialTransactionSchema = yup.InferType<
  typeof FinancialTransactionSchema
>;
export type EntrySchema = yup.InferType<typeof EntrySchema>;