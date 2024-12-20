import { useCartStore, useCsrfTokenStore, useSubscribeListStore } from "@/store/store"
import { Box, Button, Card, CardActions, CardContent, CardMedia, Grid, IconButton, Stack, Typography } from "@mui/material"
import Image from "next/image"
import { useRouter } from "next/router"

import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import { ChangeEvent, useEffect, useState } from "react";
import { ProductInfomation, ProductInfomationFavorite } from "@/interfaces";
import WithAuth from "@/components/auth/with-auth";
import PurchaseModal from "@/components/products/purchase-modal";
import { ApiResponse } from "@/interfaces/api/response";
import { RespCode } from "@/enums/resp-code";

const SubscribeListPage = () => {
    const router = useRouter()

    const goToProductDetail = (productId: number) => {
        router.push(`/products/${productId}`)
    }

    const addToCart = useCartStore((state) => state.addToCart)

    const subscribeIdList = useSubscribeListStore((state) => state.subscribeIdList())
    const subscribeList = useSubscribeListStore((state) => state.subscribeList)
    const addToList = useSubscribeListStore((state) => state.addToList)
    const removeFromList = useSubscribeListStore((state) => state.removeFromList)


    const handeClickSubscribe = (e: ChangeEvent<HTMLInputElement>, product: ProductInfomation) => {

        if (e.target.checked) {
            addToList(product)
        } else {
            removeFromList(product.productId)
        }
    }


    const [selectProduct, setSelectProduct] = useState<ProductInfomation>(initSelectProduct)

    const [modalOpen, setModalOpen] = useState<boolean>(false)

    const handleModalOpen = () => {
        setModalOpen(true)
    }

    const handleModalClose = () => {
        setSelectProduct(initSelectProduct)
        setModalOpen(false)
    }

    const handleSelectProduct = (product: ProductInfomation) => {
        setSelectProduct(product)
        handleModalOpen()
    }

    const csrfToken = useCsrfTokenStore((state) => state.csrfToken)

    const filterProductVariant = (productId: number) => {

        var variants =subscribeList.find(p => p.productId === productId)?.variants
        return variants || []
    }

    const getLowestPrice = (productId: number) => {
        //const variants =dynamicInfo?.find(p=>p.productId==product.productId)?.variants   as ProductVariant[]
        const priceList = filterProductVariant(productId).map(v => v.price).sort((a, b) => a - b)
        return priceList[0]


    }

    const getHighstPrice = (productId: number) => {
        //const variants =dynamicInfo?.find(p=>p.productId==product.productId)?.variants   as ProductVariant[]
        const priceList = filterProductVariant(productId).map(v => v.price).sort((a, b) => a - b)
        return priceList[priceList.length - 1]


    }


    const getLowestDiscountPrice = (productId: number) => {
        //product: ProductInfomation

        //const variants =dynamicInfo?.find(p=>p.productId==product.productId)?.variants   as ProductVariant[]
        const priceList = filterProductVariant(productId)
            .filter(v => v.discountPrice !== null)
            .map(v => v.discountPrice as number)
            .sort((a, b) => a - b)

        //console.log("priceList:", priceList)
        return priceList[0]

    }



    useEffect(() => {


        const fetchData = async () => {
            try {
                const response = await getFavoriteProductsFromBackend() as ApiResponse<ProductInfomationFavorite[]>;

                if (response.code != RespCode.SUCCESS) {
                    return
                }

                const products = response.data

                console.log("fetch products", products)

                products.forEach(p => {
                    addToList(p.product)
                })

            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        // 去後端找一夏
        if (subscribeList.length === 0) {
            fetchData();
        }



    }, [])


    //加入喜愛名單方法  

    const removeFromFavoriteList =async (product: ProductInfomation) => {
        removeFromList(product.productId)
        console.log("removeFromFavoriteList")
        try {
            // 發送請求更新後端數據
            const response =await removeFromFavoriteListToBackend(product.productId,csrfToken as string)
        } catch (error) {
            // 若請求失敗，回滾狀態
            addToList(product)
        }
    }


    if (subscribeList.length === 0) {
        return <p style={{ textAlign: "center" }}>目前沒有收藏的商品....</p>
    }

    return (
        <Box sx={{ p: 2 }}>
            <h1>
                {router.query.tag && router.query.tag}
                {router.query.kind && router.query.kind}
            </h1>
            <Grid container columns={8} spacing={3}>


                {subscribeList.map((product) => (
                    <Grid item lg={2} md={2} sm={4} xs={4} key={product.productId}>
                        <Card sx={{ boxShadow: "none" }}>
                            <CardMedia onClick={() => { goToProductDetail(product.productId) }} sx={{ '&:hover': { cursor: "pointer" } }}>

                                <Box
                                    sx={{
                                        position: 'relative',
                                        width: '100%',
                                        height: 0,
                                        paddingBottom: '120%', // 这是根据宽高比计算的
                                        overflow: 'hidden',
                                    }}
                                >
                                    <Image
                                        src={product.coverImg}
                                        alt="product information"
                                        fill
                                        style={{ objectFit: "cover" }}
                                    />
                                </Box>

                            </CardMedia>
                            <CardContent sx={{
                                maxHeight: "250px"
                            }}>
                                <Stack spacing={"15px"}>
                                    <Typography sx={{ minHeight: { xs: "48px", sm: "unset" }, fontWeight: "bold", '&:hover': { cursor: "pointer" } }} onClick={() => { goToProductDetail(product.productId) }}>{product.title}</Typography>
                                    {
                                        product.variants.filter(v => v.discountPrice) ?
                                        <Stack direction={"row"} spacing={"15px"}>
                                            <Typography variant="subtitle2" sx={{ textDecoration: 'line-through' }}>定價NT${getHighstPrice(product.productId)}</Typography>
                                            <Typography sx={{ color: "#ef6060" }}>${getLowestDiscountPrice(product.productId)}</Typography>
                                        </Stack>

                                        :
                                        <Stack direction={"row"} spacing={"15px"}>
                                            <Typography variant="subtitle2">定價NT${getLowestPrice(product.productId)}</Typography>
                                        </Stack>
                                    }
                                </Stack>
                            </CardContent>
                            <CardActions >
                                <Button sx={{ flexGrow: 1 }} variant="outlined" onClick={() => { handleSelectProduct(product) }}>加入購物車</Button>

                                <IconButton onClick={() => { removeFromFavoriteList(product) }}>
                                    <DeleteOutlineOutlinedIcon />
                                </IconButton>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}

            </Grid>

            <PurchaseModal
                product={selectProduct}
                handleModalOpen={handleModalOpen}
                handleModalClose={handleModalClose}
                modalOpen={modalOpen}
            />
        </Box>

    )
}


const addToFavoriteListToBackend = async (productId: number) => {
    console.log("productId:", productId)
    const postBody = {
        productId: productId,
    }

    const response = await fetch(`http://localhost:5025/User/AddToFavoriteList`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',  // 設置 Content-Type 為 JSON
        },
        body: JSON.stringify(postBody)  // 將 postBody 轉換為 JSON 字串
    })

    return response.json();
}

const removeFromFavoriteListToBackend = async (productId: number,token:string) => {

    const postBody = {
        productId: productId,
    }


    const apiUrl= process.env.NEXT_PUBLIC_BACKEND_URL
    const response = await fetch(`${apiUrl}/User/RemoveFromFavoriteList`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',  // 設置 Content-Type 為 JSON
            'X-CSRF-Token': token
        },
        body: JSON.stringify(postBody)  // 將 postBody 轉換為 JSON 字串
    })

    return response.json();
}


const getFavoriteProductsFromBackend = async () => {
    const apiUrl= process.env.NEXT_PUBLIC_BACKEND_URL

    const response = await fetch(`${apiUrl}/Product/GetfavoriteList`, {
        method: 'GET',
        credentials: 'include', //就算有加也沒用，在getserverprops 調用 cookie 要自己手動加
    })

    return response.json();
}


export default WithAuth(SubscribeListPage);


const initSelectProduct: ProductInfomation = {
    title: "",
    productId: 0,
    stock: 0,
    price: 0,
    colorDescription: [],
    material: [],
    howToWash: "",
    features: "",
    images: undefined,
    coverImg: undefined,
    variants: []

}


