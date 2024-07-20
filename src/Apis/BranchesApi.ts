import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import { baseUrl } from "../Utilities/SD";
import BranchModel from "../interfaces/ProjectInterfaces/Subleadgers/Branches/BranchModel";

const BranchesApi = createApi({
  reducerPath: "BranchesApi",
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
  tagTypes: ["Branches"],
  endpoints: (builder) => ({
    getBranches: builder.query({
      query: () => "Branches",
      providesTags: ["Branches"],
    }),
    getBranchesById: builder.query({
      query: (id) => `Branches/${id}`,
      providesTags: ["Branches"],
    }),
    getDefaultModelData: builder.query({
      query: (parentId) =>
        `branches/NextAccountDefaultData?parentId=${parentId}`,
      providesTags: ["Branches"],
    }),
    createBranch: builder.mutation({
      query: (body: BranchModel) => ({
        url: `branches`,
        method: "POST",
        body: body,
      }),
      invalidatesTags: ["Branches"],
    }),
    deleteBranchById: builder.mutation({
      query: (id) => ({
        url: `Branches/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Branches"],
    }),
    updateBranch: builder.mutation({
      query: (body: BranchModel) => ({
        url: `Branches/${body.id}`,
        method: "PUT",
        body: body,
      }),
      invalidatesTags: ["Branches"],
    }),
  }),
});

export const {
  useGetBranchesQuery,
  useGetBranchesByIdQuery,
  useDeleteBranchByIdMutation,
  useUpdateBranchMutation,
  useCreateBranchMutation,
  useGetDefaultModelDataQuery
} = BranchesApi;
export default BranchesApi;