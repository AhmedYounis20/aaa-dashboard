import { ApiResult } from "../../interfaces/ApiResponse";
import { httpDelete, httpGet, httpPost, httpPut } from "../Axios/axiosMethods";
import SizeModel from "../../interfaces/ProjectInterfaces/Inventory/Sizes/SizeModel";

const apiEndPoint = "Sizes";

const getSizes = async (): Promise<ApiResult<SizeModel[]>> => {
  return await httpGet<SizeModel[]>(apiEndPoint, {});
};

const getSizeById = async (
  id: string
): Promise<ApiResult<SizeModel>> => {
  return await httpGet<SizeModel>(`${apiEndPoint}/${id}`, {});
};

const createSize = async (
  data: SizeModel
): Promise<ApiResult<SizeModel>> => {
  return await httpPost<SizeModel>(apiEndPoint, data);
};

const updateSize = async (
  id: string,
  data: SizeModel
): Promise<ApiResult<SizeModel>> => {
  return await httpPut<SizeModel>(`${apiEndPoint}/${id}`, data);
};

const deleteSize = async (
  id: string
): Promise<ApiResult<SizeModel>> => {
  return await httpDelete<SizeModel>(`${apiEndPoint}/${id}`, { id });
};

const getNextSizeCode = async (): Promise<ApiResult<string>> => {
  return await httpGet<string>(`${apiEndPoint}/NextCode`, {});
};

export {
  getSizes,
  getSizeById,
  createSize,
  updateSize,
  deleteSize,
  getNextSizeCode,
}; 