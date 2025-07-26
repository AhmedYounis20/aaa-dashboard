import { httpGet, httpPost, httpPut } from '../Axios/axiosMethods';
import { InventoryTransferModel} from '../../interfaces/ProjectInterfaces/Inventory/InventoryTransferModel';

const apieEndpoint = '/InventoryTransfer';

export const createTransfer = async (data: InventoryTransferModel) =>
  await httpPost<InventoryTransferModel>(apieEndpoint, data);

export const updateTransfer = async (data: InventoryTransferModel) =>
  await httpPut<InventoryTransferModel>(apieEndpoint, data);

export const getTransferById = async (id: string) =>
  await httpGet<InventoryTransferModel>(`${apieEndpoint}/${id}`, {});
export const getInventoryTransfers = async () =>
  await httpGet<InventoryTransferModel[]>(`${apieEndpoint}`, {});
export const getTransfersByStatus = async (status: string) =>
  await httpGet<InventoryTransferModel[]>(`${apieEndpoint}/status/${status}`, {});

export const approveTransfer = async (id: string) =>
  await httpPost<InventoryTransferModel>(`${apieEndpoint}/approve/${id}`, {});

export const rejectTransfer = async (id: string, reason?: string) =>
  await httpPost<InventoryTransferModel>(`${apieEndpoint}/reject/${id}${reason ? `?reason=${encodeURIComponent(reason)}` : ''}`, {}); 