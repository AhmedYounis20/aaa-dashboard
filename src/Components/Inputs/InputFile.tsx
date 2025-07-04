import React, { useEffect, useState } from "react";
import AttachmentModel from "../../interfaces/BaseModels/AttachmentModel";
import UploadIcon from "@mui/icons-material/Upload";
import { Add, Delete } from "@mui/icons-material";
import { IconButton, Box, Typography, Card, CardContent, Grid, useTheme } from "@mui/material";
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
  const theme = useTheme();
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
    <Card sx={{ p: 2, backgroundColor: theme.palette.background.paper }}>
      <Box sx={{ ml: 2.5, mb: 2 }}>
        <Box component="label" sx={{ display: "inline-block" }}>
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
            sx={{ 
              borderRadius: 2.5,
              color: theme.palette.primary.main,
              '&:hover': {
                backgroundColor: theme.palette.primary.light,
                color: theme.palette.primary.contrastText,
              },
            }}
            component="span"
            disabled={disabled}
          >
            <UploadIcon />
            <Typography sx={{ fontSize: 20, opacity: 0.7, ml: 0.5 }}>
              {t("Upload")}
            </Typography>
          </IconButton>
        </Box>
        {attachments.length > 0 && multiSelect && (
          <Box component="label" sx={{ display: "inline-block", ml: 1 }}>
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
              sx={{ 
                borderRadius: 2.5,
                color: theme.palette.secondary.main,
                '&:hover': {
                  backgroundColor: theme.palette.secondary.light,
                  color: theme.palette.secondary.contrastText,
                },
              }}
              component="span"
              disabled={disabled}
            >
              <Add />
              <Typography sx={{ fontSize: 20, opacity: 0.7, ml: 0.5 }}>
                {t("Add")}
              </Typography>
            </IconButton>
          </Box>
        )}
        <Box>
          <IconButton
            size="medium"
            sx={{ 
              borderRadius: 2.5,
              color: theme.palette.text.secondary,
            }}
            component="span"
            disabled={true}
          >
            <Typography sx={{ fontSize: 20, opacity: 0.7 }}>
              {attachments.length
                ? attachments.length +
                  " " +
                  (attachments.length > 1 ? t("Files") : t("File"))
                : t("NoFiles")}
            </Typography>
          </IconButton>
        </Box>
      </Box>
      {attachments.length > 0 && (
        <Box sx={{ 
          maxHeight: 200, 
          overflowY: "scroll",
          '&::-webkit-scrollbar': {
            width: 8,
          },
          '&::-webkit-scrollbar-track': {
            background: theme.palette.grey[100],
          },
          '&::-webkit-scrollbar-thumb': {
            background: theme.palette.grey[400],
            borderRadius: 1,
          },
          '&::-webkit-scrollbar-thumb:hover': {
            background: theme.palette.grey[600],
          },
        }}>
          {attachments.map((attachment, index) => (
            <Box key={index}>
              <Card sx={{ 
                mb: 1, 
                backgroundColor: theme.palette.grey[50],
                border: `1px solid ${theme.palette.divider}`,
              }}>
                <CardContent sx={{ p: 2 }}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={3}>
                      <Box sx={{ textAlign: 'center' }}>
                        <Box>
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
                            <DescriptionIcon sx={{ 
                              fontSize: 50, 
                              color: theme.palette.text.secondary 
                            }} />
                          )}
                        </Box>
                        <Typography variant="caption" color="text.secondary">
                          {attachment.contentType.split("/")[0] != "image" &&
                            attachment.contentType.split("/")[1]}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={7}>
                      <Typography variant="body2" fontWeight={600}>
                        {attachment.fileName}
                      </Typography>
                    </Grid>
                    <Grid item xs={2}>
                      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                        {!disabled && (
                          <IconButton
                            size="small"
                            onClick={() => removeSelectedFile(index)}
                            sx={{
                              color: theme.palette.error.main,
                              '&:hover': {
                                backgroundColor: theme.palette.error.light,
                                color: theme.palette.error.contrastText,
                              },
                            }}
                          >
                            <Delete />
                          </IconButton>
                        )}
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Box>
          ))}
        </Box>
      )}
    </Card>
  );
};

export default InputFile;
