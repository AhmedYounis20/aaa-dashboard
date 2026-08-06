import {
  createCurrency,
  deleteCurrency,
  getCurrencies,
  getCurrencyById,
  updateCurrency,
} from "../../Apis/Account/CurrenciesApi";
import CurrencyModel from "../../interfaces/ProjectInterfaces/Account/Currencies/CurrencyModel";
import { FormTypes } from "../../interfaces/Components/FormType";
import { queryKeys } from "../../lib/queryKeys";
import { useEntityDetail } from "./useEntityDetail";
import { useEntityList } from "./useEntityList";
import { useEntityMutations } from "./useEntityMutations";

export function useCurrenciesList() {
  return useEntityList<CurrencyModel>({
    queryKey: queryKeys.currencies.all,
    fetcher: getCurrencies,
  });
}

export function useCurrencyDetail(id: string, formType: FormTypes) {
  return useEntityDetail<CurrencyModel>({
    queryKey: queryKeys.currencies.detail(id),
    fetcher: getCurrencyById,
    id,
    formType,
  });
}

export function useCurrencyMutations() {
  return useEntityMutations<CurrencyModel>({
    listQueryKey: queryKeys.currencies.all,
    detailQueryKey: queryKeys.currencies.detail,
    createFn: createCurrency,
    updateFn: updateCurrency,
    deleteFn: deleteCurrency,
  });
}
