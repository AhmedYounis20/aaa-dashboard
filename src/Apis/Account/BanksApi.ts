import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import { baseUrl } from "../../Utilities/SD";
import BankModel from "../../interfaces/ProjectInterfaces/Account/Subleadgers/Banks/BankModel";

const BanksApi = createApi({
  reducerPath: "banksApi",
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
  tagTypes: ["banks"],
  endpoints: (builder) => ({
    getBanks: builder.query({
      query: () => "banks",
      providesTags: ["banks"],
    }),
    getBanksById: builder.query({
      query: (id) => `banks/${id}`,
      providesTags: ["banks"],
    }),
    getDefaultModelData: builder.query({
      query: (parentId) =>
        `banks/NextAccountDefaultData${parentId == null ? "":`?parentId=${parentId}`}`  ,
      providesTags: ["banks"],
    }),
    deleteBankById: builder.mutation({
      query: (id) => ({
        url: `banks/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["banks"],
    }),
    updateBank: builder.mutation({
      query: (body: BankModel) => ({
        url: `banks/${body.id}`,
        method: "PUT",
        body: body,
      }),
      invalidatesTags: ["banks"],
    }),
    createBank: builder.mutation({
      query: (body: BankModel) => ({
        url: `banks`,
        method: "POST",
        body: body,
      }),
      invalidatesTags: ["banks"],
    }),
  }),
});

export const { useGetBanksQuery,useGetBanksByIdQuery,useDeleteBankByIdMutation,useUpdateBankMutation, useGetDefaultModelDataQuery,useCreateBankMutation } = BanksApi;
export default BanksApi;