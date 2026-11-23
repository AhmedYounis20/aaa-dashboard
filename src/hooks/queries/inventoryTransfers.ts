import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  approveTransfer,
  createTransfer,
  getInventoryTransfers,
  getTransferById,
  getTransfersByStatus,
  rejectTransfer,
  updateTransfer,
} from "@/Apis/Inventory/InventoryTransferApi";
import { InventoryTransferModel } from "@/interfaces/ProjectInterfaces/Inventory/InventoryTransferModel";
import { queryKeys } from "@/lib/queryKeys";
import { ApiError, unwrapApiResult, unwrapApiResultWithMeta } from "@/lib/unwrapApiResult";
import { toastify } from "@/Helper/toastify";

function toastMutationError(error: unknown): void {
  if (error instanceof ApiError) {
    error.messages.forEach((message) => toastify(message, "error"));
    return;
  }
  if (error instanceof Error && error.message) {
    toastify(error.message, "error");
  }
}

export function useInventoryTransfersList(status: string = "All") {
  return useQuery({
    queryKey:
      status === "All"
        ? queryKeys.inventoryTransfers.all
        : queryKeys.inventoryTransfers.byStatus(status),
    queryFn: async () => {
      const result =
        status === "All" ? await getInventoryTransfers() : await getTransfersByStatus(status);
      return unwrapApiResult(result);
    },
  });
}

export function useInventoryTransferDetail(id: string, enabled = true) {
  return useQuery({
    queryKey: queryKeys.inventoryTransfers.detail(id),
    queryFn: async () => unwrapApiResult(await getTransferById(id)),
    enabled: enabled && Boolean(id),
  });
}

export function useInventoryTransferMutations() {
  const queryClient = useQueryClient();

  const invalidate = async () => {
    await queryClient.invalidateQueries({
      queryKey: queryKeys.inventoryTransfers.all,
    });
  };

  const createMutation = useMutation({
    mutationFn: async (data: InventoryTransferModel) =>
      unwrapApiResultWithMeta(await createTransfer(data)),
    onSuccess: async (payload) => {
      if (payload.successMessage) toastify(payload.successMessage, "success");
      await invalidate();
    },
    onError: toastMutationError,
  });

  const updateMutation = useMutation({
    mutationFn: async (data: InventoryTransferModel) =>
      unwrapApiResultWithMeta(await updateTransfer(data)),
    onSuccess: async (payload) => {
      if (payload.successMessage) toastify(payload.successMessage, "success");
      await invalidate();
    },
    onError: toastMutationError,
  });

  const approveMutation = useMutation({
    mutationFn: async (id: string) => unwrapApiResultWithMeta(await approveTransfer(id)),
    onSuccess: async (payload) => {
      if (payload.successMessage) toastify(payload.successMessage, "success");
      await invalidate();
    },
    onError: toastMutationError,
  });

  const rejectMutation = useMutation({
    mutationFn: async ({
      id,
      approverId,
      reason,
    }: {
      id: string;
      approverId: string;
      reason?: string;
    }) => unwrapApiResultWithMeta(await rejectTransfer(id, approverId, reason)),
    onSuccess: async (payload) => {
      if (payload.successMessage) toastify(payload.successMessage, "success");
      await invalidate();
    },
    onError: toastMutationError,
  });

  return {
    createMutation,
    updateMutation,
    approveMutation,
    rejectMutation,
  };
}
