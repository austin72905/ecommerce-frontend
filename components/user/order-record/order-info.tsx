import { OrderInfomation } from "@/interfaces";
import { randomImg } from "@/pages/user/order-record";
import { Box, Card, CardContent, CardMedia, Grid, Paper, Stack, Typography } from "@mui/material";
import Image from "next/image";

export default function OrderInfo({ orderInfo,goToProductDetail }: OrderInfoProps) {
    console.log("orderInfo:",orderInfo)
    return (
        <Paper sx={{ boxShadow: "none", border: "1px solid #d9d9d9" }}>
            <Stack spacing={0} >
                <Typography sx={{ fontWeight: "bold", m: 3 }}>訂單資訊</Typography>
                {orderInfo.productList.map((item, index) => (
                    <Card key={index} sx={{ width: "100%", boxShadow: "none", border: "solid 0px #D9D9D9" }}>
                        <Grid container columns={12} sx={{ border: "1px solid #D9D9D9" }}>
                            <Grid item xs={4} sm={2}>
                                <CardMedia
                                    sx={{
                                        position: 'relative',
                                        width: '100%',
                                        height: '100%',
                                        maxWidth: '130px',
                                        border: '0px solid black',
                                        overflow: 'hidden',
                                        p: 1
                                    }}
                                >
                                    <Box
                                        sx={{
                                            width: '100%',
                                            height: 0,
                                            paddingBottom: '100%',
                                            position: 'relative',
                                        }}
                                    >
                                        <Image
                                            src={item.product.coverImg}

                                            //src={randomImg()}
                                            alt="product information5"
                                            layout="fill"
                                            style={{ objectFit: 'cover' }}
                                        />
                                    </Box>
                                </CardMedia>

                            </Grid>
                            <Grid item xs={8} sm={10} sx={{ border: "0px solid orange" }}>
                                <CardContent sx={{ border: "0px solid red", pl: 4, pr: 4, height: "80px" }}>
                                    <Grid container columns={8} sx={{ border: "0px solid green", height: "100px" }}>
                                        <Grid item xs={6} sx={{ border: "0px solid" }}>
                                            <Box sx={{ border: "0px solid", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                                                <Typography sx={{ fontWeight: "bold", '&:hover': { cursor: "pointer" } }} onClick={()=>goToProductDetail(item.product.productId)}>{item.product.title}</Typography>
                                                <Typography variant='caption'>規格 : {item.selectedVariant?.size} - {item.selectedVariant?.color}</Typography>
                                                <Typography >x 1</Typography>
                                            </Box>
                                        </Grid>
                                        <Grid item xs={8} sm={2} >
                                            <Box sx={{ display: "flex", flexDirection: "row" }}>
                                                <Stack sx={{ alignItems: "end" }} spacing={3}>
                                                    <Typography>NT${item.product.price}</Typography>
                                                </Stack>
                                            </Box>

                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Grid>
                        </Grid>

                    </Card>
                ))}


                <Grid container columns={12}>




                    <Grid item xs={4} sm={6} md={9}></Grid>
                    {/*靠右 */}
                    <Grid item xs={8} sm={6} md={3}>
                        <Grid container columns={4} sx={{ my: 4, pr: 4 }}>

                            <Grid item xs={2}>
                                <Stack spacing={3} sx={{ border: "0px solid", alignItems: "start" }}>
                                    <Typography >
                                        商品金額
                                    </Typography>
                                    <Typography >
                                        運費
                                    </Typography>
                                    <Typography >
                                        總計
                                    </Typography>
                                    <Typography >
                                        付款方式
                                    </Typography>
                                </Stack>
                            </Grid>
                            <Grid item xs={2}>
                                <Stack spacing={3} sx={{ border: "0px solid", alignItems: "end" }}>
                                    <Typography >
                                        NT${orderInfo.orderPrice}
                                    </Typography>
                                    <Typography >
                                        NT${orderInfo.shippingPrice}
                                    </Typography>
                                    <Typography sx={{ color: "#ef6060", fontWeight: "bold" }}>
                                        NT${orderInfo.orderPrice + orderInfo.shippingPrice}
                                    </Typography>
                                    <Typography >
                                        {payWayMap.get(orderInfo.payWay)?payWayMap.get(orderInfo.payWay):"銀行轉帳"}
                                    </Typography>
                                </Stack>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Stack>

        </Paper>
    )
}

interface OrderInfoProps {
    orderInfo: OrderInfomation;
    goToProductDetail :(productId:number)=>void

}

const payWayMap =new Map<number,string>([
    [0,"綠界支付"],
    [1,"銀行轉帳"],
])