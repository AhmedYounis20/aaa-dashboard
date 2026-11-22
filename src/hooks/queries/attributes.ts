import { useQuery } from "@tanstack/react-query";
import {
  createAttributeDefinition,
  deleteAttributeDefinition,
  getAttributeDefinitionByIdWithValues,
  getAttributeDefinitions,
  updateAttributeDefinition,
} from "../../Apis/Inventory/AttributeDefinitionsApi";
import AttributeDefinitionModel from "../../interfaces/ProjectInterfaces/Inventory/AttributeDefinitions/AttributeDefinitionModel";
import { FormTypes } from "../../interfaces/Components/FormType";
import { queryKeys } from "../../lib/queryKeys";
import { unwrapApiResult } from "../../lib/unwrapApiResult";
import { useEntityList } from "./useEntityList";
import { useEntityMutations } from "./useEntityMutations";

export function useAttributesList() {
  return useEntityList<AttributeDefinitionModel>({
    queryKey: queryKeys.attributes.all,
    fetcher: getAttributeDefinitions,
  });
}

export function useAttributeDetail(id: string, formType: FormTypes) {
  const enabled = formType !== FormTypes.Add && Boolean(id);

  return useQuery({
    queryKey: queryKeys.attributes.detail(id),
    queryFn: async () =>
      unwrapApiResult(await getAttributeDefinitionByIdWithValues(id)),
    enabled,
  });
}

export function useAttributeMutations() {
  return useEntityMutations<AttributeDefinitionModel>({
    listQueryKey: queryKeys.attributes.all,
    detailQueryKey: queryKeys.attributes.detail,
    createFn: createAttributeDefinition,
    updateFn: updateAttributeDefinition,
    deleteFn: deleteAttributeDefinition,
  });
}
