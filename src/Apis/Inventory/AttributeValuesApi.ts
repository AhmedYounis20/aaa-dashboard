import { ApiResult } from "@/interfaces/ApiResponse";
import {
  httpDelete,
  httpGet,
  httpPost,
  httpPut,
  legacyMutationNotify,
} from "../Axios/axiosMethods";
import AttributeValueModel from "@/interfaces/ProjectInterfaces/Inventory/AttributeValues/AttributeValueModel";

const apiEndPoint = "AttributeValues";

const getAttributeValues = async (): Promise<ApiResult<AttributeValueModel[]>> => {
  return await httpGet<AttributeValueModel[]>(`${apiEndPoint}/`, {});
};

const getAttributeValueById = async (id: string): Promise<ApiResult<AttributeValueModel>> => {
  return await httpGet<AttributeValueModel>(`${apiEndPoint}/${id}`, {});
};

const createAttributeValue = async (
  data: AttributeValueModel
): Promise<ApiResult<AttributeValueModel>> => {
  return await httpPost<AttributeValueModel>(apiEndPoint, data, legacyMutationNotify);
};

const updateAttributeValue = async (
  id: string,
  data: AttributeValueModel
): Promise<ApiResult<AttributeValueModel>> => {
  return await httpPut<AttributeValueModel>(`${apiEndPoint}/${id}`, data, legacyMutationNotify);
};

const deleteAttributeValue = async (id: string): Promise<ApiResult<AttributeValueModel>> => {
  return await httpDelete<AttributeValueModel>(
    `${apiEndPoint}/${id}`,
    { id },
    legacyMutationNotify
  );
};

export {
  getAttributeValues,
  getAttributeValueById,
  createAttributeValue,
  updateAttributeValue,
  deleteAttributeValue,
};
