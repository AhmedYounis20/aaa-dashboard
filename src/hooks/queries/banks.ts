import { useQuery } from "@tanstack/react-query";
import {
  createBank,
  deleteBank,
  getBankById,
  getBanks,
  getDefaultBank,
  updateBank,
} from "../../Apis/Account/BanksApi";
import BankModel from "../../interfaces/ProjectInterfaces/Account/Subleadgers/Banks/BankModel";
import { FormTypes } from "../../interfaces/Components/FormType";
import { queryKeys } from "../../lib/queryKeys";
import { unwrapApiResult } from "../../lib/unwrapApiResult";
import { useEntityList } from "./useEntityList";
import { useEntityMutations } from "./useEntityMutations";

export function useBanksList() {
  return useEntityList<BankModel>({
    queryKey: queryKeys.banks.all,
    fetcher: getBanks,
  });
}

export function useBankDetail(id: string, formType: FormTypes, parentId: string | null) {
  const isEdit = formType !== FormTypes.Add && Boolean(id);
  const isAdd = formType === FormTypes.Add;

  const detailQuery = useQuery({
    queryKey: queryKeys.banks.detail(id),
    queryFn: async () => {
      const bank = unwrapApiResult(await getBankById(id));
      return {
        ...bank,
        code: bank.chartOfAccount?.code ?? bank.code,
      };
    },
    enabled: isEdit,
  });

  const defaultQuery = useQuery({
    queryKey: queryKeys.banks.default(parentId),
    queryFn: async () => {
      const result = await getDefaultBank(parentId);
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

export function useBankMutations() {
  return useEntityMutations<BankModel>({
    listQueryKey: queryKeys.banks.all,
    detailQueryKey: queryKeys.banks.detail,
    createFn: createBank,
    updateFn: updateBank,
    deleteFn: deleteBank,
  });
}
