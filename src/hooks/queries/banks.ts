import {
  createBank,
  deleteBank,
  getBankById,
  getBanks,
  getDefaultBank,
  updateBank,
} from "@/Apis/Account/BanksApi";
import BankModel from "@/interfaces/ProjectInterfaces/Account/SubLedgers/Banks/BankModel";
import { FormTypes } from "@/interfaces/Components/FormType";
import { queryKeys } from "@/lib/queryKeys";
import { useEntityList } from "./useEntityList";
import { useEntityMutations } from "./useEntityMutations";
import { useSubLedgerDetail } from "./useSubLedgerDetail";

export function useBanksList(enabled = true) {
  return useEntityList<BankModel>({
    queryKey: queryKeys.banks.all,
    fetcher: getBanks,
    enabled,
  });
}

export function useBankDetail(id: string, formType: FormTypes, parentId: string | null) {
  return useSubLedgerDetail<BankModel>({
    detailQueryKey: queryKeys.banks.detail(id),
    defaultQueryKey: queryKeys.banks.default(parentId),
    getById: getBankById,
    getDefault: getDefaultBank,
    id,
    formType,
    parentId,
  });
}

export function useBankMutations() {
  return useEntityMutations<BankModel>({
    listQueryKey: queryKeys.banks.all,
    detailQueryKey: queryKeys.banks.detail,
    createFn: createBank,
    updateFn: updateBank,
    deleteFn: deleteBank,
  });
}
