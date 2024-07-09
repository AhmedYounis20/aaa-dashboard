import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import { baseUrl } from "../Utilities/SD";
import CurrencyModel from "../interfaces/ProjectInterfaces/Currencies/CurrencyModel";

const CurrenciesApi = createApi({
  reducerPath: "currenciesApi",
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
  tagTypes: ["currencies"],
  endpoints: (builder) => ({
    getCurrencies: builder.query({
      query: () => "currencies",
      providesTags: ["currencies"],
    }),
    getCurrenciesById: builder.query({
      query: (id) => `currencies/${id}`,
      providesTags: ["currencies"],
    }),
    updateCurrency: builder.mutation({
      query: (currencyBody: CurrencyModel) => ({
        url: `currencies/${currencyBody.id}`,
        method: "PUT",
        body:currencyBody
      }),
      invalidatesTags: ["currencies"],
    }),
  }),
});

export const { useGetCurrenciesQuery, useGetCurrenciesByIdQuery,useUpdateCurrencyMutation } = CurrenciesApi;
export default CurrenciesApi;