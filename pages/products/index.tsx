import { useRouter } from "next/router"
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import CardActions from '@mui/material/CardActions';
import ProductImage from '/public/images/朋朋衛生紙商品圖.jpg'
import { Box, Button, Stack, Typography } from "@mui/material";
import { useState } from "react";
import Image from "next/image";

export default function ProductsPage() {

    const router = useRouter()

    const goToProductDetail=()=>{
        router.push("/products/7aa1aas61cx1vs6d54fa96")
    }

    const products = [1, 2, 3, 4, 5]

    return (
        <Box sx={{ p: 2 }}>
            <h1>
                ProductsPage: {router.query.tag}
            </h1>
            <Grid container columns={8} spacing={3}>


                {products.map((product) => (
                    <Grid item lg={2} md={2} sm={4} xs={4} key={product}>
                        <Card sx={{ boxShadow: "none" }}>
                            <CardMedia onClick={goToProductDetail} sx={{'&:hover': { cursor: "pointer" }}}>

                                <Box
                                    sx={{
                                        position: 'relative',
                                        width: '100%',
                                        height: 0,
                                        paddingBottom: '100%', // 这是根据宽高比计算的
                                        overflow: 'hidden',
                                    }}
                                >
                                    <Image
                                        src={ProductImage}
                                        alt="product information"
                                        fill
                                        style={{objectFit:"cover"}}
                                    />
                                </Box>

                            </CardMedia>
                            <CardContent sx={{
                                maxHeight: "250px"
                            }}>
                                <Stack spacing={"15px"}>
                                    <Typography sx={{ fontWeight: "bold", '&:hover': { cursor: "pointer" } }} onClick={goToProductDetail}>好男人需要時我都在衛生紙(10入)</Typography>
                                    <Typography variant="subtitle2" sx={{ textDecoration: 'line-through' }}>定價NT$1000</Typography>
                                    <Typography>NT$100</Typography>

                                </Stack>
                            </CardContent>
                            <CardActions>
                                <Button variant="outlined" disableRipple onMouseEnter={() => { }}>加入購物車</Button>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}

            </Grid>
        </Box>

    )
}