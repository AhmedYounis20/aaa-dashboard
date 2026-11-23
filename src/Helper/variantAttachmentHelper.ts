import VariantAttachmentModel from "../interfaces/ProjectInterfaces/Inventory/Variants/VariantAttachmentModel";
import { AttachmentType } from "../interfaces/ProjectInterfaces/Inventory/Products/AttachmentType";
import VariantModel from "../interfaces/ProjectInterfaces/Inventory/Variants/VariantModel";
import {
  getItemPicture,
  getItemAttachmentsByType,
  getItemPrimaryAttachment,
  sortItemAttachments,
} from "@/modules/inventory/shared/itemAttachmentHelper";

export const getVariantPicture = (variant?: VariantModel): string =>
  getItemPicture(variant?.name, variant?.variantPicture);

export const getVariantAttachmentsByType = (
  attachments: VariantAttachmentModel[],
  attachmentType: AttachmentType
): VariantAttachmentModel[] => getItemAttachmentsByType(attachments, attachmentType);

export const getVariantPrimaryAttachment = (
  attachments: VariantAttachmentModel[]
): VariantAttachmentModel | null => getItemPrimaryAttachment(attachments);

export const sortVariantAttachments = (
  attachments: VariantAttachmentModel[]
): VariantAttachmentModel[] => sortItemAttachments(attachments);
