import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';

import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import SearchIcon from '@mui/icons-material/Search';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';



import { ChangeEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Avatar, Badge, Button, FormControl, InputAdornment, InputBase, MenuItem, Paper, Select, SelectChangeEvent, TextField } from '@mui/material';

import SideNavBar, { useOpenState } from './sidebar';
import { useCartStore, userUserInfoStore } from '@/store/store';
import UserMenu from './user-menu';




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

        //console.log("main-header userInfo:",userInfo)
        if (userInfo !== null) {

            setIsLogin(true)

        } else {
            setIsLogin(false)
        }
    }, [userInfo])


    const [searchAreaShow, setsearchAreaShow] = useState(false)

    const [searchType, setsearchType] = useState("currentPage")

    const handleSearchType = (e: SelectChangeEvent<string>) => {
        setsearchType(e.target.value)
    }

    const [keyword, setkeyword] = useState("")

    const handleKeyword = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setkeyword(e.target.value)
    }

    const searchProducts = () => {
        const { kind, tag } = router.query

        if(keyword.length===0){
            return
        }

        if (searchType == "currentPage") {
            let quertString = ""
            if (tag) {
                quertString += `tag=${tag}&`
            }
            if (kind) {
                quertString += `kind=${kind}`
            }
            router.push(`/products?${quertString}&query=${keyword}`)
        } else {
            router.push(`/products?query=${keyword}`)
        }
    }

    // 變換畫面自動關起搜尋欄
    useEffect(() => {
        setsearchAreaShow(false)


        // 修改不在產品頁面時，搜尋產品範圍為所有產品
        if (router.pathname != "/products") {
            setsearchType("allProducts")
        }
    }, [router])

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
                                sx={{ mr: {
                                    xs:0,
                                    sm:0,
                                    md:2,
                                    lg:8
                                } }}
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
                                    }}>DEMO</Typography>
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
                                <IconButton disableRipple onClick={() => { setsearchAreaShow(u => !u) }}>
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
                        {
                            searchAreaShow &&

                            <Toolbar>


                                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: "100%", boxShadow: "none", pr: 0 }}>
                                    <TextField

                                        onChange={handleKeyword}
                                        value={keyword}
                                        size='small'
                                        fullWidth
                                        variant="outlined"
                                        placeholder="查詢商品"
                                        InputProps={{
                                            style: {
                                                paddingRight: 0,
                                                borderRadius: 0
                                            },

                                            endAdornment: (
                                                <InputAdornment position="end" sx={{ display: 'flex', alignItems: 'center' }}>
                                                    <Select
                                                        value={searchType}
                                                        onChange={handleSearchType}
                                                        size="small"
                                                        sx={{
                                                            backgroundColor: 'white',
                                                            height: '2.5rem',
                                                            border: 'none',
                                                            borderRadius: 0
                                                        }}
                                                    >
                                                        {

                                                            router.pathname === "/products" &&
                                                            <MenuItem key="currentPage" value="currentPage">
                                                                <Typography sx={{ fontSize: '15px' }}>當前頁面</Typography>
                                                            </MenuItem>
                                                        }
                                                        <MenuItem key="allProducts" value="allProducts">
                                                            <Typography sx={{ fontSize: '15px' }}>所有產品</Typography>
                                                        </MenuItem>
                                                    </Select>
                                                    <Button
                                                        size="medium"
                                                        variant="outlined"
                                                        sx={{
                                                            borderRadius: 0, // 確保外觀與輸入框一致
                                                            margin: 0, // 移除外部 margin
                                                            height: '2.5rem',
                                                        }}
                                                        onClick={searchProducts}
                                                    >
                                                        <Stack direction={"row"} >
                                                            <SearchIcon />
                                                            搜尋
                                                        </Stack>

                                                    </Button>
                                                </InputAdornment>
                                            ),

                                        }}

                                        sx={{ background: "white" }}




                                    />
                                </Box>


                            </Toolbar>
                        }

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

