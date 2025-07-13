import FinancialPeriodModel from '../../Account/FinancialPeriods/FinancialPeriodModel';

export interface ImportTransactionItemModel {
  id: string;
  itemId: string;
  packingUnitId: string;
  quantity: number;
  totalCost: number;
}

export interface ImportTransactionModel {
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
  items: ImportTransactionItemModel[];
} 