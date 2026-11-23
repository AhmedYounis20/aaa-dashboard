import { ApiResult } from "../../interfaces/ApiResponse";

export class ApiError extends Error {
  statusCode: number;
  messages: string[];

  constructor(messages: string[], statusCode = 500) {
    const normalized = messages.length ? messages : ["Request failed"];
    super(normalized.join(", "));
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.messages = normalized;
  }
}

export function unwrapApiResult<T>(result: ApiResult<T> | null | undefined): T {
  if (!result) {
    throw new ApiError(["Empty API response"]);
  }

  if (!result.isSuccess) {
    throw new ApiError(result.errorMessages ?? ["Request failed"], result.statusCode);
  }

  return result.result;
}

/** Unwrap and retain the API success message for Query mutation toasts. */
export function unwrapApiResultWithMeta<T>(result: ApiResult<T> | null | undefined): {
  data: T;
  successMessage: string;
} {
  if (!result) {
    throw new ApiError(["Empty API response"]);
  }

  if (!result.isSuccess) {
    throw new ApiError(result.errorMessages ?? ["Request failed"], result.statusCode);
  }

  return {
    data: result.result,
    successMessage: result.successMessage ?? "",
  };
}
