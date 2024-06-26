// import { NavLink } from "react-router-dom";
// import './AppSidebar.css'
// import { Apps } from '@mui/icons-material';
// import logo from "../../../../public/ico.svg";
import { Box, Drawer, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography, useTheme } from "@mui/material";
import FlexBetween from "../../FlexBetween";
import { useEffect, useState } from "react";
import {useNavigate, useLocation} from 'react-router-dom'
import {
  // SettingsOutlined,
  ChevronLeft,
  ChevronRightOutlined,
  HomeOutlined,
  ShoppingCartOutlined,
  Groups2Outlined,
  ReceiptLongOutlined,
  PublicOutlined,
  PointOfSaleOutlined,
  TodayOutlined,
  CalendarMonthOutlined,
  AdminPanelSettingsOutlined,
  TrendingUpOutlined,
  PieChartOutline
} from '@mui/icons-material'
// sidebar nav config

const navItems = [
  {
      text: "Dashboard",
      icon: <HomeOutlined/>
  },
  {
      text: "Client Facing",
      icon: null
  },
  {
      text: "Products",
      icon: <ShoppingCartOutlined/>
  },
  {
      text: "Customers",
      icon: <Groups2Outlined/>
  },
  {
      text: "Transactions",
      icon: <ReceiptLongOutlined/>
  },
  {
      text: "Geography",
      icon: <PublicOutlined/>
  },
  {
      text: "Sales",
      icon: null
  },
  {
      text: "Overview",
      icon: <PointOfSaleOutlined/>
  },
  {
      text: "Daily",
      icon: <TodayOutlined/>
  },
  {
      text: "Monthly",
      icon: <CalendarMonthOutlined/>
  },
  {
      text: "Breakdown",
      icon: <PieChartOutline/>
  },
  {
      text: "Management",
      icon: null
  },
  {
      text: "Admin",
      icon: <AdminPanelSettingsOutlined/>
  },
  {
      text: "Performance",
      icon: <TrendingUpOutlined/>
  }
];

type SidebarProps = {
  drawerWidth: string,
  isSidebarOpen: boolean,
  setIsSidebarOpen: (open: boolean) => void,
  isNonMobile: boolean
}

function Sidebar({ drawerWidth, isNonMobile, setIsSidebarOpen, isSidebarOpen }: SidebarProps) {

  const { pathname } = useLocation();
  const [active, setActive] = useState("");
  const navigate = useNavigate();
  const theme = useTheme();

  const handleClickNavItems = (text: string) => {
    navigate(`/${text}`);
    setActive(text)
  }

  useEffect(() => {
    setActive(pathname.substring(1))
  }, [pathname])


  return (
    <Box component="nav">
      {isSidebarOpen && (
        <Drawer
          open={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          variant='persistent'
          anchor='left'
          sx={{
            width: drawerWidth,
            "& .MuiDrawer-paper": {
              color: theme?.palette.secondary,
              backgroundColor: theme?.palette.secondary,
              borderWidth: isNonMobile ? 0 : "2px",
              width: drawerWidth
            }
          }}
        >
          <Box width="100%">
            <Box m="1.5rem 2rem 2rem 3rem">
              <FlexBetween color={theme?.palette.secondary.main}>
                <Box display='flex' alignItems='center' gap='0.5rem'>
                  <Typography variant='h4' fontWeight='bold'>
                    ECOMVISION
                  </Typography>
                </Box>
                {!isNonMobile && (
                  <IconButton onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                    <ChevronLeft />
                  </IconButton>
                )}
              </FlexBetween>
            </Box>
            <List>
              {navItems.map(({ text, icon }) => {
                if (!icon) {
                  return (
                    <Typography key={text} sx={{ m: '2.25rem 0 1rem 3rem' }}>
                      {text}
                    </Typography>
                  )
                }
                const lcText = text.toLowerCase();

                return (
                  <ListItem key={text} disablePadding>
                    <ListItemButton
                      onClick={() => handleClickNavItems(lcText)}
                      sx={{
                        backgroundColor: active === lcText ? theme?.palette?.secondary[300] : 'transparent',
                        color: active === lcText
                          ? theme?.palette?.primary[600]
                          : theme?.palette?.secondary[200]
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          ml: '2rem',
                          color: active === lcText
                            ? theme?.palette?.primary[600]
                            : theme?.palette?.secondary[200]
                        }}
                      >
                        {icon}
                      </ListItemIcon>
                      <ListItemText primary={text}>
                        {active === lcText && (
                          <ChevronRightOutlined sx={{ ml: 'auto' }} />
                        )}
                      </ListItemText>
                    </ListItemButton>
                  </ListItem>
                )

              })}
            </List>
          </Box>
        </Drawer>
      )}
    </Box>
  )
}

export default Sidebar;
