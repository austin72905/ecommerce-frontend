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
import { CheckoutInfomation, ProductInfomation, ProductInfomationCount, RecievePlaceInfo, RecieverInfo } from '@/interfaces';
import { DefaultScreenCartContent, SmallScreenViewCartContent } from '@/components/cart/cart-content';
import { GridContainer } from '@/components/ui/grid-container';

import WarningMsg from '@/components/checkout/warning-msg';
import { LastConfirm } from '@/components/checkout/last-confirm';
import PaymentAmount from '@/components/checkout/payment-amount';
import CargoWay from '@/components/checkout/cargo-way';
import PaymentWay from '@/components/checkout/payment-way';
import SubscriberInfo from '@/components/checkout/subscriber';
import RecieverInfomation from '@/components/checkout/reciever';


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

    
    if (cartContent.length <= 0) {
        return <p style={{ textAlign: 'center' }}>購物車內沒有商品....</p>
    }

    return (
        <Container sx={{ border: "0px solid" }} maxWidth='xl'>
            <Grid container columns={8} sx={{ border: "0px solid" }} rowSpacing={5}>
                <Grid item xs={8} sx={{ mt: "15px" }}>
                    <Typography variant='h6' sx={{ fontWeight: "bold" }}>結帳</Typography>
                </Grid>

                <Grid item xs={8} >
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
                {/*商品運送方式 */}
                <Grid item xs={8} >

                    <CargoWay
                        recieveStoreInfo={recieveStoreInfo}
                        handleRecieveWay={handleRecieveWay}
                    />

                </Grid>
                {/*付款方式 */}
                <Grid item xs={8}>
                    <PaymentWay />


                </Grid>

                {/*訂購人資訊 */}
                <Grid item xs={8}>

                    <SubscriberInfo
                        orderInfo={orderInfo}
                        handleOrderInfo={handleOrderInfo}
                    />

                </Grid>
                {/*收件人資訊 */}
                <Grid item xs={8} >

                    <RecieverInfomation
                        recieverInfo={recieverInfo}
                        handleCheckRecieverInfo={handleCheckRecieverInfo}
                        handleRecieverInfo={handleRecieverInfo}
                    />

                </Grid>
                {/*訂單金額 */}
                <Grid item xs={8} >

                    <PaymentAmount
                        checkoutInfomation={checkoutInfomation}
                        countTotalPrice={countTotalPrice}
                    />

                </Grid>
                {/*最後確認 */}
                <Grid item xs={8} >

                    <LastConfirm
                        recieveStoreInfo={recieveStoreInfo}
                        checkoutInfomation={checkoutInfomation}
                        recieverInfo={recieverInfo}
                    />

                </Grid>
                {/*下單須知 */}
                <Grid item xs={8}>
                    <WarningMsg />
                </Grid>
                <Grid item xs={8} >
                    <Stack direction={"row"} justifyContent="end">
                        <Button variant='contained'>送出訂單</Button>
                    </Stack>

                </Grid>
            </Grid>


        </Container>

    )
}




