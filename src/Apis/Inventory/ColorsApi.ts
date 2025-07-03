import { ApiResult } from "../../interfaces/ApiResponse";
import { httpDelete, httpGet, httpPost, httpPut } from "../Axios/axiosMethods";
import ColorModel from "../../interfaces/ProjectInterfaces/Inventory/Colors/ColorModel";

const apiEndPoint = "Colors";

const getColors = async (): Promise<ApiResult<ColorModel[]>> => {
  return await httpGet<ColorModel[]>(apiEndPoint, {});
};

const getColorById = async (
  id: string
): Promise<ApiResult<ColorModel>> => {
  return await httpGet<ColorModel>(`${apiEndPoint}/${id}`, {});
};

const createColor = async (
  data: ColorModel
): Promise<ApiResult<ColorModel>> => {
  return await httpPost<ColorModel>(apiEndPoint, data);
};

const updateColor = async (
  id: string,
  data: ColorModel
): Promise<ApiResult<ColorModel>> => {
  return await httpPut<ColorModel>(`${apiEndPoint}/${id}`, data);
};

const deleteColor = async (
  id: string
): Promise<ApiResult<ColorModel>> => {
  return await httpDelete<ColorModel>(`${apiEndPoint}/${id}`, { id });
};

const getNextColorCode = async (): Promise<ApiResult<string>> => {
  return await httpGet<string>(`${apiEndPoint}/NextCode`, {});
};

export {
  getColors,
  getColorById,
  createColor,
  updateColor,
  deleteColor,
  getNextColorCode,
}; 