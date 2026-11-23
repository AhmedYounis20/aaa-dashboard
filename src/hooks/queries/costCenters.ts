import {
  createCostCenter,
  deleteCostCenter,
  getCostCenterById,
  getCostCenters,
  updateCostCenter,
} from "@/Apis/Account/CostCenterApi";
import type { CostCenterModel } from "@/interfaces/ProjectInterfaces/Account/CostCenters/costCenterModel";
import { FormTypes } from "@/interfaces/Components/FormType";
import { queryKeys } from "@/lib/queryKeys";
import { useEntityDetail } from "./useEntityDetail";
import { useEntityList } from "./useEntityList";
import { useEntityMutations } from "./useEntityMutations";
import { ApiResult } from "@/interfaces/ApiResponse";

async function fetchCostCenterById(
  id: string,
  signal?: AbortSignal
): Promise<ApiResult<CostCenterModel>> {
  return (await getCostCenterById(id, signal)) as ApiResult<CostCenterModel>;
}

export function useCostCentersList() {
  return useEntityList<CostCenterModel>({
    queryKey: queryKeys.costCenters.all,
    fetcher: getCostCenters,
  });
}

export function useCostCenterDetail(id: string, formType: FormTypes) {
  return useEntityDetail<CostCenterModel>({
    queryKey: queryKeys.costCenters.detail(id),
    fetcher: fetchCostCenterById,
    id,
    formType,
  });
}

export function useCostCenterMutations() {
  return useEntityMutations<CostCenterModel>({
    listQueryKey: queryKeys.costCenters.all,
    detailQueryKey: queryKeys.costCenters.detail,
    createFn: createCostCenter,
    updateFn: updateCostCenter,
    deleteFn: deleteCostCenter,
  });
}
