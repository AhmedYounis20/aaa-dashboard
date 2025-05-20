import { ApiResult } from "../../interfaces/ApiResponse";
import { httpDelete, httpGet, httpPost, httpPut } from "../Axios/axiosMethods";
import SellingPriceModel from "../../interfaces/ProjectInterfaces/Inventory/SellingPrices/SellingPriceModel";


const apiEndPoint = "SellingPrices";
// GET all currencies
const getSellingPrices = async (): Promise<ApiResult<SellingPriceModel[]>> => {
  return await httpGet<SellingPriceModel[]>(apiEndPoint, {});
};

// GET a single currency by ID
const getSellingPriceById = async (
  id: string
): Promise<ApiResult<SellingPriceModel>> => {
  return await httpGet<SellingPriceModel>(`${apiEndPoint}/${id}`, {});
};

// POST (Create) a new currency
const createSellingPrice = async (
  data: SellingPriceModel
): Promise<ApiResult<SellingPriceModel>> => {
  return await httpPost<SellingPriceModel>(apiEndPoint, data);
};

// PUT (Update) a currency
const updateSellingPrice = async (
  id: string,
  data: SellingPriceModel
): Promise<ApiResult<SellingPriceModel>> => {
  return await httpPut<SellingPriceModel>(`${apiEndPoint}/${id}`, data);
};

// DELETE a currency by ID
const deleteSellingPrice = async (
  id: string
): Promise<ApiResult<SellingPriceModel>> => {
  return await httpDelete<SellingPriceModel>(`${apiEndPoint}/${id}`, { id });
};

export {
  getSellingPrices,
  getSellingPriceById,
  createSellingPrice,
  updateSellingPrice,
  deleteSellingPrice,
};
