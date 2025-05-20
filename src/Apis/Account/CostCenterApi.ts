import { CostCenterModel } from "../../interfaces/ProjectInterfaces/Account/CostCenters/costCenterModel";
import { ApiResult } from "../../interfaces/ApiResponse";
import { httpDelete, httpGet, httpPost, httpPut } from "../Axios/axiosMethods";

const apiEndPoint = "costCenters";
// GET all currencies
const getCostCenters = async (): Promise<ApiResult<
  CostCenterModel[]
>> => {
  return await httpGet<CostCenterModel[]>(apiEndPoint, {});
};

// GET a single currency by ID
const getCostCenterById = async (
  id: string
): Promise<ApiResult<object>> => {
  return await httpGet<object>(`${apiEndPoint}/${id}`, {});
};


// POST (Create) a new currency
const createCostCenter = async (
  data: CostCenterModel
): Promise<ApiResult<CostCenterModel>> => {
  return await httpPost<CostCenterModel>(apiEndPoint, data);
};

// PUT (Update) a currency
const updateCostCenter = async (
  id: string,
  data: CostCenterModel
): Promise<ApiResult<CostCenterModel>> => {
  return await httpPut<CostCenterModel>(`${apiEndPoint}/${id}`, data);
};

// DELETE a currency by ID
const deleteCostCenter = async (
  id: string
): Promise<ApiResult<CostCenterModel>> => {
  return await httpDelete<CostCenterModel>(`${apiEndPoint}/${id}`, { id });
};
export {
  getCostCenters,
  getCostCenterById,
  createCostCenter,
  updateCostCenter,
  deleteCostCenter,
}; 
