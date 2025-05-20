import { ApiResult } from "../../interfaces/ApiResponse";
import { httpDelete, httpGet, httpPost, httpPut } from "../Axios/axiosMethods";
import ManufacturerCompanyModel from "../../interfaces/ProjectInterfaces/Inventory/ManufacturerCompanies/ManufacturerCompanyModel";


const apiEndPoint = "ManufacturerCompanies";
// GET all currencies
const getManufacturerCompanies = async (): Promise<ApiResult<ManufacturerCompanyModel[]>> => {
  return await httpGet<ManufacturerCompanyModel[]>(apiEndPoint, {});
};

// GET a single currency by ID
const getManufacturerCompanyById = async (
  id: string
): Promise<ApiResult<ManufacturerCompanyModel>> => {
  return await httpGet<ManufacturerCompanyModel>(`${apiEndPoint}/${id}`, {});
};

// POST (Create) a new currency
const createManufacturerCompany = async (
  data: ManufacturerCompanyModel
): Promise<ApiResult<ManufacturerCompanyModel>> => {
  return await httpPost<ManufacturerCompanyModel>(apiEndPoint, data);
};

// PUT (Update) a currency
const updateManufacturerCompany = async (
  id: string,
  data: ManufacturerCompanyModel
): Promise<ApiResult<ManufacturerCompanyModel>> => {
  return await httpPut<ManufacturerCompanyModel>(`${apiEndPoint}/${id}`, data);
};

// DELETE a currency by ID
const deleteManufacturerCompany = async (
  id: string
): Promise<ApiResult<ManufacturerCompanyModel>> => {
  return await httpDelete<ManufacturerCompanyModel>(`${apiEndPoint}/${id}`, { id });
};

export {
  getManufacturerCompanies,
  getManufacturerCompanyById,
  createManufacturerCompany,
  updateManufacturerCompany,
  deleteManufacturerCompany,
};
