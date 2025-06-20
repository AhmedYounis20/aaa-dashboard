import React, { useState, useContext, useEffect } from 'react';
import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar'
import { Link, useLocation } from 'react-router-dom'
import { ISidebarItem } from '../../../Utilities/routes';
import FlexBetween from '../../FlexBetween';
import { Typography, Box, useTheme, Avatar, IconButton, Divider, Popover, Button, styled } from '@mui/material';
import { appContext } from '../../../layout/DefaultLayout';
import { appProps } from '../../../interfaces/Components/appProps';
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { 
    initialuserState,
    setLoggedInUser,
} from "../../../Storage/Redux/userAuthSlice";
import { 
    AccountCircle,
    SettingsOutlined,
    Logout
} from '@mui/icons-material';
import './index.css';

interface ISidebarProps {
  items: ISidebarItem[];
  isSidebarOpen?: boolean;
  setIsSidebarOpen?: (open: boolean) => void;
  isMobile?: boolean;
}

const ThemedMenuItem = styled(MenuItem)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.primary,
  borderRadius: theme.spacing(1),
  transition: theme.transitions.create(["color", "background-color"], {
    duration: theme.transitions.duration.standard,
    easing: theme.transitions.easing.easeInOut,
  }),
  "&:hover": {
    borderRadius: theme.spacing(1),
    //backgroundColor: theme.palette.primary.light,
  },
}));

