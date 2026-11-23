import { ApiResult } from "@/interfaces/ApiResponse";
import {
  httpGet,
  httpPost,
  httpPut,
  httpDelete,
  legacyMutationNotify,
} from "../Axios/axiosMethods";

export interface StockBalanceModel {
  id: string;
  variantId: string;
  variantName?: string;
  variantCode?: string;
  productName?: string;
  packingUnitId: string;
  packingUnitName?: string;
  branchId: string;
  branchName?: string;
  currentBalance: number;
  minimumBalance: number;
  maximumBalance: number;
  unitCost: number;
  totalCost: number;
  lastUpdated?: Date;
}

export interface CreateStockBalanceRequest {
  variantId: string;
  packingUnitId: string;
  branchId: string;
  currentBalance: number;
  minimumBalance: number;
  maximumBalance: number;
  unitCost: number;
  totalCost: number;
}

export interface UpdateStockBalanceRequest {
  variantId: string;
  packingUnitId: string;
  branchId: string;
  currentBalance: number;
  minimumBalance: number;
  maximumBalance: number;
  unitCost: number;
  totalCost: number;
}

export interface UpdateStockBalanceQuantityRequest {
  variantId: string;
  packingUnitId: string;
  branchId: string;
  quantity: number;
  unitCost: number;
  isReceipt: boolean;
}

const apiEndPoint = "StockBalances";

export const getStockBalances = async (): Promise<ApiResult<StockBalanceModel[]>> => {
  return await httpGet<StockBalanceModel[]>(apiEndPoint, {});
};

export const getStockBalanceById = async (id: string): Promise<ApiResult<StockBalanceModel>> => {
  return await httpGet<StockBalanceModel>(`/${apiEndPoint}/${id}`, {});
};

export const createStockBalance = async (
  data: CreateStockBalanceRequest
): Promise<ApiResult<StockBalanceModel>> => {
  return await httpPost<StockBalanceModel>(apiEndPoint, data, legacyMutationNotify);
};

export const updateStockBalance = async (
  id: string,
  data: UpdateStockBalanceRequest
): Promise<ApiResult<StockBalanceModel>> => {
  return await httpPut<StockBalanceModel>(`/${apiEndPoint}/${id}`, data, legacyMutationNotify);
};

export const deleteStockBalance = async (id: string): Promise<ApiResult<boolean>> => {
  return await httpDelete<boolean>(`/${apiEndPoint}/${id}`, {}, legacyMutationNotify);
};

export const getStockBalanceByVariantAndBranch = async (
  variantId: string,
  branchId: string
): Promise<ApiResult<StockBalanceModel[]>> => {
  return await httpGet<StockBalanceModel[]>(`/${apiEndPoint}/byVariantAndBranch`, {
    variantId,
    branchId,
  });
};

export const getStockBalanceByVariantPackingUnitAndBranch = async (
  variantId: string,
  packingUnitId: string,
  branchId: string
): Promise<ApiResult<StockBalanceModel[]>> => {
  return await httpGet<StockBalanceModel[]>(`/${apiEndPoint}/byVariantPackingUnitAndBranch`, {
    variantId,
    packingUnitId,
    branchId,
  });
};

export const getStockBalancesByBranch = async (
  branchId: string
): Promise<ApiResult<StockBalanceModel[]>> => {
  return await httpGet<StockBalanceModel[]>(`/${apiEndPoint}/byBranch/${branchId}`, {});
};

export const getStockBalancesByVariant = async (
  variantId: string
): Promise<ApiResult<StockBalanceModel[]>> => {
  return await httpGet<StockBalanceModel[]>(`/${apiEndPoint}/byVariant/${variantId}`, {});
};

/** Backend returns ApiResponse&lt;decimal&gt; — result is a number, not a StockBalanceModel. */
export const getCurrentBalance = async (
  variantId: string,
  packingUnitId: string,
  branchId: string
): Promise<ApiResult<number>> => {
  return await httpGet<number>(`/${apiEndPoint}/currentBalance`, {
    variantId,
    packingUnitId,
    branchId,
  });
};

/** Normalize current-balance API payloads (number or legacy object). */
export function readCurrentBalanceAmount(
  result: number | { currentBalance?: number } | null | undefined
): number {
  if (typeof result === "number" && Number.isFinite(result)) {
    return result;
  }
  if (result && typeof result === "object" && typeof result.currentBalance === "number") {
    return result.currentBalance;
  }
  return 0;
}

export const updateStockBalanceQuantity = async (
  data: UpdateStockBalanceQuantityRequest
): Promise<ApiResult<StockBalanceModel>> => {
  return await httpPost<StockBalanceModel>(
    `/${apiEndPoint}/updateStockBalance`,
    data,
    legacyMutationNotify
  );
};
