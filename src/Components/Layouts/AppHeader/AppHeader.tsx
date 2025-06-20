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
  Box,
  Button,
  IconButton,
  Toolbar,
  Popover,
  Typography,
  useTheme,
} from "@mui/material";
import FlexBetween from "../../FlexBetween";
import { MdMenuOpen } from "react-icons/md";
import { DarkModeOutlined, LightModeOutlined } from "@mui/icons-material";
import NotificationsActiveOutlinedIcon from "@mui/icons-material/NotificationsActiveOutlined";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
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
  const { i18n } = useTranslation();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const changeLanguage = (lng: "en" | "ar") => {
    i18n.changeLanguage(lng);
    document.documentElement.dir = lng === "ar" ? "rtl" : "ltr";
  };
  const handleLogout = () => {
    localStorage.getItem("accessToken") &&
      localStorage.removeItem("accessToken");
    dispatch(setLoggedInUser(initialuserState));
    navigate("/login");
  };

  const open = Boolean(anchorEl);
  const id = open ? "user-popover" : undefined;

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
        <FlexBetween gap='2rem'>
          <IconButton
            onClick={() => changeLanguage(i18n.language == "ar" ? "en" : "ar")}
          >
            {i18n.language == "ar" ? "ar" : "en"}
          </IconButton>
          <IconButton onClick={() => dispatch(setMode())}>
            {theme.palette.mode === "dark" ? (
              <DarkModeOutlined
                sx={{ fontSize: theme.typography.pxToRem(25) }}
              />
            ) : (
              <LightModeOutlined
                sx={{ fontSize: theme.typography.pxToRem(25) }}
              />
            )}
          </IconButton>
          <IconButton>
            <NotificationsActiveOutlinedIcon
              sx={{ fontSize: theme.typography.pxToRem(25) }}
            />
          </IconButton>
          <IconButton
            className='user-icon'
            aria-describedby={id}
            onClick={handleClick}
            color='inherit'
            size='large'
          >
            <PersonOutlineIcon />
          </IconButton>
          <Popover
            id={id}
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            sx={{
              "& .MuiPopover-paper": {
                borderRadius: theme.spacing(1),
                backgroundColor: theme.palette.background.paper,
                boxShadow: `0 2px 10px ${
                  theme.palette.mode === "dark"
                    ? "rgba(0,0,0,0.7)"
                    : "rgba(0,0,0,0.1)"
                }`,
                overflow: "unset",
                top: "60px !important",
                "&::before": {
                  content: '""',
                  position: "absolute",
                  top: 0,
                  right: 14,
                  width: 0,
                  height: 0,
                  borderLeft: "8px solid transparent",
                  borderRight: "8px solid transparent",
                  borderBottom: `8px solid ${theme.palette.background.paper}`,
                  transform: "translateY(-100%)",
                  zIndex: 0,
                },
              },
            }}
          >
            <Typography
              variant='subtitle1'
              fontWeight='bold'
              sx={{
                padding: theme.spacing(1.25, 1.5),
                borderBottom: `1px solid ${theme.palette.divider}`,
                color: theme.palette.text.primary,
              }}
            >
              Admin
            </Typography>
            <Box
              sx={{
                padding: theme.spacing(1.25, 0.625),
                minWidth: 180,
                display: "flex",
                flexDirection: "column",
                gap: 2,
              }}
            >
              <Button
                sx={{
                  textAlign: "start",
                  display: "block",
                  borderRadius: theme.spacing(1),
                }}
              >
                My Profile
              </Button>
              <Button
                className='logout'
                sx={{
                  color: theme.palette.error.main,
                  textAlign: "start",
                  borderRadius: theme.spacing(1),
                  ":hover": {
                    backgroundColor: "rgba(255,0,0,0.1)",
                  },
                }}
                startIcon={<LogoutIcon />}
                onClick={handleLogout}
              >
                Logout
              </Button>
            </Box>
          </Popover>
        </FlexBetween>
      </Toolbar>
    </AppBar>
  );
}

export default AppHeader;
