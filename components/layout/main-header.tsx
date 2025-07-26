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
import { Avatar, Badge, Button, FormControl, InputAdornment, InputBase, MenuItem, Paper, Select, SelectChangeEvent, TextField, alpha } from '@mui/material';

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
                <AppBar 
                    position="fixed" 
                    sx={{
                        // 毛玻璃效果
                        backgroundColor: alpha('#2C3E50', 0.95),
                        backdropFilter: 'blur(20px)',
                        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
                    }}
                >
                    <Container sx={{ px: 0 }}>
                        <Toolbar sx={{ 
                            display: "flex", 
                            justifyContent: "space-between",
                            minHeight: '70px !important'
                        }}>
                            <IconButton
                                size="large"
                                edge="start"
                                color="inherit"
                                aria-label="menu"
                                sx={{ 
                                    mr: {
                                        xs: 0,
                                        sm: 0,
                                        md: 2,
                                        lg: 8
                                    },
                                    borderRadius: 2,
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        backgroundColor: alpha('#E67E22', 0.1),
                                        transform: 'scale(1.05)'
                                    }
                                }}
                                disableRipple
                                onClick={() => setOpen(true)}
                            >
                                <MenuIcon />
                            </IconButton>

                            <Stack direction={"row"}>
                                <Box sx={{ 
                                    display: "flex", 
                                    alignItems: "center", 
                                    cursor: "pointer",
                                    padding: '8px 16px',
                                    borderRadius: 3,
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        backgroundColor: alpha('#E67E22', 0.1),
                                        transform: 'translateY(-1px)'
                                    }
                                }} onClick={backToHomePage}>
                                    {/* 漸變色品牌標題 */}
                                    <Typography 
                                        variant="h5" 
                                        sx={{
                                            fontSize: {
                                                sm: "28px",
                                                xs: "18px"
                                            },
                                            letterSpacing: {
                                                sm: 10,
                                                xs: 3
                                            }, 
                                            fontWeight: 900,
                                            background: 'linear-gradient(45deg, #E67E22, #F39C12)',
                                            backgroundClip: 'text',
                                            WebkitBackgroundClip: 'text',
                                            color: 'transparent',
                                            textShadow: 'none'
                                        }}
                                    >
                                        DEMO
                                    </Typography>
                                    <Typography sx={{
                                        fontSize: {
                                            sm: "20px",
                                            xs: "14px"
                                        },
                                        letterSpacing: {
                                            sm: 8,
                                            xs: 2
                                        }, 
                                        fontWeight: 700, 
                                        color: "#FFFFFF",
                                        ml: 1
                                    }}>
                                        線上商店
                                    </Typography>
                                </Box>
                            </Stack>

                            <Box sx={{ display: 'flex', alignItems: "center", gap: 1 }}>
                                <IconButton 
                                    disableRipple 
                                    onClick={() => { setsearchAreaShow(u => !u) }}
                                    sx={{
                                        borderRadius: 2,
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            backgroundColor: alpha('#E67E22', 0.1),
                                            transform: 'scale(1.1)'
                                        }
                                    }}
                                >
                                    <SearchIcon />
                                </IconButton>
                                <IconButton 
                                    disableRipple 
                                    onClick={goToCart}
                                    sx={{
                                        borderRadius: 2,
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            backgroundColor: alpha('#E67E22', 0.1),
                                            transform: 'scale(1.1)'
                                        }
                                    }}
                                >
                                    <Badge 
                                        badgeContent={cartContent.length} 
                                        max={99} 
                                        color='secondary'
                                        sx={{
                                            '& .MuiBadge-badge': {
                                                backgroundColor: '#E67E22',
                                                color: 'white',
                                                fontWeight: 'bold'
                                            }
                                        }}
                                        suppressHydrationWarning
                                    >
                                        <ShoppingCartOutlinedIcon />
                                    </Badge>
                                </IconButton>
                                {
                                    isLogin ?
                                        <IconButton 
                                            disableRipple 
                                            onClick={isLogin ? handleSetAnchor : goToLogin}
                                            sx={{
                                                borderRadius: 2,
                                                transition: 'all 0.3s ease',
                                                '&:hover': {
                                                    backgroundColor: alpha('#E67E22', 0.1),
                                                    transform: 'scale(1.1)'
                                                }
                                            }}
                                        >
                                            {
                                                userInfo && userInfo.picture ?
                                                    <Avatar 
                                                        src={userInfo?.picture} 
                                                        alt='user picture' 
                                                        sx={{ 
                                                            width: "32px", 
                                                            height: "32px",
                                                            border: '2px solid #E67E22'
                                                        }} 
                                                    />
                                                    :
                                                    <AccountCircleOutlinedIcon />
                                            }
                                        </IconButton>
                                        :
                                        <IconButton 
                                            disableRipple 
                                            onClick={isLogin ? handleSetAnchor : goToLogin}
                                            sx={{
                                                borderRadius: 2,
                                                transition: 'all 0.3s ease',
                                                '&:hover': {
                                                    backgroundColor: alpha('#E67E22', 0.1),
                                                    transform: 'scale(1.1)'
                                                }
                                            }}
                                        >
                                            <AccountCircleOutlinedIcon />
                                        </IconButton>
                                }
                                {
                                    isLogin && 
                                    <Typography 
                                        variant="caption"
                                        sx={{
                                            ml: 1,
                                            fontWeight: 500,
                                            color: '#FFFFFF'
                                        }}
                                    >
                                        {userInfo?.name}，您好
                                    </Typography>
                                }
                            </Box>
                        </Toolbar>
                        {
                            searchAreaShow &&
                            <Toolbar sx={{ pb: 2 }}>
                                <Box sx={{ 
                                    display: 'flex', 
                                    justifyContent: 'center', 
                                    alignItems: 'center', 
                                    width: "100%", 
                                    boxShadow: "none", 
                                    pr: 0 
                                }}>
                                    {/* 圓角搜索框 */}
                                    <TextField
                                        onChange={handleKeyword}
                                        value={keyword}
                                        size='small'
                                        fullWidth
                                        variant="outlined"
                                        placeholder="搜尋您想要的商品..."
                                        InputProps={{
                                            style: {
                                                paddingRight: 0,
                                                borderRadius: 16,
                                                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                                backdropFilter: 'blur(10px)'
                                            },
                                            endAdornment: (
                                                <InputAdornment position="end" sx={{ display: 'flex', alignItems: 'center' }}>
                                                    <Select
                                                        value={searchType}
                                                        onChange={handleSearchType}
                                                        size="small"
                                                        sx={{
                                                            backgroundColor: 'transparent',
                                                            height: '2.5rem',
                                                            border: 'none',
                                                            borderRadius: 2,
                                                            '& .MuiOutlinedInput-notchedOutline': {
                                                                border: 'none'
                                                            }
                                                        }}
                                                    >
                                                        {
                                                            router.pathname === "/products" &&
                                                            <MenuItem key="currentPage" value="currentPage">
                                                                <Typography sx={{ fontSize: '14px', fontWeight: 500 }}>當前頁面</Typography>
                                                            </MenuItem>
                                                        }
                                                        <MenuItem key="allProducts" value="allProducts">
                                                            <Typography sx={{ fontSize: '14px', fontWeight: 500 }}>所有產品</Typography>
                                                        </MenuItem>
                                                    </Select>
                                                    <Button
                                                        size="medium"
                                                        variant="contained"
                                                        color="secondary"
                                                        sx={{
                                                            borderRadius: 2,
                                                            margin: 0,
                                                            height: '2.5rem',
                                                            minWidth: '100px',
                                                            fontWeight: 600,
                                                            boxShadow: '0 4px 12px rgba(230, 126, 34, 0.3)',
                                                            '&:hover': {
                                                                boxShadow: '0 6px 20px rgba(230, 126, 34, 0.4)',
                                                                transform: 'translateY(-1px)'
                                                            }
                                                        }}
                                                        onClick={searchProducts}
                                                    >
                                                        <Stack direction={"row"} spacing={1}>
                                                            <SearchIcon />
                                                            <span>搜尋</span>
                                                        </Stack>
                                                    </Button>
                                                </InputAdornment>
                                            ),
                                        }}
                                        sx={{ 
                                            '& .MuiOutlinedInput-root': {
                                                '& fieldset': {
                                                    borderColor: 'rgba(255, 255, 255, 0.3)',
                                                    borderWidth: 2
                                                },
                                                '&:hover fieldset': {
                                                    borderColor: '#E67E22'
                                                },
                                                '&.Mui-focused fieldset': {
                                                    borderColor: '#E67E22'
                                                }
                                            }
                                        }}
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

