import React, { useEffect, useState } from "react";
import AttachmentModel from "../../interfaces/BaseModels/AttachmentModel";
import UploadIcon from "@mui/icons-material/Upload";
import { Add, Delete } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import DescriptionIcon from '@mui/icons-material/Description';
import ImagePreview from "../Images/ImagePreview";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();
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
  };

    const handleAddFile = async (
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

      setAttachments((prevattachments) =>
        prevattachments
          ? [ ...prevattachments,...newAttachments ]
          : [...newAttachments]
      );
    };

    useEffect(()=>{
      if(onFilesChange!=null)
      onFilesChange(attachments);
    },[attachments])

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
          attachmentId:null
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

          <IconButton
            size="large"
            style={{ borderRadius: 20 }}
            component="span"
            disabled={disabled}
          >
            <UploadIcon />
            <span style={{ fontSize: 20, opacity: 0.5 }}>{t("Upload")}</span>
          </IconButton>
        </label>
        {attachments.length > 0 && multiSelect && (
          <label style={{ display: "inline-block" }}>
            {/* Hidden file input */}
            <input
              type="file"
              style={{
                display: "none",
              }}
              onChange={handleAddFile}
              multiple={multiSelect}
              accept={allowedTypes.join(",")}
              disabled={disabled}
            />

            <IconButton
              size="medium"
              style={{ borderRadius: 20 }}
              className="btn form-control"
              component="span"
              disabled={disabled}
            >
              <Add />
              <span style={{ fontSize: 20, opacity: 0.5 }}>{t("Add")}</span>
            </IconButton>
          </label>
        )}
        <label>
          <IconButton
            size="medium"
            style={{ borderRadius: 20 }}
            className="btn form-control"
            component="span"
            disabled={true}
          >
            <span style={{ fontSize: 20, opacity: 0.5 }}>
              {attachments.length
                ? attachments.length +
                  " " +
                  (attachments.length > 1 ? t("Files") : t("File"))
                : t("NoFiles")}
            </span>
          </IconButton>
        </label>
      </div>
      {attachments.length > 0 && (
        <div style={{ maxHeight: 200, overflowY: "scroll" }}>
          {attachments.map((attachment, index) => (
            <div key={index}>
              <div
                className="card card-body m-0 mb-2"
                style={{ width: "auto", backgroundColor: "whitesmoke" }}
              >
                <div className="row">
                  <div className="col col-md-3 justify-content-center align-items-center">
                    <div>
                      {attachment.contentType.startsWith("image") ? (
                        <ImagePreview
                          src={
                            "data:" +
                            attachment.contentType +
                            ";base64," +
                            attachment.fileContent
                          }
                          alt={t("Image")}
                          height={50}
                          width={50}
                        />
                      ) : (
                        <DescriptionIcon />
                      )}
                    </div>
                    <div>
                      {attachment.contentType.split("/")[0] != "image" &&
                        attachment.contentType.split("/")[1]}
                    </div>
                  </div>
                  <div className="col col-md-7">
                    <strong>{attachment.fileName}</strong>
                  </div>
                  <div className="col col-md-2 align-content-center">
                    <div
                      style={{
                        justifyContent: "end",
                        alignItems: "end",
                        display: "flex",
                      }}
                    >
                      {!disabled && (
                        <IconButton
                          size="small"
                          onClick={() => removeSelectedFile(index)}
                        >
                          <Delete />
                        </IconButton>
                      )}
                    </div>
                  </div>
                </div>

                <style>
                  {`
                      div::-webkit-scrollbar {
                        width: 8px;
                      }
                      div::-webkit-scrollbar-track {
                        background: #f1f1f1;
                      }
                      div::-webkit-scrollbar-thumb {
                        background: #888;
                        border-radius: 4px;
                      }
                      div::-webkit-scrollbar-thumb:hover {
                        background: #555;
                      }
                    `}
                </style>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InputFile;
