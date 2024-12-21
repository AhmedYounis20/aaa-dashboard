import AttachmentModel from "../../BaseModels/AttachmentModel";
import FinancialTransactionModel from "./FinancialTransaction";

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
  attachments: AttachmentModel[];
  financialTransactions: FinancialTransactionModel[];
}

export default EntryModel;