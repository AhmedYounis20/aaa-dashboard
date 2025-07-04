import { ApiResult } from "../../interfaces/ApiResponse";
import BranchModel from "../../interfaces/ProjectInterfaces/Account/Subleadgers/Branches/BranchModel";
import { httpDelete, httpGet, httpPost, httpPut } from "../Axios/axiosMethods";

const apiEndPoint = "branches";

// GET all branches
const getBranches = async (): Promise<ApiResult<BranchModel[]>> => {
  return await httpGet<BranchModel[]>(apiEndPoint, {});
};

// GET a single branch by ID
const getBranchById = async (
  id: string
): Promise<ApiResult<BranchModel>> => {
  return await httpGet<BranchModel>(`${apiEndPoint}/${id}`, {});
};

// GET default model data
const getDefaultBranchData = async (
  parentId: string | null
): Promise<ApiResult<BranchModel>> => {
  return await httpGet<BranchModel>(
    `${apiEndPoint}/NextAccountDefaultData${
      parentId == null ? "" : `?parentId=${parentId}`
    }`,
    {}
  );
};

// POST (Create) a new branch
const createBranch = async (
  model: BranchModel
): Promise<ApiResult<BranchModel>> => {
  return await httpPost<BranchModel>(apiEndPoint, model);
};

// PUT (Update) a branch
const updateBranch = async (
  id: string,
  model: BranchModel
): Promise<ApiResult<BranchModel>> => {
  return await httpPut<BranchModel>(`${apiEndPoint}/${id}`, model);
};

// DELETE a branch by ID
const deleteBranch = async (
  id: string
): Promise<ApiResult<BranchModel>> => {
  return await httpDelete<BranchModel>(`${apiEndPoint}/${id}`, {});
};

export {
  getBranches,
  getBranchById,
  getDefaultBranchData,
  createBranch,
  updateBranch,
  deleteBranch
};