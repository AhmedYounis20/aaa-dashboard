import VariantAttachmentModel from '../interfaces/ProjectInterfaces/Inventory/Variants/VariantAttachmentModel';
import { AttachmentType } from '../interfaces/ProjectInterfaces/Inventory/Products/AttachmentType';
import VariantModel from '../interfaces/ProjectInterfaces/Inventory/Variants/VariantModel';
import AttachmentModel from '../interfaces/BaseModels/AttachmentModel';

export const getVariantPicture = (variant?: VariantModel): string => {
  const attachment : AttachmentModel | undefined = variant?.variantPicture;
  if (!attachment || !attachment?.fileContent ) {
    return `https://ui-avatars.com/api/?name=${variant?.name}`;
  }

  // First, try to find the primary attachment
      return `data:${attachment.contentType};base64,${attachment.fileContent}`;
}

export const getVariantAttachmentsByType = (
  attachments: VariantAttachmentModel[],
  attachmentType: AttachmentType
): VariantAttachmentModel[] => {
  return attachments.filter(att => att.attachmentType === attachmentType);
};

export const getVariantPrimaryAttachment = (attachments: VariantAttachmentModel[]): VariantAttachmentModel | null => {
  return attachments.find(att => att.isPrimary) || null;
};

export const sortVariantAttachments = (attachments: VariantAttachmentModel[]): VariantAttachmentModel[] => {
  return [...attachments].sort((a, b) => {
    // Primary attachments first
    if (a.isPrimary && !b.isPrimary) return -1;
    if (!a.isPrimary && b.isPrimary) return 1;
    
    // Then by display order
    return a.displayOrder - b.displayOrder;
  });
};



