import { ApiResult } from "../../interfaces/ApiResponse";
import { httpDelete, httpGet, httpPost, httpPut } from "../Axios/axiosMethods";
import PackingUnitModel from "../../interfaces/ProjectInterfaces/Inventory/PackingUnits/PackingUnitModel";


const apiEndPoint = "PackingUnits";
// GET all currencies
const getPackingUnits = async (): Promise<ApiResult<PackingUnitModel[]>> => {
  return await httpGet<PackingUnitModel[]>(apiEndPoint, {});
};

// GET a single currency by ID
const getPackingUnitById = async (
  id: string
): Promise<ApiResult<PackingUnitModel>> => {
  return await httpGet<PackingUnitModel>(`${apiEndPoint}/${id}`, {});
};

// POST (Create) a new currency
const createPackingUnit = async (
  data: PackingUnitModel
): Promise<ApiResult<PackingUnitModel>> => {
  return await httpPost<PackingUnitModel>(apiEndPoint, data);
};

// PUT (Update) a currency
const updatePackingUnit = async (
  id: string,
  data: PackingUnitModel
): Promise<ApiResult<PackingUnitModel>> => {
  return await httpPut<PackingUnitModel>(`${apiEndPoint}/${id}`, data);
};

// DELETE a currency by ID
const deletePackingUnit = async (
  id: string
): Promise<ApiResult<PackingUnitModel>> => {
  return await httpDelete<PackingUnitModel>(`${apiEndPoint}/${id}`, { id });
};

export {
  getPackingUnits,
  getPackingUnitById,
  createPackingUnit,
  updatePackingUnit,
  deletePackingUnit,
};
