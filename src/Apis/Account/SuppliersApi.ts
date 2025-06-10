import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import { baseUrl } from "../../Utilities/SD";
import SupplierModel from "../../interfaces/ProjectInterfaces/Account/Subleadgers/Suppliers/SupplierModel";
import { httpDelete, httpGet, httpPost, httpPut } from "../Axios/axiosMethods";
import { ApiResult } from "../../interfaces/ApiResponse";

const SuppliersApi = createApi({
  reducerPath: "SuppliersApi",
  baseQuery: fetchBaseQuery({
    baseUrl: baseUrl,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("accessToken");
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["suppliers"],
  endpoints: (builder) => ({
    getSuppliers: builder.query({
      query: () => "suppliers",
      providesTags: ["suppliers"],
    }),
    getSuppliersById: builder.query({
      query: (id) => `suppliers/${id}`,
      providesTags: ["suppliers"],
    }),
    getDefaultModelData: builder.query({
      query: (parentId) =>
        `suppliers/NextAccountDefaultData${
          parentId == null ? "" : `?parentId=${parentId}`
        }`,
      providesTags: ["suppliers"],
    }),
    createSupplier: builder.mutation({
      query: (body: SupplierModel) => ({
        url: `suppliers`,
        method: "POST",
        body: body,
      }),
      invalidatesTags: ["suppliers"],
    }),
    deleteSupplierById: builder.mutation({
      query: (id) => ({
        url: `suppliers/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["suppliers"],
    }),
    updateSupplier: builder.mutation({
      query: (body: SupplierModel) => ({
        url: `suppliers/${body.id}`,
        method: "PUT",
        body: body,
      }),
      invalidatesTags: ["suppliers"],
    }),
  }),
});

const apiEndPoint = "Suppliers";
// GET all currencies
const getSuppliers = async (): Promise<ApiResult<
  SupplierModel[]
>> => {
  return await httpGet<SupplierModel[]>(apiEndPoint, {});
};

// GET a single currency by ID
const getSupplierById = async (
  id: string
): Promise<ApiResult<SupplierModel> | null> => {
  return await httpGet<SupplierModel>(`${apiEndPoint}/${id}`, {});
};

const getDefaultSupplier = async (
  parentId: string | null
): Promise<ApiResult<SupplierModel> | null> => {
  return await httpGet<SupplierModel>(
    `${apiEndPoint}/NextAccountDefaultData${
      parentId == null ? "" : `?parentId=${parentId}`
    }`,
    {}
  );
};

// POST (Create) a new currency
const createSupplier = async (
  data: SupplierModel
): Promise<ApiResult<SupplierModel> | null> => {
  return await httpPost<SupplierModel>(apiEndPoint, data);
};

// PUT (Update) a currency
const updateSupplier = async (
  id: string,
  data: SupplierModel
): Promise<ApiResult<SupplierModel> | null> => {
  return await httpPut<SupplierModel>(`${apiEndPoint}/${id}`, data);
};

// DELETE a currency by ID
const deleteSupplier = async (
  id: string
): Promise<ApiResult<SupplierModel> | null> => {
  return await httpDelete<SupplierModel>(`${apiEndPoint}/${id}`, { id });
};


export const {
  useGetSuppliersQuery,
  useGetSuppliersByIdQuery,
  useDeleteSupplierByIdMutation,
  useUpdateSupplierMutation,
  useGetDefaultModelDataQuery,
  useCreateSupplierMutation,
} = SuppliersApi;

export  {
  getSupplierById,
  getSuppliers,
  createSupplier,
  updateSupplier,
  deleteSupplier,
  getDefaultSupplier
}
export default SuppliersApi;