import { ApiResult } from "@/interfaces/ApiResponse";
import {
  httpDelete,
  httpGet,
  httpPost,
  httpPut,
  legacyMutationNotify,
} from "../Axios/axiosMethods";
import ComplexEntryModel from "@/interfaces/ProjectInterfaces/Account/Entries/ComplexEntry";

const apiEndPoint = "paymentEntries";
// GET all currencies
const getPaymentEntries = async (): Promise<ApiResult<ComplexEntryModel[]> | null> => {
  return await httpGet<ComplexEntryModel[]>(apiEndPoint, {});
};

// GET a single currency by ID
const getPaymentEntryById = async (id: string): Promise<ApiResult<ComplexEntryModel> | null> => {
  return await httpGet<ComplexEntryModel>(`${apiEndPoint}/${id}`, {});
};

// POST (Create) a new currency
const createPaymentEntry = async (
  data: ComplexEntryModel
): Promise<ApiResult<ComplexEntryModel> | null> => {
  return await httpPost<ComplexEntryModel>(apiEndPoint, data, legacyMutationNotify);
};

// PUT (Update) a currency
const updatePaymentEntry = async (
  id: string,
  data: ComplexEntryModel
): Promise<ApiResult<ComplexEntryModel> | null> => {
  return await httpPut<ComplexEntryModel>(`${apiEndPoint}/${id}`, data, legacyMutationNotify);
};

// DELETE a currency by ID
const deletePaymentEntry = async (id: string): Promise<ApiResult<ComplexEntryModel> | null> => {
  return await httpDelete<ComplexEntryModel>(`${apiEndPoint}/${id}`, { id }, legacyMutationNotify);
};

export {
  getPaymentEntries,
  getPaymentEntryById,
  createPaymentEntry,
  updatePaymentEntry,
  deletePaymentEntry,
};
