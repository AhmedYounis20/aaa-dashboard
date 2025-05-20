import EntryModel from "../../interfaces/ProjectInterfaces/Account/Entries/Entry";
import { ApiResult } from "../../interfaces/ApiResponse";
import { httpDelete, httpGet, httpPost, httpPut } from "../Axios/axiosMethods";

const apiEndPoint = "journalEntries";
// GET all currencies
const getJournalEntries = async (): Promise<ApiResult<EntryModel[]> | null> => {
  return await httpGet<EntryModel[]>(apiEndPoint, {});
};

// GET a single currency by ID
const getJournalEntryById = async (
  id: string
): Promise<ApiResult<EntryModel> | null> => {
  return await httpGet<EntryModel>(`${apiEndPoint}/${id}`, {});
};

// POST (Create) a new currency
const createJournalEntry = async (
  data: EntryModel
): Promise<ApiResult<EntryModel> | null> => {
  return await httpPost<EntryModel>(apiEndPoint, data);
};

// PUT (Update) a currency
const updateJournalEntry = async (
  id: string,
  data: EntryModel
): Promise<ApiResult<EntryModel> | null> => {
  return await httpPut<EntryModel>(`${apiEndPoint}/${id}`, data);
};

// DELETE a currency by ID
const deleteJournalEntry = async (
  id: string
): Promise<ApiResult<EntryModel> | null> => {
  return await httpDelete<EntryModel>(`${apiEndPoint}/${id}`, { id });
};

export {
  getJournalEntries,
  getJournalEntryById,
  createJournalEntry,
  updateJournalEntry,
  deleteJournalEntry,
};
