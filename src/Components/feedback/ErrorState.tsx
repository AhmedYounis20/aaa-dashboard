import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import RefreshIcon from "@mui/icons-material/Refresh";
import { Box, Button, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

const ErrorState = ({ title, message, onRetry }: ErrorStateProps) => {
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
      <ErrorOutlineIcon color="error" sx={{ fontSize: 56 }} />
      <Typography variant="h6" color="error">
        {title ?? t("SomethingWentWrong")}
      </Typography>
      {message && (
        <Typography variant="body2" color="text.secondary" maxWidth={480}>
          {message}
        </Typography>
      )}
      {onRetry && (
        <Button variant="outlined" startIcon={<RefreshIcon />} onClick={onRetry}>
          {t("Retry")}
        </Button>
      )}
    </Box>
  );
};

export default ErrorState;
