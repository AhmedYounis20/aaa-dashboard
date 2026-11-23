import AttachmentModel from "@/interfaces/BaseModels/AttachmentModel";
import { AttachmentType } from "@/interfaces/ProjectInterfaces/Inventory/Products/AttachmentType";

export interface ItemAttachmentLike {
  attachmentType: AttachmentType;
  isPrimary: boolean;
  displayOrder: number;
}

export const getItemPicture = (name?: string, attachment?: AttachmentModel | null): string => {
  if (attachment?.fileContent && attachment.contentType) {
    return `data:${attachment.contentType};base64,${attachment.fileContent}`;
  }
  if (attachment?.contentUrl) {
    return attachment.contentUrl;
  }
  return `https://ui-avatars.com/api/?name=${name ?? ""}`;
};

export const getItemAttachmentsByType = <T extends ItemAttachmentLike>(
  attachments: T[],
  attachmentType: AttachmentType
): T[] => attachments.filter((att) => att.attachmentType === attachmentType);

export const getItemPrimaryAttachment = <T extends ItemAttachmentLike>(
  attachments: T[]
): T | null => attachments.find((att) => att.isPrimary) || null;

export const sortItemAttachments = <T extends ItemAttachmentLike>(attachments: T[]): T[] =>
  [...attachments].sort((a, b) => {
    if (a.isPrimary && !b.isPrimary) return -1;
    if (!a.isPrimary && b.isPrimary) return 1;
    return a.displayOrder - b.displayOrder;
  });
