import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import { baseUrl } from "../Utilities/SD";

const SuppliersApi = createApi({
  reducerPath: "SuppliersApi",
  baseQuery: fetchBaseQuery({
    baseUrl: baseUrl,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["suppliers"],
  endpoints: (builder) => ({
    getSuppliers: builder.query({
      query: () => "customers/GetLevel?level=10",
      providesTags: ["suppliers"],
    }),
    getSuppliersById: builder.query({
      query: (id) => `customers/${id}`,
      providesTags: ["suppliers"],
    }),
  }),
});

export const { useGetSuppliersQuery, useGetSuppliersByIdQuery } = SuppliersApi;
export default SuppliersApi;