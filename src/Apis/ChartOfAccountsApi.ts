import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import { baseUrl } from "../Utilities/SD";
import { ChartOfAccountModel } from "../interfaces/ProjectInterfaces";

const ChartOfAccountsApi = createApi({
  reducerPath: "chartOfAccountsApi",
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
  tagTypes: ["chartofAccounts"],
  endpoints: (builder) => ({
    getChartOfAccounts: builder.query({
      query: () => "chartofAccounts",
      providesTags: ["chartofAccounts"],
    }),

    getChartOfAccountsById: builder.query({
      query: (id) => `chartofAccounts/${id}`,
      providesTags: ["chartofAccounts"],
    }),
    getDefaultChartOfAccount: builder.query({
      query: (parentId) =>
        `chartofAccounts/NextAccountDefaultData${
          parentId == null ? "" : `?parentId=${parentId}`
        }`,
      providesTags: ["chartofAccounts"],
    }),
    deleteChartOfAcountById: builder.mutation({
      query: (id) => ({
        url: `chartofAccounts/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["chartofAccounts"],
    }),
    updateChartOfAccount: builder.mutation({
      query: (body: ChartOfAccountModel) => ({
        url: `chartOfAccounts/${body.id}`,
        method: "PUT",
        body: body,
      }),
      invalidatesTags: ["chartofAccounts"],
    }),
    createChartOfAccount: builder.mutation({
      query: (body: ChartOfAccountModel) => ({
        url: `chartOfAccounts`,
        method: "POST",
        body: body,
      }),
      invalidatesTags: ["chartofAccounts"],
    }),
  }),
});

export const { useGetChartOfAccountsQuery,useGetChartOfAccountsByIdQuery,useDeleteChartOfAcountByIdMutation,useUpdateChartOfAccountMutation,useGetDefaultChartOfAccountQuery,useCreateChartOfAccountMutation } = ChartOfAccountsApi;
export default ChartOfAccountsApi;