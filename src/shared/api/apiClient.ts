import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { baseUrl } from "../../Utilities/SD";
import { ApiResult } from "../../interfaces/ApiResponse";
import { authStorage } from "../../features/auth/authStorage";
import { triggerUnauthorized } from "../../features/auth/authEvents";
import { logger } from "./logger";

/** Transport + toast options. Toast flags are consumed by `Apis/Axios/axiosMethods`; signal/timeout by this client. */
export interface ApiRequestOptions {
  notifySuccess?: boolean;
  notifyError?: boolean;
  signal?: AbortSignal;
  /** Axios timeout in ms. Defaults to 30s. */
  timeout?: number;
}

export type HttpTransportOptions = Pick<ApiRequestOptions, "signal" | "timeout">;

const DEFAULT_TIMEOUT_MS = 30_000;

const defaultRequestOptions: Required<Pick<ApiRequestOptions, "notifySuccess" | "notifyError">> = {
  notifySuccess: false,
  notifyError: false,
};

interface RetryableRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

let refreshPromise: Promise<boolean> | null = null;

function getAcceptLanguage(): string {
  const language = (localStorage.getItem("i18nextLng") || "").toLowerCase();
  // i18next / browser may store "en", "en-US", "en-GB", etc.
  return language === "en" || language.startsWith("en-") ? "en-US" : "ar-EG";
}

export async function refreshTokens(): Promise<boolean> {
  if (refreshPromise) {
    return refreshPromise;
  }

  refreshPromise = (async () => {
    const refreshToken = authStorage.getRefreshToken();
    const accessToken = authStorage.getAccessToken();

    if (!refreshToken || !accessToken) {
      return false;
    }

    try {
      const response = await axios.post(`${baseUrl}auth/refresh`, {
        refreshToken,
        accessToken,
      });

      const { accessToken: newAccess, refreshToken: newRefresh } = response.data.result;
      authStorage.setTokens(newAccess, newRefresh);
      logger.debug("Access token refreshed");
      return true;
    } catch (error) {
      logger.error("Token refresh failed", error);
      authStorage.clear();
      triggerUnauthorized();
      return false;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

const client = axios.create({
  baseURL: baseUrl,
  timeout: DEFAULT_TIMEOUT_MS,
  headers: {
    Accept: "application/json",
  },
});

client.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const accessToken = authStorage.getAccessToken();

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  config.headers["Accept-Language"] = getAcceptLanguage();
  return config;
});

client.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryableRequestConfig | undefined;

    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshed = await refreshTokens();

      if (refreshed) {
        const accessToken = authStorage.getAccessToken();
        if (accessToken) {
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        }
        return client(originalRequest);
      }
    }

    return Promise.reject(error);
  }
);

function buildErrorResult<T>(error: unknown): ApiResult<T> {
  const axiosError = error as AxiosError<ApiResult<T>>;

  if (axiosError.response?.data) {
    return axiosError.response.data;
  }

  if (axios.isCancel(error) || axiosError.code === "ERR_CANCELED") {
    return {
      isSuccess: false,
      errorMessages: ["Request aborted"],
      result: {} as T,
      statusCode: 0,
      successMessage: "",
    };
  }

  const message = axiosError instanceof Error ? axiosError.message : "An unexpected error occurred";

  return {
    isSuccess: false,
    errorMessages: [message],
    result: {} as T,
    statusCode: axiosError.response?.status ?? 500,
    successMessage: "",
  };
}

async function request<T>(
  method: "get" | "post" | "put" | "delete",
  url: string,
  data?: object,
  params?: object,
  config?: HttpTransportOptions
): Promise<ApiResult<T>> {
  const axiosConfig = {
    params,
    signal: config?.signal,
    timeout: config?.timeout ?? DEFAULT_TIMEOUT_MS,
  };

  try {
    let response: AxiosResponse<ApiResult<T>>;

    switch (method) {
      case "get":
        response = await client.get(url, axiosConfig);
        break;
      case "post":
        response = await client.post(url, data, axiosConfig);
        break;
      case "put":
        response = await client.put(url, data, axiosConfig);
        break;
      case "delete":
        response = await client.delete(url, { ...axiosConfig, data });
        break;
    }

    logger.debug(`${method.toUpperCase()} ${url}`, response.status, response.data);
    return response.data;
  } catch (error) {
    logger.error(`Error in ${method.toUpperCase()} ${url}`, error);
    return buildErrorResult<T>(error);
  }
}

export const httpGet = <T>(
  url: string,
  params: object = {},
  config?: HttpTransportOptions
): Promise<ApiResult<T>> => request<T>("get", url, undefined, params, config);

export const httpPost = <T>(
  url: string,
  data: object,
  config?: HttpTransportOptions
): Promise<ApiResult<T>> => request<T>("post", url, data, undefined, config);

export const httpPut = <T>(
  url: string,
  data: object,
  config?: HttpTransportOptions
): Promise<ApiResult<T>> => request<T>("put", url, data, undefined, config);

export const httpDelete = <T>(
  url: string,
  data: object = {},
  config?: HttpTransportOptions
): Promise<ApiResult<T>> => request<T>("delete", url, data, undefined, config);

export { client as apiClient, defaultRequestOptions, DEFAULT_TIMEOUT_MS };