export default function AppSidebar({ items }: ISidebarProps) {
    const { isSidebarOpen, setIsSidebarOpen } = useContext<appProps>(appContext);
    // const [openMenu, setOpenMenu] = useState<string | null>(null);
    // const userData = useSelector((state: RootState) => state.userAuthStore);
    const theme = useTheme();
    const location = useLocation();
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [profileAnchor, setProfileAnchor] = useState<null | HTMLElement>(null);

  const isActivePath = (path: string | undefined) => {
    if (!path) return false;
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  // useEffect(() => {
  //   const activeMenu = items.find((item) =>
  //     item.submenu?.some((sub) => isActivePath(sub.path))
  //   );

  //   if (activeMenu) {
  //     setOpenMenu(activeMenu.title);
  //   }
  // }, [location.pathname, items]);

    const handleLogout = () => {
        localStorage.getItem("accessToken") && localStorage.removeItem("accessToken");
        dispatch(setLoggedInUser(initialuserState));
        navigate("/login");
        setProfileAnchor(null);
    };

    const handleProfileClick = (event: React.MouseEvent<HTMLElement>) => {
        setProfileAnchor(event.currentTarget);
    };

    return (
      <Sidebar
        backgroundColor={theme.palette.background.paper}
        collapsed={!isSidebarOpen}
        breakPoint={"lg"}
        toggled={isSidebarOpen ? true : false}
        transitionDuration={300}
        style={{
          width: isSidebarOpen ? "280px" : "80px",
          border: 0,
          borderRight: `1px solid ${theme.palette.divider}`,
          boxShadow: "4px 0 20px rgba(0, 0, 0, 0.1)",
          background: `linear-gradient(180deg, ${theme.palette.background.paper} 0%, ${theme.palette.grey[50]} 100%)`,
          transition:  "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
        onBackdropClick={() =>{
          if(setIsSidebarOpen) setIsSidebarOpen(!isSidebarOpen);
        }}
      >
        <FlexBetween
          flexDirection={"column"}
          alignItems={"stretch"}
          padding={"10px"}
          sx={{
            backgroundColor: theme.palette.background.paper,
            overflow: "auto",
            height: "100%",
          }}
        >
          
          {/* Menu Items */}
          <Menu
            key={isSidebarOpen ? 'open' : 'closed'}
            style={{ flex: 1 }}
            closeOnClick={!isSidebarOpen}
            menuItemStyles={{
              button: {
                margin: "4px 8px",
                borderRadius: "8px",
                padding: "5px 10px 5px 5px",
                borderBottom: `1px solid ${theme.palette.divider}`,
                ":hover": {
                  backgroundColor: "transparent",
                  color: theme.palette.primary.contrastText,
                  transition: "all 0.2s ease-in-out",
                  transform: "translateX(4px)",
                },
                color: theme.palette.text.primary,
                fontWeight: 500,
                fontSize: "0.875rem",
                position: "relative",
                overflow: "hidden",
                transition: "all 0.2s ease-in-out",
                "&::before": {
                  content: '""',
                  position: "absolute",
                  top: 0,
                  left: "-100%",
                  width: "100%",
                  height: "100%",
                  background: theme.palette.mode === 'dark' 
                    ? "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)"
                    : "linear-gradient(90deg, transparent, rgba(0,0,0,0.1), transparent)",
                  transition: "left 0.5s",
                },
                "&:hover::before": {
                  left: "100%",
                },
              },
              label: {
                color: theme.palette.text.primary,
                fontWeight: 500,
                fontSize: "0.875rem",
              },
              subMenuContent: {
                backgroundColor: theme.palette.background.default,
                borderRadius: "8px",
                margin: "4px",
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
                transition: "all 0.15s ease-out",
              },
            }}
          >
            {items?.map((item, index) =>
              item?.submenu ? (
                <SubMenu
                  key={index}
                  label={t(item.title)}
                  icon={item.icon && React.cloneElement(item.icon, {
                    sx: {
                      width: "20px",
                      height: "20px",
                      color: theme.palette.primary.main,
                      transition: "all 0.3s ease",
                    }
                  })}
                  style={{
                    // backgroundColor: 'transparent',
                    // color: theme.palette.text.primary,
                    // borderRadius: "12px",
                    // margin: "4px 8px",
                    // transition: "all 0.15s ease-out",
                    // borderBottom: `2px solid ${theme.palette.primary.light}`,
                    //backgroundColor:
                    // openMenu === item.title
                    //  ? theme.palette.primary.light
                    //  : theme.palette.background.paper,
                    borderRadius: theme.spacing(1),
                    marginBlock: theme.spacing(0.625),
                  }}
                >
                  {item?.submenu.map((subItem, subIndex) => (
                    <ThemedMenuItem
                      key={subIndex}
                      icon={subItem.icon && React.cloneElement(subItem.icon, {
                        sx: {
                          width: "18px",
                          height: "18px",
                          color: isActivePath(subItem?.path) 
                            ? theme.palette.primary.contrastText 
                            : theme.palette.text.secondary,
                          transition: isSidebarOpen ? "all 0.3s ease" :"none",
                        }
                      })}
                      component={subItem?.path && <Link to={subItem?.path} />}
                      style={{
                        backgroundColor: isActivePath(subItem?.path)
                          ? theme.palette.primary.main
                          : "transparent",
                        color: isActivePath(subItem?.path) 
                          ? theme.palette.primary.contrastText 
                          : theme.palette.text.primary,
                        margin: "2px 12px",
                        borderRadius: "10px",
                        fontWeight: isActivePath(subItem?.path) ? 600 : 500,
                        transition: isSidebarOpen ? "all 0.15s ease-out" :"none",
                        position: "relative",
                        overflow: "hidden",
                        paddingLeft: theme.spacing(1.25),
                      }}
                    >
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          fontWeight: isActivePath(subItem?.path) ? 700 : 500,
                          fontSize: "0.8rem",
                          textShadow: isActivePath(subItem?.path) ? "0 1px 2px rgba(0,0,0,0.3)" : "none",
                          transition: isSidebarOpen ? "all 0.3s ease" :"none",
                        }}
                      >
                        {t(subItem?.title)}
                      </Typography>
                    </ThemedMenuItem>
                  ))}
                </SubMenu>
            ) : (
                <ThemedMenuItem
                  key={index}
                  icon={item.icon && React.cloneElement(item.icon, {
                    sx: {
                      width: "20px",
                      height: "20px",
                      color: theme.palette.primary.main,
                      transition: "all 0.3s ease",
                    }
                  })}
                  component={item?.path && <Link to={item?.path} />}
                  style={{
                    borderRadius: theme.spacing(1),
                    backgroundColor: isActivePath(item.path)
                      ? theme.palette.primary.main
                      : "transparent",
                    color: isActivePath(item?.path) 
                      ? theme.palette.primary.contrastText 
                      : theme.palette.text.primary,
                    margin: "4px 8px",
                    fontWeight: isActivePath(item?.path) ? 600 : 500,
                  }}
                >
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      fontWeight: isActivePath(item?.path) ? 700 : 500,
                      fontSize: "0.875rem",
                      textShadow: isActivePath(item?.path) ? "0 1px 2px rgba(0,0,0,0.3)" : "none",
                      transition: "all 0.3s ease",
                    }}
                  >
                    {t(item?.title)}
                  </Typography>
                </ThemedMenuItem>
              )
            )}
          </Menu>

          {/* Profile Section */}
          <Box
            sx={{
              p: 2,
              borderTop: `1px solid ${theme.palette.divider}`,
              backgroundColor: theme.palette.mode === 'dark' 
                ? theme.palette.grey[900] 
                : theme.palette.grey[50],
              minHeight: isSidebarOpen ? 'auto' : '80px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <IconButton
                onClick={handleProfileClick}
                sx={{
                  p: 0,
                  '&:hover': {
                    transform: 'scale(1.1)',
                    transition: 'none',
                  },
                }}
              >
                <Avatar sx={{ width: 40, height: 40, bgcolor: theme.palette.primary.main }}>
                  <AccountCircle />
                </Avatar>
              </IconButton>
            </Box>
          </Box>

          {/* Profile Popup */}
          <Popover
            open={Boolean(profileAnchor)}
            anchorEl={profileAnchor}
            onClose={() => setProfileAnchor(null)}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            PaperProps={{
              sx: {
                mt: 1,
                minWidth: 200,
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.15)",
                borderRadius: 2,
                border: `1px solid ${theme.palette.divider}`,
              }
            }}
          >
            <Box sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <Avatar sx={{ width: 48, height: 48, bgcolor: theme.palette.primary.main }}>
                  <AccountCircle />
                </Avatar>
                <Box>
                  <Typography variant="body1" fontWeight={600} color="text.primary">
                    Admin User
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    admin@example.com
                  </Typography>
                </Box>
              </Box>
              <Divider sx={{ my: 1 }} />
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Button
                  fullWidth
                  startIcon={<SettingsOutlined />}
                  sx={{
                    justifyContent: 'flex-start',
                    color: theme.palette.text.secondary,
                    textTransform: 'none',
                    '&:hover': {
                      backgroundColor: theme.palette.action.hover,
                      color: theme.palette.primary.main,
                    },
                  }}
                >
                  Settings
                </Button>
                <Button
                  fullWidth
                  startIcon={<Logout />}
                  onClick={handleLogout}
                  sx={{
                    justifyContent: 'flex-start',
                    color: theme.palette.error.main,
                    textTransform: 'none',
                    '&:hover': {
                      backgroundColor: theme.palette.error.light,
                      color: theme.palette.error.contrastText,
                    },
                  }}
                >
                  Logout
                </Button>
              </Box>
            </Box>
          </Popover>
        </FlexBetween>
      </Sidebar>
    );
}
