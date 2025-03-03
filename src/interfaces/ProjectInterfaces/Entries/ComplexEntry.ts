import AttachmentModel from "../../BaseModels/AttachmentModel";
import ComplexFinancialTransactionModel from "./ComplexFinancialTransaction";

interface ComplexEntryModel {
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

export default ComplexEntryModel;