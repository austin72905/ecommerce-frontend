import React, { useState, useEffect, useContext, useRef } from 'react'


import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { Button, Paper, SwipeableDrawer, useMediaQuery, useTheme } from '@mui/material';

import { useAlertMsgStore, useCartStore, useCsrfTokenStore, userUserInfoStore } from '@/store/store';
import { CheckoutInfomation, ProductInfomationCount, RecievePlaceInfo, RecieverInfo, UserShipAddress } from '@/interfaces';
import { DefaultScreenCartContent, SmallScreenViewCartContent } from '@/components/cart/cart-content';


import WarningMsg from '@/components/checkout/warning-msg';
import { LastConfirm } from '@/components/checkout/last-confirm';
import PaymentAmount from '@/components/checkout/payment-amount';
import CargoWay from '@/components/checkout/cargo-way';
import PaymentWay from '@/components/checkout/payment-way';
import RecieverInfomation from '@/components/checkout/reciever';
import WithAuth from '@/components/auth/with-auth';
import { useRouter } from 'next/router';
import { ApiResponse } from '@/interfaces/api/response';
import { PaymentRequestData } from '@/interfaces/api/payment-request-data';
import { RespCode } from '@/enums/resp-code';
import { OrderItem, SubmitOrderReq } from '@/interfaces/api/submit-order-req';
import { GridContainer } from '@/components/ui/grid-container';
import { Cart, CartItem, mergeCartContent } from '../cart';


