import {
  createManufacturerCompany,
  deleteManufacturerCompany,
  getManufacturerCompanies,
  getManufacturerCompanyById,
  updateManufacturerCompany,
} from "../../Apis/Inventory/ManufacturerCompaniesApi";
import ManufacturerCompanyModel from "../../interfaces/ProjectInterfaces/Inventory/ManufacturerCompanies/ManufacturerCompanyModel";
import { FormTypes } from "../../interfaces/Components/FormType";
import { queryKeys } from "../../lib/queryKeys";
import { useEntityDetail } from "./useEntityDetail";
import { useEntityList } from "./useEntityList";
import { useEntityMutations } from "./useEntityMutations";

export function useManufacturerCompaniesList() {
  return useEntityList<ManufacturerCompanyModel>({
    queryKey: queryKeys.manufacturerCompanies.all,
    fetcher: getManufacturerCompanies,
  });
}

export function useManufacturerCompanyDetail(id: string, formType: FormTypes) {
  return useEntityDetail<ManufacturerCompanyModel>({
    queryKey: queryKeys.manufacturerCompanies.detail(id),
    fetcher: getManufacturerCompanyById,
    id,
    formType,
  });
}

export function useManufacturerCompanyMutations() {
  return useEntityMutations<ManufacturerCompanyModel>({
    listQueryKey: queryKeys.manufacturerCompanies.all,
    detailQueryKey: queryKeys.manufacturerCompanies.detail,
    createFn: createManufacturerCompany,
    updateFn: updateManufacturerCompany,
    deleteFn: deleteManufacturerCompany,
  });
}
