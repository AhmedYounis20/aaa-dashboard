import { Box, CircularProgress, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

interface LoadingStateProps {
  message?: string;
}

const LoadingState = ({ message }: LoadingStateProps) => {
  const { t } = useTranslation();

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      gap={2}
      py={8}
    >
      <CircularProgress size={40} />
      <Typography variant="body2" color="text.secondary">
        {message ?? t("Loading")}
      </Typography>
    </Box>
  );
};

export default LoadingState;
