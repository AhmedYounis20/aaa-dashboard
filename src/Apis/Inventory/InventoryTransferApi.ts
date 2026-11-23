import { httpGet, httpPost, httpPut, legacyMutationNotify } from "../Axios/axiosMethods";
import { InventoryTransferModel } from "@/interfaces/ProjectInterfaces/Inventory/InventoryTransferModel";

const apieEndpoint = "/InventoryTransfer";

const toCreatePayload = (data: InventoryTransferModel) => ({
  sourceBranchId: data.sourceBranchId,
  destinationBranchId: data.destinationBranchId,
  transferType: data.transferType,
  notes: data.notes,
  items: data.items.map(({ variantId, packingUnitId, quantity }) => ({
    variantId,
    packingUnitId,
    quantity,
  })),
});

export const createTransfer = async (data: InventoryTransferModel) =>
  await httpPost<InventoryTransferModel>(apieEndpoint, toCreatePayload(data), legacyMutationNotify);

export const updateTransfer = async (data: InventoryTransferModel) =>
  await httpPut<InventoryTransferModel>(apieEndpoint, toCreatePayload(data), legacyMutationNotify);

export const getTransferById = async (id: string) =>
  await httpGet<InventoryTransferModel>(`${apieEndpoint}/${id}`, {});

export const getInventoryTransfers = async () =>
  await httpGet<InventoryTransferModel[]>(`${apieEndpoint}`, {});

export const getTransfersByStatus = async (status: string) =>
  await httpGet<InventoryTransferModel[]>(`${apieEndpoint}/status/${status}`, {});

export const approveTransfer = async (id: string) =>
  await httpPost<InventoryTransferModel>(`${apieEndpoint}/approve/${id}`, {}, legacyMutationNotify);

export const rejectTransfer = async (id: string, approverId: string, reason?: string) => {
  const params = new URLSearchParams({ approverId });
  if (reason) params.set("reason", reason);
  return await httpPost<InventoryTransferModel>(
    `${apieEndpoint}/reject/${id}?${params.toString()}`,
    {},
    legacyMutationNotify
  );
};
