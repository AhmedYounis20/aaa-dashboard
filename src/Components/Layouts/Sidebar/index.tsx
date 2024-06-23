import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar'
import { Link } from 'react-router-dom'
import { ISidebarItem } from '../../../Utilities/routes';
import { useState } from 'react';
import FlexBetween from '../../FlexBetween';
import profileImg from '../../../assets/react.svg'
import { Avatar, Box, Typography } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import {useSelector} from 'react-redux';
import { RootState } from '../../../Storage/Redux/store';


interface ISidebarProps {
    items: ISidebarItem[];
    isSidebarOpen: boolean;
    setIsSidebarOpen: (open: boolean) => void;
    isMobile: boolean;
}

export default function AppSidebar({ items, isMobile, isSidebarOpen, setIsSidebarOpen }: ISidebarProps) {
    const userData = useSelector((state: RootState) => state.userAuthStore);


    // const [width, setWidth] = useState<number | undefined>();
    // const getSize = () => setWidth(window.innerWidth);

    // useEffect(() => {
    //     // window.addEventListener('resize', getSize);

    //     // if (isMobile) {
    //     //     setIsSidebarOpen(true)
    //     // } else {
    //     //     setIsSidebarOpen(false)
    //     // }

    //     return () => {
    //         // window.removeEventListener('resize', getSize)
    //         // setIsSidebarOpen(true)
    //     }
    // }, [isMobile])

    // useEffect(() => {
    //     console.log(isSidebarOpen)
    // })

    return (
        <Sidebar
            backgroundColor='#fff'
            collapsed={!isSidebarOpen}
            breakPoint={"lg"}
            toggled={isSidebarOpen ? true : false}
            style={{
                width: isSidebarOpen && isMobile ? '270px' : '80px',
            }}
        >
            <FlexBetween flexDirection={'column'} alignItems={'stretch'} height={"100%"} width={'100%'}>
                <Menu
                    menuItemStyles={{
                        button: {
                            ":hover": {
                                backgroundColor: '#c5e4ff',
                                transition: '0.2s ease-in-out',
                            },
                            color: '#0098e5'
                        },
                        label: {
                            color: '#29292981'
                        }
                    }}
                >
                    <Box
                        role='button'
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        display="flex"
                        alignItems="center"
                        justifyContent="flex-start"
                        gap={"16px"}
                        p={"16px"}
                        paddingLeft={'24px'}
                        marginBottom={'8px'}
                    >
                        <DashboardIcon color='info' sx={{
                            width: '32px',
                            height: '32px'
                        }}/>
                        {isSidebarOpen && 
                            <Typography variant='h6' textTransform={'uppercase'}>
                                erp system
                            </Typography>
                        }
                    </Box>
                    {items?.map((item, index) => (
                        item?.submenu ? (
                            <SubMenu
                                key={index}
                                label={item.title}
                                icon={item.icon && item.icon}
                            >
                                {item?.submenu.map((subItem, subIndex) => (
                                    <MenuItem
                                        key={subIndex}
                                        icon={subItem.icon && subItem?.icon}
                                        component={subItem?.path && <Link to={subItem?.path} />}
                                    >
                                        <Typography variant='body1'>
                                            {subItem?.title}
                                        </Typography>
                                    </MenuItem>
                                ))}
                            </SubMenu>
                        ) : (
                            <MenuItem
                                key={index}
                                icon={item.icon && item?.icon}
                                component={item?.path && <Link to={item?.path} />}
                            >
                                <Typography variant='body1'>
                                    {item?.title}
                                </Typography>
                            </MenuItem>
                        )
                    ))}
                </Menu>

                <Menu
                    menuItemStyles={{
                        button: {
                            ":hover": {
                                backgroundColor: 'transparent',
                            },
                            color: '#0098e5'
                        },
                        label: {
                            color: '#29292981'
                        }
                    }}
                >
                    <MenuItem >
                        <Box
                            display={'flex'}
                            gap={'10px'}
                            alignItems={"center"}
                            paddingLeft={"4px"}
                        >
                            <Avatar
                                src={profileImg}
                                alt='profileImg'
                                sx={{
                                    width: '24px',
                                    height: '24px',
                                }}
                            />
                            {isSidebarOpen && 
                            <Typography 
                                variant='h6'
                                textTransform={'capitalize'}
                                fontWeight={'bold'}
                            >
                                {userData?.fullName}
                            </Typography>}
                        </Box>
                    </MenuItem>
                </Menu>
            </FlexBetween>
        </Sidebar>
    )
}