import { ApiResult } from "../../interfaces/ApiResponse";
import { httpDelete, httpGet, httpPost, httpPut } from "../Axios/axiosMethods";
import CustomerModel from "../../interfaces/ProjectInterfaces/Account/Subleadgers/Customers/CustomerModel";

const apiEndPoint = "customers";

// GET all customers
const getCustomers = async (): Promise<ApiResult<CustomerModel[]>> => {
  return await httpGet<CustomerModel[]>(apiEndPoint, {});
};

// GET a single customer by ID
const getCustomerById = async (
  id: string
): Promise<ApiResult<CustomerModel>> => {
  return await httpGet<CustomerModel>(`${apiEndPoint}/${id}`, {});
};

// GET default model data (for add form)
const getDefaultCustomer = async (
  parentId: string | null
): Promise<ApiResult<CustomerModel> | null> => {
  return await httpGet<CustomerModel>(
    `${apiEndPoint}/NextAccountDefaultData${
      parentId == null ? "" : `?parentId=${parentId}`
    }`,
    {}
  );
};

// CREATE a new customer
const createCustomer = async (
  data: CustomerModel
): Promise<ApiResult<CustomerModel>> => {
  return await httpPost<CustomerModel>(apiEndPoint, data);
};

// UPDATE a customer
const updateCustomer = async (
  id: string,
  data: CustomerModel
): Promise<ApiResult<CustomerModel>> => {
  return await httpPut<CustomerModel>(`${apiEndPoint}/${id}`, data);
};

// DELETE a customer
const deleteCustomer = async (
  id: string
): Promise<ApiResult<CustomerModel>> => {
  return await httpDelete<CustomerModel>(`${apiEndPoint}/${id}`, {});
};

export {
  getCustomers,
  getCustomerById,
  getDefaultCustomer,
  createCustomer,
  updateCustomer,
  deleteCustomer,
};