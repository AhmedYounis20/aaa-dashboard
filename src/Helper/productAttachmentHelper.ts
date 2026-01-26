import ProductAttachmentModel from '../interfaces/ProjectInterfaces/Inventory/Products/ProductAttachmentModel';
import { AttachmentType } from '../interfaces/ProjectInterfaces/Inventory/Products/AttachmentType';
import ProductModel from '../interfaces/ProjectInterfaces/Inventory/Products/ProductModel';
import AttachmentModel from '../interfaces/BaseModels/AttachmentModel';


export const getProductPicture = (product?: ProductModel): string => {
  const attachment : AttachmentModel | undefined = product?.productPicture;
  if (!attachment || !attachment?.fileContent ) {
    return `https://ui-avatars.com/api/?name=${product?.name}`;
  }

  // First, try to find the primary attachment
      return `data:${attachment.contentType};base64,${attachment.fileContent}`;

}
export const getProductAttachmentsByType = (
  attachments: ProductAttachmentModel[],
  attachmentType: AttachmentType
): ProductAttachmentModel[] => {
  return attachments.filter(att => att.attachmentType === attachmentType);
};

export const getProductPrimaryAttachment = (attachments: ProductAttachmentModel[]): ProductAttachmentModel | null => {
  return attachments.find(att => att.isPrimary) || null;
};

export const sortProductAttachments = (attachments: ProductAttachmentModel[]): ProductAttachmentModel[] => {
  return [...attachments].sort((a, b) => {
    // Primary attachments first
    if (a.isPrimary && !b.isPrimary) return -1;
    if (!a.isPrimary && b.isPrimary) return 1;
    
    // Then by display order
    return a.displayOrder - b.displayOrder;
  });
};



