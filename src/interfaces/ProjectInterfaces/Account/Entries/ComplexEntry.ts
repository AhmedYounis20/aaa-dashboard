import AttachmentModel from "../../../BaseModels/AttachmentModel";
import ComplexFinancialTransactionModel from "./ComplexFinancialTransaction";
import EntryCostCenter from "./EntryCostCenter";

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
  costCenters: EntryCostCenter[];
}

export default ComplexEntryModel;