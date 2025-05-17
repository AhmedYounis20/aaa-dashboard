import { CostCenterModel } from "../interfaces/ProjectInterfaces/CostCenter/costCenterModel";
import { ApiResult } from "../interfaces/ApiResponse";
import { httpDelete, httpGet, httpPost, httpPut } from "./Axios/axiosMethods";

// const CostCenterApi = createApi({
//     reducerPath: "costCenterApi",
//     baseQuery: fetchBaseQuery({
//         baseUrl: baseUrl,
//         prepareHeaders: (headers) => {
//             const token = localStorage.getItem("accessToken");
//             if(token){
//                 headers.set("authorization", `Bearer ${token}`);
//             }
//             return headers;
//         },
//     }),
//     tagTypes: ["costCenters"],
//     endpoints: (builder) => ({

//         getChildrenCostCenter: builder.query({
//             query: (parentId) => `CostCenters/GetChildren/${parentId}`,
//             providesTags: ["costCenters"],
//         }),



//     }),
// });

const apiEndPoint = "costCenters";
// GET all currencies
const getCostCenters = async (): Promise<ApiResult<
  CostCenterModel[]
>> => {
  return await httpGet<CostCenterModel[]>(apiEndPoint, {});
};

// GET a single currency by ID
const getCostCenterById = async (
  id: string
): Promise<ApiResult<object>> => {
  return await httpGet<object>(`${apiEndPoint}/${id}`, {});
};


// POST (Create) a new currency
const createCostCenter = async (
  data: CostCenterModel
): Promise<ApiResult<CostCenterModel>> => {
  return await httpPost<CostCenterModel>(apiEndPoint, data);
};

// PUT (Update) a currency
const updateCostCenter = async (
  id: string,
  data: CostCenterModel
): Promise<ApiResult<CostCenterModel>> => {
  return await httpPut<CostCenterModel>(`${apiEndPoint}/${id}`, data);
};

// DELETE a currency by ID
const deleteCostCenter = async (
  id: string
): Promise<ApiResult<CostCenterModel>> => {
  return await httpDelete<CostCenterModel>(`${apiEndPoint}/${id}`, { id });
};
export {
  getCostCenters,
  getCostCenterById,
  createCostCenter,
  updateCostCenter,
  deleteCostCenter,
}; 
