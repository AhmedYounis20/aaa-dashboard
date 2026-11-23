import ProductPictureUpload from "../../Products/Components/ProductPictureUpload";
import ProductAttachmentModel from "../../../../../interfaces/ProjectInterfaces/Inventory/Products/ProductAttachmentModel";
import VariantAttachmentModel from "../../../../../interfaces/ProjectInterfaces/Inventory/Variants/VariantAttachmentModel";
import { FormTypes } from "../../../../../interfaces/Components";

const toProductAttachments = (attachments: VariantAttachmentModel[]): ProductAttachmentModel[] =>
  attachments.map(({ variantId, ...rest }) => ({
    ...rest,
    productId: variantId,
  }));

const toVariantAttachments = (attachments: ProductAttachmentModel[]): VariantAttachmentModel[] =>
  attachments.map(({ productId, ...rest }) => ({
    ...rest,
    variantId: productId,
  }));

interface VariantPictureUploadProps {
  variantId: string;
  formType: FormTypes;
  attachments: VariantAttachmentModel[];
  onAttachmentsChange: (attachments: VariantAttachmentModel[]) => void;
}

const VariantPictureUpload: React.FC<VariantPictureUploadProps> = ({
  variantId,
  formType,
  attachments,
  onAttachmentsChange,
}) => (
  <ProductPictureUpload
    productId={variantId}
    formType={formType}
    attachments={toProductAttachments(attachments)}
    onAttachmentsChange={(next) => onAttachmentsChange(toVariantAttachments(next))}
  />
);

export default VariantPictureUpload;
