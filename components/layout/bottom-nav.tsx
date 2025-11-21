import { AppBar, Badge, Box, IconButton, Toolbar, useTheme, useMediaQuery, alpha } from '@mui/material';
import { useRouter } from 'next/router';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import HomeIcon from '@mui/icons-material/Home';
import { Avatar } from '@mui/material';
import { useCartStore, userUserInfoStore } from '@/store/store';

export default function BottomNav() {
    const router = useRouter();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md')); // md 以下視為手機版

    const cartContent = useCartStore(state => state.cartContent);
    const userInfo = userUserInfoStore((state) => state.userInfo);
    const isLogin = userInfo !== null;

    const goToHome = () => {
        router.push('/');
    };

    const goToCart = () => {
        router.push('/cart');
    };

    const goToAccount = () => {
        if (isLogin) {
            router.push('/user');
        } else {
            router.push('/login');
        }
    };

    // 只在手機版顯示
    if (!isMobile) {
        return null;
    }

    return (
        <AppBar
            position="fixed"
            sx={{
                top: 'auto',
                bottom: 0,
                backgroundColor: alpha('#2C3E50', 0.95),
                backdropFilter: 'blur(20px)',
                borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.1)',
                zIndex: 1100
            }}
        >
            <Toolbar
                sx={{
                    display: 'flex',
                    justifyContent: 'space-around',
                    alignItems: 'center',
                    minHeight: '64px !important',
                    px: 2
                }}
            >
                {/* 首頁 */}
                <IconButton
                    onClick={goToHome}
                    sx={{
                        color: router.pathname === '/' ? '#E67E22' : 'white',
                        flexDirection: 'column',
                        gap: 0.5,
                        '&:hover': {
                            backgroundColor: alpha('#E67E22', 0.1)
                        }
                    }}
                >
                    <HomeIcon />
                </IconButton>

                {/* 購物車 */}
                <IconButton
                    onClick={goToCart}
                    sx={{
                        color: router.pathname === '/cart' ? '#E67E22' : 'white',
                        flexDirection: 'column',
                        gap: 0.5,
                        position: 'relative',
                        '&:hover': {
                            backgroundColor: alpha('#E67E22', 0.1)
                        }
                    }}
                >
                    <Badge
                        badgeContent={cartContent.length}
                        max={99}
                        sx={{
                            '& .MuiBadge-badge': {
                                backgroundColor: '#E67E22',
                                color: 'white',
                                fontWeight: 'bold',
                                fontSize: '0.7rem'
                            }
                        }}
                        suppressHydrationWarning
                    >
                        <ShoppingCartOutlinedIcon />
                    </Badge>
                </IconButton>

                {/* 個人設定 */}
                <IconButton
                    onClick={goToAccount}
                    sx={{
                        color: router.pathname.startsWith('/user') || router.pathname === '/login' ? '#E67E22' : 'white',
                        flexDirection: 'column',
                        gap: 0.5,
                        '&:hover': {
                            backgroundColor: alpha('#E67E22', 0.1)
                        }
                    }}
                >
                    {isLogin && userInfo?.picture ? (
                        <Avatar
                            src={userInfo.picture}
                            alt="user picture"
                            sx={{
                                width: '28px',
                                height: '28px',
                                border: '2px solid #E67E22'
                            }}
                        />
                    ) : (
                        <AccountCircleOutlinedIcon />
                    )}
                </IconButton>
            </Toolbar>
        </AppBar>
    );
}

