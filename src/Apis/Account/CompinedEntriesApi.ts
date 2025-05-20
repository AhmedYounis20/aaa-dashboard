import { ApiResult } from "../../interfaces/ApiResponse";
import { httpDelete, httpGet, httpPost, httpPut } from "../Axios/axiosMethods";
import ComplexEntryModel from "../../interfaces/ProjectInterfaces/Account/Entries/ComplexEntry";

const apiEndPoint = "compinedEntries";
// GET all currencies
const getCompinedEntries = async (): Promise<ApiResult<
  ComplexEntryModel[]
> | null> => {
  return await httpGet<ComplexEntryModel[]>(apiEndPoint, {});
};

// GET a single currency by ID
const getCompinedEntryById = async (
  id: string
): Promise<ApiResult<ComplexEntryModel>> => {
  return await httpGet<ComplexEntryModel>(`${apiEndPoint}/${id}`, {});
};

// POST (Create) a new currency
const createCompinedEntry = async (
  data: ComplexEntryModel
): Promise<ApiResult<ComplexEntryModel>> => {
  return await httpPost<ComplexEntryModel>(apiEndPoint, data);
};

// PUT (Update) a currency
const updateCompinedEntry = async (
  id: string,
  data: ComplexEntryModel
): Promise<ApiResult<ComplexEntryModel>> => {
  return await httpPut<ComplexEntryModel>(`${apiEndPoint}/${id}`, data);
};

// DELETE a currency by ID
const deleteCompinedEntry = async (
  id: string
): Promise<ApiResult<ComplexEntryModel>> => {
  return await httpDelete<ComplexEntryModel>(`${apiEndPoint}/${id}`, { id });
};

export {
  getCompinedEntries,
  getCompinedEntryById,
  createCompinedEntry,
  updateCompinedEntry,
  deleteCompinedEntry,
};
