import { ApiResult } from "../../interfaces/ApiResponse";
import { httpDelete, httpGet, httpPost, httpPut } from "../Axios/axiosMethods";
import ProductModel from "../../interfaces/ProjectInterfaces/Inventory/Products/ProductModel";
import ProductInputModel from "../../interfaces/ProjectInterfaces/Inventory/Products/ProductInputModel";

const apiEndPoint = "products";

// GET all products
const getProducts = async (): Promise<ApiResult<ProductModel[]>> => {
  return await httpGet<ProductModel[]>(apiEndPoint, {});
};

// GET products with variants
const getProductsWithVariants = async (): Promise<ApiResult<ProductModel[]>> => {
  return await httpGet<ProductModel[]>(`${apiEndPoint}/withVariants`, {});
};

// GET products by type
const getProductsByType = async (productType?: string): Promise<ApiResult<ProductModel[]>> => {
  const queryParam = productType ? `?productType=${productType}` : "";
  return await httpGet<ProductModel[]>(`${apiEndPoint}/byType${queryParam}`, {});
};

// GET a single product by ID
const getProductById = async (id: string): Promise<ApiResult<ProductModel>> => {
  return await httpGet<ProductModel>(`${apiEndPoint}/${id}`, {});
};

// GET next code for product
const getProductNextCode = async (parentId?: string | null): Promise<ApiResult<string>> => {
  return await httpGet<string>(
    `${apiEndPoint}/getNextCode${parentId ? `?parentId=${parentId}` : ""}`,
    {}
  );
};

// POST (Create) a new product
const createProduct = async (data: ProductInputModel): Promise<ApiResult<ProductModel>> => {
  return await httpPost<ProductModel>(apiEndPoint, data);
};


// PUT (Update) a product
const updateProduct = async (id: string, data: ProductInputModel): Promise<ApiResult<ProductModel>> => {
  return await httpPut<ProductModel>(`${apiEndPoint}/${id}`, data);
};


// GET products with attributes
const getProductsWithAttributes = async (): Promise<ApiResult<ProductModel[]>> => {
  return await httpGet<ProductModel[]>(`${apiEndPoint}/withAttributes`, {});
};

// GET a single product with attributes by ID
const getProductWithAttributes = async (id: string): Promise<ApiResult<ProductModel>> => {
  return await httpGet<ProductModel>(`${apiEndPoint}/withAttributes/${id}`, {});
};

// DELETE a product by ID
const deleteProduct = async (id: string): Promise<ApiResult<ProductModel>> => {
  return await httpDelete<ProductModel>(`${apiEndPoint}/${id}`, { id });
};

// Export individual functions
export {
  getProducts,
  getProductsWithVariants,
  getProductsByType,
  getProductById,
  getProductNextCode,
  createProduct,
  updateProduct,
  getProductsWithAttributes,
  getProductWithAttributes,
  deleteProduct,
};

const ProductsApi = {
  getProducts,
  getProductsWithVariants,
  getProductsByType,
  getProductById,
  getProductNextCode,
  createProduct,
  updateProduct,
  getProductsWithAttributes,
  getProductWithAttributes,
  deleteProduct,
};

export default ProductsApi;