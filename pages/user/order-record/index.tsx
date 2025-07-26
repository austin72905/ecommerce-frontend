import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import styled from '@mui/system/styled';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import CardActions from '@mui/material/CardActions';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import StepConnector, { stepConnectorClasses } from '@mui/material/StepConnector';
import { StepIconProps } from '@mui/material/StepIcon';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import ReceiptIcon from '@mui/icons-material/Receipt';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

import React, { ChangeEvent, useEffect, useState } from 'react'

import { CardHeader, Divider, useMediaQuery, Chip, alpha, Badge } from '@mui/material';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { OrderInfomation, ProductInfomationCount } from '@/interfaces';
import { imgList, orderInfoList } from '@/dummy-data/order-dummy-data';
import WithAuth from '@/components/auth/with-auth';
import { ApiResponse } from '@/interfaces/api/response';
import { RespCode } from '@/enums/resp-code';

import { OrderStatus, orderStatusMap } from '@/enums/order-status';
import { useCartStore } from '@/store/store';

const OrderRecordPage = () => {

    const { pathname } = useRouter();
    //console.log("pathname",pathname)
    const lastPath = pathname.split('/')
    //console.log("lastPath",lastPath)

    //const [orderInfoDetail, setOrderInfoDetail] = useState<OrderInfomation>(null)

    //{lastPath.includes("TX")?}
    return (
        <Box sx={{ 
            backgroundColor: 'background.default',
            minHeight: '100vh',
            py: 4
        }}>
            <Container maxWidth="xl">
                <PurchaseRecord />
            </Container>
        </Box>
    )
}

export default WithAuth(OrderRecordPage);

interface OrderState {
    status: OrderStatus;
    description: string;
    icon: React.ReactNode;
    color: string;
}

const orderStateList = () => {
    let stateList: OrderState[] = []
    orderStatusMap.forEach((value, status) => {

        if (status === OrderStatus.Created) {
            stateList.push({
                status: status,
                description: "所有訂單",
                icon: <ReceiptIcon />,
                color: '#2C3E50'
            })
        } else if (status === OrderStatus.WaitingForPayment) {
            stateList.push({
                status: status,
                description: value.description,
                icon: <ShoppingBagIcon />,
                color: '#F39C12'
            })
        } else if (status === OrderStatus.WaitingForShipment || status === OrderStatus.InTransit || status === OrderStatus.WaitPickup) {
            stateList.push({
                status: status,
                description: value.description,
                icon: <LocalShippingIcon />,
                color: '#3498DB'
            })
        } else if (status === OrderStatus.Completed) {
            stateList.push({
                status: status,
                description: value.description,
                icon: <CheckCircleIcon />,
                color: '#27AE60'
            })
        } else {
            stateList.push({
                status: status,
                description: value.description,
                icon: <ReceiptIcon />,
                color: '#E74C3C'
            })
        }
    })
    return stateList;
}

const StepIcon = (props: StepIconProps) => {

    const { active, completed, className } = props
    //console.log("active", active)

    return (
        <StepIconRoot>
            {completed ? (
                <div />
            ) : (
                <div className="step-uncompleted" />
            )}
        </StepIconRoot>

    )
}

const StepIconRoot = styled('div')(({ theme }) => ({
    marginLeft: "5px",
    borderRadius: '50%',
    background: theme.palette.primary.main,
    width: 15,
    height: 15,
    '& .step-uncompleted': {
        borderRadius: '50%',
        width: 15,
        height: 15,
        backgroundColor: '#AFAFAF',
    },

}))

const StepDetailConnector = styled(StepConnector)(({ theme }) => ({
    [`&.${stepConnectorClasses.active}`]: {

    },
    [`&.${stepConnectorClasses.completed}`]: {
        [`& .${stepConnectorClasses.root}`]: {
            background: theme.palette.primary.main
        },
    },
}))

interface OrderStepInfomation {
    unachieveDescription: string;
    achieveDescription: string;
    date: string
}

