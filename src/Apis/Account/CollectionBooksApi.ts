import { ApiResult } from "../../interfaces/ApiResponse";
import { httpDelete, httpGet, httpPost, httpPut } from "../Axios/axiosMethods";
import { CollectionBookModel } from "../../interfaces/ProjectInterfaces";

const apiEndPoint = "CollectionBooks";

// GET all collection books
const getCollectionBooks = async (): Promise<ApiResult<CollectionBookModel[]>> => {
  return await httpGet<CollectionBookModel[]>(apiEndPoint, {});
};

// GET a single collection book by ID
const getCollectionBookById = async (
  id: string
): Promise<ApiResult<CollectionBookModel> | null> => {
  return await httpGet<CollectionBookModel>(`${apiEndPoint}/${id}`, {});
};

// POST (Create) a new collection book
const createCollectionBook = async (
  data: CollectionBookModel
): Promise<ApiResult<CollectionBookModel> | null> => {
  return await httpPost<CollectionBookModel>(apiEndPoint, data);
};

// PUT (Update) a collection book
const updateCollectionBook = async (
  id: string,
  data: CollectionBookModel
): Promise<ApiResult<CollectionBookModel> | null> => {
  return await httpPut<CollectionBookModel>(`${apiEndPoint}/${id}`, data);
};

// DELETE a collection book by ID
const deleteCollectionBook = async (
  id: string
): Promise<ApiResult<CollectionBookModel> | null> => {
  return await httpDelete<CollectionBookModel>(`${apiEndPoint}/${id}`, { id });
};

export {
  getCollectionBooks,
  getCollectionBookById,
  createCollectionBook,
  updateCollectionBook,
  deleteCollectionBook
};