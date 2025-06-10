import { ApiResult } from "../../interfaces/ApiResponse";
import { httpDelete, httpGet, httpPost, httpPut } from "../Axios/axiosMethods";
import ItemModel from "../../interfaces/ProjectInterfaces/Inventory/Items/ItemModel";

const apiEndPoint = "items";
// GET all currencies
const getItems = async (): Promise<ApiResult<ItemModel[]>> => {
  return await httpGet<ItemModel[]>(apiEndPoint, {});
};

// GET a single currency by ID
const getItemById = async (
  id: string
): Promise<ApiResult<ItemModel>> => {
  return await httpGet<ItemModel>(`${apiEndPoint}/${id}`, {});
};

const getItemNextCode = async (parentId?: string | null): Promise<ApiResult<string>> => {
  return await httpGet<string>(
    `${apiEndPoint}/getNextCode${parentId  ? `?parentId=${parentId}` : ""}`,
    {}
  );
};

// POST (Create) a new currency
const createItem = async (
  data: ItemModel
): Promise<ApiResult<ItemModel>> => {
  return await httpPost<ItemModel>(apiEndPoint, data);
};

// PUT (Update) a currency
const updateItem = async (
  id: string,
  data: ItemModel
): Promise<ApiResult<ItemModel>> => {
  return await httpPut<ItemModel>(`${apiEndPoint}/${id}`, data);
};

// DELETE a currency by ID
const deleteItem = async (id: string): Promise<ApiResult<ItemModel>> => {
  return await httpDelete<ItemModel>(`${apiEndPoint}/${id}`, { id });
};

export {
  getItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
  getItemNextCode,
};
