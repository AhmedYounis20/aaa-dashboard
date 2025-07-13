import { ApiResult } from '../../interfaces/ApiResponse';
import FinancialPeriodModel from '../../interfaces/ProjectInterfaces/Account/FinancialPeriods/FinancialPeriodModel';
import { httpGet, httpPost, httpPut, httpDelete } from '../Axios/axiosMethods';

export interface ExportTransactionOutputDtoModel {
  id: string;
  transactionNumber: string;
  financialPeriodId: string;
  transactionDate: Date;
  documentNumber?: string;
  transactionPartyId: string;
  transactionPartyName?: string;
  branchId: string;
  branchName?: string;
  notes?: string;
  items: ExportTransactionItemOutputDtoModel[];
  financialPeriod? : FinancialPeriodModel;
  totalAmount: number;
  status: 'draft' | 'pending' | 'approved' | 'issued' | 'cancelled';
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ExportTransactionItemOutputDtoModel {
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

export interface CreateExportTransactionRequest {
  transactionDate: Date;
  documentNumber?: string;
  transactionPartyId: string;
  branchId: string;
  notes?: string;
  items: CreateExportTransactionItemRequest[];
}

export interface CreateExportTransactionItemRequest {
  itemId: string;
  packingUnitId: string;
  quantity: number;
  totalCost: number;
}

export interface UpdateExportTransactionRequest {
  transactionDate: Date;
  documentNumber?: string;
  transactionPartyId: string;
  branchId: string;
  notes?: string;
  items: CreateExportTransactionItemRequest[];
}

const apiEndPoint = "ExportTransactions";

// Create export transaction
export const createExportTransaction = async (data: CreateExportTransactionRequest): Promise<ApiResult<ExportTransactionOutputDtoModel>> => {
  return await httpPost<ExportTransactionOutputDtoModel>(apiEndPoint, data);
};

// Get all export transactions
export const getExportTransactions = async (): Promise<ApiResult<ExportTransactionOutputDtoModel[]>> => {
  return await httpGet<ExportTransactionOutputDtoModel[]>(apiEndPoint, {});
};

// Get export transaction by ID
export const getExportTransactionById = async (id: string): Promise<ApiResult<ExportTransactionOutputDtoModel>> => {
  return await httpGet<ExportTransactionOutputDtoModel>(`/${apiEndPoint}/${id}`, {});
};

// Update export transaction
export const updateExportTransaction = async (id: string, data: UpdateExportTransactionRequest): Promise<ApiResult<ExportTransactionOutputDtoModel>> => {
  return await httpPut<ExportTransactionOutputDtoModel>(`/${apiEndPoint}/${id}`, data);
};

// Delete export transaction
export const deleteExportTransaction = async (id: string): Promise<ApiResult<boolean>> => {
  return await httpDelete<boolean>(`/${apiEndPoint}/${id}`, {});
};

// Get transaction number
export const getExportTransactionNumber = async (dateTime: Date): Promise<ApiResult<{transactionNumber: string, financialPeriodId: string, financialPeriodNumber: string}>> => {
  return await httpGet<{transactionNumber: string, financialPeriodId: string, financialPeriodNumber: string}>(`/${apiEndPoint}/GetTransactionNumber`, { dateTime: dateTime.toISOString() });
}; 