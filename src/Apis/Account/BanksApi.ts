import BankModel from "@/interfaces/ProjectInterfaces/Account/SubLedgers/Banks/BankModel";
import { createCrudApi, httpGet } from "@/shared/api";
import type { HttpTransportOptions } from "@/shared/api";

const endpoint = "banks";
const crud = createCrudApi<BankModel>(endpoint);

const getBanks = (signal?: AbortSignal) => crud.getAll({ signal });

const getBankById = (id: string, signal?: AbortSignal) => crud.getById(id, { signal });

const getDefaultBank = (parentId: string | null, signal?: AbortSignal) =>
  httpGet<BankModel>(
    `${endpoint}/NextAccountDefaultData${parentId == null ? "" : `?parentId=${parentId}`}`,
    {},
    { signal }
  );

const createBank = (data: BankModel, options?: HttpTransportOptions) => crud.create(data, options);

const updateBank = (id: string, data: BankModel, options?: HttpTransportOptions) =>
  crud.update(id, data, options);

const deleteBank = (id: string, options?: HttpTransportOptions) => crud.remove(id, options);

export { getBanks, getBankById, getDefaultBank, createBank, updateBank, deleteBank };
