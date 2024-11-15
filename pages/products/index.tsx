import { useRouter } from "next/router"
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import CardActions from '@mui/material/CardActions';

import { Alert, Box, Button, Checkbox, Stack, Typography } from "@mui/material";
import { ChangeEvent, useEffect, useReducer, useState } from "react";
import Image from "next/image";
import { getProducts } from "@/dummy-data/dummy-data";
import { GetServerSideProps } from "next";
import { ProductInfomation, ProductInfomationFavorite } from "@/interfaces";
import { useAlertMsgStore, useCartStore, userUserInfoStore, useSubscribeListStore } from "@/store/store";

import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import PurchaseModal from "@/components/products/purchase-modal";
import { ApiResponse } from "@/interfaces/api/response";
import { RespCode } from "@/enums/resp-code";



export default function ProductsPage({ products }: ProductsPageProps) {

    const router = useRouter()

    const { query, pathname } = router

    const goToProductDetail = (productId: number) => {
        router.push(`/products/${productId}`)
    }

    const addToCart = useCartStore((state) => state.addToCart)

    const subscribeIdList = useSubscribeListStore((state) => state.subscribeIdList())
    const subscribeList = useSubscribeListStore((state) => state.subscribeList)
    const addToList = useSubscribeListStore((state) => state.addToList)
    const removeFromList = useSubscribeListStore((state) => state.removeFromList)

    const userInfo = userUserInfoStore((state) => state.userInfo)
    const setAlertMsg = useAlertMsgStore((state) => state.setAlertMsg)


    //計時器 
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    const handeClickSubscribe =async (e: ChangeEvent<HTMLInputElement>, product: ProductInfomation) => {
        
        if (!userInfo) {
            setAlertMsg("請先登入")


            timeoutId = setTimeout(() => {
                router.push(`/login?redirect=/products?tag=${query.tag}`)
            }, 1000);
            return
        }

        if (e.target.checked) {
            //addToList(product)
            await addToFavoriteList(product)
        } else {
            //removeFromList(product.productId)
            await removeFromFavoriteList(product)
        }
    }


    //清除計時器
    useEffect(() => {

        return () => {
            if (timeoutId) {
                clearTimeout(timeoutId)
            }
        }
    }, [])

    //將喜愛名單的ID 同步到 subscribeIdList
    useEffect(() => {
        //感覺會有多次渲染的問題 addToList 參數改成 array 會好點?
        console.log("products:",products)
        products.forEach(p => {
            console.log("p.isFavorite:",p.isFavorite)
            if (p.isFavorite) {
                addToList(p.product)
            }
        })
    }, [])

    //加入喜愛名單方法
    const addToFavoriteList = async (product: ProductInfomation) => {

        console.log("addToFavoriteList")

        addToList(product)

        try {
            // 發送請求更新後端數據
            const response =await addToFavoriteListToBackend(product.productId)
        } catch (error) {
            // 若請求失敗，回滾狀態
            removeFromList(product.productId)
        }
    }

    const removeFromFavoriteList =async (product: ProductInfomation) => {
        removeFromList(product.productId)
        console.log("removeFromFavoriteList")
        try {
            // 發送請求更新後端數據
            const response =await removeFromFavoriteListToBackend(product.productId)
        } catch (error) {
            // 若請求失敗，回滾狀態
            addToList(product)
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

    const getLowestPrice = (product: ProductInfomation)=>{
        const priceList=product.variants.map(v=>v.price).sort((a, b) => a - b)
        return priceList[0]
        

    }

    const getHighstPrice = (product: ProductInfomation)=>{
        const priceList=product.variants.map(v=>v.price).sort((a, b) => a - b)
        return priceList[priceList.length-1]
        

    }


    const getLowestDiscountPrice = (product: ProductInfomation)=>{
        const priceList=product.variants
                .filter(v=>v.discountPrice!==null)
                .map(v => v.discountPrice as number)
                .sort((a, b) => a - b)

        console.log("priceList:",priceList)
        return priceList[0]
        
    }


    return (
        <Box sx={{ p: 2 }}>
            <h1>
                {router.query.tag && router.query.tag}
                {router.query.kind && router.query.kind}
            </h1>
            <Grid container columns={8} spacing={3}>


                {products.map((product) => (
                    <Grid item lg={2} md={2} sm={4} xs={4} key={product.product.productId}>
                        <Card sx={{ boxShadow: "none" }}>
                            <CardMedia onClick={() => { goToProductDetail(product.product.productId) }} sx={{ '&:hover': { cursor: "pointer" } }}>

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
                                        src={product.product.coverImg}
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
                                    <Typography sx={{ minHeight: { xs: "48px", sm: "unset" }, fontWeight: "bold", '&:hover': { cursor: "pointer" } }} onClick={() => { goToProductDetail(product.product.productId) }}>{product.product.title}</Typography>
                                    {
                                        product.product.variants.filter(v=>v.discountPrice) ?
                                            <Stack direction={"row"} spacing={"15px"}>
                                                <Typography variant="subtitle2" sx={{ textDecoration: 'line-through' }}>定價NT${getHighstPrice(product.product)}</Typography>
                                                <Typography sx={{ color: "#ef6060" }}>${getLowestDiscountPrice(product.product)}</Typography>
                                            </Stack>

                                            :
                                            <Stack direction={"row"} spacing={"15px"}>
                                                <Typography variant="subtitle2">定價NT${getLowestPrice(product.product)}</Typography>
                                            </Stack>

                                    }



                                </Stack>
                            </CardContent>
                            <CardActions>

                                <Button sx={{ flexGrow: 1 }} variant="outlined" onClick={() => { handleSelectProduct(product.product) }}>加入購物車</Button>

                                <Checkbox checked={subscribeIdList.includes(product.product.productId)} icon={<FavoriteBorderIcon />} onChange={(e) => { handeClickSubscribe(e, product.product) }} checkedIcon={<FavoriteIcon sx={{ color: "red" }} />} />
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

interface ProductsPageProps {
    products: ProductInfomationFavorite[]
}


const addToFavoriteListToBackend = async (productId: number) => {
    console.log("productId:",productId)
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

const removeFromFavoriteListToBackend = async (productId: number) => {

    const postBody = {
        productId: productId,
    }



    const response = await fetch(`http://localhost:5025/User/RemoveFromFavoriteList`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',  // 設置 Content-Type 為 JSON
        },
        body: JSON.stringify(postBody)  // 將 postBody 轉換為 JSON 字串
    })

    return response.json();
}


const getProductsFromBackend = async (kind: string, tag: string, cookieHeader?: string) => {

    const query = new URLSearchParams({
        tag: tag,
        kind: kind
    }).toString()

    console.log(query)

    const response = await fetch(`http://localhost:5025/Product/GetProductList?${query}`, {
        method: 'GET',
        credentials: 'include', //就算有加也沒用，在getserverprops 調用 cookie 要自己手動加
        headers: cookieHeader ? { 'Cookie': cookieHeader } : {}
    })

    return response.json();
}

//
export const getServerSideProps: GetServerSideProps<ProductsPageProps> = async (context) => {


    const {req } =context
    // querystring
    const { query } = context
    let kind = query?.kind;
    let tag = query?.tag;

    console.log("tag =", tag)
    console.log("kind =", kind)

    // 當沒有tag 時，預設 返回新品
    if (!tag || typeof tag != "string") {
        tag = "new-arrival"
    }

    if (!kind || typeof kind != "string") {
        kind = "clothes"
    }


    // 將 cookies 從請求中提取並傳遞給後端請求
    const cookieHeader = req.headers.cookie || '';

    const response = await getProductsFromBackend(kind, tag,cookieHeader) as ApiResponse<ProductInfomationFavorite[]>

    //console.log(response)

    //網路錯誤
    // 可能可以在自定義頁面之類的
    if (response.code != RespCode.SUCCESS) {
        return {
            notFound: true
        }
    }
    //console.log("data=",response.data)


    const products = response.data

    console.log("products=", products)

    //const products = getProducts();
    return {
        props: {
            products
        }
    }
}

interface ProductInfomationData {
    products: ProductInfomationFavorite[]
}
