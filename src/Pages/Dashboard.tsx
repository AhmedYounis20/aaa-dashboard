import { Box, Button, Card, CardContent, Grid, Stack, Typography, useTheme } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import AccountTreeOutlinedIcon from "@mui/icons-material/AccountTreeOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import ReceiptOutlinedIcon from "@mui/icons-material/ReceiptOutlined";
import InventoryOutlinedIcon from "@mui/icons-material/InventoryOutlined";
import type { SvgIconComponent } from "@mui/icons-material";

type QuickLink = {
  labelKey: string;
  path: string;
  descriptionKey: string;
  Icon: SvgIconComponent;
};

const QUICK_LINKS: QuickLink[] = [
  {
    labelKey: "ChartOfAccounts",
    path: "/chart-of-accounts",
    descriptionKey: "DashboardLinkChartOfAccounts",
    Icon: AccountTreeOutlinedIcon,
  },
  {
    labelKey: "Customers",
    path: "/sub-ledgers/customers",
    descriptionKey: "DashboardLinkCustomers",
    Icon: PeopleOutlinedIcon,
  },
  {
    labelKey: "JournalEntries",
    path: "/journal-entries",
    descriptionKey: "DashboardLinkJournalEntries",
    Icon: ReceiptOutlinedIcon,
  },
  {
    labelKey: "Products",
    path: "/products",
    descriptionKey: "DashboardLinkProducts",
    Icon: InventoryOutlinedIcon,
  },
];

const Dashboard = () => {
  const theme = useTheme();
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <Box>
      <Stack spacing={1} mb={3}>
        <Typography variant="h4" fontWeight={700}>
          {t("WelcomeBack")}
        </Typography>
        <Typography variant="body1" color="text.secondary" maxWidth={640}>
          {t("DashboardSubtitle")}
        </Typography>
      </Stack>

      <Typography variant="subtitle1" fontWeight={600} mb={2}>
        {t("QuickActions")}
      </Typography>

      <Grid container spacing={2}>
        {QUICK_LINKS.map(({ labelKey, path, descriptionKey, Icon }) => (
          <Grid item xs={12} sm={6} md={3} key={path}>
            <Card
              variant="outlined"
              sx={{
                height: "100%",
                backgroundColor: theme.palette.background.paper,
                borderColor: theme.palette.divider,
                boxShadow: "none",
              }}
            >
              <CardContent
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 1.5,
                  height: "100%",
                }}
              >
                <Icon color="primary" sx={{ fontSize: 28 }} />
                <Typography variant="h6" fontWeight={600}>
                  {t(labelKey)}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ flexGrow: 1 }}>
                  {t(descriptionKey)}
                </Typography>
                <Button
                  size="small"
                  variant="contained"
                  disableElevation
                  onClick={() => navigate(path)}
                  sx={{ alignSelf: "flex-start", textTransform: "none" }}
                >
                  {t("Open")}
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Dashboard;
