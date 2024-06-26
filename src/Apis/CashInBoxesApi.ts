import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import { baseUrl } from "../Utilities/SD";

const CashInBoxesApi = createApi({
  reducerPath: "cashInBoxesApi",
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
  tagTypes: ["cashInBoxes"],
  endpoints: (builder) => ({
    getCashInBoxes: builder.query({
      query: () => "cashInBoxes/GetLevel?level=10",
      providesTags: ["cashInBoxes"],
    }),
    getCashInBoxesById: builder.query({
      query: (id) => `cashInBoxes/${id}`,
      providesTags: ["cashInBoxes"],
    }),
    deleteCashInBoxById: builder.mutation({
      query: (id) => ({
        url: `cashInBoxes/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["cashInBoxes"],
    }),
  }),
});

export const { useGetCashInBoxesQuery, useGetCashInBoxesByIdQuery,useDeleteCashInBoxByIdMutation } = CashInBoxesApi;
export default CashInBoxesApi;