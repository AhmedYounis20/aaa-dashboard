import { ApiResult } from '../../interfaces/ApiResponse';
import FinancialPeriodModel from '../../interfaces/ProjectInterfaces/Account/FinancialPeriods/FinancialPeriodModel';
import { httpGet, httpPost, httpPut, httpDelete } from '../Axios/axiosMethods';

export interface ImportTransactionOutputDtoModel {
  id: string;
  transactionNumber: string;
  financialPeriodId: string;
  financialPeriodNumber: string;
  transactionDate: Date;
  documentNumber?: string;
  transactionPartyId: string;
  transactionPartyName?: string;
  branchId: string;
  branchName?: string;
  notes?: string;
  items: ImportTransactionItemOutputDtoModel[];
  financialPeriod?: FinancialPeriodModel | null;
  totalAmount: number;
  status: 'draft' | 'pending' | 'approved' | 'received' | 'cancelled';
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ImportTransactionItemOutputDtoModel {
  id: string;
  itemId: string;
  itemName?: string;
  itemCode?: string;
  packingUnitId: string;
  packingUnitName?: string;
  quantity: number;
  totalCost: number;
  unitCost: number;
}

export interface CreateImportTransactionRequest {
  transactionDate: Date;
  documentNumber?: string;
  transactionPartyId: string;
  branchId: string;
  notes?: string;
  items: CreateImportTransactionItemRequest[];
}

export interface CreateImportTransactionItemRequest {
  itemId: string;
  packingUnitId: string;
  quantity: number;
  totalCost: number;
}

export interface UpdateImportTransactionRequest {
  transactionDate: Date;
  documentNumber?: string;
  transactionPartyId: string;
  branchId: string;
  notes?: string;
  items: CreateImportTransactionItemRequest[];
}
const apiEndPoint = "ImportTransactions";
// Create import transaction
export const createImportTransaction = async (data: CreateImportTransactionRequest): Promise<ApiResult<ImportTransactionOutputDtoModel>> => {
  return await httpPost<ImportTransactionOutputDtoModel>(apiEndPoint, data);
};

// Get all import transactions
export const getImportTransactions = async (): Promise<ApiResult<ImportTransactionOutputDtoModel[]>> => {
  return await httpGet<ImportTransactionOutputDtoModel[]>(apiEndPoint, {});
};

// Get import transaction by ID
export const getImportTransactionById = async (id: string): Promise<ApiResult<ImportTransactionOutputDtoModel>> => {
  return await httpGet<ImportTransactionOutputDtoModel>(`/${apiEndPoint}/${id}`, {});
};

// Update import transaction
export const updateImportTransaction = async (id: string, data: UpdateImportTransactionRequest): Promise<ApiResult<ImportTransactionOutputDtoModel>> => {
  return await httpPut<ImportTransactionOutputDtoModel>(`/${apiEndPoint}/${id}`, data);
};

// Delete import transaction
export const deleteImportTransaction = async (id: string): Promise<ApiResult<boolean>> => {
  return await httpDelete<boolean>(`/${apiEndPoint}/${id}`, {});
};

// Get transaction number
export const getImportTransactionNumber = async (dateTime: Date): Promise<ApiResult<{transactionNumber: string, financialPeriodId: string, financialPeriodNumber: string}>> => {
  return await httpGet<{transactionNumber: string, financialPeriodId: string, financialPeriodNumber: string}>(`/${apiEndPoint}/GetTransactionNumber`, { dateTime: dateTime.toISOString() });
}; 