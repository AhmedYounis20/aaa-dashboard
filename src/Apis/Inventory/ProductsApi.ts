import { ApiResult } from "../../interfaces/ApiResponse";
import { httpDelete, httpGet, httpPost, httpPut } from "../Axios/axiosMethods";
import ProductModel from "../../interfaces/ProjectInterfaces/Inventory/Products/ProductModel";
import ProductInputModel from "../../interfaces/ProjectInterfaces/Inventory/Products/ProductInputModel";

const apiEndPoint = "products";

const getProducts = async (): Promise<ApiResult<ProductModel[]>> => {
  return await httpGet<ProductModel[]>(apiEndPoint, {});
};

const getProductById = async (id: string): Promise<ApiResult<ProductModel>> => {
  return await httpGet<ProductModel>(`${apiEndPoint}/${id}`, {});
};

const getProductNextCode = async (
  parentId?: string | null
): Promise<ApiResult<string>> => {
  return await httpGet<string>(
    `${apiEndPoint}/getNextCode${parentId ? `?parentId=${parentId}` : ""}`,
    {}
  );
};

const createProduct = async (
  data: ProductInputModel
): Promise<ApiResult<ProductModel>> => {
  return await httpPost<ProductModel>(apiEndPoint, data);
};

const updateProduct = async (
  id: string,
  data: ProductInputModel
): Promise<ApiResult<ProductModel>> => {
  return await httpPut<ProductModel>(`${apiEndPoint}/${id}`, data);
};

const deleteProduct = async (id: string): Promise<ApiResult<ProductModel>> => {
  return await httpDelete<ProductModel>(`${apiEndPoint}/${id}`, { id });
};

export {
  getProducts,
  getProductById,
  getProductNextCode,
  createProduct,
  updateProduct,
  deleteProduct,
};

const ProductsApi = {
  getProducts,
  getProductById,
  getProductNextCode,
  createProduct,
  updateProduct,
  deleteProduct,
};

export default ProductsApi;
