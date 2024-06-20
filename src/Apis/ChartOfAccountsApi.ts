import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import { baseUrl } from "../Utilities/SD";

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
      query: () => "chartofAccounts/GetLevel?level=10",
      providesTags: ["chartofAccounts"],
    }),
    getChartOfAccountsById: builder.query({
      query: (id) => `chartofAccounts/${id}`,
      providesTags: ["chartofAccounts"],
    }),
    deleteChartOfAcountById: builder.mutation({
      query: (id) => ({
        url: `chartofAccounts/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["chartofAccounts"],
    }),
  }),
});

export const { useGetChartOfAccountsQuery,useGetChartOfAccountsByIdQuery,useDeleteChartOfAcountByIdMutation } = ChartOfAccountsApi;
export default ChartOfAccountsApi;