import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import { baseUrl } from "../Utilities/SD";
import { AccountGuideModel } from "../interfaces/ProjectInterfaces";

const AccountGuidesApi = createApi({
  reducerPath: "accountGuidesApi",
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
  tagTypes: ["accountGuides"],
  endpoints: (builder) => ({
    getAccountGuides: builder.query({
      query: () => "accountGuides",
      providesTags: ["accountGuides"],
    }),
    getAccountGuidesById: builder.query({
      query: (id) => `accountGuides/${id}`,
      providesTags: ["accountGuides"],
    }),
    updateAccountGuide: builder.mutation({
      query: (currencyBody: AccountGuideModel) => ({
        url: `accountGuides/${currencyBody.id}`,
        method: "PUT",
        body: currencyBody,
      }),
      invalidatesTags: ["accountGuides"],
    }),
    createAccountGuide: builder.mutation({
      query: (currencyBody: AccountGuideModel) => ({
        url: `accountGuides`,
        method: "POST",
        body: currencyBody,
      }),
      invalidatesTags: ["accountGuides"],
    }),
    deleteAccountGuide: builder.mutation({
      query: (id: string) => ({
        url: `accountGuides/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["accountGuides"],
    }),
  }),
});

export const {useGetAccountGuidesQuery, useGetAccountGuidesByIdQuery,useCreateAccountGuideMutation,useUpdateAccountGuideMutation,useDeleteAccountGuideMutation}  = AccountGuidesApi;
export default AccountGuidesApi;