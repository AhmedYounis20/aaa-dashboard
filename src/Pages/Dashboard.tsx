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
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import PeopleIcon from '@mui/icons-material/People';
import BusinessIcon from '@mui/icons-material/Business';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import FlashOnIcon from '@mui/icons-material/FlashOn';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);
import LinearProgress from '@mui/material/LinearProgress';

const Dashboard = () => {
  const theme = useTheme();
  const { t } = useTranslation();

  const stats = [
    {
      label: t("TotalCustomers"),
      value: "1,250",
      icon: <PeopleIcon color="primary" sx={{ fontSize: 40 }} />,
      color: "#e3f2fd",
    },
    {
      label: t("TotalSuppliers"),
      value: "320",
      icon: <BusinessIcon color="success" sx={{ fontSize: 40 }} />,
      color: "#e8f5e9",
    },
    {
      label: t("ActiveFinancialPeriods"),
      value: "3",
      icon: <CalendarMonthIcon color="warning" sx={{ fontSize: 40 }} />,
      color: "#fff8e1",
    },
    {
      label: t("TotalItems"),
      value: "4,800",
      icon: <Inventory2Icon color="secondary" sx={{ fontSize: 40 }} />,
      color: "#f3e5f5",
    },
  ];

  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    datasets: [
      {
        label: t('Revenue'),
        data: [12000, 15000, 14000, 17000, 16000, 18000, 20000],
        fill: true,
        backgroundColor: 'rgba(33, 150, 243, 0.08)',
        borderColor: theme.palette.primary.main,
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { display: false } },
      y: { grid: { color: theme.palette.divider } },
    },
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <Box p={3}>
      <Typography variant="h4" fontWeight="bold" mb={3}>
        {t("WelcomeBack")}
      </Typography>

      <Grid container spacing={3} mb={3}>
        {/* Card 1: Today's Activity */}
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: '#e3f2fd', boxShadow: 3 }}>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2} mb={2}>
                <NotificationsActiveIcon color="primary" sx={{ fontSize: 36 }} />
                <Typography variant="h6" fontWeight={600}>Today's Activity</Typography>
              </Box>
              <Box display="flex" flexDirection="column" gap={1}>
                <Chip label="12 new entries" color="success" variant="outlined" />
                <Chip label="5 approvals" color="info" variant="outlined" />
                <Chip label="2 flagged" color="error" variant="outlined" />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        {/* Card 2: System Health */}
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: '#e8f5e9', boxShadow: 3, textAlign: 'center' }}>
            <CardContent>
              <CheckCircleIcon color="success" sx={{ fontSize: 48, mb: 1 }} />
              <Typography variant="h6" fontWeight={600} mb={1}>System Health</Typography>
              <Typography variant="body2" color="text.secondary" mb={2}>All systems operational</Typography>
              <Box sx={{ width: '100%', mb: 1 }}>
                <LinearProgress variant="determinate" value={99.98} sx={{ height: 10, borderRadius: 5 }} />
              </Box>
              <Typography variant="caption" color="text.secondary">Uptime: 99.98%</Typography>
            </CardContent>
          </Card>
        </Grid>
        {/* Card 3: Quick Actions */}
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: '#fffde7', boxShadow: 3 }}>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2} mb={2}>
                <FlashOnIcon color="warning" sx={{ fontSize: 36 }} />
                <Typography variant="h6" fontWeight={600}>Quick Actions</Typography>
              </Box>
              <Box display="flex" gap={1}>
                <Button size="small" variant="contained" color="primary">Add Customer</Button>
                <Button size="small" variant="outlined" color="secondary">New Invoice</Button>
                <Button size="small" variant="outlined" color="success">Export</Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        {/* Card 4: Recent Trends */}
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: '#f3e5f5', boxShadow: 3 }}>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2} mb={2}>
                <TrendingUpIcon color="secondary" sx={{ fontSize: 36 }} />
                <Typography variant="h6" fontWeight={600}>Recent Trends</Typography>
              </Box>
              <Box sx={{ height: 60, mb: 1 }}>
                {/* Mini static line chart using Chart.js */}
                <Line
                  data={{
                    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
                    datasets: [
                      {
                        data: [10, 12, 9, 14, 15, 13, 17],
                        borderColor: '#7c43bd',
                        backgroundColor: 'rgba(124,67,189,0.08)',
                        tension: 0.4,
                        pointRadius: 0,
                        fill: true,
                      },
                    ],
                  }}
                  options={{
                    plugins: { legend: { display: false }, tooltip: { enabled: false } },
                    scales: { x: { display: false }, y: { display: false } },
                    responsive: true,
                    maintainAspectRatio: false,
                  }}
                  height={60}
                />
              </Box>
              <Chip label="+8% this week" color="success" size="small" />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card sx={{ height: 320, boxShadow: 3 }}>
            <CardContent>
              <Typography variant="subtitle1" fontWeight={600} mb={2}>
                {t('RevenueOverview')}
              </Typography>
              <Box sx={{ height: 220 }}>
                <Line data={chartData} options={chartOptions} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ height: 320, boxShadow: 3, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <CardContent sx={{ width: '100%' }}>
              <Typography variant="subtitle1" fontWeight={600} mb={2}>
                {t('ProjectCompletion')}
              </Typography>
              <Box sx={{ width: '100%', mb: 2 }}>
                <LinearProgress variant="determinate" value={72} sx={{ height: 12, borderRadius: 6 }} />
              </Box>
              <Typography variant="h5" fontWeight="bold" align="center">
                72%
              </Typography>
              <Typography variant="body2" color="text.secondary" align="center">
                {t('OfCurrentMilestone')}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
