import { ApiResult } from "../interfaces/ApiResponse";

export class ApiError extends Error {
  statusCode: number;

  constructor(messages: string[], statusCode = 500) {
    super(messages.join(", ") || "Request failed");
    this.name = "ApiError";
    this.statusCode = statusCode;
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
