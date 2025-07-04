import { ApiResult } from "../../interfaces/ApiResponse";
import { httpDelete, httpGet, httpPost, httpPut } from "../Axios/axiosMethods";
import SupplierModel from "../../interfaces/ProjectInterfaces/Account/Subleadgers/Suppliers/SupplierModel";

const apiEndPoint = "Suppliers";

// GET all suppliers
const getSuppliers = async (): Promise<ApiResult<SupplierModel[]>> => {
  return await httpGet<SupplierModel[]>(apiEndPoint, {});
};

// GET a single supplier by ID
const getSupplierById = async (
  id: string
): Promise<ApiResult<SupplierModel>> => {
  return await httpGet<SupplierModel>(`${apiEndPoint}/${id}`, {});
};

const getDefaultSupplier = async (
  parentId: string | null
): Promise<ApiResult<SupplierModel>> => {
  return await httpGet<SupplierModel>(
    `${apiEndPoint}/NextAccountDefaultData${
      parentId == null ? "" : `?parentId=${parentId}`
    }`,
    {}
  );
};

// POST (Create) a new supplier
const createSupplier = async (
  data: SupplierModel
): Promise<ApiResult<SupplierModel>> => {
  return await httpPost<SupplierModel>(apiEndPoint, data);
};

// PUT (Update) a supplier
const updateSupplier = async (
  id: string,
  data: SupplierModel
): Promise<ApiResult<SupplierModel>> => {
  return await httpPut<SupplierModel>(`${apiEndPoint}/${id}`, data);
};

// DELETE a supplier by ID
const deleteSupplier = async (
  id: string
): Promise<ApiResult<SupplierModel>> => {
  return await httpDelete<SupplierModel>(`${apiEndPoint}/${id}`, { id });
};

export {
  getSupplierById,
  getSuppliers,
  createSupplier,
  updateSupplier,
  deleteSupplier,
  getDefaultSupplier
};