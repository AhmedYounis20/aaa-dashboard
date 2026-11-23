import { ApiResult } from "@/interfaces/ApiResponse";
import { toastify } from "@/Helper/toastify";
import {
  httpDelete as httpDeleteRaw,
  httpGet as httpGetRaw,
  httpPost as httpPostRaw,
  httpPut as httpPutRaw,
  ApiRequestOptions,
  HttpTransportOptions,
} from "@/lib/apiClient";

/**
 * Toast policy (axiosMethods layer):
 *
 * Mutations (POST / PUT / DELETE):
 * - Defaults **off** so TanStack Query mutation `onSuccess` / `onError`
 *   (see `useEntityMutations`) owns feedback.
 * - Legacy pages that still call Apis directly should pass `legacyMutationNotify`.
 *
 * GET:
 * - Default `notifyError: false` so Query-backed lists/details can show ErrorState
 *   without a duplicate toast.
 * - Legacy `useEffect` fetches that still rely on toasts (no ErrorState) should
 *   pass `legacyGetNotify`.
 */
export const legacyMutationNotify: Required<
  Pick<ApiRequestOptions, "notifySuccess" | "notifyError">
> = {
  notifySuccess: true,
  notifyError: true,
};

/** Opt-in GET error toasts for legacy useEffect fetches without Query ErrorState. */
export const legacyGetNotify: Required<Pick<ApiRequestOptions, "notifySuccess" | "notifyError">> = {
  notifySuccess: false,
  notifyError: true,
};

function notifyApiResult<T>(
  result: ApiResult<T>,
  options: Required<Pick<ApiRequestOptions, "notifySuccess" | "notifyError">>
): void {
  if (!result.isSuccess) {
    if (options.notifyError) {
      result.errorMessages?.forEach((message) => toastify(message, "error"));
    }
    return;
  }

  if (options.notifySuccess && result.successMessage) {
    toastify(result.successMessage, "success");
  }
}

function withMutationDefaults(
  options?: ApiRequestOptions
): Required<Pick<ApiRequestOptions, "notifySuccess" | "notifyError">> {
  return {
    notifySuccess: options?.notifySuccess ?? false,
    notifyError: options?.notifyError ?? false,
  };
}

function withGetDefaults(
  options?: ApiRequestOptions
): Required<Pick<ApiRequestOptions, "notifySuccess" | "notifyError">> {
  return {
    notifySuccess: options?.notifySuccess ?? false,
    notifyError: options?.notifyError ?? false,
  };
}

function transportOf(options?: ApiRequestOptions): HttpTransportOptions | undefined {
  if (!options) return undefined;
  const { signal, timeout } = options;
  if (signal === undefined && timeout === undefined) return undefined;
  return { signal, timeout };
}

const httpPost = async <T>(
  url: string,
  data: object,
  options?: ApiRequestOptions
): Promise<ApiResult<T>> => {
  const notifyOptions = withMutationDefaults(options);
  const result = await httpPostRaw<T>(url, data, transportOf(options));
  notifyApiResult(result, notifyOptions);
  return result;
};

const httpGet = async <T>(
  url: string,
  params: object,
  options?: ApiRequestOptions
): Promise<ApiResult<T>> => {
  const notifyOptions = withGetDefaults(options);
  const result = await httpGetRaw<T>(url, params, transportOf(options));
  notifyApiResult(result, notifyOptions);
  return result;
};

const httpPut = async <T>(
  url: string,
  data: object,
  options?: ApiRequestOptions
): Promise<ApiResult<T>> => {
  const notifyOptions = withMutationDefaults(options);
  const result = await httpPutRaw<T>(url, data, transportOf(options));
  notifyApiResult(result, notifyOptions);
  return result;
};

const httpDelete = async <T>(
  url: string,
  data: object,
  options?: ApiRequestOptions
): Promise<ApiResult<T>> => {
  const notifyOptions = withMutationDefaults(options);
  const result = await httpDeleteRaw<T>(url, data, transportOf(options));
  notifyApiResult(result, notifyOptions);
  return result;
};

export { httpPost, httpGet, httpPut, httpDelete };
export type { ApiRequestOptions };
