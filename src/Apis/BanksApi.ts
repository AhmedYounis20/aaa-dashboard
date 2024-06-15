import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import { baseUrl } from "../Utilities/SD";

const BanksApi = createApi({
  reducerPath: "banksApi",
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
  tagTypes: ["banks"],
  endpoints: (builder) => ({
    getBanks: builder.query({
      query: () => "banks/GetLevel?level=10",
      providesTags: ["banks"],
    }),
    getBanksById: builder.query({
      query: (id) => `banks/${id}`,
      providesTags: ["banks"],
    }),
  }),
});

export const { useGetBanksQuery,useGetBanksByIdQuery } = BanksApi;
export default BanksApi;