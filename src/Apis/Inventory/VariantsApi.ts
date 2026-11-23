import { ApiResult } from "@/interfaces/ApiResponse";
import { httpDelete, httpGet, httpPut, legacyMutationNotify } from "../Axios/axiosMethods";
import VariantModel from "@/interfaces/ProjectInterfaces/Inventory/Variants/VariantModel";
import VariantInputModel from "@/interfaces/ProjectInterfaces/Inventory/Variants/VariantInputModel";
import { PaginatedResponse, PaginationParams } from "@/interfaces/Pagination";

const apiEndPoint = "variants";

const getVariants = async (): Promise<ApiResult<VariantModel[]>> => {
  return await httpGet<VariantModel[]>(apiEndPoint, {});
};

const getVariantsPaginated = async (
  params: PaginationParams
): Promise<ApiResult<PaginatedResponse<VariantModel>> | null> => {
  return await httpGet<PaginatedResponse<VariantModel>>(`${apiEndPoint}/paginated`, params);
};

const getVariantsByProduct = async (productId: string): Promise<ApiResult<VariantModel[]>> => {
  return await httpGet<VariantModel[]>(`${apiEndPoint}/byProduct/${productId}`, {});
};

const getVariantById = async (id: string): Promise<ApiResult<VariantModel>> => {
  return await httpGet<VariantModel>(`${apiEndPoint}/${id}`, {});
};

const searchVariants = async (searchTerm: string): Promise<ApiResult<VariantModel[]>> => {
  return await httpGet<VariantModel[]>(`${apiEndPoint}/search-variants`, {
    searchTerm,
  });
};

const updateVariant = async (
  id: string,
  data: VariantInputModel
): Promise<ApiResult<VariantModel>> => {
  return await httpPut<VariantModel>(`${apiEndPoint}/${id}`, data, legacyMutationNotify);
};

const deleteVariant = async (id: string): Promise<ApiResult<VariantModel>> => {
  return await httpDelete<VariantModel>(`${apiEndPoint}/${id}`, { id }, legacyMutationNotify);
};

export {
  getVariants,
  getVariantsByProduct,
  getVariantById,
  searchVariants,
  updateVariant,
  deleteVariant,
  getVariantsPaginated,
};

const VariantsApi = {
  getVariants,
  getVariantsByProduct,
  getVariantById,
  searchVariants,
  updateVariant,
  deleteVariant,
  getVariantsPaginated,
};

export default VariantsApi;
