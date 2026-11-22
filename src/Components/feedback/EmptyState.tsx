import InboxOutlinedIcon from "@mui/icons-material/InboxOutlined";
import { Box, Button, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

interface EmptyStateProps {
  title?: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
}

const EmptyState = ({ title, message, actionLabel, onAction }: EmptyStateProps) => {
  const { t } = useTranslation();

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      gap={2}
      py={8}
      px={3}
      textAlign="center"
    >
      <InboxOutlinedIcon sx={{ fontSize: 56, color: "text.disabled" }} />
      <Typography variant="h6" color="text.primary">
        {title ?? t("NoDataFound")}
      </Typography>
      {message && (
        <Typography variant="body2" color="text.secondary" maxWidth={420}>
          {message}
        </Typography>
      )}
      {onAction && actionLabel && (
        <Button variant="contained" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </Box>
  );
};

export default EmptyState;
