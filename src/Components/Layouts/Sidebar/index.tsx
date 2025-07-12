import React, { useState, useContext, useEffect } from "react";
import { Sidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import { Link, useLocation } from "react-router-dom";
import { ISidebarItem } from "../../../Utilities/routes";
import FlexBetween from "../../FlexBetween";
import {
  Typography,
  Box,
  useTheme,
  Avatar,
  IconButton,
  Divider,
  Popover,
  Button,
  styled,
} from "@mui/material";
import { appContext } from "../../../layout/DefaultLayout";
import { appProps } from "../../../interfaces/Components/appProps";
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
  Logout,
  MoreVert,
} from "@mui/icons-material";
import "./index.css";
import ThemedTooltip from "../../ui/ThemedTooltip";

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
  },
}));

export default function AppSidebar({ items }: ISidebarProps) {
  const { isSidebarOpen, setIsSidebarOpen } = useContext<appProps>(appContext);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
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

  useEffect(() => {
    const activeMenu = items.find((item) =>
      item.submenu?.some((sub) => isActivePath(sub.path))
    );

    if (activeMenu) {
      setOpenMenu(activeMenu.title);
    }
  }, [location.pathname, items]);

  const handleLogout = () => {
    localStorage.getItem("accessToken") &&
      localStorage.removeItem("accessToken");
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
        border: 0,
        position: "fixed",
        top: 0,
        left: 0,
        height: "calc(100% - 64px)",
        width: isSidebarOpen ? "250px" : "80px",
        marginTop: "64px",
        zIndex: 1000,
      }}
      onBackdropClick={() => {
        if (setIsSidebarOpen) setIsSidebarOpen(!isSidebarOpen);
      }}
    >
      {/* Menu Items */}
      <Menu
        key={isSidebarOpen ? "open" : "closed"}
        style={{ flex: 1, padding: "10px", marginBottom: "70px" }}
        closeOnClick={!isSidebarOpen}
        menuItemStyles={{
          button: {
            borderRadius: "8px",
            padding: "5px 10px 5px 5px",
            //borderBottom: `1px solid ${theme.palette.divider}`,
            ":hover": {
              backgroundColor: "transparent",
              transition: "all 0.2s ease-in-out",
              transform: "translateX(4px)",
            },
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
              background:
                theme.palette.mode === "dark"
                  ? "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)"
                  : "linear-gradient(90deg, transparent, rgba(0,0,0,0.1), transparent)",
              transition: "left 0.5s",
            },
            "&:hover::before": {
              left: "100%",
            },
          },
          subMenuContent: {
            borderRadius: "8px",
            transition: "all 0.15s ease-out",
          },
        }}
      >
        {items?.map((item, index) =>
          item?.submenu ? (
            <SubMenu
              key={index}
              label={t(item.title)}
              icon={
                item.icon &&
                React.cloneElement(item.icon, {
                  sx: {
                    fontSize: "1.28rem",
                    transition: "all 0.3s ease",
                  },
                })
              }
              style={{
                // backgroundColor:
                //   openMenu === item.title
                //     ? theme.palette.primary.light
                //     : theme.palette.background.paper,
                borderRadius: theme.spacing(1),
                marginBlock: theme.spacing(0.625),
              }}
              open={openMenu === item.title}
              onOpenChange={(isOpen: boolean) =>
                setOpenMenu(isOpen ? item.title : null)
              }
            >
              {item?.submenu.map((subItem, subIndex) => (
                <ThemedTooltip title={subItem.title} key={subIndex}>
                  <ThemedMenuItem
                    icon={
                      subItem.icon &&
                      React.cloneElement(subItem.icon, {
                        sx: {
                          fontSize: "1.28rem",
                          color: isActivePath(subItem?.path)
                            ? theme.palette.primary.contrastText
                            : theme.palette.text.secondary,
                          transition: isSidebarOpen ? "all 0.3s ease" : "none",
                        },
                      })
                    }
                    component={subItem?.path && <Link to={subItem?.path} />}
                    style={{
                      backgroundColor: isActivePath(subItem?.path)
                        ? theme.palette.primary.main
                        : "transparent",
                      color: isActivePath(subItem?.path)
                        ? theme.palette.primary.contrastText
                        : theme.palette.text.primary,
                      borderRadius: "10px",
                      transition: isSidebarOpen ? "all 0.15s ease-out" : "none",
                      position: "relative",
                      overflow: "hidden",
                      paddingLeft: theme.spacing(1.25),
                    }}
                  >
                    <Typography
                      variant='body1'
                      sx={{
                        textShadow: isActivePath(subItem?.path)
                          ? "0 1px 2px rgba(0,0,0,0.3)"
                          : "none",
                        transition: isSidebarOpen ? "all 0.3s ease" : "none",
                      }}
                    >
                      {t(subItem?.title)}
                    </Typography>
                  </ThemedMenuItem>
                </ThemedTooltip>
              ))}
            </SubMenu>
          ) : (
            <ThemedTooltip title={t(item?.title)} key={index}>
              <ThemedMenuItem
                icon={
                  item.icon &&
                  React.cloneElement(item.icon, {
                    sx: {
                      fontSize: "1.28rem",
                      transition: "all 0.3s ease",
                    },
                  })
                }
                component={item?.path && <Link to={item?.path} />}
                style={{
                  borderRadius: theme.spacing(1),
                  backgroundColor: isActivePath(item.path)
                    ? theme.palette.primary.main
                    : "transparent",
                  color: isActivePath(item?.path)
                    ? theme.palette.primary.contrastText
                    : theme.palette.text.primary,
                }}
                onClick={() => setOpenMenu(null)}
              >
                <Typography
                  variant='body1'
                  sx={{
                    transition: "all 0.3s ease",
                  }}
                >
                  {t(item?.title)}
                </Typography>
              </ThemedMenuItem>
            </ThemedTooltip>
          )
        )}
      </Menu>
      {/* Profile Section */}
      <Box
        sx={{
          p: 2,
          backgroundColor:
            theme.palette.mode === "dark"
              ? theme.palette.grey[900]
              : theme.palette.grey[50],
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          position: "fixed",
          bottom: 0,
          left: 0,
          width: isSidebarOpen ? "250px" : "80px",
          borderTop: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: isSidebarOpen ? "space-between" : "center",
            gap: 1,
            cursor: "pointer",
          }}
          onClick={handleProfileClick}
        >
          <Avatar
            sx={{
              width: 35,
              height: 35,
              bgcolor: theme.palette.primary.main,
            }}
          >
            <AccountCircle sx={{ fontSize: 25 }} />
          </Avatar>
          {isSidebarOpen && (
            <>
              <Box>
                <Typography
                  variant='body1'
                  fontWeight={600}
                  color='text.primary'
                >
                  Admin User
                </Typography>
                <Typography variant='body2' color='text.secondary'>
                  admin@example.com
                </Typography>
              </Box>
              <IconButton
                sx={{
                  p: 0,
                }}
              >
                <MoreVert sx={{ color: theme.palette.text.secondary }} />
              </IconButton>
            </>
          )}
        </Box>
        {/* <Box sx={{ display: "flex", justifyContent: "center" }}>
          <IconButton
            onClick={handleProfileClick}
            sx={{
              p: 0,
              "&:hover": {
                transform: "scale(1.1)",
                transition: "none",
              },
            }}
          >
            <Avatar
              sx={{
                width: 40,
                height: 40,
                bgcolor: theme.palette.primary.main,
              }}
            >
              <AccountCircle />
            </Avatar>
          </IconButton>
          <Box>
            <Typography variant='body2' color='text.secondary'>
              Admin User
            </Typography>
            <Typography variant='body2' color='text.secondary'> 
              Super Admin
            </Typography>
          </Box>
        </Box>   */}
      </Box>

      {/* Profile Popup */}
      <Popover
        open={Boolean(profileAnchor)}
        anchorEl={profileAnchor}
        onClose={() => setProfileAnchor(null)}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        PaperProps={{
          sx: {
            mt: 1,
            minWidth: 200,
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.15)",
            borderRadius: 2,
            border: `1px solid ${theme.palette.divider}`,
          },
        }}
      >
        <Box sx={{ p: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
            <Avatar
              sx={{
                width: 48,
                height: 48,
                bgcolor: theme.palette.primary.main,
              }}
            >
              <AccountCircle />
            </Avatar>
            <Box>
              <Typography variant='body1' fontWeight={600} color='text.primary'>
                Admin User
              </Typography>
              <Typography variant='body2' color='text.secondary'>
                admin@example.com
              </Typography>
            </Box>
          </Box>
          <Divider sx={{ my: 1 }} />
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <Button
              fullWidth
              startIcon={<SettingsOutlined />}
              sx={{
                justifyContent: "flex-start",
                color: theme.palette.text.secondary,
                textTransform: "none",
                "&:hover": {
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
                justifyContent: "flex-start",
                color: theme.palette.error.main,
                textTransform: "none",
                "&:hover": {
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
    </Sidebar>
  );
}
