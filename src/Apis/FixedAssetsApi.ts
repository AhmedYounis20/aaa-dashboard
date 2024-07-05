import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import { baseUrl } from "../Utilities/SD";

const FixedAssetsApi = createApi({
  reducerPath: "fixedAssetsApi",
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
  tagTypes: ["fixedAssets"],
  endpoints: (builder) => ({
    getFixedAssets: builder.query({
      query: () => "fixedAssets/GetLevel?level=10",
      providesTags: ["fixedAssets"],
    }),
    getFixedAssetsById: builder.query({
      query: (id) => `fixedAssets/${id}`,
      providesTags: ["fixedAssets"],
    }),
    deleteFixedAssetById: builder.mutation({
      query: (id) => ({
        url: `fixedAssets/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["fixedAssets"],
    }),
  }),
});

export const {
  useGetFixedAssetsQuery,
  useGetFixedAssetsByIdQuery,
  useDeleteFixedAssetByIdMutation,
} = FixedAssetsApi;
export default FixedAssetsApi;