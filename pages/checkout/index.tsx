import React, { useState, useEffect, useContext } from 'react'
//import { CartContext } from '../../contextStore/context'
//import { ProductInfomationCount } from '../cart/Cart'

import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import styled from '@mui/system/styled';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import { Button, useMediaQuery, useTheme } from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';

import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';

import ProductImage from '../../assets/朋朋衛生紙商品圖.jpg'
import { useCartStore } from '@/store/store';
import { ProductInfomation, ProductInfomationCount } from '@/interfaces';
import { DefaultScreenCartContent, SmallScreenViewCartContent } from '@/components/cart/cart-content';
import { GridContainer } from '@/components/ui/grid-container';


export default function CheckOut() {

    const theme = useTheme()
    const isSmallScreen: boolean = useMediaQuery(theme.breakpoints.down('sm'))

    const initCheckoutInfomation: CheckoutInfomation = { productPrice: 0, cargoPrice: 0, titlePrice: 0, payWay: "銀行付款" }

    const [checkoutInfomation, setCheckoutInfomation] = useState<CheckoutInfomation>(initCheckoutInfomation)


    const [orderInfo, setOrderInfo] = useState<RecieverInfo>({ name: "王大明", phoneNumber: "0954678111", mail: "LaoD@gmail.com" })

    const [recieverInfo, setRecieverInfo] = useState<RecieverInfo>({ name: "", phoneNumber: "", mail: "" })

    const [recieveStoreInfo, setRecieveStoreInfo] = useState<RecievePlaceInfo>({ recieveWay: "7-11", recieveStore: "雅典", recieveAddress: "台中市南區三民西路377號西川一路1號" })


    const handleOrderInfo = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {


        setOrderInfo(o => {

            let newO: RecieverInfo = { ...o }

            Object.getOwnPropertyNames(o).forEach(ele => {
                if (ele === e.target.name) {
                    newO[e.target.name as keyof RecieverInfo] = e.target.value
                }
            })
            return newO
        })
    }

    const handleRecieverInfo = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setRecieverInfo(o => {

            let newO: RecieverInfo = { ...o }

            Object.getOwnPropertyNames(o).forEach(ele => {
                if (ele === e.target.name) {
                    newO[e.target.name as keyof RecieverInfo] = e.target.value
                }
            })
            return newO
        })
    }

    const handleCheckRecieverInfo = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setRecieverInfo({ ...orderInfo })
        } else {
            setRecieverInfo({ ...recieverInfo })
        }
    }

    const handleRecieveWay = (e: React.ChangeEvent<HTMLInputElement>) => {


        setRecieveStoreInfo(storeInfo => {

            return { ...storeInfo, recieveWay: (e.target as HTMLInputElement).value }
        })

    };

    const cartContent = useCartStore(state => state.cartContent);

    const removeFromCart = useCartStore(state => state.removeFromCart);

    const countTotalPrice = useCartStore(state => state.countTotalPrice);

    const plusProductCount = useCartStore((state) => state.plusProductCount)

    const minusProductCount = useCartStore((state) => state.minusProductCount)


    return (
        <Container sx={{ border: "0px solid" }} maxWidth='xl'>
            <Grid container columns={8} sx={{ border: "0px solid" }} spacing={3}>
                <Grid item xs={8} sx={{ mt: "15px" }}>
                    <Typography variant='h6' sx={{ fontWeight: "bold" }}>結帳</Typography>
                </Grid>

                <Grid item xs={8} sx={{ mt: "15px" }} >
                    <Typography variant='body1' sx={{ fontWeight: "bold", mb: "15px" }}>訂單商品內容</Typography>


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

                <Grid item xs={8} sx={{ mt: "15px" }}>
                    <Typography variant='body1' sx={{ fontWeight: "bold" }}>商品運送方式</Typography>

                    <Paper sx={{ mt: "15px", boxShadow: "none", border: "1px solid #d9d9d9" }}>

                        <Grid container columns={8} sx={{ border: "0px solid red" }}>
                            <Grid item xs={8} >
                                <FormControl sx={{ border: "0px solid red", width: "100%" }}>
                                    <RadioGroup value={recieveStoreInfo.recieveWay} onChange={handleRecieveWay} sx={{ mx: "0px", my: "0px", border: "0px solid #d9d9d9" }}>
                                        <FormControlLabel sx={{ backgroundColor: "#d9d9d9", mx: "0px", my: "0px", border: "1px solid #d9d9d9" }} value={"7-11"} control={<Radio sx={{ color: "#D9D9D9" }} />} label="7-11" />
                                        <FormControlLabel sx={{ mx: "0px", my: "0px", border: "1px solid #d9d9d9" }} value={"全家"} control={<Radio sx={{ color: "#D9D9D9" }} />} label="全家" />

                                    </RadioGroup>
                                </FormControl>

                            </Grid>
                        </Grid>

                    </Paper>

                    <Stack direction={"row"} sx={{ my: "5px" }}>
                        <Button variant='contained' sx={{ backgroundColor: "#EFB878", color: "black", "&:hover": { backgroundColor: "#EFB878" } }}>選擇門市</Button>
                    </Stack>

                    <Stack spacing={"5px"} sx={{ mt: "15px" }}>
                        <Stack direction={"row"} spacing={"15px"}>
                            <Typography variant='body2' >門市名稱:</Typography>

                            <Typography variant='body2' >{recieveStoreInfo.recieveStore}</Typography>
                        </Stack>
                        <Stack direction={"row"} spacing={"15px"}>
                            <Typography variant='body2' >門市地址:</Typography>

                            <Typography variant='body2' >{recieveStoreInfo.recieveAddress}</Typography>
                        </Stack>

                    </Stack>


                </Grid>
                <Grid item xs={8} sx={{ mt: "15px" }}>
                    <Typography variant='body1' sx={{ fontWeight: "bold" }}>付款方式</Typography>

                    <Paper sx={{ mt: "15px", boxShadow: "none", border: "1px solid #d9d9d9" }}>

                        <Grid container columns={8} sx={{ border: "0px solid red" }}>
                            <Grid item xs={8} >
                                <FormControl sx={{ width: "100%" }}>
                                    <RadioGroup sx={{ mx: "0px", my: "0px", border: "0px solid #d9d9d9" }}>
                                        <FormControlLabel sx={{ backgroundColor: "#d9d9d9", mx: "0px", my: "0px", border: "1px solid #d9d9d9" }} value={"銀行匯款"} control={<Radio disabled checked sx={{ color: "#D9D9D9" }} />} label="銀行匯款" />


                                    </RadioGroup>
                                </FormControl>
                            </Grid>
                        </Grid>




                    </Paper>

                </Grid>

                <Grid item xs={8} sx={{ mt: "15px" }}>
                    <Typography variant='body1' sx={{ fontWeight: "bold" }}>訂購人資訊</Typography>

                    <Paper sx={{ mt: "15px", boxShadow: "none", border: "1px solid #d9d9d9" }}>

                        <Stack sx={{ m: "30px" }} direction={"row"} spacing={"10px"} alignItems={"center"}>
                            <Typography sx={{ mr: "10px", minWidth: "30px" }} variant='caption' >姓名</Typography>
                            <TextField value={orderInfo.name} name="name" onChange={handleOrderInfo} placeholder='不得包含特殊符號 / $ . @ & # @...' inputProps={{ sx: { height: "15px" } }} sx={{ marginTop: "10px" }} size='small' fullWidth />
                        </Stack>
                        <Stack sx={{ m: "30px" }} direction={"row"} spacing={"10px"} alignItems={"center"}>
                            <Typography sx={{ mr: "10px", minWidth: "30px" }} variant='caption' >電話</Typography>
                            <TextField value={orderInfo.phoneNumber} name="phoneNumber" onChange={handleOrderInfo} placeholder='ex: 09xxxxxxxx' inputProps={{ sx: { height: "15px" } }} sx={{ marginTop: "10px" }} size='small' fullWidth />
                        </Stack>
                        <Stack sx={{ m: "30px" }} direction={"row"} spacing={"10px"} alignItems={"center"}>
                            <Typography sx={{ mr: "10px", minWidth: "30px" }} variant='caption' >信箱</Typography>
                            <TextField value={orderInfo.mail} name="mail" onChange={handleOrderInfo} placeholder='ex: asbc@gmail.com' inputProps={{ sx: { height: "15px" } }} sx={{ my: "10px" }} size='small' fullWidth />
                        </Stack>


                    </Paper>

                </Grid>
                <Grid item xs={8} sx={{ mt: "15px" }}>
                    <Typography variant='body1' sx={{ fontWeight: "bold" }}>收件人資訊</Typography>

                    <Paper sx={{ mt: "15px", boxShadow: "none", border: "1px solid #d9d9d9" }}>
                        <Stack sx={{ m: "30px" }} direction={"row"} spacing={"10px"} alignItems={"center"}>
                            <FormControlLabel control={<Checkbox onChange={handleCheckRecieverInfo} />} label="同訂購人資訊" />
                        </Stack>

                        <Stack sx={{ m: "30px" }} direction={"row"} spacing={"10px"} alignItems={"center"}>
                            <Typography sx={{ mr: "10px", minWidth: "30px" }} variant='caption' >姓名</Typography>
                            <TextField value={recieverInfo.name} name="name" onChange={handleRecieverInfo} placeholder='不得包含特殊符號 / $ . @ & # @...' inputProps={{ sx: { height: "15px" } }} sx={{ marginTop: "10px" }} size='small' fullWidth />
                        </Stack>
                        <Stack sx={{ m: "30px" }} direction={"row"} spacing={"10px"} alignItems={"center"}>
                            <Typography sx={{ mr: "10px", minWidth: "30px" }} variant='caption' >電話</Typography>
                            <TextField value={recieverInfo.phoneNumber} name="phoneNumber" onChange={handleRecieverInfo} placeholder='ex: 09xxxxxxxx' inputProps={{ sx: { height: "15px" } }} sx={{ marginTop: "10px" }} size='small' fullWidth />
                        </Stack>
                        <Stack sx={{ m: "30px" }} direction={"row"} spacing={"10px"} alignItems={"center"}>
                            <Typography sx={{ mr: "10px", minWidth: "30px" }} variant='caption' >信箱</Typography>
                            <TextField value={recieverInfo.mail} name="mail" onChange={handleRecieverInfo} placeholder='ex: asbc@gmail.com' inputProps={{ sx: { height: "15px" } }} sx={{ my: "10px" }} size='small' fullWidth />
                        </Stack>


                    </Paper>

                </Grid>

                <Grid item xs={8} sx={{ mt: "15px" }}>
                    <Typography variant='body1' sx={{ fontWeight: "bold" }}>訂單金額</Typography>


                    <Paper sx={{ mt: "15px", boxShadow: "none", border: "1px solid #d9d9d9" }}>


                        <Stack sx={{ p: "30px" }} spacing={"30px"}>
                            <GridContainer
                                title={<Typography >商品金額</Typography>}
                                content={<Typography  >${countTotalPrice()}</Typography>}
                                columns={12}
                                xs={4}
                                sm={3}
                                md={2}
                            />

                            <GridContainer
                                title={<Typography >運費</Typography>}
                                content={<Typography >${checkoutInfomation.cargoPrice}</Typography>}
                                columns={12}
                                xs={4}
                                sm={3}
                                md={2}
                            />

                            <GridContainer
                                title={<Typography >總計</Typography>}
                                content={<Typography sx={{ color: "red" }}  >${countTotalPrice()}</Typography>}
                                columns={12}
                                xs={4}
                                sm={3}
                                md={2}
                            />

                            <GridContainer
                                title={<Typography >付款方式</Typography>}
                                content={ <Typography>{checkoutInfomation.payWay}</Typography>}
                                columns={12}
                                xs={4}
                                sm={3}
                                md={2}
                            />
                        </Stack>
                    </Paper>


                </Grid>

                <Grid item xs={8} sx={{ mt: "15px" }}>
                    <Typography variant='body1' sx={{ fontWeight: "bold" }}>最後確認</Typography>

                    <Paper sx={{ mt: "15px", boxShadow: "none", border: "1px solid #d9d9d9" }}>



                    <Stack sx={{ p: "30px" }} spacing={"30px"}>
                            <GridContainer
                                title={<Typography   >寄送方式</Typography>}
                                content={<Typography  >{recieveStoreInfo.recieveWay}取貨</Typography>}
                                columns={12}
                                xs={4}
                                sm={3}
                                md={2}
                            />

                            <GridContainer
                                title={<Typography  >付款方式</Typography>}
                                content={<Typography >{checkoutInfomation.payWay}</Typography>}
                                columns={12}
                                xs={4}
                                sm={3}
                                md={2}
                            />

                            <GridContainer
                                title={<Typography  >收件人</Typography>}
                                content={<Typography >{recieverInfo.name}</Typography>}
                                columns={12}
                                xs={4}
                                sm={3}
                                md={2}
                            />

                            <GridContainer
                                title={ <Typography  >連絡電話</Typography>}
                                content={  <Typography  >{recieverInfo.phoneNumber}</Typography>}
                                columns={12}
                                xs={4}
                                sm={3}
                                md={2}
                            />
                             <GridContainer
                                title={ <Typography >信箱</Typography>}
                                content={ <Typography>{recieverInfo.mail}</Typography>}
                                columns={12}
                                xs={4}
                                sm={3}
                                md={2}
                            />
                             <GridContainer
                                title={  <Typography  >取件地址</Typography>}
                                content={ <Typography  >{recieveStoreInfo.recieveStore}門市-{recieveStoreInfo.recieveAddress}</Typography>}
                                columns={12}
                                xs={4}
                                sm={3}
                                md={2}
                            />
                             <GridContainer
                                title={ <Typography>總付款金額</Typography>}
                                content={  <Typography sx={{ color: "red" }}  >${checkoutInfomation.titlePrice}</Typography>}
                                columns={12}
                                xs={4}
                                sm={3}
                                md={2}
                            />
                        </Stack>

                    </Paper>

                </Grid>
                <Grid item xs={8} sx={{ mt: "15px" }}>
                    <Typography variant='body1' sx={{ fontWeight: "bold" }}>下單須知</Typography>

                    <Paper sx={{ mt: "15px", boxShadow: "none", border: "1px solid #d9d9d9" }}>
                        <Typography sx={{ p: "30px" }}>
                            購買後5天內須要付款，未付款視為取消訂單，付款後會儘快出貨，商品物流情況詳情請在訂單查詢頁面追蹤
                        </Typography>

                    </Paper>

                </Grid>
                <Grid item xs={8} sx={{ mt: "15px" }}>
                    <Stack direction={"row"} justifyContent="end">
                        <Button variant='contained'>送出訂單</Button>
                    </Stack>

                </Grid>
            </Grid>


        </Container>

    )
}



type CheckoutInfomation = {
    productPrice: number;
    cargoPrice: number;
    titlePrice: number;
    payWay: string;
}

interface ProductData {
    name: string;
    price: number;
}

interface RecieverInfo {
    name: string;
    phoneNumber: string;
    mail: string;
}

interface RecievePlaceInfo {
    recieveWay: string;
    recieveStore: string;
    recieveAddress: string;
}
