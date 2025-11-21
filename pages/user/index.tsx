import { Box, Card, CardContent, Container, Grid, Typography, useTheme, useMediaQuery, alpha, IconButton, Stack, Badge } from '@mui/material';
import { useRouter } from 'next/router';
import ReceiptIcon from '@mui/icons-material/Receipt';
import FavoriteIcon from '@mui/icons-material/Favorite';
import PersonIcon from '@mui/icons-material/Person';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import InventoryIcon from '@mui/icons-material/Inventory';
import AssignmentReturnIcon from '@mui/icons-material/AssignmentReturn';
import WithAuth from '@/components/auth/with-auth';
import { useEffect, useState } from 'react';
import { OrderInfomation } from '@/interfaces/orders';
import { ApiResponse } from '@/interfaces/api/response';
import { RespCode } from '@/enums/resp-code';
import { OrderStatus } from '@/enums/order-status';

const UserDashboardPage = () => {
    const router = useRouter();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    
    const [orderList, setOrderList] = useState<OrderInfomation[]>([]);

    // 訂單狀態列表
    const orderStatusList = [
        {
            status: OrderStatus.WaitingForPayment,
            description: '待付款',
            icon: <ShoppingBagIcon />,
            color: '#F39C12'
        },
        {
            status: OrderStatus.WaitingForShipment,
            description: '待發貨',
            icon: <LocalShippingIcon />,
            color: '#3498DB'
        },
        {
            status: OrderStatus.WaitPickup,
            description: '待收貨',
            icon: <InventoryIcon />,
            color: '#9B59B6'
        },
        {
            status: OrderStatus.Refund,
            description: '退款',
            icon: <AssignmentReturnIcon />,
            color: '#E74C3C'
        }
    ];

    // 獲取訂單列表
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const result = await getOrders() as ApiResponse<OrderInfomation[]>;
                if (result.code === RespCode.SUCCESS && result.data) {
                    setOrderList(result.data);
                }
            } catch (error) {
                console.error('Error fetching orders:', error);
            }
        };
        fetchOrders();
    }, []);

    // 計算每個狀態的訂單數量
    const getOrderCountByStatus = (status: OrderStatus): number => {
        return orderList.filter(order => order.status === status).length;
    };

    const handleCardClick = (path: string) => {
        router.push(path);
    };

    const handleOrderStatusClick = (status: OrderStatus) => {
        // 點擊狀態卡片進入訂單頁面，並帶上狀態參數
        router.push(`/user/order-record?status=${status}`);
    };

    return (
        <Box sx={{ 
            backgroundColor: 'background.default',
            minHeight: '100vh',
            py: { xs: 3, sm: 4, md: 6 }
        }}>
            <Container maxWidth="lg">
                {/* 標題區域 */}
                <Box sx={{ mb: { xs: 3, sm: 4, md: 5 } }}>
                    <Typography 
                        variant={isMobile ? "h5" : "h4"} 
                        sx={{ 
                            fontWeight: 700,
                            mb: 1,
                            background: 'linear-gradient(45deg, #2C3E50, #34495E)',
                            backgroundClip: 'text',
                            WebkitBackgroundClip: 'text',
                            color: 'transparent'
                        }}
                    >
                        我的帳戶
                    </Typography>
                    <Box sx={{
                        height: '3px',
                        width: '60px',
                        background: 'linear-gradient(90deg, #E67E22, #F39C12)',
                        borderRadius: 2,
                        mb: 2
                    }} />
                    <Typography 
                        variant={isMobile ? "body2" : "subtitle1"} 
                        sx={{ color: 'text.secondary' }}
                    >
                        管理您的訂單、收藏、地址與個人資料
                    </Typography>
                </Box>

                {/* 訂單查詢 */}
                <Box sx={{ mb: 4 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography 
                            variant="h6" 
                            sx={{ 
                                fontWeight: 700,
                                color: '#2C3E50'
                            }}
                        >
                            訂單查詢
                        </Typography>
                        <Typography 
                            variant="body2" 
                            onClick={() => handleCardClick('/user/order-record')}
                            sx={{ 
                                cursor: 'pointer',
                                color: '#3498DB',
                                '&:hover': { textDecoration: 'underline' }
                            }}
                        >
                            查看全部
                        </Typography>
                    </Box>
                    
                    {/* 訂單狀態卡片 - 橫向排列 */}
                    <Grid container spacing={1.5}>
                        {orderStatusList.map((statusItem, index) => {
                            const count = getOrderCountByStatus(statusItem.status);
                            return (
                                <Grid item xs={3} key={index}>
                                    <Card
                                        onClick={() => handleOrderStatusClick(statusItem.status)}
                                        sx={{
                                            borderRadius: 1.5,
                                            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                                            cursor: 'pointer',
                                            transition: 'all 0.3s ease',
                                            border: '1px solid rgba(0,0,0,0.05)',
                                            '&:hover': {
                                                transform: 'translateY(-2px)',
                                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                                borderColor: statusItem.color
                                            }
                                        }}
                                    >
                                        <Box sx={{ 
                                            p: 1.5,
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            textAlign: 'center'
                                        }}>
                                            <Badge
                                                badgeContent={count}
                                                max={99}
                                                sx={{
                                                    '& .MuiBadge-badge': {
                                                        backgroundColor: statusItem.color,
                                                        color: 'white',
                                                        fontWeight: 'bold',
                                                        fontSize: '0.65rem',
                                                        minWidth: '18px',
                                                        height: '18px',
                                                        padding: '0 4px'
                                                    }
                                                }}
                                                suppressHydrationWarning
                                            >
                                                <Box sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    width: 40,
                                                    height: 40,
                                                    borderRadius: '50%',
                                                    backgroundColor: alpha(statusItem.color, 0.1),
                                                    color: statusItem.color,
                                                    '& svg': {
                                                        fontSize: '20px'
                                                    }
                                                }}>
                                                    {statusItem.icon}
                                                </Box>
                                            </Badge>
                                            <Typography 
                                                variant="caption" 
                                                sx={{ 
                                                    fontWeight: 600,
                                                    color: '#2C3E50',
                                                    mt: 0.5,
                                                    fontSize: '0.75rem'
                                                }}
                                            >
                                                {statusItem.description}
                                            </Typography>
                                        </Box>
                                    </Card>
                                </Grid>
                            );
                        })}
                    </Grid>
                </Box>

                {/* Icon 按鈕區域 */}
                <Grid container spacing={2} sx={{ mb: 4 }}>
                    <Grid item xs={6} sm={3}>
                        <IconButton
                            onClick={() => handleCardClick('/user/subscribe-list')}
                            sx={{
                                width: '100%',
                                height: { xs: 80, sm: 100 },
                                borderRadius: 3,
                                backgroundColor: alpha('#E74C3C', 0.1),
                                color: '#E74C3C',
                                flexDirection: 'column',
                                gap: 1,
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    backgroundColor: alpha('#E74C3C', 0.2),
                                    transform: 'translateY(-4px)',
                                    boxShadow: '0 8px 24px rgba(231, 76, 60, 0.2)'
                                }
                            }}
                        >
                            <FavoriteIcon sx={{ fontSize: { xs: 32, sm: 40 } }} />
                            <Typography variant="caption" sx={{ fontWeight: 600 }}>
                                收藏
                            </Typography>
                        </IconButton>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                        <IconButton
                            onClick={() => handleCardClick('/user/addressed')}
                            sx={{
                                width: '100%',
                                height: { xs: 80, sm: 100 },
                                borderRadius: 3,
                                backgroundColor: alpha('#27AE60', 0.1),
                                color: '#27AE60',
                                flexDirection: 'column',
                                gap: 1,
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    backgroundColor: alpha('#27AE60', 0.2),
                                    transform: 'translateY(-4px)',
                                    boxShadow: '0 8px 24px rgba(39, 174, 96, 0.2)'
                                }
                            }}
                        >
                            <LocationOnIcon sx={{ fontSize: { xs: 32, sm: 40 } }} />
                            <Typography variant="caption" sx={{ fontWeight: 600 }}>
                                常用地址
                            </Typography>
                        </IconButton>
                    </Grid>
                </Grid>

                {/* 我的個人訊息卡片 */}
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6} md={4}>
                        <Card
                            onClick={() => handleCardClick('/user/account')}
                            sx={{
                                height: '100%',
                                borderRadius: 3,
                                boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                border: '1px solid rgba(0,0,0,0.05)',
                                position: 'relative',
                                overflow: 'hidden',
                                '&:hover': {
                                    transform: 'translateY(-8px)',
                                    boxShadow: '0 16px 48px rgba(0,0,0,0.12)',
                                    '& .card-icon': {
                                        transform: 'scale(1.1) rotate(5deg)'
                                    },
                                    '& .card-arrow': {
                                        transform: 'translateX(8px)'
                                    }
                                },
                                '&::before': {
                                    content: '""',
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    height: '4px',
                                    background: 'linear-gradient(135deg, #2C3E50 0%, #34495E 100%)',
                                    opacity: 0,
                                    transition: 'opacity 0.3s ease'
                                },
                                '&:hover::before': {
                                    opacity: 1
                                }
                            }}
                        >
                            <CardContent sx={{ 
                                p: { xs: 3, sm: 4 },
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between'
                            }}>
                                {/* 圖示區域 */}
                                <Box sx={{ 
                                    mb: 3,
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    height: { xs: 100, sm: 120 },
                                    background: `linear-gradient(135deg, ${alpha('#2C3E50', 0.1)} 0%, ${alpha('#2C3E50', 0.05)} 100%)`,
                                    borderRadius: 3,
                                    position: 'relative',
                                    overflow: 'hidden'
                                }}>
                                    <Box
                                        className="card-icon"
                                        sx={{
                                            color: '#2C3E50',
                                            transition: 'all 0.3s ease',
                                            zIndex: 1
                                        }}
                                    >
                                        <PersonIcon sx={{ fontSize: 48 }} />
                                    </Box>
                                    <Box sx={{
                                        position: 'absolute',
                                        top: -20,
                                        right: -20,
                                        width: 80,
                                        height: 80,
                                        borderRadius: '50%',
                                        background: `linear-gradient(135deg, ${alpha('#2C3E50', 0.2)} 0%, ${alpha('#2C3E50', 0.1)} 100%)`,
                                        zIndex: 0
                                    }} />
                                </Box>

                                {/* 文字區域 */}
                                <Box>
                                    <Typography 
                                        variant={isMobile ? "h6" : "h5"} 
                                        sx={{ 
                                            fontWeight: 700,
                                            mb: 1,
                                            color: '#2C3E50'
                                        }}
                                    >
                                        我的個人訊息
                                    </Typography>
                                    <Typography 
                                        variant="body2" 
                                        sx={{ 
                                            color: 'text.secondary',
                                            mb: 2,
                                            minHeight: { xs: '40px', sm: 'auto' }
                                        }}
                                    >
                                        管理您的個人資料與帳戶設定
                                    </Typography>
                                </Box>

                                {/* 箭頭指示 */}
                                <Box sx={{ 
                                    display: 'flex',
                                    alignItems: 'center',
                                    color: '#2C3E50',
                                    fontWeight: 600,
                                    mt: 2
                                }}>
                                    <Typography 
                                        variant="body2" 
                                        sx={{ 
                                            fontWeight: 600,
                                            color: '#2C3E50',
                                            mr: 1
                                        }}
                                    >
                                        查看詳情
                                    </Typography>
                                    <ArrowForwardIcon 
                                        className="card-arrow"
                                        sx={{ 
                                            fontSize: 20,
                                            transition: 'transform 0.3s ease'
                                        }} 
                                    />
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};

// 請求後端獲取訂單
const getOrders = async (keyword?: string) => {
    const apiUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    const query = new URLSearchParams({
        query: keyword == undefined ? "" : keyword
    }).toString();

    const response = await fetch(`${apiUrl}/Order/GetOrders?${query}`, {
        method: 'GET',
        credentials: 'include',
    });

    return response.json();
};

export default WithAuth(UserDashboardPage);
