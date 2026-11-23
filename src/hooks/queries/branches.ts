import {
  createBranch,
  deleteBranch,
  getBranchById,
  getBranches,
  getDefaultBranchData,
  updateBranch,
} from "@/Apis/Account/BranchesApi";
import BranchModel from "@/interfaces/ProjectInterfaces/Account/SubLedgers/Branches/BranchModel";
import { FormTypes } from "@/interfaces/Components/FormType";
import { queryKeys } from "@/lib/queryKeys";
import { useEntityList } from "./useEntityList";
import { useEntityMutations } from "./useEntityMutations";
import { useSubLedgerDetail } from "./useSubLedgerDetail";

export function useBranchesList() {
  return useEntityList<BranchModel>({
    queryKey: queryKeys.branches.all,
    fetcher: getBranches,
  });
}

export function useBranchDetail(id: string, formType: FormTypes, parentId: string | null) {
  return useSubLedgerDetail<BranchModel>({
    detailQueryKey: queryKeys.branches.detail(id),
    defaultQueryKey: queryKeys.branches.default(parentId),
    getById: getBranchById,
    getDefault: getDefaultBranchData,
    id,
    formType,
    parentId,
  });
}

export function useBranchMutations() {
  return useEntityMutations<BranchModel>({
    listQueryKey: queryKeys.branches.all,
    detailQueryKey: queryKeys.branches.detail,
    createFn: createBranch,
    updateFn: updateBranch,
    deleteFn: deleteBranch,
  });
}
