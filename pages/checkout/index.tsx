import React, { useState, useEffect, useContext } from 'react'


import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { Button, useMediaQuery, useTheme } from '@mui/material';

import { useAlertMsgStore, useCartStore } from '@/store/store';
import { CheckoutInfomation, RecievePlaceInfo, RecieverInfo } from '@/interfaces';
import { DefaultScreenCartContent, SmallScreenViewCartContent } from '@/components/cart/cart-content';


import WarningMsg from '@/components/checkout/warning-msg';
import { LastConfirm } from '@/components/checkout/last-confirm';
import PaymentAmount from '@/components/checkout/payment-amount';
import CargoWay from '@/components/checkout/cargo-way';
import PaymentWay from '@/components/checkout/payment-way';
import SubscriberInfo from '@/components/checkout/subscriber';
import RecieverInfomation from '@/components/checkout/reciever';
import WithAuth from '@/components/auth/with-auth';
import { useRouter } from 'next/router';
import { ApiResponse } from '@/interfaces/api/response';
import { PaymentRequestData } from '@/interfaces/api/payment-request-data';
import { RespCode } from '@/enums/resp-code';
import { OrderItem, SubmitOrderReq } from '@/interfaces/api/submit-order-req';


const CheckOut = () => {

    const theme = useTheme()
    const isSmallScreen: boolean = useMediaQuery(theme.breakpoints.down('sm'))

    const initCheckoutInfomation: CheckoutInfomation = { productPrice: 0, cargoPrice: 60, titlePrice: 0, payWay: "銀行付款" }

    const [checkoutInfomation, setCheckoutInfomation] = useState<CheckoutInfomation>(initCheckoutInfomation)


    const [orderInfo, setOrderInfo] = useState<RecieverInfo>({ name: "王大明", phoneNumber: "0954678111",email:"" })

    const [recieverInfo, setRecieverInfo] = useState<RecieverInfo>({ name: "王大明", phoneNumber: "0954678111",email:"" })

    const [recieveStoreInfo, setRecieveStoreInfo] = useState<RecievePlaceInfo>({ recieveWay: "UNIMARTC2C", recieveStore: "雅典", recieveAddress: "台中市南區三民西路377號西川一路1號" })


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

        // 切換全家 or 7-11 清空門市地址
        setRecieveStoreInfo(storeInfo => {

            return { recieveAddress:"",recieveStore:"", recieveWay: (e.target as HTMLInputElement).value }
        })

    };

    const cartContent = useCartStore(state => state.cartContent);

    const removeFromCart = useCartStore(state => state.removeFromCart);

    const countTotalPrice = useCartStore(state => state.countTotalPrice);

    const plusProductCount = useCartStore((state) => state.plusProductCount)

    const minusProductCount = useCartStore((state) => state.minusProductCount)


    const setAlertMsg = useAlertMsgStore(state => state.setAlertMsg)


    const router = useRouter()
    useEffect(() => {
        const query = router.query
        const storeName = query.CVSStoreName as string
        const storeAddress = query.CVSAddress as string
        const storeType = query.LogisticsSubType as string

        setRecieveStoreInfo(store => {
            return { 
                recieveWay: storeType?storeType:store.recieveWay, 
                recieveStore: storeName, 
                recieveAddress: storeAddress 
            }
        })
    }, [router.isReady])


    //電子地圖
    const selectShipmentStoreMap = async () => {

        // 創建表單元素
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = 'https://logistics-stage.ecpay.com.tw/Express/map'; // 提交的目標URL

        // 添加表單字段
        const data = {
            MerchantID: "2000933",      // 廠商編號
            MerchantTradeNo: "RK45723",  // 廠商交易編號
            LogisticsType: "CVS",        // 超商取貨
            LogisticsSubType: recieveStoreInfo.recieveWay,  // C2C
            IsCollection: "N",           // N：不代收貨款
            ServerReplyURL: "https://bdec-1-168-26-39.ngrok-free.app/api/shopmap-callback", // 伺服器回調URL
            Device: isSmallScreen?"1":"0"                  // 0：PC（預設值） 1：Mobile
        };

        console.log(data.Device)

        // 將數據轉換為表單輸入
        for (const key in data) {
            if (data.hasOwnProperty(key)) {
                const hiddenField = document.createElement('input');
                hiddenField.type = 'hidden';
                hiddenField.name = key;
                hiddenField.value = data[key as keyof typeof data]; //類型斷言
                form.appendChild(hiddenField);
            }
        }

        // 將表單添加到文檔並提交
        document.body.appendChild(form);
        form.submit();
    }


    //送出訂單
    const submitOrder =async ()=>{

        // 從購物車取出 每個商品的 productId、variantId、count
        const orderItems :OrderItem[]= cartContent.map(productItem=>{
            const item:OrderItem = {
                quantity:productItem.count,
                productId:productItem.product.productId,
                variantId:productItem.selectedVariant?.variantID
            }
            return item
        })

        const req :SubmitOrderReq= {
            shippingFee:60,
            shippingAddress:recieveStoreInfo.recieveAddress,
            receiverName:recieverInfo.name,
            receiverPhone:recieverInfo.phoneNumber,
            items:orderItems
        }


        // 之後提交改成傳遞訂單資訊
        const response = await generateOrder(req) as ApiResponse<PaymentRequestData>;

        if(response.code!==RespCode.SUCCESS || !response.data){
            setAlertMsg("提交訂單失敗，請稍後再試")
            return
        }

        const paymentData: PaymentRequestData={
            recordNo:response.data.recordNo,
            paymentUrl:response.data.paymentUrl,
            payType:response.data.payType,
            amount:response.data.amount,
        }


        goToPayment(paymentData);
        
    }


  
    const generateOrder = async (data: SubmitOrderReq) => {
        console.log("data:",data)
        const response = await fetch("http://localhost:5025/Order/SubmitOrder", {
            method: 'POST',
            credentials:'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })

        return response.json();
    }

    //前往支付頁面
    const goToPayment = (paymentData:PaymentRequestData)=>{
        const url = `${paymentData.paymentUrl}?RecordNo=${paymentData.recordNo}&Amount=${paymentData.amount}&PayType=${paymentData.payType}`
        window.location.href =url
    }



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
                        selectShipmentStoreMap={selectShipmentStoreMap}
                    />

                </Grid>
                {/*付款方式 */}
                <Grid item xs={8}>
                    <PaymentWay />


                </Grid>

                {/*訂購人資訊 */}
                {/* <Grid item xs={8}>

                    <SubscriberInfo
                        orderInfo={orderInfo}
                        handleOrderInfo={handleOrderInfo}
                    />

                </Grid> */}
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
                        <Button variant='contained' onClick={submitOrder}>送出訂單</Button>
                    </Stack>

                </Grid>
            </Grid>


        </Container>

    )
}


export default WithAuth(CheckOut);

