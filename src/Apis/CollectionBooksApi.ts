import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import { baseUrl } from "../Utilities/SD";
import { CollectionBookModel } from "../interfaces/ProjectInterfaces";

const CollectionBooksApi = createApi({
  reducerPath: "collectionBooksApi",
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
  tagTypes: ["collectionBooks"],
  endpoints: (builder) => ({
    getCollectionBooks: builder.query({
      query: () => "collectionBooks",
      providesTags: ["collectionBooks"],
    }),
    getCollectionBooksById: builder.query({
      query: (id) => `collectionBooks/${id}`,
      providesTags: ["collectionBooks"],
    }),
    updateCollectionBook: builder.mutation({
      query: (currencyBody: CollectionBookModel) => ({
        url: `collectionBooks/${currencyBody.id}`,
        method: "PUT",
        body: currencyBody,
      }),
      invalidatesTags: ["collectionBooks"],
    }),
    createCollectionBook: builder.mutation({
      query: (currencyBody: CollectionBookModel) => ({
        url: `collectionBooks`,
        method: "POST",
        body: currencyBody,
      }),
      invalidatesTags: ["collectionBooks"],
    }),
    deleteCollectionBook: builder.mutation({
      query: (id: string) => ({
        url: `collectionBooks/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["collectionBooks"],
    }),
  }),
});

export const {
  useGetCollectionBooksQuery,
  useGetCollectionBooksByIdQuery,
  useCreateCollectionBookMutation,
  useUpdateCollectionBookMutation,
  useDeleteCollectionBookMutation,
} = CollectionBooksApi;
export default CollectionBooksApi;