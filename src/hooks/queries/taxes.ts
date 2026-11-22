import { useQuery } from "@tanstack/react-query";
import {
  createTax,
  deleteTax,
  getDefaultTax,
  getTaxById,
  getTaxes,
  updateTax,
} from "../../Apis/Account/TaxesApi";
import { TaxInputModel, TaxModel } from "../../interfaces/ProjectInterfaces/Account/Subleadgers/Taxes/TaxModel";
import { FormTypes } from "../../interfaces/Components/FormType";
import { queryKeys } from "../../lib/queryKeys";
import { unwrapApiResult } from "../../lib/unwrapApiResult";
import { useEntityList } from "./useEntityList";
import { useEntityMutations } from "./useEntityMutations";

export function useTaxesList() {
  return useEntityList<TaxModel>({
    queryKey: queryKeys.taxes.all,
    fetcher: getTaxes,
  });
}

export function useTaxDetail(id: string, formType: FormTypes, parentId: string | null) {
  const isEdit = formType !== FormTypes.Add && Boolean(id);
  const isAdd = formType === FormTypes.Add;

  const detailQuery = useQuery({
    queryKey: queryKeys.taxes.detail(id),
    queryFn: async () => {
      const tax = unwrapApiResult(await getTaxById(id));
      return {
        ...tax,
        code: tax.chartOfAccount?.code ?? tax.code,
      };
    },
    enabled: isEdit,
  });

  const defaultQuery = useQuery({
    queryKey: queryKeys.taxes.default(parentId),
    queryFn: async () => {
      const result = await getDefaultTax(parentId);
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

export function useTaxMutations() {
  return useEntityMutations<TaxModel, TaxInputModel>({
    listQueryKey: queryKeys.taxes.all,
    detailQueryKey: queryKeys.taxes.detail,
    createFn: createTax,
    updateFn: updateTax,
    deleteFn: deleteTax,
  });
}
