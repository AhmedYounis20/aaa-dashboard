import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import { baseUrl } from "../Utilities/SD";
import ComplexEntryModel from "../interfaces/ProjectInterfaces/Entries/ComplexEntry";
import EntryModel from "../interfaces/ProjectInterfaces/Entries/Entry";

const EntriesApi = createApi({
  reducerPath: "entriesApi",
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
  tagTypes: ["compinedEntries"],
  endpoints: (builder) => ({
    getEntries: builder.query({
      query: () => "compinedEntries",
      providesTags: ["compinedEntries"],
    }),
    getEntryById: builder.query({
      query: (id) => `compinedEntries/${id}`,
      providesTags: ["compinedEntries"],
    }),
    updateComplexEntry: builder.mutation({
      query: (body: ComplexEntryModel) => ({
        url: `compinedEntries/${body.id}`,
        method: "PUT",
        body: body,
      }),
      invalidatesTags: ["compinedEntries"],
    }),
    updateEntry: builder.mutation({
      query: (body: EntryModel) => ({
        url: `compinedEntries/${body.id}`,
        method: "PUT",
        body: body,
      }),
      invalidatesTags: ["compinedEntries"],
    }),
    deleteEntry: builder.mutation({
      query: (id) => ({
        url: `compinedEntries/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["compinedEntries"],
    }),
    createComplexEntry: builder.mutation({
      query: (body: ComplexEntryModel) => ({
        url: `compinedEntries`,
        method: "POST",
        body: body,
      }),
      invalidatesTags: ["compinedEntries"],
    }),
    createEntry: builder.mutation({
      query: (body: EntryModel) => ({
        url: `compinedEntries`,
        method: "POST",
        body: body,
      }),
      invalidatesTags: ["compinedEntries"],
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