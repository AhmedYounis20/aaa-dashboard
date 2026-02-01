import { ApiResult } from "../../interfaces/ApiResponse";
import { httpDelete, httpGet, httpPost, httpPut } from "../Axios/axiosMethods";
import {TaxModel,TaxInputModel} from "../../interfaces/ProjectInterfaces/Account/Subleadgers/Taxes/TaxModel";

const apiEndPoint = "taxes";

// GET all taxes
const getTaxes = async (): Promise<ApiResult<TaxModel[]>> => {
  return await httpGet<TaxModel[]>(apiEndPoint, {});
};

// GET a single tax by ID
const getTaxById = async (
  id: string
): Promise<ApiResult<TaxModel>> => {
  return await httpGet<TaxModel>(`${apiEndPoint}/${id}`, {});
};

// GET default model data for Category (uses parentId)
const getDefaultTax = async (
  parentId: string | null
): Promise<ApiResult<TaxModel> | null> => {
  return await httpGet<TaxModel>(
    `${apiEndPoint}/NextAccountDefaultData${
      parentId == null ? "" : `?parentId=${parentId}`
    }`,
    {}
  );
};

// CREATE a new tax
const createTax = async (
  data: TaxInputModel
): Promise<ApiResult<TaxModel>> => {
  return await httpPost<TaxModel>(apiEndPoint, data);
};

// UPDATE a tax
const updateTax = async (
  id: string,
  data: TaxInputModel
): Promise<ApiResult<TaxModel>> => {
  return await httpPut<TaxModel>(`${apiEndPoint}/${id}`, data);
};

// DELETE a tax
const deleteTax = async (
  id: string
): Promise<ApiResult<TaxModel>> => {
  return await httpDelete<TaxModel>(`${apiEndPoint}/${id}`, {});
};

export {
  getTaxes,
  getTaxById,
  getDefaultTax,
  createTax,
  updateTax,
  deleteTax,
};
