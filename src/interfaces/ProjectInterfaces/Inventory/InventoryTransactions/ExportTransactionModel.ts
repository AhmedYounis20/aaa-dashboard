import FinancialPeriodModel from '../../Account/FinancialPeriods/FinancialPeriodModel';

export interface ExportTransactionItemModel {
  id: string;
  itemId: string;
  packingUnitId: string;
  quantity: number;
  totalCost: number;
}

export interface ExportTransactionModel {
  id: string;
  transactionNumber: string;
  financialPeriodNumber: string;
  financialPeriodId: string;
  documentNumber: string;
  transactionDate: Date;
  transactionPartyId: string;
  branchId: string;
  notes: string;
  financialPeriod?: FinancialPeriodModel;
  items: ExportTransactionItemModel[];
} 