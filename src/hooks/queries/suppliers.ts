import {
  createSupplier,
  deleteSupplier,
  getDefaultSupplier,
  getSupplierById,
  getSuppliers,
  updateSupplier,
} from "@/Apis/Account/SuppliersApi";
import SupplierModel from "@/interfaces/ProjectInterfaces/Account/SubLedgers/Suppliers/SupplierModel";
import { FormTypes } from "@/interfaces/Components/FormType";
import { queryKeys } from "@/lib/queryKeys";
import { useEntityList } from "./useEntityList";
import { useEntityMutations } from "./useEntityMutations";
import { useSubLedgerDetail } from "./useSubLedgerDetail";

export function useSuppliersList() {
  return useEntityList<SupplierModel>({
    queryKey: queryKeys.suppliers.all,
    fetcher: getSuppliers,
  });
}

export function useSupplierDetail(id: string, formType: FormTypes, parentId: string | null) {
  return useSubLedgerDetail<SupplierModel>({
    detailQueryKey: queryKeys.suppliers.detail(id),
    defaultQueryKey: queryKeys.suppliers.default(parentId),
    getById: getSupplierById,
    getDefault: getDefaultSupplier,
    id,
    formType,
    parentId,
  });
}

export function useSupplierMutations() {
  return useEntityMutations<SupplierModel>({
    listQueryKey: queryKeys.suppliers.all,
    detailQueryKey: queryKeys.suppliers.detail,
    createFn: createSupplier,
    updateFn: updateSupplier,
    deleteFn: deleteSupplier,
  });
}
