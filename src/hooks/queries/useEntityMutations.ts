import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiResult } from "../../interfaces/ApiResponse";
import { unwrapApiResult } from "../../lib/unwrapApiResult";

interface UseEntityMutationsOptions<TData, TInput> {
  listQueryKey: readonly unknown[];
  detailQueryKey?: (id: string) => readonly unknown[];
  createFn: (data: TInput) => Promise<ApiResult<TData>>;
  updateFn: (id: string, data: TInput) => Promise<ApiResult<TData>>;
  deleteFn: (id: string) => Promise<ApiResult<TData>>;
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
    mutationFn: async (data: TInput) => unwrapApiResult(await createFn(data)),
    onSuccess: invalidateList,
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: TInput }) =>
      unwrapApiResult(await updateFn(id, data)),
    onSuccess: async (_data, variables) => {
      await invalidateList();
      if (detailQueryKey) {
        await queryClient.invalidateQueries({
          queryKey: detailQueryKey(variables.id),
        });
      }
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => unwrapApiResult(await deleteFn(id)),
    onSuccess: async (_data, id) => {
      await invalidateList();
      if (detailQueryKey) {
        queryClient.removeQueries({ queryKey: detailQueryKey(id) });
      }
    },
  });

  return {
    createMutation,
    updateMutation,
    deleteMutation,
    isMutating:
      createMutation.isPending ||
      updateMutation.isPending ||
      deleteMutation.isPending,
  };
}
