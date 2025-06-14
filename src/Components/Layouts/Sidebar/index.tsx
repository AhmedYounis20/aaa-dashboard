import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar'
import { Link, useLocation } from 'react-router-dom'
import { ISidebarItem } from '../../../Utilities/routes';
import FlexBetween from '../../FlexBetween';
import { Typography } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import { useContext } from 'react';
import { appContext } from '../../../layout/DefaultLayout';
import { appProps } from '../../../interfaces/Components/appProps';
import { useTranslation } from "react-i18next";


interface ISidebarProps {
    items: ISidebarItem[];
    isSidebarOpen?: boolean;
    setIsSidebarOpen?: (open: boolean) => void;
    isMobile?: boolean;
}

export default function AppSidebar({ items }: ISidebarProps) {
    const { isMobile, isSidebarOpen, setIsSidebarOpen } = useContext<appProps>(appContext);
    // const userData = useSelector((state: RootState) => state.userAuthStore);
    const location = useLocation();
    const { t } = useTranslation();

    const isActivePath = (path: string | undefined) => {
        if (path != undefined) {
            return location.pathname.includes(path);
        }
    }

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
        backgroundColor="#fff"
        collapsed={!isSidebarOpen}
        breakPoint={"xxl"}
        toggled={isSidebarOpen ? true : false}
        style={{
          width: isSidebarOpen && isMobile ? "270px" : "80px",
        }}
        onBackdropClick={() =>{
          console.log("pressed");
          if(setIsSidebarOpen)  setIsSidebarOpen(!isSidebarOpen);
        }
        }
      >
        <FlexBetween
          flexDirection={"column"}
          alignItems={"stretch"}
          height={"100%"}
          width={"100%"}
        >
          <Menu
            menuItemStyles={{
              button: {
                ":hover": {
                  backgroundColor: "#c5e4ff",
                  transition: "0.2s ease-in-out",
                },
                color: "#0098e5",
              },
              label: {
                color: "#29292981",
              },
            }}
          >
            <MenuItem
              icon={
                <DashboardIcon
                  color="info"
                  sx={{
                    width: "32px",
                    height: "32px",
                  }}
                />
              }
              component={<Link to="/" />}
              style={{
                color: "#fff",
              }}
            >
              <Typography variant="body1">erp system</Typography>
            </MenuItem>

        
            {items?.map((item, index) =>
              item?.submenu ? (
                <SubMenu
                  key={index}
                  label={t(item.title)}
                  icon={item.icon && item.icon}
                >
                  {item?.submenu.map((subItem, subIndex) => (
                    <MenuItem
                      key={subIndex}
                      icon={subItem.icon && subItem?.icon}
                      component={subItem?.path && <Link to={subItem?.path} />}
                      style={{
                        backgroundColor: isActivePath(subItem?.path)
                          ? "#00a8ff"
                          : "transparent",
                        color: isActivePath(subItem?.path) ? "#fff" : "",
                      }}
                    >
                      <Typography variant="body1">{t(subItem?.title)}</Typography>
                    </MenuItem>
                  ))}
                </SubMenu>
              ) : (
                <MenuItem
                  key={index}
                  icon={item.icon && item?.icon}
                  component={item?.path && <Link to={item?.path} />}
                  style={{
                    backgroundColor: isActivePath(item.path)
                      ? "#00a8ff"
                      : "transparent",
                    color: isActivePath(item?.path) ? "#fff" : "",
                  }}
                >
                  <Typography variant="body1">{item?.title}</Typography>
                </MenuItem>
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