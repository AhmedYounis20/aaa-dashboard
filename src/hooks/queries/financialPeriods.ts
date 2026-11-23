import { useQuery } from "@tanstack/react-query";
import {
  createFinancialPeriod,
  deleteFinancialPeriod,
  getDefaultFinancialPeriodData,
  getFinancialPeriodById,
  getFinancialPeriods,
  updateFinancialPeriod,
} from "@/Apis/Account/FinancialPeriodsApi";
import FinancialPeriodModel from "@/interfaces/ProjectInterfaces/Account/FinancialPeriods/FinancialPeriodModel";
import { FormTypes } from "@/interfaces/Components/FormType";
import { queryKeys } from "@/lib/queryKeys";
import { useEntityDetail } from "./useEntityDetail";
import { useEntityList } from "./useEntityList";
import { useEntityMutations } from "./useEntityMutations";

export function useFinancialPeriodsList() {
  return useEntityList<FinancialPeriodModel>({
    queryKey: queryKeys.financialPeriods.all,
    fetcher: getFinancialPeriods,
  });
}

export function useFinancialPeriodDetail(id: string, formType: FormTypes) {
  const detail = useEntityDetail<FinancialPeriodModel>({
    queryKey: queryKeys.financialPeriods.detail(id),
    fetcher: getFinancialPeriodById,
    id,
    formType,
  });

  const defaultQuery = useQuery({
    queryKey: queryKeys.financialPeriods.default,
    queryFn: async () => {
      const result = await getDefaultFinancialPeriodData();
      return result?.result ?? null;
    },
    enabled: formType === FormTypes.Add,
  });

  return {
    data: detail.data,
    defaultData: defaultQuery.data,
    isLoading: detail.isLoading || defaultQuery.isLoading,
  };
}

export function useFinancialPeriodMutations() {
  return useEntityMutations<FinancialPeriodModel>({
    listQueryKey: queryKeys.financialPeriods.all,
    detailQueryKey: queryKeys.financialPeriods.detail,
    createFn: createFinancialPeriod,
    updateFn: updateFinancialPeriod,
    deleteFn: deleteFinancialPeriod,
  });
}
