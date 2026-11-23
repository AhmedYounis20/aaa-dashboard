import { ApiResult } from "@/interfaces/ApiResponse";
import BranchModel from "@/interfaces/ProjectInterfaces/Account/SubLedgers/Branches/BranchModel";
import {
  httpDelete,
  httpGet,
  httpPost,
  httpPut,
  legacyMutationNotify,
} from "../Axios/axiosMethods";

const apiEndPoint = "branches";

const getBranches = async (signal?: AbortSignal): Promise<ApiResult<BranchModel[]>> => {
  return await httpGet<BranchModel[]>(apiEndPoint, {}, { signal });
};

const getBranchById = async (id: string, signal?: AbortSignal): Promise<ApiResult<BranchModel>> => {
  return await httpGet<BranchModel>(`${apiEndPoint}/${id}`, {}, { signal });
};

const getDefaultBranchData = async (
  parentId: string | null,
  signal?: AbortSignal
): Promise<ApiResult<BranchModel>> => {
  return await httpGet<BranchModel>(
    `${apiEndPoint}/NextAccountDefaultData${parentId == null ? "" : `?parentId=${parentId}`}`,
    {},
    { signal }
  );
};

const createBranch = async (model: BranchModel): Promise<ApiResult<BranchModel>> => {
  return await httpPost<BranchModel>(apiEndPoint, model, legacyMutationNotify);
};

const updateBranch = async (id: string, model: BranchModel): Promise<ApiResult<BranchModel>> => {
  return await httpPut<BranchModel>(`${apiEndPoint}/${id}`, model, legacyMutationNotify);
};

const deleteBranch = async (id: string): Promise<ApiResult<BranchModel>> => {
  return await httpDelete<BranchModel>(`${apiEndPoint}/${id}`, {}, legacyMutationNotify);
};

export {
  getBranches,
  getBranchById,
  getDefaultBranchData,
  createBranch,
  updateBranch,
  deleteBranch,
};
