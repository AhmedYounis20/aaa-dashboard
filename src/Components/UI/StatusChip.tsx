import { Chip, useTheme } from "@mui/material";
import { useTranslation } from "react-i18next";

export const StatusChip: React.FC<{ value: boolean }> = ({ value }) => {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <Chip
      label={value ? t("Active") : t("Inactive")}
      size='small'
      variant='filled'
      sx={{
        backgroundColor: value
          ? theme.palette.success.main
          : theme.palette.error.main,
        color: value
          ? theme.palette.success.contrastText
          : theme.palette.error.contrastText,
      }}
    />
  );
};
