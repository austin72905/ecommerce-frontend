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
import { useState } from 'react';
import { useRouter } from 'next/router';



export default function MainHeader() {


    const [open, setOpen] = useState<boolean>(false)

    const router = useRouter();

    const backToHomePage=()=>{
        router.push("/")
    }

    const goToLogin=()=>{
        router.push("/login")
    }

    return (
        <header>
            <Box sx={{ flexGrow: 1 }}>
                <AppBar position="fixed" >
                    <Container sx={{px:0}}>
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
                                        fontSize:{
                                            sm:"25px",
                                            xs:"15px"
                                        },
                                        letterSpacing: {
                                            sm: 10,
                                            xs: 2
                                        }, fontWeight: 900, color: "#755F4B"
                                    }}>好男友</Typography>
                                    <Typography  sx={{
                                        fontSize:{
                                            sm:"18px",
                                            xs:"12px"
                                        },
                                        letterSpacing: {
                                            sm: 10,
                                            xs: 2
                                        }, fontWeight: 900, color: "#355C5A"
                                    }}>線上商店</Typography>

                                </Box>



                            </Stack>


                            <Box sx={{ display: 'flex',alignItems: "center" }}>
                                <IconButton disableRipple>
                                    <SearchIcon />
                                </IconButton>
                                <IconButton disableRipple>
                                    <ShoppingCartOutlinedIcon />
                                </IconButton>

                                <IconButton disableRipple onClick={goToLogin}>
                                    <AccountCircleOutlinedIcon />
                                </IconButton>

                            </Box>
                        </Toolbar>
                    </Container>

                </AppBar>
                <Drawer
                    PaperProps={{
                        sx: { backgroundColor: "#61D1BD" }
                    }}
                    open={open} onClose={() => setOpen(false)}>
                    <Stack direction="row-reverse">
                        <IconButton disableRipple onClick={() => setOpen(false)}>
                            <CloseIcon sx={{ color: "white" }} />
                        </IconButton>
                    </Stack>
                    <nav>
                        <List sx={{ width: "200px" }}>

                            <Link passHref href={{
                                pathname: "/products",
                                query: { tag: "new-arrival" }
                            }}
                                style={{ color: 'inherit', textDecoration: "none" }}>
                                <ListItemButton disableRipple onClick={() => setOpen(false)}>
                                    <ListItemText sx={{ color: "white" }} primary={
                                        "新品上市"
                                    } />


                                </ListItemButton >
                            </Link>
                            <Link passHref href={{
                                pathname: "/products",
                                query: { tag: "all-products" }
                            }}
                                style={{ color: 'inherit', textDecoration: "none" }}>
                                <ListItemButton disableRipple onClick={() => setOpen(false)}>
                                    <ListItemText sx={{ color: "white" }} primary={
                                        "全部商品"
                                    } />


                                </ListItemButton >
                            </Link>
                            <Link passHref href={{
                                pathname: "/products",
                                query: { tag: "limit-time-offer" }
                            }}
                                style={{ color: 'inherit', textDecoration: "none" }}>
                                <ListItemButton disableRipple onClick={() => setOpen(false)}>
                                    <ListItemText sx={{ color: "white" }} primary={
                                        "本月優惠"
                                    } />


                                </ListItemButton >
                            </Link>
                            <Link passHref href={{
                                pathname: "/products",
                                query: { tag: "daily-products" }
                            }}
                                style={{ color: 'inherit', textDecoration: "none" }}>
                                <ListItemButton disableRipple onClick={() => setOpen(false)}>
                                    <ListItemText sx={{ color: "white" }} primary={
                                        "生活小物"
                                    } />


                                </ListItemButton >
                            </Link>





                        </List>
                    </nav>

                </Drawer>
            </Box>
        </header>
    )
}

