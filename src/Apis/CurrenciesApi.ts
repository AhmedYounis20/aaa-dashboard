import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import { baseUrl } from "../Utilities/SD";

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
  }),
});

export const { useGetCurrenciesQuery, useGetCurrenciesByIdQuery } = CurrenciesApi;
export default CurrenciesApi;