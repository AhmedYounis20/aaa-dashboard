import {
  deleteVariant,
  getVariantById,
  getVariants,
  updateVariant,
} from "@/Apis/Inventory/VariantsApi";
import VariantModel from "@/interfaces/ProjectInterfaces/Inventory/Variants/VariantModel";
import VariantInputModel from "@/interfaces/ProjectInterfaces/Inventory/Variants/VariantInputModel";
import { FormTypes } from "@/interfaces/Components/FormType";
import { queryKeys } from "@/lib/queryKeys";
import { ApiResult } from "@/interfaces/ApiResponse";
import { useEntityDetail } from "./useEntityDetail";
import { useEntityList } from "./useEntityList";
import { useEntityMutations } from "./useEntityMutations";

/** Variants are typically created via Products; list/detail/update/delete only. */
export function useVariantsList() {
  return useEntityList<VariantModel>({
    queryKey: queryKeys.variants.all,
    fetcher: getVariants,
  });
}

export function useVariantDetail(id: string, formType: FormTypes) {
  return useEntityDetail<VariantModel>({
    queryKey: queryKeys.variants.detail(id),
    fetcher: getVariantById,
    id,
    formType,
  });
}

async function unsupportedCreate(data: VariantInputModel): Promise<ApiResult<VariantModel>> {
  void data;
  return {
    isSuccess: false,
    result: null as unknown as VariantModel,
    errorMessages: ["Variants are created via Products"],
    statusCode: 400,
    successMessage: "",
  };
}

export function useVariantMutations() {
  return useEntityMutations<VariantModel, VariantInputModel>({
    listQueryKey: queryKeys.variants.all,
    detailQueryKey: queryKeys.variants.detail,
    createFn: unsupportedCreate,
    updateFn: updateVariant,
    deleteFn: deleteVariant,
  });
}
