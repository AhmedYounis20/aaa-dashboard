import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import { baseUrl } from "../Utilities/SD";
import CashInBoxModel from "../interfaces/ProjectInterfaces/Subleadgers/CashInBoxes/CashInBoxModel";

const CashInBoxesApi = createApi({
  reducerPath: "cashInBoxesApi",
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
  tagTypes: ["cashInBoxes"],
  endpoints: (builder) => ({
    getCashInBoxes: builder.query({
      query: () => "cashInBoxes",
      providesTags: ["cashInBoxes"],
    }),
    getCashInBoxesById: builder.query({
      query: (id) => `cashInBoxes/${id}`,
      providesTags: ["cashInBoxes"],
    }),
    getDefaultModelData: builder.query({
      query: (parentId) =>
        `cashInBoxes/NextAccountDefaultData${
          parentId == null ? "" : `?parentId=${parentId}`
        }`,
      providesTags: ["cashInBoxes"],
    }),
    createCashInBox: builder.mutation({
      query: (body: CashInBoxModel) => ({
        url: `cashInBoxes`,
        method: "POST",
        body: body,
      }),
      invalidatesTags: ["cashInBoxes"],
    }),
    deleteCashInBoxById: builder.mutation({
      query: (id) => ({
        url: `cashInBoxes/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["cashInBoxes"],
    }),
    updateCashInBox: builder.mutation({
      query: (body: CashInBoxModel) => ({
        url: `cashInBoxes/${body.id}`,
        method: "PUT",
        body: body,
      }),
      invalidatesTags: ["cashInBoxes"],
    }),
  }),
});

export const { useGetCashInBoxesQuery,
   useGetCashInBoxesByIdQuery,
   useDeleteCashInBoxByIdMutation,
   useUpdateCashInBoxMutation,
   useGetDefaultModelDataQuery,
   useCreateCashInBoxMutation
  } = CashInBoxesApi;
export default CashInBoxesApi;