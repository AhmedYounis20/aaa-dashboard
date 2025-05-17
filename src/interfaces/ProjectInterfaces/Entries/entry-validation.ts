import * as yup from 'yup'

export const FinancialTransactionSchema = yup.object().shape({
  debitAccountId: yup.string().required("Debit Account is Required"),

  creditAccountId: yup.string().required("Credit Account is Required"),
  amount: yup
    .number()
    .test("greater-than-zero", "amount is required", (val) => {
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
    .min(0, 'Must be 0 or more') // base rule
    .when('costCenterId', {
      is: (val: string | null) => val != null && val.trim() !== '',
      then: (schema) => schema.moreThan(0, 'Must be greater than 0'),
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
  currencyId: yup.string().required("currency is Required"),
  exchangeRate: yup
    .number()
    .required("exchage rate Is required"),
  financialPeriodId: yup.string().required("Financial Period Id Is required"),
  financialPeriodNumber: yup.string().required("Financial Number Is required"),
  entryDate: yup.date().required("entry date is required"),
  branchId: yup.string().required("branch Id is required"),
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