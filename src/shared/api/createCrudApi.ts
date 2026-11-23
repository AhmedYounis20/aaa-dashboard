import type { ApiResult } from "@/interfaces/ApiResponse";
import { httpDelete, httpGet, httpPost, httpPut, type HttpTransportOptions } from "./apiClient";

export type CrudApi<T extends object> = {
  getAll: (options?: HttpTransportOptions) => Promise<ApiResult<T[]>>;
  getById: (id: string, options?: HttpTransportOptions) => Promise<ApiResult<T>>;
  create: (data: T, options?: HttpTransportOptions) => Promise<ApiResult<T>>;
  update: (id: string, data: T, options?: HttpTransportOptions) => Promise<ApiResult<T>>;
  remove: (id: string, options?: HttpTransportOptions) => Promise<ApiResult<T>>;
};

/**
 * Generic CRUD client for REST resources at `endpoint`.
 * Transport options (`signal`, `timeout`) are forwarded to apiClient.
 * Toast policy stays outside this factory (Query mutations or axiosMethods wrappers).
 */
export function createCrudApi<T extends object>(endpoint: string): CrudApi<T> {
  return {
    getAll: (options) => httpGet<T[]>(endpoint, {}, options),
    getById: (id, options) => httpGet<T>(`${endpoint}/${id}`, {}, options),
    create: (data, options) => httpPost<T>(endpoint, data, options),
    update: (id, data, options) => httpPut<T>(`${endpoint}/${id}`, data, options),
    remove: (id, options) => httpDelete<T>(`${endpoint}/${id}`, { id }, options),
  };
}
