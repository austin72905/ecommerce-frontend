import { OrderInfomation } from "@/interfaces";
import { Box, Card, CardContent, Grid, Stack, Typography, Divider } from "@mui/material";
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PaymentIcon from '@mui/icons-material/Payment';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import Image from "next/image";

export default function OrderInfo({ orderInfo, goToProductDetail }: OrderInfoProps) {
    console.log("orderInfo:", orderInfo)
    
    return (
        <Box>
            {/* 現代化標題區域 */}
            <Box sx={{ 
                background: 'linear-gradient(135deg, #2C3E50 0%, #34495E 100%)',
                p: 3
            }}>
                <Typography 
                    variant="h6" 
                    sx={{ 
                        color: 'white',
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1
                    }}
                >
                    <ShoppingCartIcon />
                    訂單明細
                </Typography>
            </Box>

            <Box sx={{ p: 3 }}>
                {/* 商品列表 */}
                <Stack spacing={2} sx={{ mb: 4 }}>
                    {orderInfo.productList.map((item, index) => (
                        <Card 
                            key={index} 
                            sx={{ 
                                borderRadius: 2,
                                border: '1px solid rgba(0,0,0,0.08)',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                                transition: 'all 0.2s ease',
                                '&:hover': {
                                    boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
                                    borderColor: 'rgba(230, 126, 34, 0.2)'
                                }
                            }}
                        >
                            <CardContent sx={{ p: 2 }}>
                                <Grid container spacing={2} alignItems="center">
                                    {/* 商品圖片 */}
                                    <Grid item xs={3} sm={2}>
                                        <Box sx={{ 
                                            position: 'relative',
                                            width: '100%',
                                            aspectRatio: '1',
                                            borderRadius: 2,
                                            overflow: 'hidden',
                                            backgroundColor: '#F5F5F5'
                                        }}>
                                            <Image
                                                src={item.product.coverImg}
                                                alt={item.product.title}
                                                fill
                                                style={{ objectFit: 'cover' }}
                                            />
                                        </Box>
                                    </Grid>

                                    {/* 商品資訊 */}
                                    <Grid item xs={6} sm={7}>
                                        <Box sx={{ 
                                            display: 'flex', 
                                            flexDirection: 'column',
                                            height: '100%',
                                            justifyContent: 'space-between'
                                        }}>
                                            <Typography 
                                                variant="h6" 
                                                sx={{ 
                                                    fontWeight: 600,
                                                    cursor: 'pointer',
                                                    color: 'text.primary',
                                                    mb: 1,
                                                    '&:hover': {
                                                        color: '#E67E22',
                                                        textDecoration: 'underline'
                                                    }
                                                }}
                                                onClick={() => goToProductDetail(item.product.productId)}
                                            >
                                                {item.product.title}
                                            </Typography>
                                            
                                            <Typography 
                                                variant="body2" 
                                                sx={{ 
                                                    color: 'text.secondary',
                                                    mb: 1
                                                }}
                                            >
                                                規格: {item.selectedVariant?.size} - {item.selectedVariant?.color}
                                            </Typography>
                                            
                                            <Typography 
                                                variant="body2" 
                                                sx={{ 
                                                    color: 'text.secondary'
                                                }}
                                            >
                                                數量: {item.count}
                                            </Typography>
                                        </Box>
                                    </Grid>

                                    {/* 價格 */}
                                    <Grid item xs={3} sm={3}>
                                        <Box sx={{ 
                                            display: 'flex',
                                            justifyContent: 'flex-end',
                                            alignItems: 'center'
                                        }}>
                                            <Typography 
                                                variant="h6" 
                                                sx={{ 
                                                    fontWeight: 700,
                                                    color: '#E67E22'
                                                }}
                                            >
                                                NT${item.selectedVariant?.discountPrice || item.selectedVariant?.price}
                                            </Typography>
                                        </Box>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    ))}
                </Stack>

                <Divider sx={{ my: 3 }} />

                {/* 價格摘要 */}
                <Box sx={{
                    backgroundColor: '#FAFAFA',
                    borderRadius: 2,
                    p: 3,
                    border: '1px solid rgba(0,0,0,0.05)'
                }}>
                    <Typography 
                        variant="h6" 
                        sx={{ 
                            fontWeight: 600,
                            mb: 3,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1
                        }}
                    >
                        <PaymentIcon sx={{ color: '#E67E22' }} />
                        費用明細
                    </Typography>

                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            {/* 左側空白或其他內容 */}
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Stack spacing={2}>
                                <PriceSummaryRow
                                    label="商品金額"
                                    value={`NT$${orderInfo.orderPrice - orderInfo.shippingPrice}`}
                                />
                                <PriceSummaryRow
                                    label="運費"
                                    value={`NT$${orderInfo.shippingPrice}`}
                                    icon={<LocalShippingIcon />}
                                />
                                <Divider />
                                <PriceSummaryRow
                                    label="總計"
                                    value={`NT$${orderInfo.orderPrice}`}
                                    isTotal
                                />
                                <PriceSummaryRow
                                    label="付款方式"
                                    value={payWayMap.get(orderInfo.payWay) || "銀行轉帳"}
                                    icon={<PaymentIcon />}
                                />
                            </Stack>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </Box>
    )
}

// 價格摘要行組件
const PriceSummaryRow = ({ 
    label, 
    value, 
    icon, 
    isTotal = false 
}: {
    label: string;
    value: string;
    icon?: React.ReactNode;
    isTotal?: boolean;
}) => (
    <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography 
            variant={isTotal ? "h6" : "body1"}
            sx={{ 
                fontWeight: isTotal ? 700 : 500,
                color: isTotal ? 'text.primary' : 'text.secondary',
                display: 'flex',
                alignItems: 'center',
                gap: 1
            }}
        >
            {icon && <Box sx={{ color: '#E67E22', fontSize: '1.2rem' }}>{icon}</Box>}
            {label}
        </Typography>
        <Typography 
            variant={isTotal ? "h6" : "body1"}
            sx={{ 
                fontWeight: isTotal ? 700 : 600,
                color: isTotal ? '#E67E22' : 'text.primary'
            }}
        >
            {value}
        </Typography>
    </Stack>
);

interface OrderInfoProps {
    orderInfo: OrderInfomation;
    goToProductDetail: (productId: number) => void;
}

const payWayMap = new Map<number, string>([
    [0, "綠界支付"],
    [1, "銀行轉帳"],
])