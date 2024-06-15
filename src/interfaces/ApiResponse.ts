export type ApiResponse = {
  data?: {
    statusCode: number;
    isSucess: boolean;
    errorMessages?: Array<string>;
    result: any;
  };
  error?: any;
};
