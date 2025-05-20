import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import { baseUrl } from "../../Utilities/SD";
import CustomerModel from "../../interfaces/ProjectInterfaces/Account/Subleadgers/Customers/CustomerModel";

const CustomersApi = createApi({
  reducerPath: "customersApi",
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
  tagTypes: ["customers"],
  endpoints: (builder) => ({
    getCustomers: builder.query({
      query: () => "customers",
      providesTags: ["customers"],
    }),
    getCustomersById: builder.query({
      query: (id) => `customers/${id}`,
      providesTags: ["customers"],
    }),
    getDefaultModelData: builder.query({
      query: (parentId) =>
        `customers/NextAccountDefaultData${
          parentId == null ? "" : `?parentId=${parentId}`
        }`,
      providesTags: ["customers"],
    }),
    createCustomer: builder.mutation({
      query: (body: CustomerModel) => ({
        url: `customers`,
        method: "POST",
        body: body,
      }),
      invalidatesTags: ["customers"],
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

export const {
  useGetCustomersQuery,
  useGetCustomersByIdQuery,
  useDeleteCustomerByIdMutation,
  useUpdateCustomerMutation,
  useGetDefaultModelDataQuery,
  useCreateCustomerMutation,
} = CustomersApi;
export default CustomersApi;