const CheckOut = () => {

    const csrfToken = useCsrfTokenStore((state) => state.csrfToken)
    const userInfo = userUserInfoStore((state) => state.userInfo)
    const theme = useTheme()
    const isSmallScreen: boolean = useMediaQuery(theme.breakpoints.down('sm'))

    const initCheckoutInfomation: CheckoutInfomation = { productPrice: 0, cargoPrice: 60, totalPrice: 0, payWay: "綠界支付" }

    const [checkoutInfomation, setCheckoutInfomation] = useState<CheckoutInfomation>(initCheckoutInfomation)


    const [orderInfo, setOrderInfo] = useState<RecieverInfo>({ name: "王大明", phoneNumber: "0954678111", email: "" })

    const [recieverInfo, setRecieverInfo] = useState<RecieverInfo>({ name: userInfo?.name ? userInfo.name : "", phoneNumber: userInfo?.phoneNumber ? userInfo.phoneNumber : "", email: userInfo ? userInfo.email : "" })

    const [recieveStoreInfo, setRecieveStoreInfo] = useState<RecievePlaceInfo>({ recieveWay: "UNIMARTC2C", recieveStore: "雅典", recieveAddress: "台中市南區三民西路377號西川一路1號" })

    const [userShippingAddress, setuserShippingAddress] = useState<UserShipAddress[]>([])

    const [addressDrawer, setaddressDrawer] = useState(false)
    useEffect(() => {
        console.log("userShippingAddress:", userShippingAddress)

    }, [userShippingAddress])

    const handleAddressDrawerOpen = () => {
        setaddressDrawer(true)
    }

    const handleAddressDrawerClose = () => {
        setaddressDrawer(false)
    }

    const selectShippingAddress = (addressInfo: UserShipAddress) => {
        setRecieveStoreInfo(info => {
            return {
                ...info,
                recieveWay: addressInfo.recieveWay,
                recieveStore: addressInfo.recieveStore,
                recieveAddress: addressInfo.addressLine
            }
        })

        setRecieverInfo(info => {
            return {
                ...info,
                name: addressInfo.recipientName,
                phoneNumber: addressInfo.phoneNumber
            }
        })
        handleAddressDrawerClose()
    }


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

            return { recieveAddress: "", recieveStore: "", recieveWay: (e.target as HTMLInputElement).value }
        })

    };

    const cartContent = useCartStore(state => state.cartContent);

    const removeFromCart = useCartStore(state => state.removeFromCart);

    const countTotalPrice = useCartStore(state => state.countTotalPrice);

    const plusProductCount = useCartStore((state) => state.plusProductCount)

    const minusProductCount = useCartStore((state) => state.minusProductCount)

    const initializeCart = useCartStore(state => state.initializeCart);


    const setAlertMsg = useAlertMsgStore(state => state.setAlertMsg)


    const router = useRouter()

    useEffect(() => {
        if (!router.isReady) return;

        const query = router.query
        const storeName = query.CVSStoreName as string
        const storeAddress = query.CVSAddress as string
        const storeType = query.LogisticsSubType as string

        // 沒有 querystring
        if (Object.keys(router.query).length === 0) {
            const fetchData = async () => {
                try {
                    const result = await getUserShippingAddress() as ApiResponse;
                    console.log("getUserShippingAddress result=", result)


                    if (result.code != RespCode.SUCCESS) {

                        console.log("獲取數據失敗")
                        return;
                    }


                    if (result.data == null) {
                        console.log("獲取數據失敗")
                        return;
                    }


                    const data = result.data as UserShipAddress[]

                    console.log("data:", data)

                    // 如果一個常用地址都沒有就跳過了
                    if (data.length > 0) {

                        setuserShippingAddress(data)

                        const isDefaultAddress = data.find(ua => ua.isDefault == true) ? data.find(ua => ua.isDefault == true) as UserShipAddress : data[0] as UserShipAddress

                        setRecieveStoreInfo(info => {
                            return {
                                ...info,
                                recieveWay: isDefaultAddress.recieveWay,
                                recieveStore: isDefaultAddress.recieveStore,
                                recieveAddress: isDefaultAddress.addressLine
                            }
                        })

                    }





                } catch (error) {
                    console.error('Error fetching data:', error)
                }
            }

            fetchData()
        } else {
            setRecieveStoreInfo(store => {
                return {
                    recieveWay: storeType ? storeType : store.recieveWay,
                    recieveStore: storeName,
                    recieveAddress: storeAddress
                }
            })
        }


    }, [router.isReady])


    useEffect(() => {
        console.log("recieveStoreInfo:", recieveStoreInfo)
    }, [recieveStoreInfo])


    //計算總金額
    useEffect(() => {

        let totalPrice = 0
        console.log("cartContent", cartContent)
        cartContent.forEach(cartItem => {
            let price = cartItem.selectedVariant?.discountPrice ? cartItem.selectedVariant?.discountPrice : cartItem.selectedVariant?.price as number
            totalPrice += price * cartItem.count
        })

        setCheckoutInfomation(ch => {
            return { ...ch, totalPrice: totalPrice }
        })

    }, [cartContent])


    // 用 useRef 追蹤是否為初次渲染
    const isFirstRender = useRef(true);

    // 使用 useRef 持續追踪最新的 cartContent
    const cartContentRef = useRef(cartContent);

    // 每次 cartContent 變化時更新 cartContentRef
    useEffect(() => {
        cartContentRef.current = cartContent;
    }, [cartContent]);


    useEffect(() => {

        const mergeCartenthData = async (content: ProductInfomationCount[], isCover: boolean) => {
            try {
                //console.log("content:", content)
                const cartItems = content.map(item => {
                    const cartItem: CartItem = {
                        productVariantId: item.selectedVariant?.variantID,
                        quantity: item.count
                    }

                    return cartItem;
                })
                // 用前端覆蓋後端 的資料庫
                const cart: Cart = {
                    items: cartItems,
                    isCover: true
                }
                const result = await mergeCartContent(cart) as ApiResponse;

                //console.log("mergeCartContent result=", result)

                if (result.code !== RespCode.SUCCESS) {
                    return;
                }

                const data = result.data as ProductInfomationCount[]

                initializeCart(data)


            } catch (error) {
                console.error('Error fetching data:', error)
            }
        }

        // 如果本地沒有數據，去數據庫撈
        if (cartContent.length == 0 && userInfo) {
            mergeCartenthData(cartContent, false)

        }

        return () => {
            // 如果是第一次渲染，跳過 fetchData 的執行
            if (isFirstRender.current && userInfo !== null) {
                isFirstRender.current = false;
                return;
            }
            //console.log("content:cartContent", cartContent) // 確實，會發現cartcontent 會保持初次掛載時拿到的值
            if (userInfo) {
                mergeCartenthData(cartContentRef.current, true);

            }

        }
    }, [])





    //電子地圖
    const selectShipmentStoreMap = async () => {

        // 創建表單元素
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = 'https://logistics-stage.ecpay.com.tw/Express/map'; // 提交的目標URL


        const replyUrl = process.env.NEXT_PUBLIC_MAP_RETURN_URL

        // 添加表單字段
        const data = {
            MerchantID: "2000933",      // 廠商編號
            MerchantTradeNo: "RK45723",  // 廠商交易編號
            LogisticsType: "CVS",        // 超商取貨
            LogisticsSubType: recieveStoreInfo.recieveWay,  // C2C
            IsCollection: "N",           // N：不代收貨款
            ServerReplyURL: `${replyUrl}/api/shopmap-callback`, // 伺服器回調URL
            Device: isSmallScreen ? "1" : "0"                  // 0：PC（預設值） 1：Mobile
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
    const submitOrder = async () => {



        // 從購物車取出 每個商品的 productId、variantId、count
        const orderItems: OrderItem[] = cartContent.map(productItem => {
            const item: OrderItem = {
                quantity: productItem.count,
                productId: productItem.product.productId,
                variantId: productItem.selectedVariant?.variantID
            }
            return item
        })

        const req: SubmitOrderReq = {
            shippingFee: 60,
            shippingAddress: recieveStoreInfo.recieveAddress,
            receiverName: recieverInfo.name,
            receiverPhone: recieverInfo.phoneNumber,
            recieveStore: recieveStoreInfo.recieveStore,
            recieveWay: recieveStoreInfo.recieveWay,
            email: userInfo?.email,
            items: orderItems
        }


        // 之後提交改成傳遞訂單資訊
        const response = await generateOrder(req, csrfToken as string) as ApiResponse<PaymentRequestData>;

        if (response.code !== RespCode.SUCCESS || !response.data) {
            setAlertMsg("提交訂單失敗，請稍後再試")
            return
        }

        const paymentData: PaymentRequestData = {
            recordNo: response.data.recordNo,
            paymentUrl: response.data.paymentUrl,
            payType: response.data.payType,
            amount: response.data.amount,
        }

        // 清除購物車
        // 確保在提交訂單前，同步購物車內容
        try {

            // 用前端覆蓋後端 的資料庫
            const cart: Cart = {
                items: [],
                isCover: true
            }
            initializeCart([])
            await mergeCartContent(cart);

        } catch (error) {
            console.error('Error merging cart content before submitting order:', error);
        }




        goToPayment(paymentData);

    }



    const generateOrder = async (data: SubmitOrderReq, token: string) => {

        const apiUrl = process.env.NEXT_PUBLIC_BACKEND_URL

        console.log("data:", data)
        console.log("token:", token)
        const response = await fetch(`${apiUrl}/Order/SubmitOrder`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-Token': token
            },
            body: JSON.stringify(data)

        })

        return response.json();
    }

    //前往支付頁面
    const goToPayment = (paymentData: PaymentRequestData) => {
        const url = `${paymentData.paymentUrl}?RecordNo=${paymentData.recordNo}&Amount=${paymentData.amount}&PayType=${paymentData.payType}`
        window.location.href = url
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
                        handleAddressDrawerOpen={handleAddressDrawerOpen}
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

            <SwipeableDrawer
                anchor="bottom"
                open={addressDrawer}
                onClose={handleAddressDrawerClose}
                onOpen={handleAddressDrawerOpen}
            >
                <Container>
                    {userShippingAddress.map((content, index) => (
                        <Paper sx={{ boxShadow: "none", mx: 1 }} key={content.addressId}>
                            <Grid container columns={12} sx={{ p: 4 }} >
                                <Grid item xs={12} sm={9} md={9} >
                                    <Grid container columns={12} spacing={1}>

                                        <Grid item xs={12}>
                                            <GridContainer
                                                xs={5} sm={2}
                                                columns={12}
                                                title={<Typography sx={{ minWidth: "30px" }} variant='subtitle2' >收件人</Typography>}
                                                content={
                                                    <Typography sx={{ minWidth: "30px" }} variant='subtitle2'  >{content.recipientName}</Typography>
                                                }
                                            />
                                        </Grid>

                                        <Grid item xs={12}>
                                            <GridContainer
                                                xs={5} sm={2}
                                                columns={12}
                                                title={<Typography sx={{ minWidth: "30px" }} variant='subtitle2' >連絡電話</Typography>}
                                                content={
                                                    <Typography sx={{ minWidth: "30px" }} variant='subtitle2'  >{content.phoneNumber}</Typography>
                                                }
                                            />
                                        </Grid>

                                        <Grid item xs={12}>
                                            <GridContainer
                                                xs={5} sm={2}
                                                columns={12}
                                                title={<Typography sx={{ minWidth: "30px" }} variant='subtitle2' >取件地址</Typography>}
                                                content={
                                                    <Typography sx={{ minWidth: "30px" }} variant='subtitle2'  >{content.addressLine}</Typography>
                                                }
                                            />
                                        </Grid>

                                        <Grid item xs={12}>
                                            <GridContainer
                                                xs={5} sm={2}
                                                columns={12}
                                                title={<Typography sx={{ minWidth: "30px" }} variant='subtitle2' >取件門市</Typography>}
                                                content={
                                                    <Typography sx={{ minWidth: "30px" }} variant='subtitle2'  >{content.recieveStore}</Typography>
                                                }
                                            />
                                        </Grid>

                                        <Grid item xs={12}>
                                            <GridContainer
                                                xs={5} sm={2}
                                                columns={12}
                                                title={<Typography sx={{ minWidth: "30px" }} variant='subtitle2' >取件方式</Typography>}
                                                content={
                                                    <Typography sx={{ minWidth: "30px" }} variant='subtitle2'  >{recieveWayMap.get(content.recieveWay as string)}</Typography>
                                                }
                                            />
                                        </Grid>

                                    </Grid>
                                </Grid>

                                <Grid item xs={12} sm={3} md={3} sx={{ border: "0px solid #d9d9d9" }}>
                                    <Stack sx={{ mt: 5, border: "1px solid #d9d9d9" }}>
                                        <Button onClick={() => { selectShippingAddress(content) }}>選擇</Button>
                                    </Stack>

                                </Grid>



                            </Grid>

                        </Paper>
                    ))}
                </Container>


            </SwipeableDrawer>


        </Container>

    )
}

const recieveWayMap = new Map<string, string>([
    ["UNIMARTC2C", "7-11"],
    ["FAMIC2C", "全家"],
])


// 後端
const getUserShippingAddress = async () => {


    const apiUrl = process.env.NEXT_PUBLIC_BACKEND_URL

    const response = await fetch(`${apiUrl}/User/GetUserShippingAddress`, {
        method: 'GET',
        credentials: 'include',

    })

    return response.json();
}





export default WithAuth(CheckOut);


