export type ApiResponse<T = unknown> = {
  data?: ApiResult<T>;
  error?: unknown;
};

export type ApiResult<T = unknown> = {
  statusCode: number;
  isSuccess: boolean;
  errorMessages?: Array<string>;
  result: T;
  successMessage: string;
};
