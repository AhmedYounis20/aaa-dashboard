import { ApiResult } from "../../interfaces/ApiResponse";
import { httpDelete, httpGet, httpPost, httpPut } from "../Axios/axiosMethods";
import CurrencyModel from "../../interfaces/ProjectInterfaces/Account/Currencies/CurrencyModel";

const apiEndPoint = "currencies";

// GET all currencies
const getCurrencies = async (): Promise<ApiResult<CurrencyModel[]>> => {
  return await httpGet<CurrencyModel[]>(apiEndPoint, {});
};

// GET a single currency by ID
const getCurrencyById = async (
  id: string
): Promise<ApiResult<CurrencyModel>> => {
  return await httpGet<CurrencyModel>(`${apiEndPoint}/${id}`, {});
};

// CREATE a new currency
const createCurrency = async (
  data: CurrencyModel
): Promise<ApiResult<CurrencyModel>> => {
  return await httpPost<CurrencyModel>(apiEndPoint, data);
};

// UPDATE a currency
const updateCurrency = async (
  id: string,
  data: CurrencyModel
): Promise<ApiResult<CurrencyModel>> => {
  return await httpPut<CurrencyModel>(`${apiEndPoint}/${id}`, data);
};

// DELETE a currency
const deleteCurrency = async (
  id: string
): Promise<ApiResult<CurrencyModel>> => {
  return await httpDelete<CurrencyModel>(`${apiEndPoint}/${id}`, {});
};

export {
  getCurrencies,
  getCurrencyById,
  createCurrency,
  updateCurrency,
  deleteCurrency,
};