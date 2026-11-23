import { CostCenterModel } from "@/interfaces/ProjectInterfaces/Account/CostCenters/costCenterModel";
import { ApiResult } from "@/interfaces/ApiResponse";
import {
  httpDelete,
  httpGet,
  httpPost,
  httpPut,
  legacyMutationNotify,
} from "../Axios/axiosMethods";

const apiEndPoint = "costCenters";

const getCostCenters = async (signal?: AbortSignal): Promise<ApiResult<CostCenterModel[]>> => {
  return await httpGet<CostCenterModel[]>(apiEndPoint, {}, { signal });
};

const getCostCenterById = async (id: string, signal?: AbortSignal): Promise<ApiResult<object>> => {
  return await httpGet<object>(`${apiEndPoint}/${id}`, {}, { signal });
};

const createCostCenter = async (data: CostCenterModel): Promise<ApiResult<CostCenterModel>> => {
  return await httpPost<CostCenterModel>(apiEndPoint, data, legacyMutationNotify);
};

const updateCostCenter = async (
  id: string,
  data: CostCenterModel
): Promise<ApiResult<CostCenterModel>> => {
  return await httpPut<CostCenterModel>(`${apiEndPoint}/${id}`, data, legacyMutationNotify);
};

const deleteCostCenter = async (id: string): Promise<ApiResult<CostCenterModel>> => {
  return await httpDelete<CostCenterModel>(`${apiEndPoint}/${id}`, { id }, legacyMutationNotify);
};

export { getCostCenters, getCostCenterById, createCostCenter, updateCostCenter, deleteCostCenter };
