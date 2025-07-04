import { ApiResult } from "../../interfaces/ApiResponse";
import FixedAssetModel from "../../interfaces/ProjectInterfaces/Account/Subleadgers/FixedAssets/FixedAssetModel";
import { httpDelete, httpGet, httpPost, httpPut } from "../Axios/axiosMethods";

const getFixedAssets = async (): Promise<ApiResult<FixedAssetModel[]>> => {
  return await httpGet<FixedAssetModel[]>("fixedAssets", {});
};

const getFixedAssetById = async (id: string): Promise<ApiResult<FixedAssetModel>> => {
  return await httpGet<FixedAssetModel>(`fixedAssets/${id}`, {});
};

const createFixedAsset = async (model: FixedAssetModel): Promise<ApiResult<FixedAssetModel>> => {
  return await httpPost<FixedAssetModel>("fixedAssets", model);
};

const updateFixedAsset = async (id: string, model: FixedAssetModel): Promise<ApiResult<FixedAssetModel>> => {
  return await httpPut<FixedAssetModel>(`fixedAssets/${id}`, model);
};

const deleteFixedAsset = async (id: string): Promise<ApiResult<FixedAssetModel>> => {
  return await httpDelete<FixedAssetModel>(`fixedAssets/${id}`, {});
};

const getDefaultFixedAssetData = async (parentId: string | null, fixedAssetType: number): Promise<ApiResult<FixedAssetModel>> => {
  return await httpGet<FixedAssetModel>(`fixedAssets/NextAccountDefaultData`, {
    parentId,
    fixedAssetType,
  });
};

export {
  getFixedAssets,
  getFixedAssetById,
  createFixedAsset,
  updateFixedAsset,
  deleteFixedAsset,
  getDefaultFixedAssetData,
};