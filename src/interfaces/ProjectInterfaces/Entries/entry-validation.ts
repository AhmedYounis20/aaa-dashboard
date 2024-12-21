import * as yup from 'yup'

export const FinancialTransactionSchema = yup.object().shape({
    debitAccountId: yup
    .string()
    .required("Debit Account is Required"),

    creditAccountId: yup
    .string()
    .required("Credit Account is Required"),


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
export type FinancialTransactionSchema = yup.InferType<
  typeof FinancialTransactionSchema
>;
export type EntrySchema = yup.InferType<typeof EntrySchema>;