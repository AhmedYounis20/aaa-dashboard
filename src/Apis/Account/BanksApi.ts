import { ApiResult } from "../../interfaces/ApiResponse";
import { httpDelete, httpGet, httpPost, httpPut } from "../Axios/axiosMethods";
import BankModel from "../../interfaces/ProjectInterfaces/Account/Subleadgers/Banks/BankModel";

const apiEndPoint = "banks";

// GET all banks
const getBanks = async (): Promise<ApiResult<BankModel[]>> => {
  return await httpGet<BankModel[]>(apiEndPoint, {});
};

// GET a single bank by ID
const getBankById = async (
  id: string
): Promise<ApiResult<BankModel>> => {
  return await httpGet<BankModel>(`${apiEndPoint}/${id}`, {});
};

// GET default model data (for add form)
const getDefaultBank = async (
  parentId: string | null
): Promise<ApiResult<BankModel> | null> => {
  return await httpGet<BankModel>(
    `${apiEndPoint}/NextAccountDefaultData${
      parentId == null ? "" : `?parentId=${parentId}`
    }`,
    {}
  );
};

// CREATE a new bank
const createBank = async (
  data: BankModel
): Promise<ApiResult<BankModel>> => {
  return await httpPost<BankModel>(apiEndPoint, data);
};

// UPDATE a bank
const updateBank = async (
  id: string,
  data: BankModel
): Promise<ApiResult<BankModel>> => {
  return await httpPut<BankModel>(`${apiEndPoint}/${id}`, data);
};

// DELETE a bank
const deleteBank = async (
  id: string
): Promise<ApiResult<BankModel>> => {
  return await httpDelete<BankModel>(`${apiEndPoint}/${id}`, {});
};

export {
  getBanks,
  getBankById,
  getDefaultBank,
  createBank,
  updateBank,
  deleteBank,
};