const orderStepInfomationList: OrderStepInfomation[] = [
    {
        unachieveDescription: "訂單未成立",
        achieveDescription: "訂單已成立",
        date: "2022-12-10 13:10:16"
    },
    {
        unachieveDescription: "未收到款項",
        achieveDescription: "已收款",
        date: "2022-12-14 00:01:55"
    },
    {
        unachieveDescription: "尚未出貨",
        achieveDescription: "已出貨",
        date: "2022-12-15 08:30:33"
    },
    {
        unachieveDescription: "尚未完成訂單",
        achieveDescription: "已完成訂單",
        date: "2022-12-22 10:10:09"
    },
]

interface CargoInfomation {
    description: string;
    date: string;
}

const cargoInfomation: CargoInfomation[] = [
    {
        description: "買家取件成功",
        date: "2022-12-20 10:10:09"
    },
    {
        description: "包裹已送達",
        date: "2022-12-18 01:30:33"
    },
    {
        description: "包裹寄送中",
        date: "2022-12-16 08:01:55"
    },
    {
        description: "已寄件",
        date: "2022-12-15 00:10:16"
    },
]

interface PurchaseRecordProps {
    //setOrderInfoDetail: React.Dispatch<React.SetStateAction<OrderInfomation>>;
}

//訂單頁面
const PurchaseRecord = ({ }: PurchaseRecordProps) => {

    const router = useRouter();
    const [viewValue, setviewValue] = useState<string>(OrderStatus.Created.toString())

    const [orderList, setorderList] = useState<OrderInfomation[]>([]);
    const [orderCounts, setOrderCounts] = useState<Map<OrderStatus, number>>(new Map());

    const handleView = (e: React.SyntheticEvent, newVal: string) => {
        setviewValue(newVal)
    }

    const [keyword, setkeyword] = useState("");

    const handleKeyword = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setkeyword(e.target.value)
    }

    const searchOrderRecords = async (e: React.KeyboardEvent<HTMLInputElement>) => {

        if (e.key !== "Enter") {
            return
        }

        if (keyword.length === 0) {
            return
        }

        try {
            const result = await getOrders(keyword) as ApiResponse;
            console.log("result=", result)

            if (result.code != RespCode.SUCCESS) {

                console.log("獲取數據失敗")
                return;
            }

            if (result.data == null) {
                console.log("獲取數據失敗")
                return;
            }

            const ordersData = result.data as OrderInfomation[]

            setorderList(ordersData)

        } catch (error) {
            console.error('Error fetching data:', error)
        }
    }

    const goOrderDetail = (orderInfo: OrderInfomation) => {
        //setOrderInfoDetail(orderInfo)
        //console.log(orderInfo.recordCode)
        router.push(`/user/order-record/${orderInfo.recordCode}`)
    }

    const addToCart = useCartStore((state) => state.addToCart)

    // 把訂單內的商品再放入購物車
    // router.push 到購物車
    const buyAgain = (productList: ProductInfomationCount[]) => {
        productList.forEach(productCount => {
            addToCart(productCount.product, productCount.selectedVariant, productCount.count)
        })
        router.push("/cart")

    }

    // 請求後端
    useEffect(() => {

        const fetchData = async () => {
            try {
                const result = await getOrders() as ApiResponse;
                console.log("result=", result)

                if (result.code != RespCode.SUCCESS) {

                    console.log("獲取數據失敗")
                    return;
                }

                if (result.data == null) {
                    console.log("獲取數據失敗")
                    return;
                }

                const ordersData = result.data as OrderInfomation[]

                setorderList(ordersData)

            } catch (error) {
                console.error('Error fetching data:', error)
            }
        }

        fetchData()
    }, [])

    // 客戶端計算訂單數量，避免 SSR 不匹配
    useEffect(() => {
        const counts = new Map<OrderStatus, number>();
        
        // 計算所有訂單數量
        counts.set(OrderStatus.Created, orderList.length);
        
        // 計算各狀態的訂單數量
        orderStateList().forEach(orderState => {
            if (orderState.status !== OrderStatus.Created) {
                const count = orderList.filter(order => order.status === orderState.status).length;
                counts.set(orderState.status, count);
            }
        });
        
        setOrderCounts(counts);
    }, [orderList]);

    const isSmallScreen = useMediaQuery('(max-width:700px)');
    
    // 獲取訂單數量的安全方法
    const getOrderCountByStatus = (status: OrderStatus): number => {
        return orderCounts.get(status) || 0;
    }

    return (
        <Box>
            {/* 現代化標題區域 */}
            <Box sx={{ mb: 4 }}>
                <Typography 
                    variant="h4" 
                    sx={{ 
                        fontWeight: 700,
                        mb: 1,
                        background: 'linear-gradient(45deg, #2C3E50, #34495E)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        color: 'transparent'
                    }}
                >
                    我的訂單
                </Typography>
                <Box sx={{
                    height: '3px',
                    width: '60px',
                    background: 'linear-gradient(90deg, #E67E22, #F39C12)',
                    borderRadius: 2,
                    mb: 2
                }} />
                <Typography variant="subtitle1" sx={{ color: 'text.secondary' }}>
                    查看您的所有訂單狀態與詳細資訊
                </Typography>
            </Box>

            {/* 現代化Tab區域 */}
            <Card sx={{ 
                borderRadius: 3,
                boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
                overflow: 'hidden',
                mb: 3
            }}>
                <TabContext value={viewValue}>
                    <Box sx={{ 
                        background: 'linear-gradient(135deg, #2C3E50 0%, #34495E 100%)',
                        px: 3,
                        pt: 2
                    }}>
                        <TabList 
                            variant={isSmallScreen ? 'scrollable' : 'fullWidth'} 
                            onChange={handleView} 
                            allowScrollButtonsMobile 
                            scrollButtons="auto"
                            sx={{
                                '& .MuiTab-root': {
                                    color: 'rgba(255, 255, 255, 0.7)',
                                    fontWeight: 600,
                                    minHeight: '64px',
                                    transition: 'all 0.3s ease',
                                    '&.Mui-selected': {
                                        color: '#E67E22',
                                    },
                                    '&:hover': {
                                        color: '#F39C12',
                                        backgroundColor: alpha('#E67E22', 0.1)
                                    }
                                },
                                '& .MuiTabs-indicator': {
                                    backgroundColor: '#E67E22',
                                    height: '3px',
                                    borderRadius: '2px'
                                }
                            }}
                        >
                            {orderStateList().map(orderState => (
                                <Tab 
                                    key={orderState.status} 
                                    value={orderState.status.toString()} 
                                    label={
                                        <Box sx={{ 
                                            display: 'flex', 
                                            alignItems: 'center', 
                                            gap: 1,
                                            flexDirection: isSmallScreen ? 'column' : 'row'
                                        }}>
                                            <Box sx={{ color: orderState.color }}>
                                                {orderState.icon}
                                            </Box>
                                            <Box sx={{ textAlign: isSmallScreen ? 'center' : 'left' }}>
                                                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                                    {orderState.description}
                                                </Typography>
                                                <Badge 
                                                    badgeContent={getOrderCountByStatus(orderState.status)} 
                                                    color="secondary"
                                                    sx={{
                                                        '& .MuiBadge-badge': {
                                                            backgroundColor: '#E67E22',
                                                            color: 'white',
                                                            fontSize: '0.75rem',
                                                            fontWeight: 600
                                                        }
                                                    }}
                                                    suppressHydrationWarning
                                                />
                                            </Box>
                                        </Box>
                                    }
                                />
                            ))}
                        </TabList>
                    </Box>

                    {orderStateList().map(orderState => (
                        <TabPanel key={orderState.status} value={orderState.status.toString()} sx={{ p: 0 }}>
                            <Box sx={{ p: 3 }}>
                                {/* 現代化搜尋區域 */}
                                <Stack direction="row" justifyContent="flex-end" sx={{ mb: 3 }}>
                                    <Paper sx={{ 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        width: { xs: '100%', sm: 400 },
                                        borderRadius: 3,
                                        border: '1px solid rgba(0,0,0,0.08)',
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                                        '&:hover': {
                                            borderColor: '#E67E22',
                                            boxShadow: '0 4px 16px rgba(230, 126, 34, 0.2)'
                                        }
                                    }}>
                                        <IconButton 
                                            sx={{ 
                                                p: 2,
                                                color: '#E67E22',
                                                '&:hover': {
                                                    backgroundColor: alpha('#E67E22', 0.1)
                                                }
                                            }}
                                        >
                                            <SearchIcon />
                                        </IconButton>
                                        <InputBase
                                            sx={{ 
                                                ml: 1, 
                                                flex: 1,
                                                pr: 2,
                                                fontSize: '0.95rem'
                                            }}
                                            placeholder="輸入訂單編號或商品名稱搜尋..."
                                            value={keyword}
                                            onChange={handleKeyword}
                                            onKeyDown={searchOrderRecords}
                                        />
                                    </Paper>
                                </Stack>

                                {/* 現代化訂單列表 */}
                                {orderList.length === 0 ? (
                                    <Box sx={{
                                        textAlign: 'center',
                                        py: 8,
                                        color: 'text.secondary'
                                    }}>
                                        <ReceiptIcon sx={{ fontSize: 64, mb: 2, opacity: 0.3 }} />
                                        <Typography variant="h6" sx={{ mb: 1 }}>
                                            尚無訂單記錄
                                        </Typography>
                                        <Typography variant="body2">
                                            開始購物來建立您的第一筆訂單
                                        </Typography>
                                    </Box>
                                ) : (
                                    <Stack spacing={3}>
                                        {orderList.map((info, index) => {
                                            // 不是當前狀態的訂單就不顯示
                                            if (info.status.toString() != viewValue && viewValue != OrderStatus.Created.toString()) {
                                                return null
                                            }

                                            return (
                                                <ModernOrderCard
                                                    key={index}
                                                    orderInfo={info}
                                                    onViewDetail={() => goOrderDetail(info)}
                                                    onBuyAgain={() => buyAgain(info.productList)}
                                                />
                                            )
                                        })}
                                    </Stack>
                                )}
                            </Box>
                        </TabPanel>
                    ))}
                </TabContext>
            </Card>
        </Box>
    )
}

