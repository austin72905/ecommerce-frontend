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
import { ProductInfomation, ProductInfomationFavoriate } from "@/interfaces";
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

    const handeClickSubscribe = (e: ChangeEvent<HTMLInputElement>, product: ProductInfomation) => {

        if (!userInfo) {
            setAlertMsg("請先登入")


            timeoutId = setTimeout(() => {
                router.push(`/login?redirect=/products?tag=${query.tag}`)
            }, 1000);
            return
        }

        if (e.target.checked) {
            addToList(product)
        } else {
            removeFromList(product.productId)
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
                                    <Typography variant="subtitle2" sx={{ textDecoration: 'line-through' }}>定價NT${product.product.price}</Typography>
                                    <Typography>NT${product.product.price}</Typography>

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
    variants:[]

}

interface ProductsPageProps {
    products: ProductInfomationFavoriate[]
}


const getProductsFromBackend =async (kind:string,tag:string)=>{

    const query = new URLSearchParams({
        tag:tag,
        kind:kind
    }).toString()

    console.log(query)

    const response = await fetch(`http://localhost:5025/Product/GetProductList?${query}`, {
        method: 'GET',
        credentials:'include',
        
    })

    return response.json();
}

export const getServerSideProps: GetServerSideProps<ProductsPageProps> = async (context) => {
    
    const { params } =context
    let kind = params?.kind;
    let tag = params?.tag;

    if(!tag || typeof tag != "string"){
        tag="new-arrival"
    }

    if(!kind || typeof kind != "string"){
        kind=""
    }

    const response =await getProductsFromBackend(kind,tag) as ApiResponse<ProductInfomationData>

    //console.log(response)
    
    //網路錯誤
    // 可能可以在自定義頁面之類的
    if(response.code != RespCode.SUCCESS){
        return {
            notFound: true
        }
    }
    //console.log("data=",response.data)


    const products = response.data.products

    console.log("products=",products)

    //const products = getProducts();
    return {
        props: {
            products
        }
    }
}

interface ProductInfomationData{
    products:ProductInfomationFavoriate[]
}
