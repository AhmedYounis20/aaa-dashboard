import ProductAttachmentModel from "../interfaces/ProjectInterfaces/Inventory/Products/ProductAttachmentModel";
import { AttachmentType } from "../interfaces/ProjectInterfaces/Inventory/Products/AttachmentType";
import ProductModel from "../interfaces/ProjectInterfaces/Inventory/Products/ProductModel";
import {
  getItemPicture,
  getItemAttachmentsByType,
  getItemPrimaryAttachment,
  sortItemAttachments,
} from "@/modules/inventory/shared/itemAttachmentHelper";

export const getProductPicture = (product?: ProductModel): string =>
  getItemPicture(product?.name, product?.productPicture);

export const getProductAttachmentsByType = (
  attachments: ProductAttachmentModel[],
  attachmentType: AttachmentType
): ProductAttachmentModel[] => getItemAttachmentsByType(attachments, attachmentType);

export const getProductPrimaryAttachment = (
  attachments: ProductAttachmentModel[]
): ProductAttachmentModel | null => getItemPrimaryAttachment(attachments);

export const sortProductAttachments = (
  attachments: ProductAttachmentModel[]
): ProductAttachmentModel[] => sortItemAttachments(attachments);
