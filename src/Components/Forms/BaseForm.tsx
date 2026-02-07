import { useMemo, useState, useCallback, useContext } from "react";
import { FormTypes } from "../../interfaces/Components/FormType";
import { useTranslation } from "react-i18next";
import { appContext } from "../../layout/DefaultLayout";
import { Box, Typography, useTheme, Button, Dialog, DialogTitle, DialogContent, DialogActions, IconButton, CircularProgress, useMediaQuery } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

type FormSize = "small" | "medium" | "large" | "xlarge";

interface BaseFormProps {
  formType: FormTypes;
  handleCloseForm?: () => void;
  handleUpdate?: () => Promise<boolean>;
  handleDelete?: () => Promise<boolean>;
  handleAdd?: () => Promise<boolean>;
  children: React.ReactNode;
  isModal?: boolean;
  size?: FormSize;
  title?: string;
}

const ModalSize: Record<FormSize, "sm" | "md" | "lg" | "xl"> = {
  small: "sm",
  medium: "md",
  large: "lg",
  xlarge: "xl",
};

const BaseForm: React.FC<BaseFormProps> = ({
  formType,
  handleCloseForm,
  handleUpdate,
  handleDelete,
  handleAdd,
  children,
  isModal = true,
  size = "medium",
  title,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery("(max-width: 991px)");
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isSidebarOpen } = useContext(appContext);

  const modalSizeClass = useMemo(() => ModalSize[size], [size]);

  const formTitle = `${t(FormTypes[formType].toString())} ${title ?? ""}`;

  const handleSubmit = useCallback(async () => {
    setIsSubmitting(true);
    try {
      let success = false;

      switch (formType) {
        case FormTypes.Add:
          success = handleAdd ? await handleAdd() : false;
          break;
        case FormTypes.Edit:
          success = handleUpdate ? await handleUpdate() : false;
          break;
        case FormTypes.Delete:
          success = handleDelete ? await handleDelete() : false;
          break;
        default:
          break;
      }

      if (success && handleCloseForm) {
        handleCloseForm();
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [formType, handleAdd, handleUpdate, handleDelete, handleCloseForm]);

  const getActionButtonVariant = (): "error" | "primary" => {
    return formType === FormTypes.Delete ? "error" : "primary";
  };

  const getActionButtonText = () => {
    if (formType === FormTypes.Delete) return t("Delete");
    if (formType === FormTypes.Add) return t("Save");
    return t("Update");
  };

  const renderActionButtons = () => {
    const showActionButton = formType !== FormTypes.Details;

    const closeButton = (
      <button
        key="close"
        type="button"
        className="btn btn-secondary"
        onClick={handleCloseForm}
        disabled={isSubmitting}
        style={{ height: 40, marginLeft: 10, marginRight: 10 }}
      >
        {t("Cancel")}
      </button>
    );

    const actionButton = showActionButton ? (
      <Button
        key="action"
        variant="contained"
        color={getActionButtonVariant()}
        onClick={handleSubmit}
        disabled={isSubmitting}
        sx={{
          p: "8px 16px",
          fontWeight: 500,
        }}
      >
        {isSubmitting ? (
          <CircularProgress size={22} color="inherit" />
        ) : (
          getActionButtonText()
        )}
      </Button>
    ) : null;

    const buttons = [actionButton, closeButton].filter(Boolean);

    return buttons;
  };

  if (!isModal && formType !== FormTypes.Delete) {
    return (
      <Box
        className='base-form-inline'
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          overflow: "hidden",
        }}
      >
        <Box
          className='form-header'
          sx={{
            p: "0 0 20px",
            flexShrink: 0,
          }}
        >
          <Typography
            variant="h4"
            sx={{
              m: 0,
              fontSize: "1.5rem",
              fontWeight: 600,
              color: theme.palette.text.primary,
            }}
          >
            {formTitle}
          </Typography>
        </Box>

        <Box
          className='form-body'
          sx={{
            pb: "90px",
            flex: 1,
            overflowY: "auto",
          }}
        >
          {children}
        </Box>

        <Box
          className='form-footer'
          sx={{
            p: "16px 24px",
            bgcolor: theme.palette.background.paper,
            display: "flex",
            justifyContent: "flex-end",
            position: "fixed",
            bottom: 0,
            left: isMobile
                ? 0
                : isSidebarOpen
                ? "230px"
                : "80px",
            right: 0,
            zIndex: 1000,
            boxShadow: "5px -2px 10px rgba(0, 0, 0, 0.1)",
            transition: "left 0.3s ease",
          }}
        >
          {renderActionButtons()}
        </Box>
      </Box>
    );
  }

  return (
    <Dialog
      open={true}
      maxWidth={formType === FormTypes.Delete ? "sm" : modalSizeClass}
      fullWidth
      scroll="paper"
      PaperProps={{
        sx: {
          borderRadius: 1,
          boxShadow: "0 10px 40px rgba(0, 0, 0, 0.2)",
          overflow: "hidden",
        }
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
        {formTitle}
        <IconButton
          aria-label={t("Close")}
          onClick={handleCloseForm}
          size="small"
          sx={{
            color: theme.palette.text.secondary,
            '&:hover': {
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
          p: "24px",
          overflowY: "auto",
        }}
      >
        {children}
      </DialogContent>

      <DialogActions
        sx={{
          p: "16px 24px",
          bgcolor: theme.palette.background.paper,
          justifyContent: "flex-end",
          flexDirection: isRTL ? "row-reverse" : "row",
        }}
      >
        {renderActionButtons()}
      </DialogActions>
    </Dialog>
  );
};

export default BaseForm;
