import {
  Paper,
  List,
  ListItem,
  ListItemText,
  Checkbox,
  Typography,
  Divider,
  useTheme,
  Box,
} from "@mui/material";
import { useTranslation } from "react-i18next";

interface ColumnVisibilityDropdownProps {
  visibleColumns: Record<string, boolean>;
  onToggleColumn: (column: string) => void;
  columnLabels: Record<string, string>;
}

export function ColumnVisibilityDropdown({
  visibleColumns,
  onToggleColumn,
  columnLabels,
}: ColumnVisibilityDropdownProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const visibleCount = Object.values(visibleColumns).filter(Boolean).length;

  return (
    <Paper
      elevation={3}
      sx={{
        position: "absolute",
        left: 0,
        top: "100%",
        mt: 1,
        width: 225,
        maxHeight: 370,
        overflowY: "auto",
        zIndex: 50,
      }}
    >
      <Box sx={{ padding: "12px" }}>
        <Typography variant="subtitle2" color="text.primary">
          {t("Column Visibility")}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {visibleCount} {t("of")} {Object.keys(visibleColumns).length} {t("visible")}
        </Typography>
      </Box>
      <Divider />
      <List dense disablePadding>
        {Object.entries(visibleColumns).map(([key, visible]) => (
          <ListItem
            key={key}
            onClick={() => onToggleColumn(key)}
            sx={{
              padding: "10px 16px",
              color: theme.palette.text.secondary,
              "&:hover": {
                backgroundColor: theme.palette.background.default,
                cursor: "pointer",
              },
              "& .MuiListItemText-root": {
                margin: 0,
              },
            }}
            secondaryAction={
              <Checkbox
                edge="end"
                checked={visible}
                onChange={() => onToggleColumn(key)}
                size="small"
              />
            }
          >
            <ListItemText primary={columnLabels[key] || key} />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
}
