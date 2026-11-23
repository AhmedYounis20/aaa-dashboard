import {
  createCashInBox,
  deleteCashInBox,
  getCashInBoxById,
  getCashInBoxes,
  getDefaultCashInBox,
  updateCashInBox,
} from "@/Apis/Account/CashInBoxesApi";
import CashInBoxModel from "@/interfaces/ProjectInterfaces/Account/SubLedgers/CashInBoxes/CashInBoxModel";
import { FormTypes } from "@/interfaces/Components/FormType";
import { queryKeys } from "@/lib/queryKeys";
import { useEntityList } from "./useEntityList";
import { useEntityMutations } from "./useEntityMutations";
import { useSubLedgerDetail } from "./useSubLedgerDetail";

export function useCashInBoxesList() {
  return useEntityList<CashInBoxModel>({
    queryKey: queryKeys.cashInBoxes.all,
    fetcher: getCashInBoxes,
  });
}

export function useCashInBoxDetail(id: string, formType: FormTypes, parentId: string | null) {
  return useSubLedgerDetail<CashInBoxModel>({
    detailQueryKey: queryKeys.cashInBoxes.detail(id),
    defaultQueryKey: queryKeys.cashInBoxes.default(parentId),
    getById: getCashInBoxById,
    getDefault: getDefaultCashInBox,
    id,
    formType,
    parentId,
  });
}

export function useCashInBoxMutations() {
  return useEntityMutations<CashInBoxModel>({
    listQueryKey: queryKeys.cashInBoxes.all,
    detailQueryKey: queryKeys.cashInBoxes.detail,
    createFn: createCashInBox,
    updateFn: updateCashInBox,
    deleteFn: deleteCashInBox,
  });
}
