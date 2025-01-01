/* eslint-disable @typescript-eslint/no-explicit-any */
export type ApiResponse< T = any> = {
  data?: ApiResult<T>;
  error?: any;
};

export type ApiResult<T = any> = {
  statusCode: number;
  isSuccess: boolean;
  errorMessages?: Array<string>;
  result: T;
  successMessage: string;
};

