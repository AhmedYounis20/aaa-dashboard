import SellingPriceModel from "@/interfaces/ProjectInterfaces/Inventory/SellingPrices/SellingPriceModel";
import { createCrudApi } from "@/shared/api";
import type { HttpTransportOptions } from "@/shared/api";

const crud = createCrudApi<SellingPriceModel>("SellingPrices");

const getSellingPrices = (signal?: AbortSignal) => crud.getAll({ signal });

const getSellingPriceById = (id: string, signal?: AbortSignal) => crud.getById(id, { signal });

const createSellingPrice = (data: SellingPriceModel, options?: HttpTransportOptions) =>
  crud.create(data, options);

const updateSellingPrice = (id: string, data: SellingPriceModel, options?: HttpTransportOptions) =>
  crud.update(id, data, options);

const deleteSellingPrice = (id: string, options?: HttpTransportOptions) => crud.remove(id, options);

export {
  getSellingPrices,
  getSellingPriceById,
  createSellingPrice,
  updateSellingPrice,
  deleteSellingPrice,
};
