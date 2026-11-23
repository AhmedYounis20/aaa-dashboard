import InputFile from "@/Components/Inputs/InputFile";
import type AttachmentModel from "@/interfaces/BaseModels/AttachmentModel";
import { FormTypes } from "@/interfaces/Components/FormType";

export interface EntryAttachmentsSectionProps {
  formType: FormTypes;
  attachments: AttachmentModel[];
  onChange: (attachments: AttachmentModel[]) => void;
}

export default function EntryAttachmentsSection({
  formType,
  attachments,
  onChange,
}: EntryAttachmentsSectionProps) {
  return (
    <div className="row mb-2">
      <div className="col col-md-12">
        <InputFile
          value={attachments}
          multiSelect={true}
          allowedTypes={[]}
          disabled={formType === FormTypes.Details}
          onFilesChange={onChange}
          onlySelectedTypes={false}
        />
      </div>
    </div>
  );
}
