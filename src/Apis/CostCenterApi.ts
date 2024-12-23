import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseUrl } from "../Utilities/SD";
import { CostCenterModel } from "../interfaces/ProjectInterfaces/CostCenter/costCenterModel";

const CostCenterApi = createApi({
    reducerPath: "costCenterApi",
    baseQuery: fetchBaseQuery({
        baseUrl: baseUrl,
        prepareHeaders: (headers) => {
            const token = localStorage.getItem("token");
            if(token){
                headers.set("authorization", `Bearer ${token}`);
            }
            return headers;
        },
    }),
    tagTypes: ["costCenters"],
    endpoints: (builder) => ({
        getCostCenter: builder.query({
            query: () => "costCenters",
            providesTags: ["costCenters"],
        }),

        getCostCenterById: builder.query({
            query: (id) => `CostCenters/${id}`,
            providesTags: ["costCenters"],
        }),

        getChildrenCostCenter: builder.query({
            query: (parentId) => `CostCenters/GetChildren/${parentId}`,
            providesTags: ["costCenters"],
        }),

        createCostCenter: builder.mutation({
            query: (body: CostCenterModel) => ({
                url: 'CostCenters',
                method: "POST",
                body: body
            }),
            invalidatesTags: ["costCenters"]
        }),
        updateCostCenter: builder.mutation({
            query: (costCenterBody: CostCenterModel) => ({
            url: `CostCenters/${costCenterBody.id}`,
            method: "PUT",
            body: costCenterBody,
            }),
            invalidatesTags: ["costCenters"],
        }),
        deleteCostCenter: builder.mutation({
            query: (id: string) => ({
                url: `CostCenters/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["costCenters"]
        }),
    }),
});

export const {
    useGetChildrenCostCenterQuery,
    useCreateCostCenterMutation,
    useGetCostCenterByIdQuery,
    useGetCostCenterQuery,
    useUpdateCostCenterMutation,
    useDeleteCostCenterMutation
} = CostCenterApi;
export default CostCenterApi;