// 現代化訂單卡片組件
const ModernOrderCard = ({ 
    orderInfo, 
    onViewDetail, 
    onBuyAgain 
}: {
    orderInfo: OrderInfomation;
    onViewDetail: () => void;
    onBuyAgain: () => void;
}) => {
    const statusInfo = orderStatusMap.get(orderInfo.status);

    return (
        <Card sx={{ 
            borderRadius: 3,
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            border: '1px solid rgba(0,0,0,0.05)',
            overflow: 'hidden',
            transition: 'all 0.3s ease',
            '&:hover': {
                boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
                transform: 'translateY(-2px)'
            }
        }}>
            {/* 訂單標題區域 */}
            <Box sx={{ 
                background: 'linear-gradient(135deg, #F8F9FA 0%, #E9ECEF 100%)',
                p: 3,
                borderBottom: '1px solid rgba(0,0,0,0.05)'
            }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Stack direction="row" spacing={2} alignItems="center">
                        <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                            訂單號:
                        </Typography>
                        <Typography 
                            variant="body1" 
                            sx={{ 
                                fontWeight: 700,
                                color: '#E67E22',
                                cursor: 'pointer',
                                '&:hover': {
                                    textDecoration: 'underline'
                                }
                            }}
                            onClick={onViewDetail}
                        >
                            {orderInfo.recordCode}
                        </Typography>
                    </Stack>
                    <Chip
                        label={statusInfo?.description}
                        sx={{
                            backgroundColor: statusInfo?.color,
                            color: 'white',
                            fontWeight: 600,
                            borderRadius: 2,
                            '& .MuiChip-label': {
                                px: 2
                            }
                        }}
                    />
                </Stack>
            </Box>

            {/* 商品列表區域 */}
            <Box sx={{ p: 3 }}>
                <Stack spacing={2}>
                    {orderInfo.productList.map((item, index) => (
                        <ModernProductItem 
                            key={index} 
                            productInfo={item}
                            onViewDetail={onViewDetail}
                        />
                    ))}
                </Stack>

                {/* 訂單金額 */}
                <Box sx={{ 
                    mt: 3, 
                    pt: 2, 
                    borderTop: '1px solid rgba(0,0,0,0.08)',
                    textAlign: 'right'
                }}>
                    <Stack direction="row" justifyContent="flex-end" spacing={1} alignItems="center">
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                            訂單總額:
                        </Typography>
                        <Typography 
                            variant="h6" 
                            sx={{ 
                                fontWeight: 700,
                                color: '#E67E22'
                            }}
                        >
                            NT${orderInfo.orderPrice}
                        </Typography>
                    </Stack>
                </Box>
            </Box>

            {/* 操作按鈕區域 */}
            <Box sx={{ 
                px: 3, 
                pb: 3,
                display: 'flex',
                justifyContent: 'flex-end',
                gap: 2
            }}>
                {orderInfo.status === OrderStatus.WaitingForPayment && (
                    <Button 
                        variant="outlined"
                        color="error"
                        sx={{
                            borderColor: '#E74C3C',
                            color: '#E74C3C',
                            '&:hover': {
                                borderColor: '#C0392B',
                                backgroundColor: alpha('#E74C3C', 0.05)
                            }
                        }}
                    >
                        取消訂單
                    </Button>
                )}
                <Button 
                    variant="outlined"
                    onClick={onViewDetail}
                    sx={{
                        borderColor: '#2C3E50',
                        color: '#2C3E50',
                        '&:hover': {
                            borderColor: '#34495E',
                            backgroundColor: alpha('#2C3E50', 0.05)
                        }
                    }}
                >
                    查看詳情
                </Button>
                <Button 
                    variant="contained"
                    onClick={onBuyAgain}
                    sx={{
                        backgroundColor: '#E67E22',
                        '&:hover': {
                            backgroundColor: '#D35400'
                        }
                    }}
                >
                    重新購買
                </Button>
            </Box>
        </Card>
    )
}

// 現代化商品項目組件
const ModernProductItem = ({ 
    productInfo, 
    onViewDetail 
}: {
    productInfo: ProductInfomationCount;
    onViewDetail: () => void;
}) => {
    return (
        <Box sx={{ 
            display: 'flex',
            gap: 2,
            p: 2,
            borderRadius: 2,
            backgroundColor: '#FAFAFA',
            border: '1px solid rgba(0,0,0,0.05)',
            transition: 'all 0.2s ease',
            '&:hover': {
                backgroundColor: '#F5F5F5',
                borderColor: 'rgba(230, 126, 34, 0.2)'
            }
        }}>
            {/* 商品圖片 */}
            <Box sx={{ 
                width: 80, 
                height: 80, 
                borderRadius: 2,
                overflow: 'hidden',
                flexShrink: 0,
                position: 'relative'
            }}>
                <Image
                    src={productInfo.product.coverImg}
                    alt={productInfo.product.title}
                    fill
                    style={{ objectFit: 'cover' }}
                />
            </Box>

            {/* 商品資訊 */}
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <Box>
                    <Typography 
                        variant="body1" 
                        sx={{ 
                            fontWeight: 600,
                            mb: 0.5,
                            cursor: 'pointer',
                            '&:hover': {
                                color: '#E67E22'
                            }
                        }}
                        onClick={onViewDetail}
                    >
                        {productInfo.product.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                        規格: {productInfo.selectedVariant?.size} - {productInfo.selectedVariant?.color}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        數量: {productInfo.count}
                    </Typography>
                </Box>
            </Box>

            {/* 價格 */}
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography 
                    variant="h6" 
                    sx={{ 
                        fontWeight: 700,
                        color: '#E67E22'
                    }}
                >
                    NT${productInfo.selectedVariant?.discountPrice || productInfo.selectedVariant?.price}
                </Typography>
            </Box>
        </Box>
    )
}

export const randomImg = () => {
    const randomIndex = Math.floor(Math.random() * imgList.length);
    return imgList[randomIndex];
}

//請求後端
const getOrders = async (keyword?: string) => {
    const apiUrl = process.env.NEXT_PUBLIC_BACKEND_URL

    const query = new URLSearchParams({
        query: keyword == undefined ? "" : keyword
    }).toString()

    const response = await fetch(`${apiUrl}/Order/GetOrders?${query}`, {
        method: 'GET',
        credentials: 'include',
    })

    return response.json();
}