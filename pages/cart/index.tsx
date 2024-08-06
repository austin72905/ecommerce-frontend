import React, { useState, useContext } from 'react'
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import styled from '@mui/system/styled';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import IconButton from '@mui/material/IconButton';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';



import ProductImage1 from '/public/images/coat1.jpg'
import { useRouter } from 'next/router';
import { useCartStore } from '@/store/store';
import { it } from 'node:test';
import { ProductInfomationCount } from '@/interfaces';
import { Card, CardActions, CardContent, CardMedia, useMediaQuery, useTheme } from '@mui/material';
import Image from 'next/image';
import { DefaultScreenCartContent, SmallScreenViewCartContent } from '@/components/cart/cart-content';

export default function Cart() {

    const router = useRouter();

    const toCheckout = () => {
        router.push("/checkout")
    }

    const cartContent = useCartStore((state) => state.cartContent)

    const removeFromCart = useCartStore((state) => state.removeFromCart)

    const plusProductCount = useCartStore((state) => state.plusProductCount)

    const minusProductCount = useCartStore((state) => state.minusProductCount)

    const countTotalPrice = useCartStore((state) => state.countTotalPrice)


    const addToCheckOutList = () => {
        //setCheckOutContent([...cartContent])
        //setCartContent([])
        toCheckout()
    }

    const theme = useTheme()
    const isSmallScreen: boolean = useMediaQuery(theme.breakpoints.down('sm'))

    // const handleFavoriteChecked=(event: React.ChangeEvent<HTMLInputElement>,product:ProductInfomation)=>{


    //     //是打勾的
    //     if(event.target.checked){
    //       addToCollectionList(product)
    //     }else{
    //       removeFromCollectionList(product.productId)
    //     }
    // }


    return (
        <Container sx={{ border: "0px solid" }} maxWidth='xl'>
            <Grid container columns={8} sx={{ border: "0px solid" }} spacing={3}>
                <Grid item xs={8} sx={{ my: "15px" }}>
                    <Typography variant='h6' sx={{ fontWeight: "bold" }}>購物車</Typography>

                </Grid>
                <Grid item xs={8}>

                    {
                        isSmallScreen ?
                            <SmallScreenViewCartContent
                                cartContent={cartContent}
                                plusProductCount={plusProductCount}
                                minusProductCount={minusProductCount}
                                removeFromCart={removeFromCart}
                            />
                            :
                            <DefaultScreenCartContent
                                cartContent={cartContent}
                                plusProductCount={plusProductCount}
                                minusProductCount={minusProductCount}
                                removeFromCart={removeFromCart}

                            />

                    }


                </Grid>
                <Grid item xs={8}>
                    <Paper sx={{ border: "1px solid #d9d9d9", boxShadow: 'none' }} >

                        <Grid container columns={8}>
                            <Grid item xs={0.5} sm={2} md={3} lg={4} sx={{ borderBottom: "1px solid #d9d9d9" }}></Grid>

                            <Grid item xs={7.5} sm={6} md={5} lg={4} sx={{ borderBottom: "1px solid #d9d9d9" }}>
                                <Stack direction={"row"} justifyContent={"space-between"}>
                                    <Typography sx={{ my: "5px" }}>
                                        目前無使用優惠券
                                    </Typography>
                                    <Typography sx={{ marginRight: "30px", my: "5px", color: "#3E8FB2" }}>
                                        輸入優惠碼
                                    </Typography>
                                </Stack>
                            </Grid>
                            <Grid item  xs={0.5} sm={2} md={3} lg={4} ></Grid>
                            <Grid item  xs={7.5} sm={6} md={5} lg={4} >
                                <Stack sx={{ my: "20px" }} direction={"row"} justifyContent={"space-between"} alignItems={"center"}>
                                    <Stack spacing={"5px"} direction={"row"} justifyContent={"space-between"} alignItems={"center"}>
                                        <Typography >
                                            總金額
                                        </Typography>
                                        <Stack direction={"row"}>
                                            <Typography>
                                                (
                                            </Typography>
                                            <Typography sx={{ color: "red", fontWeight: "bold" }} >
                                                {cartContent.length}
                                            </Typography>
                                            <Typography>
                                                個商品)
                                            </Typography>
                                        </Stack>

                                        <Typography >
                                            :
                                        </Typography>
                                        <Typography variant='h6' sx={{ color: "red", fontWeight: "bold" }} >
                                            ${countTotalPrice()}
                                        </Typography>
                                    </Stack>


                                    <Button onClick={addToCheckOutList} variant='contained' sx={{ marginRight: "30px", my: "5px" }}>
                                        前往結帳
                                    </Button>
                                </Stack>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
            </Grid>
        </Container>

    )
}

export interface ProductData {
    name: string;
    price: number;
}
