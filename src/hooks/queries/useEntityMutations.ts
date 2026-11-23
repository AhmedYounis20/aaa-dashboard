import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiResult } from "@/interfaces/ApiResponse";
import { toastify } from "@/Helper/toastify";
import { ApiError, unwrapApiResultWithMeta } from "@/lib/unwrapApiResult";

interface UseEntityMutationsOptions<TData, TInput> {
  listQueryKey: readonly unknown[];
  detailQueryKey?: (id: string) => readonly unknown[];
  createFn: (data: TInput) => Promise<ApiResult<TData>>;
  updateFn: (id: string, data: TInput) => Promise<ApiResult<TData>>;
  deleteFn: (id: string) => Promise<ApiResult<TData>>;
}

function toastMutationError(error: unknown): void {
  if (error instanceof ApiError) {
    error.messages.forEach((message) => toastify(message, "error"));
    return;
  }
  if (error instanceof Error && error.message) {
    toastify(error.message, "error");
  }
}

function toastMutationSuccess(successMessage: string): void {
  if (successMessage) {
    toastify(successMessage, "success");
  }
}

export function useEntityMutations<TData, TInput = TData>({
  listQueryKey,
  detailQueryKey,
  createFn,
  updateFn,
  deleteFn,
}: UseEntityMutationsOptions<TData, TInput>) {
  const queryClient = useQueryClient();

  const invalidateList = async () => {
    await queryClient.invalidateQueries({ queryKey: listQueryKey });
  };

  const createMutation = useMutation({
    mutationFn: async (data: TInput) => unwrapApiResultWithMeta(await createFn(data)),
    onSuccess: async (payload) => {
      toastMutationSuccess(payload.successMessage);
      await invalidateList();
    },
    onError: toastMutationError,
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: TInput }) =>
      unwrapApiResultWithMeta(await updateFn(id, data)),
    onSuccess: async (payload, variables) => {
      toastMutationSuccess(payload.successMessage);
      await invalidateList();
      if (detailQueryKey) {
        await queryClient.invalidateQueries({
          queryKey: detailQueryKey(variables.id),
        });
      }
    },
    onError: toastMutationError,
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => unwrapApiResultWithMeta(await deleteFn(id)),
    onSuccess: async (payload, id) => {
      toastMutationSuccess(payload.successMessage);
      await invalidateList();
      if (detailQueryKey) {
        queryClient.removeQueries({ queryKey: detailQueryKey(id) });
      }
    },
    onError: toastMutationError,
  });

  return {
    createMutation,
    updateMutation,
    deleteMutation,
    isMutating: createMutation.isPending || updateMutation.isPending || deleteMutation.isPending,
  };
}
