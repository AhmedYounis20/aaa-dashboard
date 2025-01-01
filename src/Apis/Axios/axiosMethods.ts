/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, {
  AxiosResponse,
  AxiosRequestConfig,
  RawAxiosRequestHeaders,
} from "axios";
import { baseUrl } from "../../Utilities/SD";
import { ApiResult } from "../../interfaces/ApiResponse";
import { toastify } from "../../Helper/toastify";

const client = axios.create({
  baseURL: baseUrl,
});
    const token = localStorage.getItem("token");
    const config: AxiosRequestConfig = {
      headers: {
        Accept: "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      } as RawAxiosRequestHeaders,
    };

const httpPost = async (url : string,data : object) => {
  try {
    const response: AxiosResponse = await client.post(`/${url}`,data, config);
    console.log(response.status);
    console.log(response.data.json);
  } catch (err) {
    console.log(err);
  }
}

const httpGet = async <T>(
  url: string,
  params: object
): Promise<ApiResult<T> | null> => {
  try {
    config.params = params;
    console.log("Trying axios");
    console.log(config);

    const response: AxiosResponse<ApiResult<T>> = await client.get<
      ApiResult<T>
    >(url, config);
    console.log(response.status);

    const apiResponse = response.data;
    console.log("api:", apiResponse);

    if (apiResponse.isSuccess == false) {
      apiResponse.errorMessages?.forEach((errorMessage) =>
        toastify(errorMessage, "error")
      );
      console.log("eror");
    }
    return apiResponse;
  } catch (error: any) {
    console.error("Error in httpGet:", error);

    if (error.response) {
      error.response.data.errorMessages?.forEach((errorMessage: string) =>
        toastify(errorMessage, "error")
      );
      console.error("Response data:", error.response.data);
      console.error("Response status:", error.response.status);
      console.error("Response headers:", error.response.headers);
    } else if (error.request) {
      console.error("Request:", error.request);
    } else {
      console.error("Error message:", error.message);
    }

    return null;
  }
};
export {httpPost,httpGet};
