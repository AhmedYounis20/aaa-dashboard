import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import { baseUrl } from "../Utilities/SD";

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
  }),
});

export const { useGetGlSettingsQuery } = GlSettingsApi;
export default GlSettingsApi;