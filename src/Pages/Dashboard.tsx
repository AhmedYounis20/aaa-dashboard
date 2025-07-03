import {
  Box,
  Grid,
  Typography,
  Card,
  CardContent,
  useTheme,
} from "@mui/material";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import ReceiptIcon from "@mui/icons-material/Receipt";
import { useTranslation } from "react-i18next";

const Dashboard = () => {
  const theme = useTheme();
  const { t } = useTranslation();

  const stats = [
    {
      label: t("TotalRevenue"),
      value: "$120,000",
      icon: <TrendingUpIcon color="success" sx={{ fontSize: 40 }} />,
      color: "#e8f5e9",
    },
    {
      label: t("TotalExpenses"),
      value: "$48,500",
      icon: <TrendingDownIcon color="error" sx={{ fontSize: 40 }} />,
      color: "#ffebee",
    },
    {
      label: t("AccountBalance"),
      value: "$71,500",
      icon: <AccountBalanceWalletIcon color="primary" sx={{ fontSize: 40 }} />,
      color: "#e3f2fd",
    },
    {
      label: t("PendingInvoices"),
      value: "23",
      icon: <ReceiptIcon color="warning" sx={{ fontSize: 40 }} />,
      color: "#fff8e1",
    },
  ];

  return (
    <Box p={3}>
      <Typography variant="h4" fontWeight="bold" mb={3}>
        {t("WelcomeBack")}
      </Typography>

      <Grid container spacing={3}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card
              sx={{
                backgroundColor: stat.color,
                borderLeft: `6px solid ${theme.palette.primary.main}`,
                boxShadow: 3,
              }}
            >
              <CardContent>
                <Box display="flex" alignItems="center" gap={2}>
                  {stat.icon}
                  <Box>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      fontWeight="bold"
                    >
                      {stat.label}
                    </Typography>
                    <Typography variant="h6" fontWeight="bold">
                      {stat.value}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Dashboard;
