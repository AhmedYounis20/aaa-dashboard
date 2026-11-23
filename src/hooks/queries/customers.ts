import {
  createCustomer,
  deleteCustomer,
  getCustomerById,
  getCustomers,
  getDefaultCustomer,
  updateCustomer,
} from "@/Apis/Account/CustomersApi";
import CustomerModel from "@/interfaces/ProjectInterfaces/Account/SubLedgers/Customers/CustomerModel";
import { FormTypes } from "@/interfaces/Components/FormType";
import { queryKeys } from "@/lib/queryKeys";
import { useEntityList } from "./useEntityList";
import { useEntityMutations } from "./useEntityMutations";
import { useSubLedgerDetail } from "./useSubLedgerDetail";

export function useCustomersList() {
  return useEntityList<CustomerModel>({
    queryKey: queryKeys.customers.all,
    fetcher: getCustomers,
  });
}

export function useCustomerDetail(id: string, formType: FormTypes, parentId: string | null) {
  return useSubLedgerDetail<CustomerModel>({
    detailQueryKey: queryKeys.customers.detail(id),
    defaultQueryKey: queryKeys.customers.default(parentId),
    getById: getCustomerById,
    getDefault: getDefaultCustomer,
    id,
    formType,
    parentId,
  });
}

export function useCustomerMutations() {
  return useEntityMutations<CustomerModel>({
    listQueryKey: queryKeys.customers.all,
    detailQueryKey: queryKeys.customers.detail,
    createFn: createCustomer,
    updateFn: updateCustomer,
    deleteFn: deleteCustomer,
  });
}
