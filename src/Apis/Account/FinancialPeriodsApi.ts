import { ApiResult } from "../../interfaces/ApiResponse";
import { httpDelete, httpGet, httpPost, httpPut } from "../Axios/axiosMethods";
import FinancialPeriodModel from "../../interfaces/ProjectInterfaces/Account/FinancialPeriods/FinancialPeriodModel";

const apiEndPoint = "FinancialPeriods";

// GET all financial periods
const getFinancialPeriods = async (): Promise<ApiResult<FinancialPeriodModel[]>> => {
  return await httpGet<FinancialPeriodModel[]>(apiEndPoint, {});
};

// GET a single financial period by ID
const getFinancialPeriodById = async (
  id: string
): Promise<ApiResult<FinancialPeriodModel>> => {
  return await httpGet<FinancialPeriodModel>(`${apiEndPoint}/${id}`, {});
};

const getDefaultFinancialPeriodData = async (
): Promise<ApiResult<FinancialPeriodModel>> => {
  return await httpGet<FinancialPeriodModel>(
    `${apiEndPoint}/nextDefaultdata`,
    {}
  );
};
// POST (Create) a new financial period
const createFinancialPeriod = async (
  data: FinancialPeriodModel
): Promise<ApiResult<FinancialPeriodModel>> => {
  return await httpPost<FinancialPeriodModel>(apiEndPoint, data);
};

// PUT (Update) a financial period
const updateFinancialPeriod = async (
  id: string,
  data: FinancialPeriodModel
): Promise<ApiResult<FinancialPeriodModel>> => {
  return await httpPut<FinancialPeriodModel>(`${apiEndPoint}/${id}`, data);
};

// DELETE a financial period by ID
const deleteFinancialPeriod = async (
  id: string
): Promise<ApiResult<FinancialPeriodModel>> => {
  return await httpDelete<FinancialPeriodModel>(`${apiEndPoint}/${id}`, { id });
};

export {
  getFinancialPeriods,
  getFinancialPeriodById,
  createFinancialPeriod,
  updateFinancialPeriod,
  deleteFinancialPeriod,
  getDefaultFinancialPeriodData
};