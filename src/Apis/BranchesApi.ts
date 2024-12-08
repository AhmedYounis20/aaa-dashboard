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
        `branches/NextAccountDefaultData${
          parentId == null ? "" : `?parentId=${parentId}`
        }`,
      providesTags: ["Branches"],
    }),
    createBranch: builder.mutation({
      query: (body: BranchModel & { logo: File | null }) => {
        const formData = new FormData();

        // Append the branch model properties
        formData.append("name", body.name);
        formData.append("nameSecondLanguage", body.nameSecondLanguage);
        formData.append("phone", body.phone);
        formData.append("address", body.address);
        formData.append("nodeType", body.nodeType.toString());
        formData.append("notes", body.notes);
        if (body.parentId) formData.append("parentId", body.parentId);

        // Append the logo if it exists
        if (body.logo) {
          formData.append("logo", body.logo);
        }

        return {
          url: `branches`,
          method: "POST",
          body: formData,
        };
      },
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
      query: (body: BranchModel & { logo: File | null }) => {
        const formData = new FormData();

        // Append the branch model properties
        formData.append("name", body.name);
        formData.append("nameSecondLanguage", body.nameSecondLanguage);
        formData.append("phone", body.phone);
        formData.append("address", body.address);
        formData.append("nodeType", body.nodeType.toString());
        formData.append("notes", body.notes);
        if (body.parentId) formData.append("parentId", body.parentId);

        // Append the logo if it exists
        if (body.logo) {
          formData.append("logo", body.logo);
        }

        return {
        url: `Branches/${body.id}`,
        method: "PUT",
        body: formData,
        };
      },
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