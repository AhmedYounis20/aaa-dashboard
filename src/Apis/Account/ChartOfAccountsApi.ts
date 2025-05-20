import { ChartOfAccountModel } from "../../interfaces/ProjectInterfaces";
import { ApiResult } from "../../interfaces/ApiResponse";
import { httpDelete, httpGet, httpPost, httpPut } from "../Axios/axiosMethods";

const apiEndPoint = "ChartOfAccounts";
// GET all currencies
const getChartOfAccounts = async (): Promise<ApiResult<
  ChartOfAccountModel[]
> | null> => {
  return await httpGet<ChartOfAccountModel[]>(apiEndPoint, {});
};

// GET a single currency by ID
const getChartOfAccountById = async (
  id: string
): Promise<ApiResult<ChartOfAccountModel> | null> => {
  return await httpGet<ChartOfAccountModel>(`${apiEndPoint}/${id}`, {});
};

const getDefaultChartOfAccount = async (
  parentId: string | null
): Promise<ApiResult<ChartOfAccountModel> | null> => {
  return await httpGet<ChartOfAccountModel>(
    `${apiEndPoint}/NextAccountDefaultData${
      parentId == null ? "" : `?parentId=${parentId}`
    }`,
    {}
  );
};

// POST (Create) a new currency
const createChartOfAccount = async (
  data: ChartOfAccountModel
): Promise<ApiResult<ChartOfAccountModel> | null> => {
  return await httpPost<ChartOfAccountModel>(apiEndPoint, data);
};

// PUT (Update) a currency
const updateChartOfAccount = async (
  id: string,
  data: ChartOfAccountModel
): Promise<ApiResult<ChartOfAccountModel> | null> => {
  return await httpPut<ChartOfAccountModel>(`${apiEndPoint}/${id}`, data);
};

// DELETE a currency by ID
const deleteChartOfAccount = async (
  id: string
): Promise<ApiResult<ChartOfAccountModel> | null> => {
  return await httpDelete<ChartOfAccountModel>(`${apiEndPoint}/${id}`, { id });
};

export {
  getChartOfAccounts,
  getChartOfAccountById,
  createChartOfAccount,
  updateChartOfAccount,
  deleteChartOfAccount,
  getDefaultChartOfAccount
};
