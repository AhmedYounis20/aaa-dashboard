import { AccountNature } from "../ChartOfAccount/AccountNature";

interface FinancialTransactionModel {
  debitAccountId: string;
  creditAccountId: string;
  amount: number;
  notes: string | null;
  accountNature: AccountNature;
  chequeBankId: string | null; // UUID format
  chequeNumber: string | null;
  chequeIssueDate: string | null; // ISO date string
  chequeCollectionDate: Date | null; // ISO date string
  collectionDate: Date | null; // ISO date string
  number: string | null;
  promissoryName: string | null;
  promissoryNumber: string | null;
  promissoryIdentityCard: string | null;
  promissoryCollectionDate: Date | null; // ISO date string
  wireTransferReferenceNumber: string | null;
  creditCardLastDigits: string | null;
  orderNumber: number;
}

export default FinancialTransactionModel;