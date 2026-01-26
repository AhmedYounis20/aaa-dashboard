import { ApiResult } from "../../interfaces/ApiResponse";
import { httpDelete, httpGet, httpPost, httpPut } from "../Axios/axiosMethods";
import VariantModel from "../../interfaces/ProjectInterfaces/Inventory/Variants/VariantModel";
import VariantInputModel from "../../interfaces/ProjectInterfaces/Inventory/Variants/VariantInputModel";
import { PaginatedResponse, PaginationParams } from "../../interfaces/Pagination";

const apiEndPoint = "variants";

// GET all variants
const getVariants = async (): Promise<ApiResult<VariantModel[]>> => {
  return await httpGet<VariantModel[]>(apiEndPoint, {});
};
// GET paginated account guides
const getVariantsPaginated = async (
  params: PaginationParams
): Promise<ApiResult<PaginatedResponse<VariantModel>> | null> => {
  return await httpGet<PaginatedResponse<VariantModel>>(
    `${apiEndPoint}/paginated`,
    params
  );
};
// GET variants by product ID
const getVariantsByProduct = async (productId: string): Promise<ApiResult<VariantModel[]>> => {
  return await httpGet<VariantModel[]>(`${apiEndPoint}/byProduct/${productId}`, {});
};

// GET variants with attributes
const getVariantsWithAttributes = async (): Promise<ApiResult<VariantModel[]>> => {
  return await httpGet<VariantModel[]>(`${apiEndPoint}/withAttributes`, {});
};

// GET a single variant by ID
const getVariantById = async (id: string): Promise<ApiResult<VariantModel>> => {
  return await httpGet<VariantModel>(`${apiEndPoint}/${id}`, {});
};

// GET variant with attributes by ID
const getVariantWithAttributes = async (id: string): Promise<ApiResult<VariantModel>> => {
  return await httpGet<VariantModel>(`${apiEndPoint}/withAttributes/${id}`, {});
};

// GET next code for variant
const getVariantNextCode = async (productId: string): Promise<ApiResult<string>> => {
  return await httpGet<string>(`${apiEndPoint}/getNextCode?productId=${productId}`, {});
};

// SEARCH variants
const searchVariants = async (searchTerm: string): Promise<ApiResult<VariantModel[]>> => {
  return await httpGet<VariantModel[]>(`${apiEndPoint}/search?searchTerm=${searchTerm}`, {});
};

// POST (Create) a new variant
const createVariant = async (data: VariantInputModel): Promise<ApiResult<VariantModel>> => {
  return await httpPost<VariantModel>(apiEndPoint, data);
};

// POST (Create) a new variant with attributes
const createVariantWithAttributes = async (data: VariantModel): Promise<ApiResult<VariantModel>> => {
  return await httpPost<VariantModel>(`${apiEndPoint}/createWithAttributes`, data);
};

// POST (Create) default variant for product
const createDefaultVariantForProduct = async (productId: string): Promise<ApiResult<VariantModel>> => {
  return await httpPost<VariantModel>(`${apiEndPoint}/createDefaultForProduct/${productId}`, {});
};

// PUT (Update) a variant
const updateVariant = async (id: string, data: VariantInputModel): Promise<ApiResult<VariantModel>> => {
  return await httpPut<VariantModel>(`${apiEndPoint}/${id}`, data);
};

// PUT (Update) a variant with attributes
const updateVariantWithAttributes = async (id: string, data: VariantModel): Promise<ApiResult<VariantModel>> => {
  return await httpPut<VariantModel>(`${apiEndPoint}/updateWithAttributes/${id}`, data);
};

// DELETE a variant by ID
const deleteVariant = async (id: string): Promise<ApiResult<VariantModel>> => {
  return await httpDelete<VariantModel>(`${apiEndPoint}/${id}`, { id });
};

// Export individual functions
export {
  getVariants,
  getVariantsByProduct,
  getVariantsWithAttributes,
  getVariantById,
  getVariantWithAttributes,
  getVariantNextCode,
  searchVariants,
  createVariant,
  createVariantWithAttributes,
  createDefaultVariantForProduct,
  updateVariant,
  updateVariantWithAttributes,
  deleteVariant,
  getVariantsPaginated
};

const VariantsApi = {
  getVariants,
  getVariantsByProduct,
  getVariantsWithAttributes,
  getVariantById,
  getVariantWithAttributes,
  getVariantNextCode,
  searchVariants,
  createVariant,
  createVariantWithAttributes,
  createDefaultVariantForProduct,
  updateVariant,
  updateVariantWithAttributes,
  deleteVariant,
  getVariantsPaginated
};

export default VariantsApi;



