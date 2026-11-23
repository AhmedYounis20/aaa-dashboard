import {
  createAccountGuide,
  deleteAccountGuide,
  getAccountGuideById,
  getAccountGuides,
  updateAccountGuide,
} from "@/Apis/Account/AccountGuidesApi";
import type { AccountGuideModel } from "@/interfaces/ProjectInterfaces";
import { FormTypes } from "@/interfaces/Components/FormType";
import { queryKeys } from "@/lib/queryKeys";
import { ApiResult } from "@/interfaces/ApiResponse";
import { useEntityDetail } from "./useEntityDetail";
import { useEntityList } from "./useEntityList";
import { useEntityMutations } from "./useEntityMutations";

async function fetchAccountGuides(signal?: AbortSignal): Promise<ApiResult<AccountGuideModel[]>> {
  const result = await getAccountGuides();
  void signal;
  if (!result) {
    return {
      isSuccess: false,
      result: [],
      errorMessages: [],
      statusCode: 0,
      successMessage: "",
    };
  }
  return result;
}

async function fetchAccountGuideById(
  id: string,
  signal?: AbortSignal
): Promise<ApiResult<AccountGuideModel>> {
  void signal;
  const result = await getAccountGuideById(id);
  if (!result) {
    return {
      isSuccess: false,
      result: null as unknown as AccountGuideModel,
      errorMessages: [],
      statusCode: 0,
      successMessage: "",
    };
  }
  return result;
}

export function useAccountGuidesList() {
  return useEntityList<AccountGuideModel>({
    queryKey: queryKeys.accountGuides.all,
    fetcher: fetchAccountGuides,
  });
}

export function useAccountGuideDetail(id: string, formType: FormTypes) {
  return useEntityDetail<AccountGuideModel>({
    queryKey: queryKeys.accountGuides.detail(id),
    fetcher: fetchAccountGuideById,
    id,
    formType,
  });
}

export function useAccountGuideMutations() {
  return useEntityMutations<AccountGuideModel>({
    listQueryKey: queryKeys.accountGuides.all,
    detailQueryKey: queryKeys.accountGuides.detail,
    createFn: createAccountGuide as (
      data: AccountGuideModel
    ) => Promise<ApiResult<AccountGuideModel>>,
    updateFn: updateAccountGuide as (
      id: string,
      data: AccountGuideModel
    ) => Promise<ApiResult<AccountGuideModel>>,
    deleteFn: deleteAccountGuide as (id: string) => Promise<ApiResult<AccountGuideModel>>,
  });
}
