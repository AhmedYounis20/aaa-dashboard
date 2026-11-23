import ManufacturerCompanyModel from "@/interfaces/ProjectInterfaces/Inventory/ManufacturerCompanies/ManufacturerCompanyModel";
import { createCrudApi } from "@/shared/api";
import type { HttpTransportOptions } from "@/shared/api";

const crud = createCrudApi<ManufacturerCompanyModel>("ManufacturerCompanies");

const getManufacturerCompanies = (signal?: AbortSignal) => crud.getAll({ signal });

const getManufacturerCompanyById = (id: string, signal?: AbortSignal) =>
  crud.getById(id, { signal });

const createManufacturerCompany = (
  data: ManufacturerCompanyModel,
  options?: HttpTransportOptions
) => crud.create(data, options);

const updateManufacturerCompany = (
  id: string,
  data: ManufacturerCompanyModel,
  options?: HttpTransportOptions
) => crud.update(id, data, options);

const deleteManufacturerCompany = (id: string, options?: HttpTransportOptions) =>
  crud.remove(id, options);

export {
  getManufacturerCompanies,
  getManufacturerCompanyById,
  createManufacturerCompany,
  updateManufacturerCompany,
  deleteManufacturerCompany,
};
