import { CollectionBookModel } from "@/interfaces/ProjectInterfaces";
import { httpDelete, httpPost, httpPut, legacyMutationNotify } from "@/Apis/Axios/axiosMethods";
import { createCrudApi } from "@/shared/api";

const endpoint = "CollectionBooks";
const crud = createCrudApi<CollectionBookModel>(endpoint);

const getCollectionBooks = (signal?: AbortSignal) => crud.getAll({ signal });

const getCollectionBookById = (id: string, signal?: AbortSignal) => crud.getById(id, { signal });

/** Forms still call mutations directly; keep legacy toasts. */
const createCollectionBook = (data: CollectionBookModel) =>
  httpPost<CollectionBookModel>(endpoint, data, legacyMutationNotify);

const updateCollectionBook = (id: string, data: CollectionBookModel) =>
  httpPut<CollectionBookModel>(`${endpoint}/${id}`, data, legacyMutationNotify);

const deleteCollectionBook = (id: string) =>
  httpDelete<CollectionBookModel>(`${endpoint}/${id}`, { id }, legacyMutationNotify);

export {
  getCollectionBooks,
  getCollectionBookById,
  createCollectionBook,
  updateCollectionBook,
  deleteCollectionBook,
};
