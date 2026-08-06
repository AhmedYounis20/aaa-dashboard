import { ApiResult } from "../../interfaces/ApiResponse";
import { toastify } from "../../Helper/toastify";
import {
  httpDelete as httpDeleteRaw,
  httpGet as httpGetRaw,
  httpPost as httpPostRaw,
  httpPut as httpPutRaw,
  ApiRequestOptions,
} from "../../lib/apiClient";

function notifyApiResult<T>(result: ApiResult<T>, options: Required<ApiRequestOptions>): void {
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

function withDefaults(options?: ApiRequestOptions): Required<ApiRequestOptions> {
  return {
    notifySuccess: options?.notifySuccess ?? true,
    notifyError: options?.notifyError ?? true,
  };
}

const httpPost = async <T>(
  url: string,
  data: object,
  options?: ApiRequestOptions
): Promise<ApiResult<T>> => {
  const notifyOptions = withDefaults(options);
  const result = await httpPostRaw<T>(url, data);
  notifyApiResult(result, notifyOptions);
  return result;
};

const httpGet = async <T>(
  url: string,
  params: object,
  options?: ApiRequestOptions
): Promise<ApiResult<T>> => {
  const notifyOptions = withDefaults({ notifySuccess: false, ...options });
  const result = await httpGetRaw<T>(url, params);
  notifyApiResult(result, notifyOptions);
  return result;
};

const httpPut = async <T>(
  url: string,
  data: object,
  options?: ApiRequestOptions
): Promise<ApiResult<T>> => {
  const notifyOptions = withDefaults(options);
  const result = await httpPutRaw<T>(url, data);
  notifyApiResult(result, notifyOptions);
  return result;
};

const httpDelete = async <T>(
  url: string,
  data: object,
  options?: ApiRequestOptions
): Promise<ApiResult<T>> => {
  const notifyOptions = withDefaults(options);
  const result = await httpDeleteRaw<T>(url, data);
  notifyApiResult(result, notifyOptions);
  return result;
};

export { httpPost, httpGet, httpPut, httpDelete };
