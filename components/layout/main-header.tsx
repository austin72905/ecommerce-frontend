import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';

import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';


import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Avatar, Badge, Collapse, Menu, MenuItem } from '@mui/material';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import SideNavBar, { useOpenState } from './sidebar';
import { useCartStore, userUserInfoStore } from '@/store/store';
import UserMenu from './user-menu';
import Image from 'next/image';



export default function MainHeader() {

    const [isLogin, setIsLogin] = useState<boolean>(false)
    //const isLogin = false;
    const [open, setOpen] = useOpenState(false)

    const router = useRouter();

    const backToHomePage = () => {
        router.push("/")
    }

    const goToLogin = () => {
        router.push("/login")
    }

    const goToCart = () => {
        router.push("/cart")
    }

    const [anchorElement, setAnchorElement] = useState<null | HTMLElement>(null)

    const handleSetAnchor = (e: React.MouseEvent<HTMLElement>) => {
        setAnchorElement(e.currentTarget)
    }

    const handleCancelAnchor = () => {
        setAnchorElement(null)
    }

    const cartContent = useCartStore(state => state.cartContent)


    const setUserInfo = userUserInfoStore((state) => state.setUserInfo)

    const userInfo = userUserInfoStore((state) => state.userInfo)

    useEffect(() => {
        if (userInfo && userInfo.userId) {

            setIsLogin(true)

        } else {
            setIsLogin(false)
        }
    }, [userInfo])

    return (
        <header>
            <Box sx={{ flexGrow: 1 }}>
                <AppBar position="fixed" >
                    <Container sx={{ px: 0 }}>
                        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
                            <IconButton
                                size="large"
                                edge="start"
                                color="inherit"
                                aria-label="menu"
                                sx={{ mr: 2 }}
                                disableRipple
                                onClick={() => setOpen(true)}
                            >
                                <MenuIcon />
                            </IconButton>


                            <Stack direction={"row"}>
                                <Box sx={{ display: "flex", alignItems: "center", cursor: "pointer" }} onClick={backToHomePage}>
                                    <Typography variant="h5" sx={{
                                        fontSize: {
                                            sm: "25px",
                                            xs: "15px"
                                        },
                                        letterSpacing: {
                                            sm: 10,
                                            xs: 2
                                        }, fontWeight: 900, color: "#755F4B"
                                    }}>好男友</Typography>
                                    <Typography sx={{
                                        fontSize: {
                                            sm: "18px",
                                            xs: "12px"
                                        },
                                        letterSpacing: {
                                            sm: 10,
                                            xs: 2
                                        }, fontWeight: 900, color: "#355C5A"
                                    }}>線上商店</Typography>

                                </Box>



                            </Stack>


                            <Box sx={{ display: 'flex', alignItems: "center" }}>
                                <IconButton disableRipple>
                                    <SearchIcon />
                                </IconButton>
                                <IconButton disableRipple onClick={goToCart}>
                                    <Badge badgeContent={cartContent.length} max={99} color='error'>
                                        <ShoppingCartOutlinedIcon />
                                    </Badge>

                                </IconButton>
                                {
                                    isLogin ?
                                        <IconButton disableRipple onClick={isLogin ? handleSetAnchor : goToLogin}>
                                            {
                                                userInfo && userInfo.picture ?
                                                    <Avatar src={userInfo?.picture} alt='user picture' sx={{ width: "30px", height: "30px" }} />
                                                    :
                                                    <AccountCircleOutlinedIcon />
                                            }

                                        </IconButton>
                                        :
                                        <IconButton disableRipple onClick={isLogin ? handleSetAnchor : goToLogin}>
                                            <AccountCircleOutlinedIcon />
                                        </IconButton>
                                }
                                {
                                    isLogin && <Typography variant="caption">{userInfo?.name}，Hello</Typography>
                                }



                            </Box>
                        </Toolbar>
                    </Container>

                </AppBar>
                <SideNavBar open={open} setOpen={setOpen} />


                {/*他是黏著 帳戶icon 鈕的 */}
                <UserMenu
                    anchorElement={anchorElement}
                    handleCancelAnchor={handleCancelAnchor}
                />

            </Box>
        </header>
    )
}

