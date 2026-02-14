import React, { useState, useRef } from "react";
import { v4 as uuid } from "uuid";
import { useTranslation } from "react-i18next";
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardMedia,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  useTheme,
  alpha,
  Paper,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  Add as AddIcon,
} from "@mui/icons-material";
import {
  RiImageLine,
  RiAttachment2,
  RiStarFill,
  RiArrowUpSLine,
  RiArrowDownSLine,
  RiUpload2Line,
} from "react-icons/ri";
import CloseIcon from "@mui/icons-material/Close";
import ProductAttachmentModel from "../../../../../interfaces/ProjectInterfaces/Inventory/Products/ProductAttachmentModel";
import {
  AttachmentType,
  AttachmentTypeOptions,
} from "../../../../../interfaces/ProjectInterfaces/Inventory/Products/AttachmentType";
import AttachmentModel from "../../../../../interfaces/BaseModels/AttachmentModel";
import { FormTypes } from "../../../../../interfaces/Components/FormType";
import InputSelect from "../../../../../Components/Inputs/InputSelect";
import InputText from "../../../../../Components/Inputs/InputText";
import InputNumber from "../../../../../Components/Inputs/InputNumber";

interface ProductPictureUploadProps {
  productId: string;
  attachments: ProductAttachmentModel[];
  formType: FormTypes;
  onAttachmentsChange: (attachments: ProductAttachmentModel[]) => void;
  handleTranslate: (key: string) => string;
}

