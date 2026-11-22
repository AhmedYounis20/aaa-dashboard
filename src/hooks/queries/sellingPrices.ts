import {
  createSellingPrice,
  deleteSellingPrice,
  getSellingPriceById,
  getSellingPrices,
  updateSellingPrice,
} from "../../Apis/Inventory/SellingPricesApi";
import SellingPriceModel from "../../interfaces/ProjectInterfaces/Inventory/SellingPrices/SellingPriceModel";
import { FormTypes } from "../../interfaces/Components/FormType";
import { queryKeys } from "../../lib/queryKeys";
import { useEntityDetail } from "./useEntityDetail";
import { useEntityList } from "./useEntityList";
import { useEntityMutations } from "./useEntityMutations";

export function useSellingPricesList() {
  return useEntityList<SellingPriceModel>({
    queryKey: queryKeys.sellingPrices.all,
    fetcher: getSellingPrices,
  });
}

export function useSellingPriceDetail(id: string, formType: FormTypes) {
  return useEntityDetail<SellingPriceModel>({
    queryKey: queryKeys.sellingPrices.detail(id),
    fetcher: getSellingPriceById,
    id,
    formType,
  });
}

export function useSellingPriceMutations() {
  return useEntityMutations<SellingPriceModel>({
    listQueryKey: queryKeys.sellingPrices.all,
    detailQueryKey: queryKeys.sellingPrices.detail,
    createFn: createSellingPrice,
    updateFn: updateSellingPrice,
    deleteFn: deleteSellingPrice,
  });
}
