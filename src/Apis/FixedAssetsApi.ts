import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import { baseUrl } from "../Utilities/SD";
import FixedAssetModel from "../interfaces/ProjectInterfaces/Subleadgers/FixedAssets/FixedAssetModel";
import FixedAssetType from "../interfaces/ProjectInterfaces/Subleadgers/FixedAssets/FixedAssetType";

const FixedAssetsApi = createApi({
  reducerPath: "fixedAssetsApi",
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
  tagTypes: ["fixedAssets"],
  endpoints: (builder) => ({
    getFixedAssets: builder.query({
      query: () => "fixedAssets",
      providesTags: ["fixedAssets"],
    }),
    getFixedAssetsById: builder.query({
      query: (id) => `fixedAssets/${id}`,
      providesTags: ["fixedAssets"],
    }),
    getDefaultModelData: builder.query({
      query: (query: {
        parentId?: string | null;
        fixedAssetType: FixedAssetType;
      }) =>
        `fixedAssets/NextAccountDefaultData${
          `?fixedAssetType=${query.fixedAssetType}` + 
            (!query.parentId 
            ? ""
            : `&parentId=${query.parentId}`)
        }`,

      providesTags: ["fixedAssets"],
    }),
    createFixedAsset: builder.mutation({
      query: (body: FixedAssetModel) => ({
        url: `fixedAssets`,
        method: "POST",
        body: body,
      }),
      invalidatesTags: ["fixedAssets"],
    }),
    deleteFixedAssetById: builder.mutation({
      query: (id) => ({
        url: `fixedAssets/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["fixedAssets"],
    }),
    updateFixedAsset: builder.mutation({
      query: (body: FixedAssetModel) => ({
        url: `fixedAssets/${body.id}`,
        method: "PUT",
        body: body,
      }),
      invalidatesTags: ["fixedAssets"],
    }),
  }),
});

export const {
  useGetFixedAssetsQuery,
  useGetFixedAssetsByIdQuery,
  useDeleteFixedAssetByIdMutation,
  useUpdateFixedAssetMutation,
  useCreateFixedAssetMutation,
  useGetDefaultModelDataQuery
} = FixedAssetsApi;
export default FixedAssetsApi;