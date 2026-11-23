import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getGlSettings, updateGlSettings } from "@/Apis/Account/GlSettingsApi";
import GlSettingsModel from "@/interfaces/ProjectInterfaces/Account/GlSettings/GlSettingsModel";
import { queryKeys } from "@/lib/queryKeys";
import { ApiError, unwrapApiResult, unwrapApiResultWithMeta } from "@/lib/unwrapApiResult";
import { toastify } from "@/Helper/toastify";

export function useGlSettings() {
  return useQuery({
    queryKey: queryKeys.glSettings.all,
    queryFn: async () => {
      const result = await getGlSettings();
      return unwrapApiResult(result);
    },
  });
}

export function useGlSettingsMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: GlSettingsModel) =>
      unwrapApiResultWithMeta(await updateGlSettings(data)),
    onSuccess: async (payload) => {
      if (payload.successMessage) {
        toastify(payload.successMessage, "success");
      }
      await queryClient.invalidateQueries({ queryKey: queryKeys.glSettings.all });
    },
    onError: (error: unknown) => {
      if (error instanceof ApiError) {
        error.messages.forEach((message) => toastify(message, "error"));
        return;
      }
      if (error instanceof Error && error.message) {
        toastify(error.message, "error");
      }
    },
  });
}
