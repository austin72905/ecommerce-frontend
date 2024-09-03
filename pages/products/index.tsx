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
import { ProductInfomation } from "@/interfaces";
import { useAlertMsgStore, useCartStore, userUserInfoStore, useSubscribeListStore } from "@/store/store";

import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import PurchaseModal from "@/components/products/purchase-modal";



export default function ProductsPage({ products }: ProductsPageProps) {

    const router = useRouter()

    const {query,pathname}=router

    const goToProductDetail = (productId: string) => {
        router.push(`/products/${productId}`)
    }

    const addToCart = useCartStore((state) => state.addToCart)

    const subscribeIdList = useSubscribeListStore((state) => state.subscribeIdList())
    const subscribeList = useSubscribeListStore((state) => state.subscribeList)
    const addToList = useSubscribeListStore((state) => state.addToList)
    const removeFromList = useSubscribeListStore((state) => state.removeFromList)

    const userInfo = userUserInfoStore((state) => state.userInfo)


    const handeClickSubscribe = (e: ChangeEvent<HTMLInputElement>, product: ProductInfomation) => {

        if(!userInfo){
            router.push(`/login?redirect=/products?tag=${query.tag}`)
            return
        }

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

   




    return (
        <Box sx={{ p: 2 }}>
            <h1>
                {router.query.tag && router.query.tag}
                {router.query.kind && router.query.kind}
            </h1>
            <Grid container columns={8} spacing={3}>


                {products.map((product) => (
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
                                    <Typography variant="subtitle2" sx={{ textDecoration: 'line-through' }}>定價NT${product.price}</Typography>
                                    <Typography>NT${product.price}</Typography>

                                </Stack>
                            </CardContent>
                            <CardActions>

                                <Button sx={{ flexGrow: 1 }} variant="outlined" onClick={() => { handleSelectProduct(product) }}>加入購物車</Button>

                                <Checkbox checked={subscribeIdList.includes(product.productId)} icon={<FavoriteBorderIcon />} onChange={(e) => { handeClickSubscribe(e, product) }} checkedIcon={<FavoriteIcon sx={{ color: "red" }} />} />
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
    productId: "",
    stock: 0,
    price: 0,
    size: [],
    color: [],
    colorDescription: [],
    material: [],
    howToWash: "",
    features: "",
    images: undefined,
    coverImg: undefined

}

interface ProductsPageProps {
    products: ProductInfomation[]
}

export const getServerSideProps: GetServerSideProps<ProductsPageProps> = async (context) => {

    const products = getProducts();
    return {
        props: {
            products
        }
    }
}