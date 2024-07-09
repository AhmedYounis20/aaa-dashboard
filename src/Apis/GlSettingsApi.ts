import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import { baseUrl } from "../Utilities/SD";
import GlSettingsModel from "../interfaces/ProjectInterfaces/GlSettings/GlSettingsModel";

const GlSettingsApi = createApi({
  reducerPath: "glSettingsApi",
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
  tagTypes: ["glSettings"],
  endpoints: (builder) => ({
    getGlSettings: builder.query({
      query: () => "glSettings",
      providesTags: ["glSettings"],
    }),
    updateGlSettings: builder.mutation({
      query: (body: GlSettingsModel) => ({
        url: `glSettings`,
        method: "PUT",
        body: body,
      }),
      invalidatesTags : ['glSettings']
    }),
  }),
});

export const { useGetGlSettingsQuery,useUpdateGlSettingsMutation } = GlSettingsApi;
export default GlSettingsApi;