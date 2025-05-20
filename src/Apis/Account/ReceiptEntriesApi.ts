import { ApiResult } from "../../interfaces/ApiResponse";
import { httpDelete, httpGet, httpPost, httpPut } from "../Axios/axiosMethods";
import ComplexEntryModel from "../../interfaces/ProjectInterfaces/Account/Entries/ComplexEntry";

const apiEndPoint = "receiptEntries";
// GET all currencies
const getReceiptEntries = async (): Promise<ApiResult<
  ComplexEntryModel[]
> | null> => {
  return await httpGet<ComplexEntryModel[]>(apiEndPoint, {});
};

// GET a single currency by ID
const getReceiptEntryById = async (
  id: string
): Promise<ApiResult<ComplexEntryModel> | null> => {
  return await httpGet<ComplexEntryModel>(`${apiEndPoint}/${id}`, {});
};

// POST (Create) a new currency
const createReceiptEntry = async (
  data: ComplexEntryModel
): Promise<ApiResult<ComplexEntryModel> | null> => {
  return await httpPost<ComplexEntryModel>(apiEndPoint, data);
};

// PUT (Update) a currency
const updateReceiptEntry = async (
  id: string,
  data: ComplexEntryModel
): Promise<ApiResult<ComplexEntryModel> | null> => {
  return await httpPut<ComplexEntryModel>(`${apiEndPoint}/${id}`, data);
};

// DELETE a currency by ID
const deleteReceiptEntry = async (
  id: string
): Promise<ApiResult<ComplexEntryModel> | null> => {
  return await httpDelete<ComplexEntryModel>(`${apiEndPoint}/${id}`, { id });
};

export {
  getReceiptEntries,
  getReceiptEntryById,
  createReceiptEntry,
  updateReceiptEntry,
  deleteReceiptEntry,
};
