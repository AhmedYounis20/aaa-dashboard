import { AccountGuideModel } from "../../interfaces/ProjectInterfaces";
import { ApiResult } from "../../interfaces/ApiResponse";
import { httpDelete, httpGet, httpPost, httpPut } from "../Axios/axiosMethods";
import { PaginatedResponse, PaginationParams } from "../../interfaces/Pagination";

const apiEndPoint = "AccountGuides";

// GET all currencies
const getAccountGuides = async (): Promise<ApiResult<AccountGuideModel[]> | null> => {
  return await httpGet<AccountGuideModel[]>(apiEndPoint, {});
};

// GET paginated account guides
const getAccountGuidesPaginated = async (
  params: PaginationParams
): Promise<ApiResult<PaginatedResponse<AccountGuideModel>> | null> => {
  return await httpGet<PaginatedResponse<AccountGuideModel>>(
    `${apiEndPoint}/paginated`,
    params
  );
};

// GET a single currency by ID
const getAccountGuideById = async (
  id: string
): Promise<ApiResult<AccountGuideModel> | null> => {
  return await httpGet<AccountGuideModel>(`${apiEndPoint}/${id}`, {});
};

// POST (Create) a new currency
const createAccountGuide = async (
  data: AccountGuideModel
): Promise<ApiResult<AccountGuideModel> | null> => {
  return await httpPost<AccountGuideModel>(apiEndPoint, data);
};

// PUT (Update) a currency
const updateAccountGuide = async (
  id: string,
  data: AccountGuideModel
): Promise<ApiResult<AccountGuideModel> | null> => {
  return await httpPut<AccountGuideModel>(`${apiEndPoint}/${id}`, data);
};

// DELETE a currency by ID
const deleteAccountGuide = async (
  id: string
): Promise<ApiResult<AccountGuideModel> | null> => {
  return await httpDelete<AccountGuideModel>(`${apiEndPoint}/${id}`, { id });
};

export { getAccountGuides, getAccountGuidesPaginated, getAccountGuideById, createAccountGuide, updateAccountGuide, deleteAccountGuide }
