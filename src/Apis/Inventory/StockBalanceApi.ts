import { ApiResult } from '../../interfaces/ApiResponse';
import { httpGet, httpPost, httpPut, httpDelete } from '../Axios/axiosMethods';

export interface StockBalanceModel {
  id: string;
  itemId: string;
  itemName?: string;
  itemCode?: string;
  packingUnitId: string;
  packingUnitName?: string;
  branchId: string;
  branchName?: string;
  currentBalance: number;
  minimumBalance: number;
  maximumBalance: number;
  unitCost: number;
  totalCost: number;
  lastUpdated: Date;
}

export interface StoreIssueItemModel {
  id: string;
  itemId: string;
  itemName: string;
  itemCode: string;
  quantity: number;
  unitCost: number;
  totalCost: number;
  location: string;
}

export interface StoreIssueModel {
  id: string;
  issueNumber: string;
  date: Date;
  departmentId: string;
  departmentName: string;
  warehouseId: string;
  warehouseName: string;
  items: StoreIssueItemModel[];
  totalAmount: number;
  status: 'draft' | 'pending' | 'approved' | 'issued' | 'cancelled';
  notes: string;
  requestedBy: string;
  createdAt: Date;
}

export interface WarehouseReceiptItemModel {
  id: string;
  itemId: string;
  itemName: string;
  itemCode: string;
  quantity: number;
  unitCost: number;
  totalCost: number;
  location: string;
}

export interface WarehouseReceiptModel {
  id: string;
  receiptNumber: string;
  date: Date;
  supplierId: string;
  supplierName: string;
  warehouseId: string;
  warehouseName: string;
  items: WarehouseReceiptItemModel[];
  totalAmount: number;
  status: 'draft' | 'pending' | 'approved' | 'received' | 'cancelled';
  notes: string;
  receivedBy: string;
  createdAt: Date;
}

export interface CreateStockBalanceRequest {
  itemId: string;
  packingUnitId: string;
  branchId: string;
  currentBalance: number;
  minimumBalance: number;
  maximumBalance: number;
  unitCost: number;
  totalCost: number;
}

export interface UpdateStockBalanceRequest {
  itemId: string;
  packingUnitId: string;
  branchId: string;
  currentBalance: number;
  minimumBalance: number;
  maximumBalance: number;
  unitCost: number;
  totalCost: number;
}

export interface UpdateStockBalanceQuantityRequest {
  itemId: string;
  packingUnitId: string;
  branchId: string;
  quantity: number;
  unitCost: number;
  isReceipt: boolean;
}
const apiEndPoint = "StockBalances";
// Get all stock balances
export const getStockBalances = async (): Promise<ApiResult<StockBalanceModel[]>> => {
  return await httpGet<StockBalanceModel[]>(apiEndPoint, {});
};

// Get stock balance by ID
export const getStockBalanceById = async (id: string): Promise<ApiResult<StockBalanceModel>> => {
  return await httpGet<StockBalanceModel>(`/${apiEndPoint}/${id}`, {});
};

// Create stock balance
export const createStockBalance = async (data: CreateStockBalanceRequest): Promise<ApiResult<StockBalanceModel>> => {
  return await httpPost<StockBalanceModel>(apiEndPoint, data);
};

// Update stock balance
export const updateStockBalance = async (id: string, data: UpdateStockBalanceRequest): Promise<ApiResult<StockBalanceModel>> => {
  return await httpPut<StockBalanceModel>(`/${apiEndPoint}/${id}`, data);
};

// Delete stock balance
export const deleteStockBalance = async (id: string): Promise<ApiResult<boolean>> => {
  return await httpDelete<boolean>(`/${apiEndPoint}/${id}`, {});
};

// Get stock balance by item and branch
export const getStockBalanceByItemAndBranch = async (itemId: string, branchId: string): Promise<ApiResult<StockBalanceModel[]>> => {
  return await httpGet<StockBalanceModel[]>(`/${apiEndPoint}/byItemAndBranch`, { itemId, branchId });
};

// Get stock balance by item, packing unit and branch
export const getStockBalanceByItemPackingUnitAndBranch = async (itemId: string, packingUnitId: string, branchId: string): Promise<ApiResult<StockBalanceModel[]>> => {
  return await httpGet<StockBalanceModel[]>(`/${apiEndPoint}/byItemPackingUnitAndBranch`, { itemId, packingUnitId, branchId });
};

// Get stock balances by branch
export const getStockBalancesByBranch = async (branchId: string): Promise<ApiResult<StockBalanceModel[]>> => {
  return await httpGet<StockBalanceModel[]>(`/${apiEndPoint}/byBranch/${branchId}`, {});
};

// Get stock balances by item
export const getStockBalancesByItem = async (itemId: string): Promise<ApiResult<StockBalanceModel[]>> => {
  return await httpGet<StockBalanceModel[]>(`/${apiEndPoint}/byItem/${itemId}`, {});
};

// Get current balance
export const getCurrentBalance = async (itemId: string, packingUnitId: string, branchId: string): Promise<ApiResult<StockBalanceModel>> => {
  return await httpGet<StockBalanceModel>(`/${apiEndPoint}/currentBalance`, { itemId, packingUnitId, branchId });
};

// Update stock balance quantity
export const updateStockBalanceQuantity = async (data: UpdateStockBalanceQuantityRequest): Promise<ApiResult<StockBalanceModel>> => {
  return await httpPost<StockBalanceModel>(`/${apiEndPoint}/updateStockBalance`, data);
}; 