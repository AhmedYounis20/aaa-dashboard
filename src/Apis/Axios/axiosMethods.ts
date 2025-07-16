/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, {
  AxiosResponse,
  AxiosRequestConfig,
  RawAxiosRequestHeaders,
} from "axios";
import { baseUrl } from "../../Utilities/SD";
import { ApiResult } from "../../interfaces/ApiResponse";
import { toastify } from "../../Helper/toastify";

const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem("refreshToken");
  const accessToken = localStorage.getItem("accessToken");

  if (!refreshToken || !accessToken) return;

  try {
    const res = await axios.post(baseUrl + "auth/refresh", {
      refreshToken,
      accessToken,
    });

    const { accessToken: newAccess, refreshToken: newRefresh } =
      res.data.result;
    localStorage.setItem("accessToken", newAccess);
    localStorage.setItem("refreshToken", newRefresh);

    console.log("Token refreshed automatically");
  } catch (err) {
    console.error("Auto-refresh failed:", err);
    localStorage.clear();
    // Optionally redirect to login page
    window.location.href = "/login";
  }
};


setInterval(refreshAccessToken, 5 * 60 * 1000);

const client = axios.create({
  baseURL: baseUrl,
});

const language = localStorage.getItem("i18nextLng");
// Add token to each request
client.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem("accessToken");
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
    config.headers["Accept-Language"] = language =="en" ? "en-US": "ar-EG";
  }
  return config;
});

// Refresh token on 401
client.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem("refreshToken");

      try {
        const res = await axios.post(baseUrl + "auth/refresh", {
          refreshToken: refreshToken,
          accessToken: localStorage.getItem("accessToken"),
        });
        console.log("refresh: ", res);
        const { accessToken, refreshToken: newRefresh } = res.data.result;
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", newRefresh);

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return client(originalRequest); // Retry original request
      } catch (refreshError) {
        console.error("Refresh failed", refreshError);
        localStorage.clear();
        window.location.href = "/login"; // Redirect to login
      }
    }

    return Promise.reject(error);
  }
);
const token = localStorage.getItem("accessToken");
const config: AxiosRequestConfig = {
  headers: {
    Accept: "application/json",
    Authorization: token ? `Bearer ${token}` : "",
  } as RawAxiosRequestHeaders,
};

// HTTP POST method
const httpPost = async <T>(
  url: string,
  data: object
): Promise<ApiResult<T>> => {
  try {
    const response: AxiosResponse<ApiResult<T>> = await client.post(url, data);
    console.log(response.status);

    const apiResponse = response.data;
    console.log("API Response:", apiResponse);

    if (!apiResponse.isSuccess) {
      apiResponse.errorMessages?.forEach((errorMessage) =>
        toastify(errorMessage, "error")
      );
      return apiResponse;
    }
    else
    toastify(apiResponse.successMessage,"success");
    return apiResponse;
  } catch (error: any) {

    console.error("Error in httpPost:", error);
    handleErrorResponse(error);
    if(error.response && error.response.data){
      const res : ApiResult<T> = error.response.data;
      return res;
    }

    const res: ApiResult<T> = {
      isSuccess: false,
      errorMessages: [error],
      result: {} as T,
      statusCode: 500,
      successMessage: "",
    };
    return res;  }
};

// HTTP GET method
const httpGet = async <T>(
  url: string,
  params: object
): Promise<ApiResult<T>> => {
  try {
    config.params = params;
    console.log("Trying axios");

    const response: AxiosResponse<ApiResult<T>> = await client.get(url, config);
    console.log(response.status);

    const apiResponse = response.data;
    console.log("API Response:", apiResponse);

    if (apiResponse.isSuccess === false) {
      apiResponse.errorMessages?.forEach((errorMessage) =>
        toastify(errorMessage, "error")
      );
    }
    return apiResponse;
  } catch (error: any) {
    console.error("Error in httpGet:", error);
    handleErrorResponse(error);
    if(error.response && error.response.data){
      const res : ApiResult<T> = error.response.data;
      return res;
    }
    const res : ApiResult<T> = {
      isSuccess : false,
      errorMessages : [error],
      result : {} as T,
      statusCode : 500,
      successMessage : ""
    }
    return res;
  }
};

// HTTP PUT method
const httpPut = async <T>(
  url: string,
  data: object
): Promise<ApiResult<T>> => {
  try {
    const response: AxiosResponse<ApiResult<T>> = await client.put(url, data);
    console.log(response.status);

    const apiResponse = response.data;
    console.log("API Response:", apiResponse);

    if (!apiResponse.isSuccess) {
      apiResponse.errorMessages?.forEach((errorMessage) =>
        toastify(errorMessage, "error")
      );
      return apiResponse;
    }
    else
        toastify(apiResponse.successMessage,"success");
    

    return apiResponse;
  } catch (error: any) {
    console.error("Error in httpPut:", error);
    handleErrorResponse(error);
    if(error.response && error.response.data){
      const res : ApiResult<T> = error.response.data;
      return res;
    }
    const res: ApiResult<T> = {
      isSuccess: false,
      errorMessages: [error],
      result: {} as T,
      statusCode: 500,
      successMessage: "",
    };
    return res;  }
};

// HTTP DELETE method
const httpDelete = async <T>(
  url: string,
  data: object
): Promise<ApiResult<T>> => {
  try {
    const response: AxiosResponse<ApiResult<T>> = await client.delete(url, {
      data,
    });
    console.log(response.status);

    const apiResponse = response.data;
    console.log("API Response:", apiResponse);

    if (!apiResponse.isSuccess) {
      apiResponse.errorMessages?.forEach((errorMessage) =>
        toastify(errorMessage, "error")
      );
      return apiResponse;
    }
    else
    toastify(apiResponse.successMessage,"success");
    return apiResponse;
  } catch (error: any) {
    console.error("Error in httpDelete:", error);
    handleErrorResponse(error);
    if(error.response && error.response.data){
      const res : ApiResult<T> = error.response.data;
      return res;
    }
    const res: ApiResult<T> = {
      isSuccess: false,
      errorMessages: [error],
      result: {} as T,
      statusCode: 500,
      successMessage: "",
    };
    return res;
  }
};

// Helper function to handle error responses
const handleErrorResponse = (error: any) => {
  if (error.response && error.response.data && error.response.data.errorMessages){

      error.response.data.errorMessages?.forEach((errorMessage: string) =>
        toastify(errorMessage, "error")
    );
    console.error("Response data:", error.response.data);
    console.error("Response status:", error.response.status);
    console.error("Response headers:", error.response.headers);
  }
  else if (error.response && error.response.data && error.response.data.title) {
    toastify(error.response.data.title, "error");
  } else if (error.request) {
    console.error("Request:", error.request);
  } else {
    console.error("Error message:", error.message);
  }
};

export { httpPost, httpGet, httpPut, httpDelete };
