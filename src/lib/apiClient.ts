import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { baseUrl } from "../Utilities/SD";
import { ApiResult } from "../interfaces/ApiResponse";
import { authStorage } from "../features/auth/authStorage";
import { triggerUnauthorized } from "../features/auth/authEvents";
import { logger } from "./logger";

export interface ApiRequestOptions {
  notifySuccess?: boolean;
  notifyError?: boolean;
}

const defaultRequestOptions: Required<ApiRequestOptions> = {
  notifySuccess: false,
  notifyError: false,
};

interface RetryableRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

let refreshPromise: Promise<boolean> | null = null;

function getAcceptLanguage(): string {
  const language = localStorage.getItem("i18nextLng");
  return language === "en" ? "en-US" : "ar-EG";
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

  const message =
    axiosError instanceof Error ? axiosError.message : "An unexpected error occurred";

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
  params?: object
): Promise<ApiResult<T>> {
  try {
    let response: AxiosResponse<ApiResult<T>>;

    switch (method) {
      case "get":
        response = await client.get(url, { params });
        break;
      case "post":
        response = await client.post(url, data);
        break;
      case "put":
        response = await client.put(url, data);
        break;
      case "delete":
        response = await client.delete(url, { data });
        break;
    }

    logger.debug(`${method.toUpperCase()} ${url}`, response.status, response.data);
    return response.data;
  } catch (error) {
    logger.error(`Error in ${method.toUpperCase()} ${url}`, error);
    return buildErrorResult<T>(error);
  }
}

export const httpGet = <T>(url: string, params: object = {}): Promise<ApiResult<T>> =>
  request<T>("get", url, undefined, params);

export const httpPost = <T>(url: string, data: object): Promise<ApiResult<T>> =>
  request<T>("post", url, data);

export const httpPut = <T>(url: string, data: object): Promise<ApiResult<T>> =>
  request<T>("put", url, data);

export const httpDelete = <T>(url: string, data: object = {}): Promise<ApiResult<T>> =>
  request<T>("delete", url, data);

export { client as apiClient, defaultRequestOptions };
