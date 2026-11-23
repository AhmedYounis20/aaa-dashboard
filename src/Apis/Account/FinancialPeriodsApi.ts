import FinancialPeriodModel from "@/interfaces/ProjectInterfaces/Account/FinancialPeriods/FinancialPeriodModel";
import { httpDelete, httpPost, httpPut, legacyMutationNotify } from "@/Apis/Axios/axiosMethods";
import { createCrudApi, httpGet } from "@/shared/api";

const endpoint = "FinancialPeriods";
const crud = createCrudApi<FinancialPeriodModel>(endpoint);

const getFinancialPeriods = (signal?: AbortSignal) => crud.getAll({ signal });

const getFinancialPeriodById = (id: string, signal?: AbortSignal) => crud.getById(id, { signal });

const getDefaultFinancialPeriodData = (signal?: AbortSignal) =>
  httpGet<FinancialPeriodModel>(`${endpoint}/nextDefaultdata`, {}, { signal });

/** Forms still call mutations directly; keep legacy toasts. */
const createFinancialPeriod = (data: FinancialPeriodModel) =>
  httpPost<FinancialPeriodModel>(endpoint, data, legacyMutationNotify);

const updateFinancialPeriod = (id: string, data: FinancialPeriodModel) =>
  httpPut<FinancialPeriodModel>(`${endpoint}/${id}`, data, legacyMutationNotify);

const deleteFinancialPeriod = (id: string) =>
  httpDelete<FinancialPeriodModel>(`${endpoint}/${id}`, { id }, legacyMutationNotify);

export {
  getFinancialPeriods,
  getFinancialPeriodById,
  createFinancialPeriod,
  updateFinancialPeriod,
  deleteFinancialPeriod,
  getDefaultFinancialPeriodData,
};
