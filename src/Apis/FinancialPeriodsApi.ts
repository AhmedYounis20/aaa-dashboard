import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import { baseUrl } from "../Utilities/SD";

const FinancialPeriodsApi = createApi({
  reducerPath: "financialPeriodsApi",
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
  }),
});

export const { useGetFinancialPeriodsQuery, useGetFinancialPeriodsByIdQuery } =
  FinancialPeriodsApi;
export default FinancialPeriodsApi;