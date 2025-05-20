import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import { baseUrl } from "../../Utilities/SD";
import SupplierModel from "../../interfaces/ProjectInterfaces/Account/Subleadgers/Suppliers/SupplierModel";

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

export const {
  useGetSuppliersQuery,
  useGetSuppliersByIdQuery,
  useDeleteSupplierByIdMutation,
  useUpdateSupplierMutation,
  useGetDefaultModelDataQuery,
  useCreateSupplierMutation,
} = SuppliersApi;
export default SuppliersApi;