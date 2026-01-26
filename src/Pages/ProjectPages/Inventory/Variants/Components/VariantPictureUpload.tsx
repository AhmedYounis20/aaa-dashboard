import React, { useState } from 'react';
import { v4 as uuid } from "uuid";
import { useTranslation } from 'react-i18next';
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardMedia,
  CardActions,
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
  FormControlLabel
} from '@mui/material';
import {
  CloudUpload as CloudUploadIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Visibility as VisibilityIcon
} from '@mui/icons-material';
import VariantAttachmentModel from '../../../../../interfaces/ProjectInterfaces/Inventory/Variants/VariantAttachmentModel';
import { AttachmentType } from '../../../../../interfaces/ProjectInterfaces/Inventory/Products/AttachmentType';
import AttachmentModel from '../../../../../interfaces/BaseModels/AttachmentModel';
import { FormTypes } from '../../../../../interfaces/Components';

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
  onAttachmentsChange
}) => {
  const { t } = useTranslation();
  const [openDialog, setOpenDialog] = useState(false);
  const [editingAttachment, setEditingAttachment] = useState<VariantAttachmentModel | null>(null);
  const [selectedAttachment, setSelectedAttachment] = useState<AttachmentModel | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const getPreviewUrl = (attachment?: AttachmentModel | null) => {
    if (!attachment) {
      return null;
    }

    if (!attachment.contentType.startsWith('image')) {
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
          attachmentId: uuid()
        });
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const attachment = await convertToAttachmentModel(file);
      setSelectedAttachment(attachment);
      setPreviewUrl(getPreviewUrl(attachment));
      
      // Initialize editingAttachment for new attachment
      setEditingAttachment({
        id: uuid(),
        variantId: variantId,
        attachmentId: uuid(),
        description: '',
        attachmentType: AttachmentType.Picture,
        isPrimary: attachments.length === 0, // Set as primary if it's the first attachment
        displayOrder: attachments.length,
        createdAt: '',
        modifiedAt: ''
      });
      
      setOpenDialog(true);
    }
  };

  const handleSaveAttachment = () => {
    if (!editingAttachment) {
      return;
    }

    const now = new Date().toISOString();
    const isEditingExisting = attachments.some(
      (attachment) => attachment.id === editingAttachment.id
    );
    const baseAttachment = isEditingExisting ? editingAttachment.attachment : undefined;
    const attachmentPayload = selectedAttachment ?? baseAttachment;

    if (!attachmentPayload) {
      return;
    }

    const resolvedAttachmentId =
      editingAttachment.attachmentId || attachmentPayload.attachmentId || uuid();

    const newAttachment: VariantAttachmentModel = {
      id: editingAttachment.id || uuid(),
      variantId: variantId,
      attachmentId: resolvedAttachmentId,
      description: editingAttachment.description || '',
      attachmentType: editingAttachment.attachmentType || AttachmentType.Picture,
      isPrimary: editingAttachment.isPrimary || false,
      displayOrder: editingAttachment.displayOrder ?? attachments.length,
      attachment: {
        ...attachmentPayload,
        attachmentId: resolvedAttachmentId
      },
      createdAt: editingAttachment.createdAt || now,
      modifiedAt: now
    };

    let updatedAttachments = isEditingExisting
      ? attachments.map(att => att.id === editingAttachment.id ? newAttachment : att)
      : [...attachments, newAttachment];

    if (newAttachment.isPrimary) {
      updatedAttachments = updatedAttachments.map(att => ({
        ...att,
        isPrimary: att.id === newAttachment.id
      }));
    }

    onAttachmentsChange(updatedAttachments);
    handleCloseDialog();
  };

  const handleDeleteAttachment = (attachmentId: string) => {
    const updatedAttachments = attachments.filter(att => att.id !== attachmentId);
    onAttachmentsChange(updatedAttachments);
  };

  const handleEditAttachment = (attachment: VariantAttachmentModel) => {
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
    const updatedAttachments = attachments.map(att => ({
      ...att,
      isPrimary: att.id === attachmentId
    }));
    onAttachmentsChange(updatedAttachments);
  };

  const primaryAttachment = attachments.find(att => att.isPrimary);
  const otherAttachments = attachments.filter(att => !att.isPrimary);

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">{t("Variant Attachments")}</Typography>
        <Button
          variant="contained"
          startIcon={<CloudUploadIcon />}
          disabled={formType === FormTypes.Details}
          component="label"
        >
          {t("Upload Attachment")}
          <input
            type="file"
            hidden
            accept="image/*,.pdf,.doc,.docx"
            disabled={formType === FormTypes.Details}
            onChange={handleFileSelect}
          />
        </Button>
      </Box>

      {attachments.length === 0 ? (
        <Box
          sx={{
            border: '2px dashed #ccc',
            borderRadius: 2,
            p: 4,
            textAlign: 'center',
            backgroundColor: '#f9f9f9',
            mb:2
          }}
        >
          <CloudUploadIcon sx={{ fontSize: 48, color: '#ccc', mb: 2 }} />
          <Typography variant="body1" color="textSecondary">
            {t("No attachments uploaded yet")}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {t("Click the upload button to add attachments")}
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={2} sx={{mb:2}}>
          {/* Primary Attachment */}
          {primaryAttachment && (
            <Grid item xs={12} md={6}>
              <Card sx={{ position: 'relative' }}>
                <Box sx={{ position: 'absolute', top: 8, left: 8, zIndex: 1 }}>
                  <Typography
                    variant="caption"
                    sx={{
                      backgroundColor: 'primary.main',
                      color: 'white',
                      px: 1,
                      py: 0.5,
                      borderRadius: 1
                    }}
                  >
                    {t("Primary")}
                  </Typography>
                </Box>
                <CardMedia
                  component="img"
                  height="200"
                  image={getPreviewUrl(primaryAttachment.attachment) || '/placeholder-image.jpg'}
                  alt={primaryAttachment.description || 'Primary attachment'}
                />
                <CardActions>
                  <IconButton
                    size="small"
                    onClick={() => handleEditAttachment(primaryAttachment)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleDeleteAttachment(primaryAttachment.id)}
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          )}

          {/* Other Attachments */}
          {otherAttachments.map((attachment) => (
            <Grid item xs={12} sm={6} md={3} key={attachment.id}>
              <Card sx={{ position: 'relative' }}>
                <CardMedia
                  component="img"
                  height="150"
                  image={getPreviewUrl(attachment.attachment) || '/placeholder-image.jpg'}
                  alt={attachment.description || 'Attachment'}
                />
                <CardActions>
                  <IconButton
                    size="small"
                    onClick={() => handleSetPrimary(attachment.id)}
                    title={t("Set as Primary")}
                  >
                    <VisibilityIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleEditAttachment(attachment)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleDeleteAttachment(attachment.id)}
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Attachment Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingAttachment?.id ? t("Edit Attachment") : t("Add Attachment")}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            {previewUrl && (
              <Box sx={{ textAlign: 'center' }}>
                <img
                  src={previewUrl}
                  alt="Preview"
                  style={{ maxWidth: '100%', maxHeight: '300px', objectFit: 'contain' }}
                />
              </Box>
            )}

            <TextField
              label={t("Description")}
              value={editingAttachment?.description || ''}
              onChange={(e) => setEditingAttachment(prev => prev ? { ...prev, description: e.target.value } : null)}
              fullWidth
              multiline
              rows={2}
            />

            <FormControl fullWidth>
              <InputLabel>{t("Attachment Type")}</InputLabel>
              <Select
                value={editingAttachment?.attachmentType || AttachmentType.Picture}
                onChange={(e) => setEditingAttachment(prev => prev ? { ...prev, attachmentType: e.target.value as AttachmentType } : null)}
              >
                <MenuItem value={AttachmentType.Picture}>{t("Picture")}</MenuItem>
                <MenuItem value={AttachmentType.License}>{t("License")}</MenuItem>
                <MenuItem value={AttachmentType.Manual}>{t("Manual")}</MenuItem>
                <MenuItem value={AttachmentType.Certificate}>{t("Certificate")}</MenuItem>
                <MenuItem value={AttachmentType.Warranty}>{t("Warranty")}</MenuItem>
                <MenuItem value={AttachmentType.Other}>{t("Other")}</MenuItem>
              </Select>
            </FormControl>

            <TextField
              label={t("Display Order")}
              type="number"
              value={editingAttachment?.displayOrder ?? attachments.length}
              onChange={(e) => setEditingAttachment(prev => prev ? { ...prev, displayOrder: parseInt(e.target.value) || 0 } : null)}
              fullWidth
            />

            <FormControlLabel
              control={
                <Switch
                  checked={editingAttachment?.isPrimary || false}
                  onChange={(e) => setEditingAttachment(prev => prev ? { ...prev, isPrimary: e.target.checked } : null)}
                />
              }
              label={t("Set as Primary")}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>{t("Cancel")}</Button>
          <Button onClick={handleSaveAttachment} variant="contained">
            {editingAttachment?.id ? t("Update") : t("Add")}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default VariantPictureUpload;



