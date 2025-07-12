import "./AppHeader.css";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  initialuserState,
  setLoggedInUser,
} from "../../../Storage/Redux/userAuthSlice";
import {
  AppBar,
  IconButton,
  Toolbar,
  useTheme,
  Box,
  Typography,
  Avatar,
  Menu,
  MenuItem,
  Divider,
} from "@mui/material";
import FlexBetween from "../../FlexBetween";
import {
  DarkModeOutlined,
  LightModeOutlined,
  SettingsOutlined,
  Language,
  AccountCircle,
  NotificationsNone,
} from "@mui/icons-material";
import { MdMenuOpen } from "react-icons/md";
import DashboardIcon from "@mui/icons-material/Dashboard";
import { setMode } from "../../../Storage/Redux/global";
import LogoutIcon from "@mui/icons-material/Logout";
import { useTranslation } from "react-i18next";

type AppHeaderProps = {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
};

function AppHeader({ isSidebarOpen, setIsSidebarOpen }: AppHeaderProps) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const { i18n, t } = useTranslation();
  const [languageMenuAnchor, setLanguageMenuAnchor] =
    useState<null | HTMLElement>(null);
  const [userMenuAnchor, setUserMenuAnchor] = useState<null | HTMLElement>(
    null
  );
  // const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  // const handleClick = (event: React.MouseEvent<HTMLElement>) => {
  //   setAnchorEl(event.currentTarget);
  // };

  // const handleClose = () => {
  //   setAnchorEl(null);
  // };

  const changeLanguage = (lng: "en" | "ar") => {
    i18n.changeLanguage(lng);
    document.documentElement.dir = lng === "ar" ? "rtl" : "ltr";
    setLanguageMenuAnchor(null);
  };

  const handleLogout = () => {
    localStorage.getItem("accessToken") &&
      localStorage.removeItem("accessToken");
    dispatch(setLoggedInUser(initialuserState));
    navigate("/login");
    setUserMenuAnchor(null);
  };

  const openLanguageMenu = (event: React.MouseEvent<HTMLElement>) => {
    setLanguageMenuAnchor(event.currentTarget);
  };

  const openUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setUserMenuAnchor(event.currentTarget);
  };

  // const open = Boolean(anchorEl);
  // const id = open ? "user-popover" : undefined;

  return (
    <AppBar
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        backgroundColor: theme.palette.background.paper,
        backgroundImage: "none",
        color: theme.palette.text.primary,
        boxShadow:
          theme.palette.mode === "dark"
            ? "0 2px 10px rgba(0,0,0,0.7)"
            : "0 2px 10px rgba(0,0,0,0.1)",
        backdropFilter: "blur(5px)",
        WebkitBackdropFilter: "blur(5px)",
        zIndex: 1,
        width: "100%",
        transition: theme.transitions.create(
          ["left", "width", "background-color"],
          {
            duration: theme.transitions.duration.standard,
            easing: theme.transitions.easing.easeInOut,
          }
        ),
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between" }}>
        {/* LEFT SIDE */}
        <FlexBetween gap='2rem'>
          <Box
            className='header-logo'
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              fontWeight: "bold",
            }}
          >
            <DashboardIcon sx={{ width: 28, height: 28 }} color='info' />
            <Typography
              variant='body1'
              sx={{ color: theme.palette.text.primary }}
            >
              ERP System
            </Typography>
          </Box>
          <IconButton
            className='menu-button'
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <MdMenuOpen
              style={{
                transform: !isSidebarOpen ? "rotate(180deg)" : "rotate(0deg)",
                fontSize: theme.typography.pxToRem(25),
                transition: theme.transitions.create(["transform"], {
                  duration: theme.transitions.duration.standard,
                  easing: theme.transitions.easing.easeInOut,
                }),
              }}
            />
          </IconButton>
          {/* <FlexBetween
                // backgroundColor={theme.palette.background.alt}
                borderRadius="9px"
                gap="3rem"
                p="0.1rem 0.5rem"
                border='1px solid rgba(0,0,0,0.125)'
            >
                <InputBase placeholder='Search...' />
                <IconButton>
                    <Search />
                </IconButton>
            </FlexBetween> */}
        </FlexBetween>

        {/* RIGHT SIDE */}
        <FlexBetween gap={1}>
          {/* Language Selector */}
          <IconButton
            onClick={openLanguageMenu}
            sx={{
              color: theme.palette.text.secondary,
              "&:hover": {
                backgroundColor: theme.palette.action.hover,
                color: theme.palette.primary.main,
              },
            }}
          >
            <Language />
          </IconButton>

          <Menu
            anchorEl={languageMenuAnchor}
            open={Boolean(languageMenuAnchor)}
            onClose={() => setLanguageMenuAnchor(null)}
            PaperProps={{
              sx: {
                mt: 1,
                minWidth: 120,
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
                borderRadius: 2,
              },
            }}
          >
            <MenuItem
              onClick={() => changeLanguage("en")}
              selected={i18n.language === "en"}
              sx={{
                fontWeight: i18n.language === "en" ? 600 : 400,
              }}
            >
              English
            </MenuItem>
            <MenuItem
              onClick={() => changeLanguage("ar")}
              selected={i18n.language === "ar"}
              sx={{
                fontWeight: i18n.language === "ar" ? 600 : 400,
              }}
            >
              العربية
            </MenuItem>
          </Menu>

          {/* Theme Toggle */}
          <IconButton
            onClick={() => dispatch(setMode())}
            sx={{
              color: theme.palette.text.secondary,
              "&:hover": {
                backgroundColor: theme.palette.action.hover,
                color: theme.palette.primary.main,
              },
            }}
          >
            {theme.palette.mode === "dark" ? (
              <LightModeOutlined
                sx={{ fontSize: theme.typography.pxToRem(25) }}
              />
            ) : (
              <DarkModeOutlined
                sx={{ fontSize: theme.typography.pxToRem(25) }}
              />
            )}
          </IconButton>

          {/* Notifications */}
          <IconButton
            sx={{
              color: theme.palette.text.secondary,
              "&:hover": {
                backgroundColor: theme.palette.action.hover,
                color: theme.palette.primary.main,
              },
            }}
          >
            <NotificationsNone />
          </IconButton>

          {/* User Menu */}
          <IconButton
            onClick={openUserMenu}
            sx={{
              color: theme.palette.text.secondary,
              "&:hover": {
                backgroundColor: theme.palette.action.hover,
                color: theme.palette.primary.main,
              },
            }}
          >
            <AccountCircle />
          </IconButton>

          <Menu
            anchorEl={userMenuAnchor}
            open={Boolean(userMenuAnchor)}
            onClose={() => setUserMenuAnchor(null)}
            PaperProps={{
              sx: {
                mt: 1,
                minWidth: 180,
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
                borderRadius: 2,
              },
            }}
          >
            <MenuItem sx={{ py: 1.5 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Avatar
                  sx={{
                    width: 32,
                    height: 32,
                    bgcolor: theme.palette.primary.main,
                  }}
                >
                  <AccountCircle />
                </Avatar>
                <Box>
                  <Typography variant='body2' fontWeight={600}>
                    Admin User
                  </Typography>
                  <Typography variant='caption' color='text.secondary'>
                    admin@example.com
                  </Typography>
                </Box>
              </Box>
            </MenuItem>
            <Divider />
            <MenuItem onClick={() => setUserMenuAnchor(null)} sx={{ py: 1.5 }}>
              <SettingsOutlined sx={{ mr: 1, fontSize: 20 }} />
              {t("Settings")}
            </MenuItem>
            <Divider />
            <MenuItem
              onClick={handleLogout}
              sx={{
                py: 1.5,
                color: theme.palette.error.main,
                "&:hover": {
                  backgroundColor: theme.palette.error.light,
                  color: theme.palette.error.contrastText,
                },
              }}
            >
              <LogoutIcon sx={{ mr: 1, fontSize: 20 }} />
              {t("Logout")}
            </MenuItem>
          </Menu>
        </FlexBetween>
      </Toolbar>
    </AppBar>
  );
}

export default AppHeader;