const ProductPictureUpload: React.FC<ProductPictureUploadProps> = ({
  productId,
  attachments,
  formType,
  onAttachmentsChange,
  handleTranslate,
}) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const [openDialog, setOpenDialog] = useState(false);
  const [editingAttachment, setEditingAttachment] =
    useState<ProductAttachmentModel | null>(null);
  const [selectedAttachment, setSelectedAttachment] =
    useState<AttachmentModel | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollThumbnails = (direction: "up" | "down") => {
    if (scrollRef.current) {
      const scrollAmount = 100;
      scrollRef.current.scrollBy({
        top: direction === "up" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const getPreviewUrl = (attachment?: AttachmentModel | null) => {
    if (!attachment) {
      return null;
    }

    if (!attachment.contentType.startsWith("image")) {
      return null;
    }

    return `data:${attachment.contentType};base64,${attachment.fileContent}`;
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
          fileContent = fileContent.substring(commaIndex + 1);
        }

        resolve({
          fileName: file.name,
          fileContent: fileContent,
          contentType: file.type,
          attachmentId: uuid(),
        });
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const processFile = async (file: File) => {
    const attachment = await convertToAttachmentModel(file);
    setSelectedAttachment(attachment);
    setPreviewUrl(getPreviewUrl(attachment));
    setEditingAttachment({
      id: uuid(),
      productId: productId,
      attachmentId: uuid(),
      description: "",
      attachmentType: AttachmentType.Picture,
      isPrimary: attachments.length === 0,
      displayOrder: attachments.length,
      createdAt: "",
      modifiedAt: "",
    });

    setOpenDialog(true);
  };

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      await processFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (formType !== FormTypes.Details) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (formType !== FormTypes.Details) {
      const file = e.dataTransfer.files?.[0];
      if (file) {
        await processFile(file);
      }
    }
  };

  const handleSaveAttachment = () => {
    if (!editingAttachment) {
      return;
    }

    const now = new Date().toISOString();
    const isEditingExisting = attachments.some(
      (attachment) => attachment.id === editingAttachment.id,
    );
    const baseAttachment = isEditingExisting
      ? editingAttachment.attachment
      : undefined;
    const attachmentPayload = selectedAttachment ?? baseAttachment;

    if (!attachmentPayload) {
      return;
    }

    const resolvedAttachmentId =
      editingAttachment.attachmentId ||
      attachmentPayload.attachmentId ||
      uuid();

    const newAttachment: ProductAttachmentModel = {
      id: editingAttachment.id || uuid(),
      productId: productId,
      attachmentId: resolvedAttachmentId,
      description: editingAttachment.description || "",
      attachmentType:
        editingAttachment.attachmentType || AttachmentType.Picture,
      isPrimary: editingAttachment.isPrimary || false,
      displayOrder: editingAttachment.displayOrder ?? attachments.length,
      attachment: {
        ...attachmentPayload,
        attachmentId: resolvedAttachmentId,
      },
      createdAt: editingAttachment.createdAt || now,
      modifiedAt: now,
    };

    let updatedAttachments = isEditingExisting
      ? attachments.map((att) =>
          att.id === editingAttachment.id ? newAttachment : att,
        )
      : [...attachments, newAttachment];

    if (newAttachment.isPrimary) {
      updatedAttachments = updatedAttachments.map((att) => ({
        ...att,
        isPrimary: att.id === newAttachment.id,
      }));
    }

    onAttachmentsChange(updatedAttachments);
    handleCloseDialog();
  };

  const handleDeleteAttachment = (attachmentId: string) => {
    const updatedAttachments = attachments.filter(
      (att) => att.id !== attachmentId,
    );
    onAttachmentsChange(updatedAttachments);
  };

  const handleEditAttachment = (attachment: ProductAttachmentModel) => {
    setEditingAttachment(attachment);
    setSelectedAttachment(null);
    setPreviewUrl(getPreviewUrl(attachment.attachment));
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingAttachment(null);
    setSelectedAttachment(null);
    setPreviewUrl(null);
  };

  const handleSetPrimary = (attachmentId: string) => {
    const updatedAttachments = attachments.map((att) => ({
      ...att,
      isPrimary: att.id === attachmentId,
    }));
    onAttachmentsChange(updatedAttachments);
  };

  const primaryAttachment = attachments.find((att) => att.isPrimary);
  const [viewingAttachmentId, setViewingAttachmentId] = useState<string | null>(
    primaryAttachment?.id || attachments[0]?.id || null,
  );

  // Update viewingAttachment if primary changes or attachments are added/removed
  React.useEffect(() => {
    if (!viewingAttachmentId && attachments.length > 0) {
      setViewingAttachmentId(primaryAttachment?.id || attachments[0].id);
    } else if (
      viewingAttachmentId &&
      !attachments.some((a) => a.id === viewingAttachmentId)
    ) {
      setViewingAttachmentId(
        primaryAttachment?.id || attachments[0]?.id || null,
      );
    }
  }, [attachments, primaryAttachment, viewingAttachmentId]);

  const viewingAttachment = attachments.find(
    (a) => a.id === viewingAttachmentId,
  );

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography
          variant='h6'
          sx={{
            fontWeight: "bold",
            color: "text.primary",
            opacity: 0.75,
            mb: 2,
            fontSize: "0.875rem",
          }}
        >
          {t("Attachments")}
        </Typography>
      </Box>

      {attachments.length === 0 ? (
        <Box
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            py: "0.75rem",
            backgroundColor: isDragging
              ? "rgba(37, 99, 235, 0.04)"
              : "transparent",
            borderRadius: "0.625rem",
            border: "2px dashed",
            borderColor: isDragging
              ? alpha(theme.palette.primary.main, 0.4)
              : "divider",
            mb: 3,
            transition: "all 0.2s ease-in-out",
            "&:hover": {
              borderColor: alpha(theme.palette.primary.main, 0.4),
              backgroundColor: "rgba(0,0,0,0.01)",
            },
          }}
        >
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: "50%",
              backgroundColor: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mb: "1rem",
              boxShadow: "0 8px 16px rgba(0,0,0,0.06)",
              border: "1px solid rgba(0,0,0,0.04)",
            }}
          >
            <RiUpload2Line
              size={24}
              style={{
                color: "rgba(0, 0, 0, 0.4)",
              }}
            />
          </Box>
          <Typography
            sx={{
              color: "text.primary",
              fontSize: ".875rem",
              fontWeight: 600,
            }}
          >
            {t("No attachments uploaded yet")}
          </Typography>
          <Typography
            sx={{
              color: "text.secondary",
              fontSize: ".875rem",
              textAlign: "center",
              maxWidth: "320px",
              mt: 0.5,
              mb: 2,
            }}
          >
            {t("Drag & drop or click to add attachments")}
          </Typography>
          {formType !== FormTypes.Details && (
            <Button
              variant='outlined'
              component='label'
              startIcon={<AddIcon />}
              sx={{
                borderRadius: "0.5rem",
                textTransform: "none",
                color: "text.primary",
                borderColor: "divider",
                px: "0.625rem",
                py: "0.175rem",
                "&:hover": {
                  borderColor: "divider",
                  boxShadow: "none",
                  backgroundColor: theme.palette.background.default,
                },
              }}
            >
              {t("Upload Attachment")}
              <input
                type='file'
                hidden
                accept='image/*,.pdf,.doc,.docx'
                onChange={handleFileSelect}
              />
            </Button>
          )}
        </Box>
      ) : (
        <Box sx={{ display: "flex", gap: 3, mb: 3 }}>
          {/* Main Preview Area */}
          <Box sx={{ flex: 1, position: "relative" }}>
            <Card
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              sx={{
                borderRadius: "1.25rem",
                overflow: "hidden",
                boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                border: "1px solid",
                borderColor: isDragging ? "primary.main" : "divider",
                position: "relative",
                height: "100%",
                minHeight: "320px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: isDragging
                  ? "rgba(37, 99, 235, 0.04)"
                  : theme.palette.background.default,
                transition: "all 0.2s ease-in-out",
              }}
            >
              {viewingAttachment && (
                <>
                  {viewingAttachment.isPrimary && (
                    <Box
                      sx={{
                        position: "absolute",
                        top: 16,
                        left: 16,
                        zIndex: 2,
                        backgroundColor: "#2563eb",
                        color: "white",
                        px: 1.5,
                        py: 0.5,
                        borderRadius: "0.5rem",
                        fontSize: "0.7rem",
                        fontWeight: 700,
                        boxShadow: "0 4px 12px rgba(37, 99, 235, 0.3)",
                      }}
                    >
                      {handleTranslate("Primary")}
                    </Box>
                  )}
                  <CardMedia
                    component='img'
                    image={
                      getPreviewUrl(viewingAttachment.attachment) ||
                      "/placeholder-image.jpg"
                    }
                    alt={viewingAttachment.description || "Attachment Preview"}
                    sx={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                      maxHeight: "400px",
                    }}
                  />
                  {/* Floating Actions for viewing image */}
                  {formType !== FormTypes.Details && (
                    <Box
                      sx={{
                        position: "absolute",
                        bottom: 20,
                        right: 20,
                        display: "flex",
                        gap: 1,
                        zIndex: 2,
                      }}
                    >
                      <IconButton
                        size='small'
                        onClick={() => handleSetPrimary(viewingAttachment.id)}
                        disabled={viewingAttachment.isPrimary}
                        sx={{
                          backgroundColor: viewingAttachment.isPrimary
                            ? theme.palette.background.paper
                            : theme.palette.background.paper,
                          backdropFilter: "blur(8px)",
                          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                          "&:hover": {
                            backgroundColor: viewingAttachment.isPrimary
                              ? theme.palette.background.paper
                              : theme.palette.background.default,
                            "& svg": {
                              color: "primary.main",
                            },
                          },
                          "&:disabled": {
                            backgroundColor: theme.palette.background.paper,
                          },
                        }}
                      >
                        {viewingAttachment.isPrimary ? (
                          <RiStarFill color={theme.palette.primary.main} />
                        ) : (
                          <RiStarFill />
                        )}
                      </IconButton>
                      <IconButton
                        size='small'
                        onClick={() => handleEditAttachment(viewingAttachment)}
                        sx={{
                          backgroundColor: theme.palette.background.paper,
                          backdropFilter: "blur(8px)",
                          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                          "&:hover": {
                            backgroundColor: theme.palette.background.default,
                          },
                        }}
                      >
                        <EditIcon fontSize='small' />
                      </IconButton>
                      <IconButton
                        size='small'
                        onClick={() =>
                          handleDeleteAttachment(viewingAttachment.id)
                        }
                        sx={{
                          backgroundColor: theme.palette.error.main,
                          color: "white",
                          backdropFilter: "blur(8px)",
                          boxShadow: "0 4px 12px rgba(239, 68, 68, 0.3)",
                          "&:hover": {
                            backgroundColor: theme.palette.error.dark,
                          },
                        }}
                      >
                        <DeleteIcon fontSize='small' />
                      </IconButton>
                    </Box>
                  )}
                </>
              )}
            </Card>
          </Box>

          {/* Thumbnails Sidebar with Arrows */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 1,
              width: "5.5rem",
            }}
          >
            <IconButton
              size='small'
              onClick={() => scrollThumbnails("up")}
              sx={{ color: "rgba(0,0,0,0.3)" }}
              disabled={attachments.length < 4}
            >
              <RiArrowUpSLine size={24} />
            </IconButton>

            <Box
              ref={scrollRef}
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                maxHeight: "320px",
                overflowY: "auto",
                px: 1,
                scrollBehavior: "smooth",
                "&::-webkit-scrollbar": { display: "none" },
                "-ms-overflow-style": "none",
                "scrollbar-width": "none",
              }}
            >
              {attachments.map((attachment) => {
                const isActive = viewingAttachmentId === attachment.id;
                const isPrimary = attachment.isPrimary;

                return (
                  <Box
                    key={attachment.id}
                    onClick={() => setViewingAttachmentId(attachment.id)}
                    sx={{
                      flexShrink: 0,
                      width: "5rem",
                      aspectRatio: "4 / 3",
                      borderRadius: "0.75rem",
                      overflow: "hidden",
                      cursor: "pointer",
                      position: "relative",
                      border: isActive
                        ? "2px solid " + theme.palette.primary.main
                        : isPrimary
                          ? "2px solid " +
                            alpha(theme.palette.primary.main, 0.4)
                          : "2px solid " + theme.palette.divider,
                      transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                      "&:hover": {
                        borderColor: isActive
                          ? theme.palette.primary.main
                          : alpha(theme.palette.primary.main, 0.4),
                      },
                    }}
                  >
                    <CardMedia
                      component='img'
                      image={
                        getPreviewUrl(attachment.attachment) ||
                        "/placeholder-image.jpg"
                      }
                      sx={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        imageOrientation: "from-image",
                      }}
                    />
                    {isPrimary && (
                      <Box
                        sx={{
                          position: "absolute",
                          bottom: 0,
                          left: 0,
                          right: 0,
                          backgroundColor: isActive
                            ? theme.palette.primary.main
                            : alpha(theme.palette.primary.main, 0.4),
                          color: "white",
                          fontSize: "0.5rem",
                          fontWeight: 800,
                          textAlign: "center",
                          pt: 0.45,
                          textTransform: "uppercase",
                          letterSpacing: "0.05em",
                        }}
                      >
                        {handleTranslate("Primary")}
                      </Box>
                    )}
                  </Box>
                );
              })}

              {/* Add Thumbnail Button */}
              {formType !== FormTypes.Details && (
                <Box
                  component='label'
                  sx={{
                    flexShrink: 0,
                    width: "5rem",
                    aspectRatio: "4 / 3",
                    borderRadius: "0.75rem",
                    border: "2px dashed",
                    borderColor: theme.palette.divider,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    transition: "all 0.2s",
                    backgroundColor: "rgba(0,0,0,0.01)",
                    "&:hover": {
                      borderColor: alpha(theme.palette.primary.main, 0.4),
                      backgroundColor: "rgba(37, 99, 235, 0.02)",
                      "& svg": {
                        color: alpha(theme.palette.primary.main, 0.4),
                      },
                    },
                  }}
                >
                  <AddIcon
                    sx={{
                      color: theme.palette.divider,
                      fontSize: 24,
                    }}
                  />
                  <input
                    type='file'
                    hidden
                    accept='image/*,.pdf,.doc,.docx'
                    onChange={handleFileSelect}
                  />
                </Box>
              )}
            </Box>

            <IconButton
              size='small'
              onClick={() => scrollThumbnails("down")}
              sx={{ color: "rgba(0,0,0,0.3)" }}
              disabled={attachments.length < 4}
            >
              <RiArrowDownSLine size={24} />
            </IconButton>
          </Box>
        </Box>
      )}

      {/* Attachment Dialog */}
      <Dialog
        open={openDialog}
        maxWidth='sm'
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 1,
            boxShadow: "0 10px 40px rgba(0, 0, 0, 0.2)",
            overflow: "hidden",
          },
        }}
      >
        <DialogTitle
          sx={{
            p: "16px 24px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: theme.palette.background.paper,
          }}
        >
          {attachments.some((a) => a.id === editingAttachment?.id) ? (
            <>{t("Edit Attachment")}</>
          ) : (
            <>{t("Add Attachment")}</>
          )}
          <IconButton
            aria-label={t("Close")}
            onClick={handleCloseDialog}
            size='small'
            sx={{
              color: theme.palette.text.secondary,
              "&:hover": {
                bgcolor: "rgba(0,0,0,0.05)",
              },
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent
          dividers
          sx={{
            overflowY: "auto",
          }}
        >
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <Box
              sx={{
                width: "100%",
                height: 240,
                borderRadius: "1rem",
                overflow: "hidden",
                border: "1px solid",
                borderColor: "divider",
                backgroundColor: theme.palette.background.paper,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
              }}
            >
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt='Preview'
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                  }}
                />
              ) : (
                <Box sx={{ textAlign: "center", opacity: 0.5 }}>
                  <RiImageLine size={48} />
                  <Typography variant='caption' display='block'>
                    {t("PREVIEW_UNAVAILABLE")}
                  </Typography>
                </Box>
              )}
            </Box>

            <InputText
              type='text'
              className='form-input form-control'
              label={handleTranslate("Description")}
              variant='outlined'
              fullWidth
              disabled={formType === FormTypes.Details}
              value={editingAttachment?.description || ""}
              onChange={(value) =>
                setEditingAttachment((prev) =>
                  prev ? { ...prev, description: value } : prev,
                )
              }
            />

            <Grid container spacing={2}>
              <Grid item xs={12} sm={8}>
                <FormControl fullWidth>
                  <InputSelect
                    options={AttachmentTypeOptions.map((e) => ({
                      ...e,
                      label: handleTranslate(e.label),
                    }))}
                    label={handleTranslate("Attachment Type")}
                    defaultValue={editingAttachment?.attachmentType}
                    disabled={formType === FormTypes.Details}
                    multiple={false}
                    onChange={(e: { target: { value: AttachmentType } }) =>
                      setEditingAttachment((prev) =>
                        prev
                          ? {
                              ...prev,
                              attachmentType: e.target.value,
                            }
                          : null,
                      )
                    }
                    name={"AttachmentType"}
                    onBlur={null}
                    error={undefined}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4}>
                <InputNumber
                  label={handleTranslate("Display Order")}
                  variant='outlined'
                  fullWidth
                  size='small'
                  disabled={formType === FormTypes.Details}
                  value={editingAttachment?.displayOrder ?? attachments.length}
                  inputType='number'
                  onChange={(val) =>
                    setEditingAttachment((prev) =>
                      prev
                        ? {
                            ...prev,
                            displayOrder: val ?? 0,
                          }
                        : null,
                    )
                  }
                />
              </Grid>
            </Grid>

            {formType !== FormTypes.Details && (
              <Box>
                <Paper
                  elevation={0}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    px: 2,
                    py: 1,
                    borderRadius: "0.5rem",
                    border: `1px solid ${theme.palette.divider}`,
                    backgroundColor: theme.palette.background.paper,
                    boxShadow: "none",
                    cursor: "pointer",
                    transition: "all 0.2s ease-in-out",
                    "&:hover": {
                      backgroundColor: theme.palette.action.hover,
                    },
                  }}
                  onClick={() =>
                    setEditingAttachment((prev) =>
                      prev ? { ...prev, isPrimary: !prev.isPrimary } : null,
                    )
                  }
                >
                  <Box>
                    <Typography variant='subtitle2' fontWeight={600}>
                      {t("PRIMARY_ATTACHMENT_TITLE")}
                    </Typography>
                    <Typography variant='caption' color='text.secondary'>
                      {t("PRIMARY_ATTACHMENT_DESC")}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      position: "relative",
                      width: "32px",
                      height: "18px",
                      borderRadius: "12px",
                      backgroundColor: editingAttachment?.isPrimary
                        ? "#3b82f6"
                        : theme.palette.action.disabled,
                      transition: "background-color 0.3s ease",
                      cursor: "pointer",
                    }}
                  >
                    <Box
                      sx={{
                        position: "absolute",
                        top: "1px",
                        left: editingAttachment?.isPrimary ? "14px" : "1px",
                        width: "16px",
                        height: "16px",
                        borderRadius: "50%",
                        backgroundColor: "#ffffff",
                        transition: "left 0.3s ease",
                        boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                      }}
                    />
                  </Box>
                </Paper>
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions
          sx={{
            p: "16px 24px",
            bgcolor: theme.palette.background.paper,
            justifyContent: "flex-end",
            flexDirection: "row",
          }}
        >
          <Button
            onClick={handleSaveAttachment}
            key='action'
            variant='contained'
            color='primary'
            sx={{
              p: "8px 16px",
              fontWeight: 500,
            }}
          >
            {attachments.some((a) => a.id === editingAttachment?.id)
              ? t("Update")
              : t("Add")}
          </Button>
          <button
            key='close'
            type='button'
            className='btn btn-secondary'
            onClick={handleCloseDialog}
            style={{ height: 40, marginLeft: 10, marginRight: 10 }}
          >
            {t("Cancel")}
          </button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProductPictureUpload;
