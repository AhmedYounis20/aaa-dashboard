import React, { useState } from "react";
import AttachmentModel from "../../interfaces/BaseModels/AttachmentModel";
import UploadIcon from "@mui/icons-material/Upload";
import { Delete } from "@mui/icons-material";
import { IconButton } from "@mui/material";
interface InputFileProps {
  allowedTypes: string[];
  onFilesChange: (attachments: AttachmentModel[]) => void;
  multiSelect: boolean ;
  value: AttachmentModel[];
  onlySelectedTypes: boolean;
  disabled : boolean ;
}

const InputFile: React.FC<InputFileProps> = ({
  allowedTypes = [],
  onFilesChange,
  multiSelect = false,
  value = [],
  onlySelectedTypes = false,
  disabled = false
}) => {
  const [attachments, setAttachments] = useState<AttachmentModel[]>(value);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (!files) return;

    const fileArray = Array.from(files);

    // Filter files by allowed types
    const validFiles = fileArray.filter(
      (file) => allowedTypes.includes(file.type) || !onlySelectedTypes
    );

    // Limit number of files to maxFiles

    // Convert files to AttachmentModel
    const attachmentPromises = validFiles.map((file) =>
      convertToAttachmentModel(file)
    );

    const newAttachments = await Promise.all(attachmentPromises);

    setAttachments(newAttachments);
    if(onFilesChange != null)
      onFilesChange(newAttachments);
  };

  const convertToAttachmentModel = (file: File): Promise<AttachmentModel> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        let fileContent = result;

        if (
          fileContent.startsWith("data:") ||
          fileContent.startsWith("base64,")
        ) {
          const commaIndex = fileContent.indexOf(",");
          fileContent = fileContent.substring(commaIndex + 1); // Remove the prefix
        }

        resolve({
          fileName: file.name,
          fileContent: fileContent,
          contentType: file.type,
        });
      };
      reader.onerror = reject;
      reader.readAsDataURL(file); // Reads the file as a Base64-encoded string
    });
  };

  const removeSelectedFile = (index : number)=> {

      setAttachments(attachments.filter((e) => (e != attachments[index])));
      if(onFilesChange != null)
      onFilesChange(attachments);
  }
  return (
    <div className="p-2 card">
      <div className="ml-5 mb-2">
        <label style={{ display: "inline-block" }}>
          {/* Hidden file input */}
          <input
            type="file"
            style={{
              display: "none",
            }}
            onChange={handleFileChange}
            multiple={multiSelect}
            accept={allowedTypes.join(",")}
            disabled={disabled}
          />

        
          <IconButton size="large" component="span" disabled={disabled}>
            <UploadIcon />
          </IconButton>
          <span style={{ fontSize: 20, opacity: 0.5 }}>
            {attachments.length
              ? attachments.length + " file" + (attachments.length>1 ? "s":"")
              : disabled
              ? "no files"
              : "upload"}
          </span>
        </label>
      </div>
      {attachments.length > 0 && (
        <div>
          {attachments.map((attachment, index) => (
            <div key={index}>
              <div
                className="card card-body m-0"
                style={{ width: "auto", backgroundColor: "whitesmoke" }}
              >
                <div className="row">
                  <div className="col col-md-2  text-center">
                    {attachment.contentType.startsWith("image") && (
                      <img
                        src={
                          "data:" +
                          attachment.contentType +
                          ";base64," +
                          attachment.fileContent
                        }
                        alt="image"
                        height={50}
                        width={50}
                        style={{ borderRadius: 50 }}
                      />
                    )}
                    {attachment.contentType.split("/")[0] != "image" &&
                      attachment.contentType.split("/")[0]}
                  </div>
                  <div className="col col-md-6">
                    <strong>{attachment.fileName}</strong>
                  </div>
                  <div className="col col-md-4 align-content-center">
                    <div style={{ position: "absolute", right: 20, top: 25 }}>
                      {!disabled && (
                        <IconButton
                          size="small"
                          style={{ marginInline: 2 }}
                          onClick={() => removeSelectedFile(index)}
                        >
                          <Delete />
                        </IconButton>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InputFile;
