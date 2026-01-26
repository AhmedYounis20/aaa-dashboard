import AttachmentModel from "../../../BaseModels/AttachmentModel";
import { AttachmentType } from "../Products/AttachmentType";

interface ProductAttachmentModel {
  id: string;
  productId: string;
  attachmentId: string;
  attachmentType: AttachmentType;
  description?: string;
  isPrimary: boolean;
  displayOrder: number;
  attachment?: AttachmentModel
  createdAt: string;
  modifiedAt: string;
  createdByName?: string;
  createdByNameSecondLanguage?: string;
  modifiedByName?: string;
  modifiedByNameSecondLanguage?: string;
}

export default ProductAttachmentModel;











