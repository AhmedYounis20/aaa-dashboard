import PackingUnitModel from "@/interfaces/ProjectInterfaces/Inventory/PackingUnits/PackingUnitModel";
import { createCrudApi } from "@/shared/api";
import type { HttpTransportOptions } from "@/shared/api";

const crud = createCrudApi<PackingUnitModel>("PackingUnits");

const getPackingUnits = (signal?: AbortSignal) => crud.getAll({ signal });

const getPackingUnitById = (id: string, signal?: AbortSignal) => crud.getById(id, { signal });

const createPackingUnit = (data: PackingUnitModel, options?: HttpTransportOptions) =>
  crud.create(data, options);

const updatePackingUnit = (id: string, data: PackingUnitModel, options?: HttpTransportOptions) =>
  crud.update(id, data, options);

const deletePackingUnit = (id: string, options?: HttpTransportOptions) => crud.remove(id, options);

export {
  getPackingUnits,
  getPackingUnitById,
  createPackingUnit,
  updatePackingUnit,
  deletePackingUnit,
};
