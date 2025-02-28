import AttachmentModel from "../../BaseModels/AttachmentModel";
import ComplexFinancialTransactionModel from "./FinancialTransaction";

interface EntryModel {
  id: string;
  entryNumber: string;
  documentNumber: string;
  currencyId: string;
  exchangeRate: number;
  receiverName: string;
  branchId: string;
  entryDate: Date;
  notes: string;
  financialPeriodId: string;
  financialPeriodNumber: string;
  attachments: AttachmentModel[];
  financialTransactions: ComplexFinancialTransactionModel[];
}

export default EntryModel;