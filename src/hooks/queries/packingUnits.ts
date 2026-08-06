import {
  createPackingUnit,
  deletePackingUnit,
  getPackingUnitById,
  getPackingUnits,
  updatePackingUnit,
} from "../../Apis/Inventory/PackingUnitsApi";
import PackingUnitModel from "../../interfaces/ProjectInterfaces/Inventory/PackingUnits/PackingUnitModel";
import { FormTypes } from "../../interfaces/Components/FormType";
import { queryKeys } from "../../lib/queryKeys";
import { useEntityDetail } from "./useEntityDetail";
import { useEntityList } from "./useEntityList";
import { useEntityMutations } from "./useEntityMutations";

export function usePackingUnitsList() {
  return useEntityList<PackingUnitModel>({
    queryKey: queryKeys.packingUnits.all,
    fetcher: getPackingUnits,
  });
}

export function usePackingUnitDetail(id: string, formType: FormTypes) {
  return useEntityDetail<PackingUnitModel>({
    queryKey: queryKeys.packingUnits.detail(id),
    fetcher: getPackingUnitById,
    id,
    formType,
  });
}

export function usePackingUnitMutations() {
  return useEntityMutations<PackingUnitModel>({
    listQueryKey: queryKeys.packingUnits.all,
    detailQueryKey: queryKeys.packingUnits.detail,
    createFn: createPackingUnit,
    updateFn: updatePackingUnit,
    deleteFn: deletePackingUnit,
  });
}
