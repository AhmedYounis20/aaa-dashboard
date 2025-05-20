import { AccountNature } from "../ChartOfAccount/AccountNature";
import { PaymentType } from "./PaymentType";

interface FinancialTransactionModel {
  id: string;
  chartOfAccountId: string;
  amount: number;
  notes: string | null;
  accountNature: AccountNature;
  chequeBankId: string | null; // UUID format
  chequeNumber: string | null;
  chequeIssueDate: string | null; // ISO date string
  chequeCollectionDate: Date | null; // ISO date string
  collectionBookId: string | null;
  cashAgentName: string | null;
  cashPhoneNumber: string | null;
  promissoryName: string | null;
  promissoryNumber: string | null;
  promissoryIdentityCard: string | null;
  promissoryCollectionDate: Date | null; // ISO date string
  wireTransferReferenceNumber: string | null;
  atmTransferReferenceNumber: string | null;
  creditCardLastDigits: string | null;
  orderNumber: number;
  paymentType: PaymentType;
  isPaymentTransaction: boolean;
}

export default FinancialTransactionModel;