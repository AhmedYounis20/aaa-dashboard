import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import { baseUrl } from "../Utilities/SD";

const CustomersApi = createApi({
  reducerPath: "customersApi",
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
  tagTypes: ["customers"],
  endpoints: (builder) => ({
    getCustomers: builder.query({
      query: () => "customers/GetLevel?level=10",
      providesTags: ["customers"],
    }),
    getCustomersById: builder.query({
      query: (id) => `customers/${id}`,
      providesTags: ["customers"],
    }),
  }),
});

export const { useGetCustomersQuery, useGetCustomersByIdQuery } = CustomersApi;
export default CustomersApi;