import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import { baseUrl } from "../../Utilities/SD";
import CurrencyModel from "../../interfaces/ProjectInterfaces/Account/Currencies/CurrencyModel";

const CurrenciesApi = createApi({
  reducerPath: "currenciesApi",
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
        body: currencyBody,
      }),
      invalidatesTags: ["currencies"],
    }),
    createCurrency: builder.mutation({
      query: (currencyBody: CurrencyModel) => ({
        url: `currencies`,
        method: "POST",
        body: currencyBody,
      }),
      invalidatesTags: ["currencies"],
    }),
    deleteCurrency: builder.mutation({
      query: (id: string) => ({
        url: `currencies/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["currencies"],
    }),
  }),
});

export const { useGetCurrenciesQuery, useGetCurrenciesByIdQuery,useUpdateCurrencyMutation,useCreateCurrencyMutation,useDeleteCurrencyMutation } = CurrenciesApi;
export default CurrenciesApi;