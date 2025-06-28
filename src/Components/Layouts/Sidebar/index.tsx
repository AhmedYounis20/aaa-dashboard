import "./index.css";
import { Sidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import { Link, useLocation } from "react-router-dom";
import { ISidebarItem } from "../../../Utilities/routes";
import FlexBetween from "../../FlexBetween";
import { styled, Typography, useTheme } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { appContext } from "../../../layout/DefaultLayout";
import { appProps } from "../../../interfaces/Components/appProps";
import { useTranslation } from "react-i18next";
import ThemedTooltip from "../../UI/ThemedTooltip";
import i18n from "../../../Utilities/localization";

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
    backgroundColor: theme.palette.primary.light,
  },
}));

export default function AppSidebar({ items }: ISidebarProps) {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const { isSidebarOpen, setIsSidebarOpen } = useContext<appProps>(appContext);
  // const userData = useSelector((state: RootState) => state.userAuthStore);
  const theme = useTheme();
  const location = useLocation();
  const { t } = useTranslation();

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

  // const [width, setWidth] = useState<number | undefined>();
  // const getSize = () => setWidth(window.innerWidth);

  // useEffect(() => {
  //     window.addEventListener('resize', getSize);

  //     if (isMobile) {
  //         setIsSidebarOpen(false)
  //     } else {
  //         setIsSidebarOpen(true)
  //     }

  //     return () => {
  //         window.removeEventListener('resize', getSize)
  //     }
  // }, [isMobile])

  return (
    <Sidebar
      rtl={i18n.language === "ar"}
      key={i18n.language}
      backgroundColor='#fff'
      collapsed={!isSidebarOpen}
      breakPoint={"lg"}
      toggled={isSidebarOpen ? true : false}
      style={{
        border: 0,
      }}
      onBackdropClick={() => {
        if (setIsSidebarOpen) setIsSidebarOpen(!isSidebarOpen);
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
        <Menu
          menuItemStyles={{
            button: {
              padding: "5px 10px 5px 5px",
            },
            label: {
              color: theme.palette.text.primary,
            },
          }}
        >
          {items?.map((item, index) =>
            item?.submenu ? (
              <SubMenu
                key={index}
                label={t(item.title)}
                icon={item.icon && item.icon}
                open={openMenu === item.title}
                onOpenChange={(isOpen: boolean) =>
                  setOpenMenu(isOpen ? item.title : null)
                }
                style={{
                  backgroundColor:
                    openMenu === item.title
                      ? theme.palette.primary.light
                      : theme.palette.background.paper,
                  borderRadius: theme.spacing(1),
                  marginBlock: theme.spacing(0.625),
                }}
              >
                {item?.submenu.map((subItem, subIndex) => (
                  <ThemedTooltip key={subIndex} titleKey={subItem?.title}>
                    <ThemedMenuItem
                      icon={subItem.icon && subItem?.icon}
                      component={subItem?.path && <Link to={subItem?.path} />}
                      style={{
                        borderRadius: theme.spacing(1),
                        backgroundColor: isActivePath(subItem?.path)
                          ? theme.palette.primary.main
                          : "transparent",
                        color: isActivePath(subItem?.path) ? "#fff" : "",
                        paddingLeft: theme.spacing(1.25),
                      }}
                    >
                      <Typography
                        variant='body1'
                        style={{
                          color: isActivePath(subItem?.path) ? "#fff" : "",
                        }}
                      >
                        {t(subItem?.title)}
                      </Typography>
                    </ThemedMenuItem>
                  </ThemedTooltip>
                ))}
              </SubMenu>
            ) : (
              <ThemedTooltip key={index} titleKey={item?.title}>
                <ThemedMenuItem
                  icon={item.icon && item?.icon}
                  component={item?.path && <Link to={item?.path} />}
                  style={{
                    borderRadius: theme.spacing(1),
                    backgroundColor: isActivePath(item.path)
                      ? theme.palette.primary.main
                      : theme.palette.background.paper,
                    color: isActivePath(item?.path) ? "#fff" : "",
                  }}
                  onClick={() => setOpenMenu(null)}
                >
                  <Typography
                    variant='body1'
                    style={{
                      color: isActivePath(item?.path) ? "#fff" : "",
                    }}
                  >
                    {t(item?.title)}
                  </Typography>
                </ThemedMenuItem>
              </ThemedTooltip>
            )
          )}
        </Menu>
        {/*
          <Menu
            menuItemStyles={{
              button: {
                ":hover": {
                  backgroundColor: "transparent",
                },
                color: "#0098e5",
              },
              label: {
                color: "#29292981",
              },
            }}
          >
             <MenuItem>
              <Box
                display={"flex"}
                gap={"10px"}
                alignItems={"center"}
                paddingLeft={"4px"}
              >
                <Avatar
                  src={profileImg}
                  alt="profileImg"
                  sx={{
                    width: "24px",
                    height: "24px",
                  }}
                />
                {isSidebarOpen && (
                  <Typography
                    variant="h6"
                    textTransform={"capitalize"}
                    fontWeight={"bold"}
                  >
                    {userData?.fullName}
                  </Typography>
                )}
              </Box>
            </MenuItem> 
          </Menu>*/}
      </FlexBetween>
    </Sidebar>
  );
}
