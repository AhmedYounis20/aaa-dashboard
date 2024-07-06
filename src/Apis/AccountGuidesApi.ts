import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import { baseUrl } from "../Utilities/SD";

const AccountGuidesApi = createApi({
  reducerPath: "accountGuidesApi",
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
  tagTypes: ["accountGuides"],
  endpoints: (builder) => ({
    getAccountGuides: builder.query({
      query: () => "accountGuides",
      providesTags: ["accountGuides"],
    }),
    getAccountGuidesById: builder.query({
      query: (id) => `accountGuides/${id}`,
      providesTags: ["accountGuides"],
    }),
  }),
});

export const {useGetAccountGuidesQuery, useGetAccountGuidesByIdQuery}  = AccountGuidesApi;
export default AccountGuidesApi;