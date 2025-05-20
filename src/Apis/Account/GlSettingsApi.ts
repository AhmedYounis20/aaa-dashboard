import GlSettingsModel from "../../interfaces/ProjectInterfaces/Account/GlSettings/GlSettingsModel";
import { httpGet, httpPut } from "../Axios/axiosMethods";
import { ApiResult } from "../../interfaces/ApiResponse";

const getGlSettings = async (): Promise<ApiResult<GlSettingsModel> | null> => {
  return await httpGet<GlSettingsModel>("glsettings", {});
};

// POST (Create) a new currency
const updateGlSettings = async (
  data: GlSettingsModel
): Promise<ApiResult<GlSettingsModel> | null> => {
  return await httpPut<GlSettingsModel>("glsettings", data);
};
export { getGlSettings, updateGlSettings }; 
