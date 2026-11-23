import EntryModel from "@/interfaces/ProjectInterfaces/Account/Entries/Entry";
import { ApiResult } from "@/interfaces/ApiResponse";
import {
  httpDelete,
  httpGet,
  httpPost,
  httpPut,
  legacyMutationNotify,
} from "../Axios/axiosMethods";

const apiEndPoint = "openingEntries";
// GET all currencies
const getOpeningEntries = async (): Promise<ApiResult<EntryModel[]> | null> => {
  return await httpGet<EntryModel[]>(apiEndPoint, {});
};

// GET a single currency by ID
const getOpeningEntryById = async (id: string): Promise<ApiResult<EntryModel> | null> => {
  return await httpGet<EntryModel>(`${apiEndPoint}/${id}`, {});
};

// POST (Create) a new currency
const createOpeningEntry = async (data: EntryModel): Promise<ApiResult<EntryModel> | null> => {
  return await httpPost<EntryModel>(apiEndPoint, data, legacyMutationNotify);
};

// PUT (Update) a currency
const updateOpeningEntry = async (
  id: string,
  data: EntryModel
): Promise<ApiResult<EntryModel> | null> => {
  return await httpPut<EntryModel>(`${apiEndPoint}/${id}`, data, legacyMutationNotify);
};

// DELETE a currency by ID
const deleteOpeningEntry = async (id: string): Promise<ApiResult<EntryModel> | null> => {
  return await httpDelete<EntryModel>(`${apiEndPoint}/${id}`, { id }, legacyMutationNotify);
};

export {
  getOpeningEntries,
  getOpeningEntryById,
  createOpeningEntry,
  updateOpeningEntry,
  deleteOpeningEntry,
};
