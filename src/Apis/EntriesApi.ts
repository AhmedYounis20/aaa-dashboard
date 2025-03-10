import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import { baseUrl } from "../Utilities/SD";
import ComplexEntryModel from "../interfaces/ProjectInterfaces/Entries/ComplexEntry";
import EntryModel from "../interfaces/ProjectInterfaces/Entries/Entry";

const EntriesApi = createApi({
  reducerPath: "entriesApi",
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
  tagTypes: ["entries"],
  endpoints: (builder) => ({
    getEntries: builder.query({
      query: () => "entries",
      providesTags: ["entries"],
    }),
    getEntryById: builder.query({
      query: (id) => `entries/${id}`,
      providesTags: ["entries"],
    }),
    updateComplexEntry: builder.mutation({
      query: (body: ComplexEntryModel) => ({
        url: `entries/${body.id}`,
        method: "PUT",
        body: body,
      }),
      invalidatesTags: ["entries"],
    }),
    updateEntry: builder.mutation({
      query: (body: EntryModel) => ({
        url: `entries/${body.id}`,
        method: "PUT",
        body: body,
      }),
      invalidatesTags: ["entries"],
    }),
    deleteEntry: builder.mutation({
      query: (id) => ({
        url: `entries/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["entries"],
    }),
    createComplexEntry: builder.mutation({
      query: (body: ComplexEntryModel) => ({
        url: `entries`,
        method: "POST",
        body: body,
      }),
      invalidatesTags: ["entries"],
    }),
    createEntry: builder.mutation({
      query: (body: EntryModel) => ({
        url: `entries`,
        method: "POST",
        body: body,
      }),
      invalidatesTags: ["entries"],
    }),
  }),
});

export const {
  useGetEntriesQuery,
  useGetEntryByIdQuery,
  useUpdateEntryMutation,
  useUpdateComplexEntryMutation,
  useDeleteEntryMutation,
  useCreateEntryMutation,
  useCreateComplexEntryMutation,
} = EntriesApi;
export default EntriesApi;