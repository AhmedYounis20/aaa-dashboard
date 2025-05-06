import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import { baseUrl } from "../Utilities/SD";
import FinancialPeriodModel from "../interfaces/ProjectInterfaces/FinancialPeriods/FinancialPeriodModel";

const FinancialPeriodsApi = createApi({
  reducerPath: "financialPeriodsApi",
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
  tagTypes: ["financialPeriods"],
  endpoints: (builder) => ({
    getFinancialPeriods: builder.query({
      query: () => "financialPeriods",
      providesTags: ["financialPeriods"],
    }),
    getFinancialPeriodsById: builder.query({
      query: (id) => `financialPeriods/${id}`,
      providesTags: ["financialPeriods"],
    }),
    updateFinancialPeriod: builder.mutation({
      query: (body: FinancialPeriodModel) => ({
        url: `financialPeriods/${body.id}`,
        method: "PUT",
        body: body,
      }),
      invalidatesTags: ["financialPeriods"],
    }),
    createFinancialPeriod: builder.mutation({
      query: (body: FinancialPeriodModel) => ({
        url: `financialPeriods`,
        method: "POST",
        body: body,
      }),
      invalidatesTags: ["financialPeriods"],
    }),
  }),
});

export const {
  useGetFinancialPeriodsQuery,
  useGetFinancialPeriodsByIdQuery,
  useUpdateFinancialPeriodMutation,
  useCreateFinancialPeriodMutation,
} = FinancialPeriodsApi;
export default FinancialPeriodsApi;