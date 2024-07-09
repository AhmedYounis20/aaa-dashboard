import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import { baseUrl } from "../Utilities/SD";
import CustomerModel from "../interfaces/ProjectInterfaces/Subleadgers/Customers/CustomerModel";

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
    deleteCustomerById: builder.mutation({
      query: (id) => ({
        url: `customers/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["customers"],
    }),
    updateCustomer: builder.mutation({
      query: (body: CustomerModel) => ({
        url: `customers/${body.id}`,
        method: "PUT",
        body: body,
      }),
      invalidatesTags: ["customers"],
    }),
  }),
});

export const { useGetCustomersQuery, useGetCustomersByIdQuery,useDeleteCustomerByIdMutation,useUpdateCustomerMutation } = CustomersApi;
export default CustomersApi;