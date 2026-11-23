import {
  createTax,
  deleteTax,
  getDefaultTax,
  getTaxById,
  getTaxes,
  updateTax,
} from "@/Apis/Account/TaxesApi";
import {
  TaxInputModel,
  TaxModel,
} from "@/interfaces/ProjectInterfaces/Account/SubLedgers/Taxes/TaxModel";
import { FormTypes } from "@/interfaces/Components/FormType";
import { queryKeys } from "@/lib/queryKeys";
import { useEntityList } from "./useEntityList";
import { useEntityMutations } from "./useEntityMutations";
import { useSubLedgerDetail } from "./useSubLedgerDetail";

export function useTaxesList() {
  return useEntityList<TaxModel>({
    queryKey: queryKeys.taxes.all,
    fetcher: getTaxes,
  });
}

export function useTaxDetail(id: string, formType: FormTypes, parentId: string | null) {
  return useSubLedgerDetail<TaxModel>({
    detailQueryKey: queryKeys.taxes.detail(id),
    defaultQueryKey: queryKeys.taxes.default(parentId),
    getById: getTaxById,
    getDefault: getDefaultTax,
    id,
    formType,
    parentId,
  });
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
