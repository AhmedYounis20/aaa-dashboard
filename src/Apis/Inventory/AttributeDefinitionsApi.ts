  import { ApiResponse, ApiResult } from "../../interfaces/ApiResponse";
  import { httpDelete, httpGet, httpPost, httpPut } from "../Axios/axiosMethods";
  import AttributeDefinitionModel from "../../interfaces/ProjectInterfaces/Inventory/AttributeDefinitions/AttributeDefinitionModel";

  const apiEndPoint = "AttributeDefinitions";

  const getAttributeDefinitions = async (): Promise<ApiResult<AttributeDefinitionModel[]>> => {
    return await httpGet<AttributeDefinitionModel[]>(apiEndPoint, {});
  };

  const getAttributeDefinitionById = async (
    id: string
  ): Promise<ApiResult<AttributeDefinitionModel>> => {
    return await httpGet<AttributeDefinitionModel>(`${apiEndPoint}/${id}`, {});
  };

const getAttributeDefinitionByIdWithValues = async (
  id: string
): Promise<ApiResponse<AttributeDefinitionModel>> => {
  const response = await httpGet<ApiResult<AttributeDefinitionModel>>(`${apiEndPoint}/${id}/with-Values`, {});

  return {
    data: {
      ...response,
      result: (response as any).data ?? response.result, 
    },
    error: null,
  };
};

  const createAttributeDefinition = async (
    data: AttributeDefinitionModel
  ): Promise<ApiResult<AttributeDefinitionModel>> => {
    return await httpPost<AttributeDefinitionModel>(apiEndPoint, data);
  };

  const updateAttributeDefinition = async (
    id: string,
    data: AttributeDefinitionModel
  ): Promise<ApiResult<AttributeDefinitionModel>> => {
    debugger;
    return await httpPut<AttributeDefinitionModel>(`${apiEndPoint}/${id}`, data);
  };

  const deleteAttributeDefinition = async (
    id: string
  ): Promise<ApiResult<AttributeDefinitionModel>> => {
    return await httpDelete<AttributeDefinitionModel>(`${apiEndPoint}/${id}`, { id });
  };

  export {
    getAttributeDefinitions,
    getAttributeDefinitionById,
    getAttributeDefinitionByIdWithValues,
    createAttributeDefinition,
    updateAttributeDefinition,
    deleteAttributeDefinition,
  };
