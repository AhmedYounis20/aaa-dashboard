import { ApiResult } from "../../interfaces/ApiResponse";
import { httpDelete, httpGet, httpPost, httpPut } from "../Axios/axiosMethods";
import CashInBoxModel from "../../interfaces/ProjectInterfaces/Account/Subleadgers/CashInBoxes/CashInBoxModel";

const apiEndPoint = "cashInBoxes";

// GET all cash in boxes
const getCashInBoxes = async (): Promise<ApiResult<CashInBoxModel[]>> => {
  return await httpGet<CashInBoxModel[]>(apiEndPoint, {});
};

// GET a single cash in box by ID
const getCashInBoxById = async (
  id: string
): Promise<ApiResult<CashInBoxModel>> => {
  return await httpGet<CashInBoxModel>(`${apiEndPoint}/${id}`, {});
};

// GET default model data (for add form)
const getDefaultCashInBox = async (
  parentId: string | null
): Promise<ApiResult<CashInBoxModel> | null> => {
  return await httpGet<CashInBoxModel>(
    `${apiEndPoint}/NextAccountDefaultData${
      parentId == null ? "" : `?parentId=${parentId}`
    }`,
    {}
  );
};

// CREATE a new cash in box
const createCashInBox = async (
  data: CashInBoxModel
): Promise<ApiResult<CashInBoxModel>> => {
  return await httpPost<CashInBoxModel>(apiEndPoint, data);
};

// UPDATE a cash in box
const updateCashInBox = async (
  id: string,
  data: CashInBoxModel
): Promise<ApiResult<CashInBoxModel>> => {
  return await httpPut<CashInBoxModel>(`${apiEndPoint}/${id}`, data);
};

// DELETE a cash in box
const deleteCashInBox = async (
  id: string
): Promise<ApiResult<CashInBoxModel>> => {
  return await httpDelete<CashInBoxModel>(`${apiEndPoint}/${id}`, {});
};

export {
  getCashInBoxes,
  getCashInBoxById,
  getDefaultCashInBox,
  createCashInBox,
  updateCashInBox,
  deleteCashInBox,
};