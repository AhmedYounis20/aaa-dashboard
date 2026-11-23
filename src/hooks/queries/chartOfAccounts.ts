import { useQuery } from "@tanstack/react-query";
import {
  createChartOfAccount,
  deleteChartOfAccount,
  getChartOfAccountById,
  getChartOfAccounts,
  getDefaultChartOfAccount,
  updateChartOfAccount,
} from "@/Apis/Account/ChartOfAccountsApi";
import type { ChartOfAccountModel } from "@/interfaces/ProjectInterfaces";
import { FormTypes } from "@/interfaces/Components/FormType";
import { queryKeys } from "@/lib/queryKeys";
import { unwrapApiResult } from "@/lib/unwrapApiResult";
import { useEntityList } from "./useEntityList";
import { useEntityMutations } from "./useEntityMutations";

export function useChartOfAccountsList() {
  return useEntityList<ChartOfAccountModel>({
    queryKey: queryKeys.chartOfAccounts.all,
    fetcher: getChartOfAccounts,
  });
}

export function useChartOfAccountDetail(id: string, formType: FormTypes, parentId: string | null) {
  const isEdit = formType !== FormTypes.Add && Boolean(id);
  const isAdd = formType === FormTypes.Add;

  const detailQuery = useQuery({
    queryKey: queryKeys.chartOfAccounts.detail(id),
    queryFn: async ({ signal }) => {
      const result = await getChartOfAccountById(id, signal);
      return unwrapApiResult(result);
    },
    enabled: isEdit,
  });

  const defaultQuery = useQuery({
    queryKey: queryKeys.chartOfAccounts.default(parentId),
    queryFn: async ({ signal }) => {
      const result = await getDefaultChartOfAccount(parentId, signal);
      return result?.result ?? null;
    },
    enabled: isAdd,
  });

  return {
    data: detailQuery.data,
    defaultData: defaultQuery.data,
    isLoading: detailQuery.isLoading || defaultQuery.isLoading,
  };
}

export function useChartOfAccountMutations() {
  return useEntityMutations<ChartOfAccountModel>({
    listQueryKey: queryKeys.chartOfAccounts.all,
    detailQueryKey: queryKeys.chartOfAccounts.detail,
    createFn: createChartOfAccount,
    updateFn: updateChartOfAccount,
    deleteFn: deleteChartOfAccount,
  });
}
