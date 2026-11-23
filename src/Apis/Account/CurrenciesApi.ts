import CurrencyModel from "@/interfaces/ProjectInterfaces/Account/Currencies/CurrencyModel";
import { createCrudApi } from "@/shared/api";
import type { HttpTransportOptions } from "@/shared/api";

const crud = createCrudApi<CurrencyModel>("currencies");

const getCurrencies = (signal?: AbortSignal) => crud.getAll({ signal });

const getCurrencyById = (id: string, signal?: AbortSignal) => crud.getById(id, { signal });

const createCurrency = (data: CurrencyModel, options?: HttpTransportOptions) =>
  crud.create(data, options);

const updateCurrency = (id: string, data: CurrencyModel, options?: HttpTransportOptions) =>
  crud.update(id, data, options);

const deleteCurrency = (id: string, options?: HttpTransportOptions) => crud.remove(id, options);

export { getCurrencies, getCurrencyById, createCurrency, updateCurrency, deleteCurrency };
