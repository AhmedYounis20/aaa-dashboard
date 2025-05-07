import { UserLoginModel } from "../interfaces/Auth/UserLoginModel";
import { ApiResult } from "../interfaces/ApiResponse";
import { AccessTokenResponse } from "../interfaces/Auth/AccessTokenResponse";
import { httpPost } from "./Axios/axiosMethods";

const loginRequest = async (
  data: UserLoginModel
): Promise<ApiResult<AccessTokenResponse> | null> => {
  return await httpPost<AccessTokenResponse>("auth/login", data);
};

export { loginRequest };
