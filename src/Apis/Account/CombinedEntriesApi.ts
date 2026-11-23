import ComplexEntryModel from "@/interfaces/ProjectInterfaces/Account/Entries/ComplexEntry";
import { httpDelete, httpPost, httpPut, legacyMutationNotify } from "@/Apis/Axios/axiosMethods";
import { createCrudApi } from "@/shared/api";
import type { HttpTransportOptions } from "@/shared/api";

const endpoint = "combinedEntries";
const crud = createCrudApi<ComplexEntryModel>(endpoint);

const getCombinedEntries = (options?: HttpTransportOptions) => crud.getAll(options);

const getCombinedEntryById = (id: string, options?: HttpTransportOptions) =>
  crud.getById(id, options);

/** Mutations keep legacy toasts — ComplexEntryForm calls Apis directly. */
const createCombinedEntry = (data: ComplexEntryModel) =>
  httpPost<ComplexEntryModel>(endpoint, data, legacyMutationNotify);

const updateCombinedEntry = (id: string, data: ComplexEntryModel) =>
  httpPut<ComplexEntryModel>(`${endpoint}/${id}`, data, legacyMutationNotify);

const deleteCombinedEntry = (id: string) =>
  httpDelete<ComplexEntryModel>(`${endpoint}/${id}`, { id }, legacyMutationNotify);

/** @deprecated Use getCombinedEntries */
const getCompinedEntries = getCombinedEntries;
/** @deprecated Use getCombinedEntryById */
const getCompinedEntryById = getCombinedEntryById;
/** @deprecated Use createCombinedEntry */
const createCompinedEntry = createCombinedEntry;
/** @deprecated Use updateCombinedEntry */
const updateCompinedEntry = updateCombinedEntry;
/** @deprecated Use deleteCombinedEntry */
const deleteCompinedEntry = deleteCombinedEntry;

export {
  getCombinedEntries,
  getCombinedEntryById,
  createCombinedEntry,
  updateCombinedEntry,
  deleteCombinedEntry,
  getCompinedEntries,
  getCompinedEntryById,
  createCompinedEntry,
  updateCompinedEntry,
  deleteCompinedEntry,
};
