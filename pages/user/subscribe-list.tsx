import { useCartStore, useSubscribeListStore } from "@/store/store"
import { Box, Button, Card, CardActions, CardContent, CardMedia, Grid, Stack, Typography } from "@mui/material"
import Image from "next/image"
import { useRouter } from "next/router"

export default function SubscribeListPage() {
    const router = useRouter()

    const goToProductDetail = (productId: string) => {
        router.push(`/products/${productId}`)
    }

    const addToCart = useCartStore((state) => state.addToCart)

    const subscribeIdList = useSubscribeListStore((state) => state.subscribeIdList())
    const subscribeList = useSubscribeListStore((state) => state.subscribeList)
    const addToList = useSubscribeListStore((state) => state.addToList)
    const removeFromList = useSubscribeListStore((state) => state.removeFromList)

    if(subscribeList.length===0){
        return <p style={{textAlign:"center"}}>目前沒有收藏的商品....</p>
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
                                    <Typography variant="subtitle2" sx={{ textDecoration: 'line-through' }}>定價NT${product.price}</Typography>
                                    <Typography>NT${product.price}</Typography>

                                </Stack>
                            </CardContent>
                            <CardActions >
                                <Stack spacing={1} sx={{ width: "100%" }}>
                                    <Button sx={{ flexGrow: 1 }} variant="outlined" onClick={() => { addToCart(product, 1) }}>加入購物車</Button>
                                    {
                                        subscribeIdList.includes(product.productId) ?
                                            <Button sx={{ flexGrow: 1, backgroundColor: "#EFB878", color: "black" }} variant="contained" onClick={() => { removeFromList(product.productId) }}>取消收藏</Button>
                                            :
                                            <Button sx={{ flexGrow: 1 }} variant="contained" onClick={() => { addToList(product) }}>加入收藏</Button>
                                    }
                                </Stack>

                            </CardActions>
                        </Card>
                    </Grid>
                ))}

            </Grid>
        </Box>

    )
}