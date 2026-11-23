import { ChartOfAccountModel } from "@/interfaces/ProjectInterfaces";
import { ApiResult } from "@/interfaces/ApiResponse";
import {
  httpDelete,
  httpGet,
  httpPost,
  httpPut,
  legacyMutationNotify,
} from "../Axios/axiosMethods";

const apiEndPoint = "ChartOfAccounts";

const getChartOfAccounts = async (
  signal?: AbortSignal
): Promise<ApiResult<ChartOfAccountModel[]>> => {
  return await httpGet<ChartOfAccountModel[]>(apiEndPoint, {}, { signal });
};

const getChartOfAccountById = async (
  id: string,
  signal?: AbortSignal
): Promise<ApiResult<ChartOfAccountModel> | null> => {
  return await httpGet<ChartOfAccountModel>(`${apiEndPoint}/${id}`, {}, { signal });
};

const getDefaultChartOfAccount = async (
  parentId: string | null,
  signal?: AbortSignal
): Promise<ApiResult<ChartOfAccountModel>> => {
  return await httpGet<ChartOfAccountModel>(
    `${apiEndPoint}/NextAccountDefaultData${parentId == null ? "" : `?parentId=${parentId}`}`,
    {},
    { signal }
  );
};

const createChartOfAccount = async (
  data: ChartOfAccountModel
): Promise<ApiResult<ChartOfAccountModel>> => {
  return await httpPost<ChartOfAccountModel>(apiEndPoint, data, legacyMutationNotify);
};

const updateChartOfAccount = async (
  id: string,
  data: ChartOfAccountModel
): Promise<ApiResult<ChartOfAccountModel>> => {
  return await httpPut<ChartOfAccountModel>(`${apiEndPoint}/${id}`, data, legacyMutationNotify);
};

const deleteChartOfAccount = async (id: string): Promise<ApiResult<ChartOfAccountModel>> => {
  return await httpDelete<ChartOfAccountModel>(
    `${apiEndPoint}/${id}`,
    { id },
    legacyMutationNotify
  );
};

export {
  getChartOfAccounts,
  getChartOfAccountById,
  createChartOfAccount,
  updateChartOfAccount,
  deleteChartOfAccount,
  getDefaultChartOfAccount,
};
