import CashInBoxModel from "@/interfaces/ProjectInterfaces/Account/SubLedgers/CashInBoxes/CashInBoxModel";
import { createCrudApi, httpGet } from "@/shared/api";
import type { HttpTransportOptions } from "@/shared/api";

const endpoint = "cashInBoxes";
const crud = createCrudApi<CashInBoxModel>(endpoint);

const getCashInBoxes = (signal?: AbortSignal) => crud.getAll({ signal });

const getCashInBoxById = (id: string, signal?: AbortSignal) => crud.getById(id, { signal });

const getDefaultCashInBox = (parentId: string | null, signal?: AbortSignal) =>
  httpGet<CashInBoxModel>(
    `${endpoint}/NextAccountDefaultData${parentId == null ? "" : `?parentId=${parentId}`}`,
    {},
    { signal }
  );

const createCashInBox = (data: CashInBoxModel, options?: HttpTransportOptions) =>
  crud.create(data, options);

const updateCashInBox = (id: string, data: CashInBoxModel, options?: HttpTransportOptions) =>
  crud.update(id, data, options);

const deleteCashInBox = (id: string, options?: HttpTransportOptions) => crud.remove(id, options);

export {
  getCashInBoxes,
  getCashInBoxById,
  getDefaultCashInBox,
  createCashInBox,
  updateCashInBox,
  deleteCashInBox,
};
