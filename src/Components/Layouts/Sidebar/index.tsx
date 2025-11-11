import React, { useState, useContext, useEffect } from "react";
import { Sidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import { Link, useLocation } from "react-router-dom";
import { ISidebarItem } from "../../../Utilities/routes";
import ThemedTooltip from "../../UI/ThemedTooltip";
import {
  Typography,
  Box,
  useTheme,
  Avatar,
  IconButton,
  Divider,
  styled,
  Menu as MuiMenu,
  MenuItem as MuiMenuItem,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import { appContext } from "../../../layout/DefaultLayout";
import { appProps } from "../../../interfaces/Components/appProps";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  initialuserState,
  setLoggedInUser,
} from "../../../Storage/Redux/userAuthSlice";
import { AccountCircle, SettingsOutlined, MoreVert } from "@mui/icons-material";
import "./index.css";

interface ISidebarProps {
  items: ISidebarItem[];
  isSidebarOpen?: boolean;
  setIsSidebarOpen?: (open: boolean) => void;
  isMobile?: boolean;
}

const ThemedMenuItem = styled(MenuItem)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.primary,
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
      rtl={theme.direction === "rtl" ? true : false}
      backgroundColor={theme.palette.background.paper}
      collapsed={!isSidebarOpen}
      breakPoint={"lg"}
      toggled={isSidebarOpen ? true : false}
      transitionDuration={300}
      style={{
        border: 0,
        position: "fixed",
        top: 0,
        height: "calc(100% - 64px)",
        width: isSidebarOpen ? "230px" : "80px",
        minWidth: isSidebarOpen ? "230px" : "80px",
        marginTop: "55px",
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
          SubMenuExpandIcon: {
            "& span": {
              borderRightWidth:
                theme.direction === "rtl" ? "0 !important" : "auto",
              borderBottomWidth:
                theme.direction === "rtl" ? "0 !important" : "auto",

              borderLeftWidth:
                theme.direction === "rtl" ? "1px !important" : "auto",
              borderTopWidth:
                theme.direction === "rtl" ? "1px !important" : "auto",
            },
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
                    fontSize: "1.18rem",
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
                fontSize: "13px",
                height: "45px",
                paddingBlock: 0,
              }}
              open={openMenu === item.title}
              onOpenChange={(isOpen: boolean) =>
                setOpenMenu(isOpen ? item.title : null)
              }
            >
              {item?.submenu.map((subItem, subIndex) => (
                <ThemedTooltip
                  title={subItem.title}
                  key={subIndex}
                  placement={`${theme.direction === "rtl" ? "left" : "right"}`}
                >
                  <div>
                    <ThemedMenuItem
                      icon={
                        subItem.icon &&
                        React.cloneElement(subItem.icon, {
                          sx: {
                            fontSize: "1.18rem",
                            transition: isSidebarOpen
                              ? "all 0.3s ease"
                              : "none",
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
                        transition: isSidebarOpen
                          ? "all 0.15s ease-out"
                          : "none",
                        position: "relative",
                        overflow: "hidden",
                        height: "45px",
                        paddingBlock: 0,
                        paddingLeft:
                          theme.direction === "rtl"
                            ? "auto"
                            : theme.spacing(2.25),
                        paddingRight:
                          theme.direction === "rtl"
                            ? theme.spacing(2.25)
                            : "auto",
                        pointerEvents: isActivePath(subItem?.path)
                          ? "none"
                          : "auto",
                      }}
                    >
                      <Typography
                        variant='body2'
                        sx={{
                          textShadow: isActivePath(subItem?.path)
                            ? "0 1px 2px rgba(0,0,0,0.3)"
                            : "none",
                          transition: isSidebarOpen ? "all 0.1s ease" : "none",
                        }}
                      >
                        {t(subItem?.title)}
                      </Typography>
                    </ThemedMenuItem>
                  </div>
                </ThemedTooltip>
              ))}
            </SubMenu>
          ) : (
            <ThemedTooltip
              title={t(item?.title)}
              key={index}
              placement={`${theme.direction === "rtl" ? "left" : "right"}`}
            >
              <div>
                <ThemedMenuItem
                  icon={
                    item.icon &&
                    React.cloneElement(item.icon, {
                      sx: {
                        fontSize: "1.18rem",
                        transition: "all 0.3s ease",
                      },
                    })
                  }
                  component={item?.path && <Link to={item?.path} />}
                  style={{
                    height: "45px",
                    paddingBlock: 0,
                    borderRadius: theme.spacing(1),
                    backgroundColor: isActivePath(item.path)
                      ? theme.palette.primary.main
                      : "transparent",
                    color: isActivePath(item?.path)
                      ? theme.palette.primary.contrastText
                      : theme.palette.text.primary,
                    pointerEvents: isActivePath(item?.path) ? "none" : "auto",
                  }}
                  onClick={() => setOpenMenu(null)}
                >
                  <Typography
                    variant='body2'
                    sx={{
                      transition: "all 0.3s ease",
                    }}
                  >
                    {t(item?.title)}
                  </Typography>
                </ThemedMenuItem>
              </div>
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
          width: isSidebarOpen ? "230px" : "80px",
          borderTop: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: isSidebarOpen ? "space-between" : "center",
            gap: 1,
          }}
        >
          <Avatar
            onClick={handleProfileClick}
            sx={{
              width: 35,
              height: 35,
              bgcolor: theme.palette.primary.main,
              cursor: "pointer",
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
                onClick={handleProfileClick}
              >
                <MoreVert sx={{ color: theme.palette.text.secondary }} />
              </IconButton>
            </>
          )}
        </Box>
      </Box>

      {/* Profile Popup */}
      <MuiMenu
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        anchorEl={profileAnchor}
        open={Boolean(profileAnchor)}
        onClose={() => setProfileAnchor(null)}
        PaperProps={{
          sx: {
            mt: 1,
            minWidth: 180,
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
            borderRadius: 2,
          },
        }}
        MenuListProps={{
          sx: {
            padding: 0,
          },
        }}
      >
        <MuiMenuItem sx={{ py: 1.5 }}>
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
        </MuiMenuItem>
        <Divider />
        <MuiMenuItem sx={{ py: 1.5 }}>
          <SettingsOutlined sx={{ mr: 1, fontSize: 20 }} />
          {t("Settings")}
        </MuiMenuItem>
        <Divider />
        <MuiMenuItem
          onClick={handleLogout}
          sx={{
            py: 1.5,
            color: theme.palette.error.main,
            "&:hover": {
              backgroundColor: "#ffcece",
            },
          }}
        >
          <LogoutIcon sx={{ mr: 1, fontSize: 20 }} />
          {t("Logout")}
        </MuiMenuItem>
      </MuiMenu>
    </Sidebar>
  );
}
