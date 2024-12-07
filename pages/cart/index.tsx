import React, { useEffect, useRef } from 'react'
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';



import { useRouter } from 'next/router';
import { useAlertMsgStore, useCartStore, userUserInfoStore } from '@/store/store';
import { ProductInfomationCount } from '@/interfaces';
import { useMediaQuery, useTheme } from '@mui/material';
import { DefaultScreenCartContent, SmallScreenViewCartContent } from '@/components/cart/cart-content';
import { ApiResponse } from '@/interfaces/api/response';
import { RespCode } from '@/enums/resp-code';


export default function Cart() {

    const router = useRouter();

    const toCheckout = () => {
        router.push("/checkout")
    }

    const cartContent = useCartStore((state) => state.cartContent)

    const userInfo = userUserInfoStore((state) => state.userInfo)

    const initializeCart = useCartStore((state) => state.initializeCart)

    const setAlertMsg = useAlertMsgStore((state) => state.setAlertMsg)

    const removeFromCart = useCartStore((state) => state.removeFromCart)

    const plusProductCount = useCartStore((state) => state.plusProductCount)

    const minusProductCount = useCartStore((state) => state.minusProductCount)

    const countTotalPrice = useCartStore((state) => state.countTotalPrice)

    //計時器 
    let timeoutId: ReturnType<typeof setTimeout> | null = null;


    const addToCheckOutList = () => {
        //setCheckOutContent([...cartContent])
        //setCartContent([])


        if (!userInfo) {
            setAlertMsg("請先登入")
            timeoutId = setTimeout(() => {
                router.push(`/login?redirect=/checkout`)
            }, 1000);

            return
        }

        toCheckout()
    }

    //清除計時器 
    useEffect(() => {

        return () => {
            if (timeoutId) {
                clearTimeout(timeoutId)
            }

        }
    }, [])


    // 將本地資料同步到資料庫
    /*
    

    cartContent  取的是它在 useEffect 初次掛載時的值。即使後來更新了 cartContent，這段 useEffect 的返回函數仍會使用其掛載時的 cartContent 值，因為 useEffect 中沒有依賴項。
    
    */


    // 使用 useRef 持續追踪最新的 cartContent
    const cartContentRef = useRef(cartContent);

    // 每次 cartContent 變化時更新 cartContentRef
    useEffect(() => {
        cartContentRef.current = cartContent;
    }, [cartContent]);


    useEffect(() => {

        return () => {
            //console.log("content:cartContent", cartContent) // 確實，會發現cartcontent 會保持初次掛載時拿到的值
            if (userInfo) {

                const mergeCartenthData = async (content: ProductInfomationCount[]) => {
                    try {
                        console.log("合併購物車")
                        const cartItems = content.map(item => {
                            const cartItem: CartItem = {
                                productVariantId: item.selectedVariant?.variantID,
                                quantity: item.count
                            }

                            return cartItem;
                        })
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




                    } catch (error) {
                        console.error('Error fetching data:', error)
                    }
                }




                mergeCartenthData(cartContentRef.current);

            }

        }
    }, [cartContentRef.current])



    const theme = useTheme()
    const isSmallScreen: boolean = useMediaQuery(theme.breakpoints.down('sm'))


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
                    {cartContent.length > 0 &&
                        <Paper sx={{ border: "1px solid #d9d9d9", boxShadow: 'none' }} >

                            <Grid container columns={8}>
                                <Grid item xs={0.5} sm={2} md={3} lg={4} sx={{ borderBottom: "1px solid #d9d9d9" }}></Grid>

                                {/* <Grid item xs={7.5} sm={6} md={5} lg={4} sx={{ borderBottom: "1px solid #d9d9d9"}}>
                                    <Stack direction={"row"} justifyContent={"space-between"}>
                                        <Typography sx={{ my: "5px" }}>
                                            目前無使用優惠券
                                        </Typography>
                                        <Typography sx={{ marginRight: "30px", my: "5px", color: "#3E8FB2" }}>
                                            輸入優惠碼
                                        </Typography>
                                    </Stack>
                                </Grid>
                                <Grid item xs={0.5} sm={2} md={3} lg={4} ></Grid> */}
                                <Grid item xs={7.5} sm={6} md={5} lg={4} >
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
                    }

                </Grid>
            </Grid>
        </Container>

    )
}

export interface ProductData {
    name: string;
    price: number;
}

export interface CartItem {
    productVariantId?: number;
    quantity: number;
}

export interface Cart {
    items: CartItem[];
    isCover?: boolean;
}

//後端請求
export const mergeCartContent = async (data: Cart) => {
    const apiUrl= process.env.NEXT_PUBLIC_BACKEND_URL

    const response = await fetch(`${apiUrl}/Cart/MergeCartContent`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })

    return response.json();
}


