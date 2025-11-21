import { useRouter } from "next/router"
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import CardActions from '@mui/material/CardActions';

import { Box, Button, Checkbox, Stack, Typography, Chip, alpha, IconButton, useTheme, useMediaQuery } from "@mui/material";
import { ChangeEvent, useEffect, useReducer, useState } from "react";
import Image from "next/image";
import { ProductBasic, ProductDynamic, ProductInfomation, ProductInfomationFavorite, ProductVariant } from "@/interfaces";
import { useAlertMsgStore, useCartStore, useCsrfTokenStore, userUserInfoStore, useSubscribeListStore } from "@/store/store";

import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import VisibilityIcon from '@mui/icons-material/Visibility';
import StarIcon from '@mui/icons-material/Star';
import PurchaseModal from "@/components/products/purchase-modal";
import { ApiResponse } from "@/interfaces/api/response";
import { RespCode } from "@/enums/resp-code";
import { pageTitleMap } from "@/constant-value/page-title-map";

export default function ProductsPage() {
    //console.log("products=",products)
    const router = useRouter()
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down('md')) // md 以下視為手機版

    const { query, pathname } = router
    const [products, setProducts] = useState<ProductBasic[]>([])
    const [loading, setLoading] = useState<boolean>(true)

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

    const csrfToken = useCsrfTokenStore((state) => state.csrfToken)

    const [dynamicInfo, setdynamicInfo] = useState<ProductDynamic[]>()
    const [hoveredCard, setHoveredCard] = useState<number | null>(null)

    const filterProductVariant = (productId: number) => {
        console.log("productId=", productId)
        console.log("dynamicInfo=", dynamicInfo)
        var variants = dynamicInfo?.find(p => p.productId === productId)?.variants
        return variants || []
    }

    const filterProductIsVariant = (productId: number) => {
        return dynamicInfo?.find(p => p.productId === productId)?.isFavorite as boolean
    }

    const combineToProductInfo = (basic: ProductBasic) => {
        //const variants =dynamicInfo?.find(p=>p.productId==basic.productId)?.variants   as ProductVariant[]

        const productInfo: ProductInfomation = {
            productId: basic.productId,
            title: basic.title,
            howToWash: basic.howToWash,
            features: basic.features,
            material: basic.material,
            coverImg: basic.coverImg,
            variants: filterProductVariant(basic.productId)
        }

        return productInfo
    }

    const comineToProductInfoFavroiate = (basic: ProductBasic) => {

        const prodoctInfo: ProductInfomationFavorite = {
            product: combineToProductInfo(basic),
            isFavorite: filterProductIsVariant(basic.productId)
        }

        return prodoctInfo
    }

    //計時器 
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    const handeClickSubscribe = async (e: ChangeEvent<HTMLInputElement>, basic: ProductBasic) => {

        if (!userInfo) {
            setAlertMsg("請先登入")

            timeoutId = setTimeout(() => {
                router.push(`/login?redirect=/products?tag=${query.tag}`)
            }, 1000);
            return
        }

        if (e.target.checked) {
            var product = combineToProductInfo(basic)
            await addToFavoriteList(product)
        } else {
            var product = combineToProductInfo(basic)
            await removeFromFavoriteList(product)
        }
    }

    // CSR: 從後端獲取商品列表
    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                let kind = query?.kind as string;
                let tag = query?.tag as string;
                let keyword = query?.query as string;

                // 當沒有tag 時，預設 返回新品
                if (!tag || typeof tag != "string") {
                    if (keyword) {
                        tag = ""
                    } else {
                        tag = "new-arrival"
                    }
                }

                if (!kind || typeof kind != "string") {
                    if (keyword) {
                        kind = ""
                    } else {
                        kind = "clothes"
                    }
                }

                if (typeof keyword != "string") {
                    keyword = ""
                }

                const response = await getProductsBasicInfoFromBackend(kind, tag, keyword) as ApiResponse<ProductBasic[]>

                if (response.code != RespCode.SUCCESS) {
                    console.log("獲取商品列表失敗")
                    setProducts([])
                    setLoading(false)
                    return;
                }

                const productsData = response.data || []
                setProducts(productsData)
                setLoading(false)

            } catch (error) {
                console.error('Error fetching products:', error)
                setProducts([])
                setLoading(false)
            }
        }

        if (router.isReady) {
            fetchProducts()
        }
    }, [router.isReady, query.kind, query.tag, query.query])

    //請求後端獲取variant
    useEffect(() => {
        if (products.length === 0) return;

        let productIdList = products.map(p => p.productId)
        console.log("productIdList=", productIdList)

        const fetchData = async (productIdList: number[]) => {
            try {
                const result = await getProductsDynamicInfoFromBackend(productIdList) as ApiResponse;
                console.log("result=", result)

                if (result.code != RespCode.SUCCESS) {

                    console.log("獲取數據失敗")
                    return;
                }

                if (result.data == null) {
                    console.log("獲取數據失敗")
                    return;
                }

                const data = result.data as ProductDynamic[]

                setdynamicInfo(data);

            } catch (error) {
                console.error('Error fetching data:', error)
            }
        }

        fetchData(productIdList)

    }, [products])

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
        if (dynamicInfo) {

            products.forEach(p => {
                let pro = comineToProductInfoFavroiate(p);
                if (pro.isFavorite) {
                    addToList(pro.product)
                }
            })

        }

    }, [dynamicInfo])

    //加入喜愛名單方法
    const addToFavoriteList = async (product: ProductInfomation) => {

        console.log("addToFavoriteList")

        addToList(product)

        try {
            // 發送請求更新後端數據
            const response = await addToFavoriteListToBackend(product.productId, csrfToken as string)
        } catch (error) {
            // 若請求失敗，回滾狀態
            removeFromList(product.productId)
        }
    }

    const removeFromFavoriteList = async (product: ProductInfomation) => {
        removeFromList(product.productId)
        console.log("removeFromFavoriteList")
        try {
            // 發送請求更新後端數據
            const response = await removeFromFavoriteListToBackend(product.productId, csrfToken as string)
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

    const handleSelectProduct = (basic: ProductBasic) => {
        const product = combineToProductInfo(basic)
        console.log("handleSelectProduct product=", product)
        setSelectProduct(product)
        handleModalOpen()
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

    const hasDiscount = (productId: number) => {
        return filterProductVariant(productId).some(v => v.discountPrice !== null)
    }

    const getDiscountPercentage = (productId: number) => {
        const originalPrice = getHighstPrice(productId)
        const discountPrice = getLowestDiscountPrice(productId)
        if (originalPrice && discountPrice) {
            return Math.round(((originalPrice - discountPrice) / originalPrice) * 100)
        }
        return 0
    }

    // 模擬評分 (實際應該從後端獲取)
    const getProductRating = (productId: number) => {
        // 使用商品ID作為種子，確保評分在服務端和客戶端一致
        const seed = productId % 100;
        return 4.5 + (seed / 100) * 0.5; // 根據商品ID產生固定的 4.5-5.0 評分
    }

    if (loading) {
        return (
            <Box sx={{ p: 3, backgroundColor: 'background.default', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
                <Typography variant="h6" sx={{ color: 'text.secondary' }}>
                    載入中...
                </Typography>
            </Box>
        )
    }

    return (
        <Box sx={{ p: 3, backgroundColor: 'background.default' }}>
            <Box sx={{ mb: 4 }}>
                <Typography 
                    variant="h4" 
                    sx={{ 
                        fontWeight: 700,
                        mb: 1,
                        background: 'linear-gradient(45deg, #2C3E50, #34495E)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        color: 'transparent'
                    }}
                >
                    {!router.query.query && router.query.tag && pageTitleMap.get(router.query.tag as string)}
                    {!router.query.query && router.query.kind && pageTitleMap.get(router.query.kind as string)}
                    {router.query.query && "搜尋結果"}
                </Typography>
                <Typography variant="subtitle1" sx={{ color: 'text.secondary' }}>
                    發現 {products.length} 件精選商品
                </Typography>
            </Box>
            
            {products.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 8 }}>
                    <Typography variant="h6" sx={{ color: 'text.secondary' }}>
                        沒有找到商品
                    </Typography>
                </Box>
            ) : (
                <Grid container columns={8} spacing={3}>
                    {products.map((product) => (
                    <Grid item lg={2} md={2} sm={4} xs={4} key={product.productId}>
                        <Card 
                            onClick={() => {
                                // 手機版：點選整個卡片直接進入詳細頁面
                                if (isMobile) {
                                    goToProductDetail(product.productId);
                                }
                            }}
                            sx={{ 
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                borderRadius: 3,
                                overflow: 'hidden',
                                position: 'relative',
                                background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
                                border: '1px solid rgba(0,0,0,0.05)',
                                transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                                cursor: isMobile ? 'pointer' : 'default',
                                '&:hover': {
                                    transform: isMobile ? 'none' : 'translateY(-12px) scale(1.02)',
                                    boxShadow: isMobile ? 'none' : '0 25px 50px rgba(0,0,0,0.15)',
                                    border: isMobile ? '1px solid rgba(0,0,0,0.05)' : '1px solid rgba(230, 126, 34, 0.3)'
                                },
                                '&:active': {
                                    transform: isMobile ? 'scale(0.98)' : 'none'
                                }
                            }}
                            onMouseEnter={() => {
                                if (!isMobile) {
                                    setHoveredCard(product.productId);
                                }
                            }}
                            onMouseLeave={() => {
                                if (!isMobile) {
                                    setHoveredCard(null);
                                }
                            }}
                        >
                            {/* 折扣標籤 */}
                            {dynamicInfo && hasDiscount(product.productId) && (
                                <Chip
                                    label={`-${getDiscountPercentage(product.productId)}%`}
                                    size="small"
                                    sx={{
                                        position: 'absolute',
                                        top: 12,
                                        left: 12,
                                        zIndex: 2,
                                        backgroundColor: '#E67E22',
                                        color: 'white',
                                        fontWeight: 'bold',
                                        fontSize: '0.75rem'
                                    }}
                                />
                            )}
                            
                            {/* 收藏按鈕 */}
                            <IconButton
                                sx={{
                                    position: 'absolute',
                                    top: 8,
                                    right: 8,
                                    zIndex: 2,
                                    backgroundColor: alpha('#FFFFFF', 0.9),
                                    backdropFilter: 'blur(10px)',
                                    '&:hover': {
                                        backgroundColor: alpha('#FFFFFF', 1),
                                        transform: 'scale(1.1)'
                                    }
                                }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    const fakeEvent = {
                                        target: { checked: !subscribeIdList.includes(product.productId) }
                                    } as ChangeEvent<HTMLInputElement>;
                                    handeClickSubscribe(fakeEvent, product);
                                }}
                            >
                                {subscribeIdList.includes(product.productId) ? 
                                    <FavoriteIcon sx={{ color: '#E67E22', fontSize: '1.2rem' }} /> : 
                                    <FavoriteBorderIcon sx={{ color: '#666', fontSize: '1.2rem' }} />
                                }
                            </IconButton>

                            <CardMedia 
                                onClick={(e) => {
                                    // 桌面版：點選圖片進入詳細頁面
                                    if (!isMobile) {
                                        e.stopPropagation();
                                        goToProductDetail(product.productId);
                                    }
                                    // 手機版：事件會冒泡到 Card，由 Card 的 onClick 處理
                                }} 
                                sx={{ 
                                    '&:hover': { cursor: isMobile ? 'pointer' : "pointer" },
                                    position: 'relative',
                                    overflow: 'hidden'
                                }}
                            >
                                <Box
                                    sx={{
                                        position: 'relative',
                                        width: '100%',
                                        height: 0,
                                        paddingBottom: '120%',
                                        overflow: 'hidden',
                                    }}
                                >
                                    <Image
                                        src={product.coverImg}
                                        alt="product information"
                                        fill
                                        style={{ 
                                            objectFit: "cover",
                                            transition: 'transform 0.4s ease'
                                        }}
                                        priority
                                    />
                                    
                                    {/* 懸停操作按鈕 - 只在桌面版顯示 */}
                                    {!isMobile && (
                                        <Box
                                            sx={{
                                                position: 'absolute',
                                                bottom: 0,
                                                left: 0,
                                                right: 0,
                                                background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
                                                display: 'flex',
                                                justifyContent: 'center',
                                                gap: 1,
                                                p: 2,
                                                opacity: hoveredCard === product.productId ? 1 : 0,
                                                transform: hoveredCard === product.productId ? 'translateY(0)' : 'translateY(20px)',
                                                transition: 'all 0.3s ease'
                                            }}
                                        >
                                        <Button
                                            variant="contained"
                                            size="small"
                                            startIcon={<AddShoppingCartIcon />}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleSelectProduct(product);
                                            }}
                                            sx={{
                                                backgroundColor: '#E67E22',
                                                '&:hover': {
                                                    backgroundColor: '#D35400'
                                                }
                                            }}
                                        >
                                            加入購物車
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            size="small"
                                            startIcon={<VisibilityIcon />}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                goToProductDetail(product.productId);
                                            }}
                                            sx={{
                                                borderColor: 'white',
                                                color: 'white',
                                                '&:hover': {
                                                    borderColor: '#E67E22',
                                                    backgroundColor: alpha('#E67E22', 0.1)
                                                }
                                            }}
                                        >
                                            查看詳情
                                        </Button>
                                        </Box>
                                    )}
                                </Box>
                            </CardMedia>
                            
                            <CardContent sx={{
                                flexGrow: 1,
                                p: 2.5,
                                '&:last-child': { pb: 2.5 }
                            }}>
                                <Stack spacing={1.5}>
                                    <Typography 
                                        variant="h6"
                                        sx={{ 
                                            minHeight: { xs: "48px", sm: "unset" }, 
                                            fontWeight: 600, 
                                            fontSize: '1rem',
                                            lineHeight: 1.4,
                                            color: '#2C3E50',
                                            '&:hover': { 
                                                cursor: isMobile ? 'pointer' : "pointer",
                                                color: isMobile ? '#2C3E50' : '#E67E22'
                                            },
                                            transition: 'color 0.2s ease'
                                        }} 
                                        onClick={(e) => {
                                            // 桌面版：點選標題進入詳細頁面
                                            if (!isMobile) {
                                                e.stopPropagation();
                                                goToProductDetail(product.productId);
                                            }
                                            // 手機版：事件會冒泡到 Card，由 Card 的 onClick 處理
                                        }}
                                    >
                                        {product.title}
                                    </Typography>
                                    
                                    {/* 評分 */}
                                    <Stack direction="row" alignItems="center" spacing={0.5}>
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            {[...Array(5)].map((_, index) => (
                                                <StarIcon
                                                    key={index}
                                                    sx={{
                                                        fontSize: '0.9rem',
                                                        color: index < Math.floor(getProductRating(product.productId)) ? '#FFD700' : '#E0E0E0'
                                                    }}
                                                />
                                            ))}
                                        </Box>
                                        <Typography variant="caption" sx={{ color: 'text.secondary', ml: 0.5 }}>
                                            ({getProductRating(product.productId).toFixed(1)})
                                        </Typography>
                                    </Stack>
                                    
                                    {/* 價格區域 */}
                                    {dynamicInfo == undefined ? (
                                        <Box sx={{ height: 40, display: 'flex', alignItems: 'center' }}>
                                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                                載入中...
                                            </Typography>
                                        </Box>
                                    ) : hasDiscount(product.productId) ? (
                                        <Stack direction="row" alignItems="center" spacing={1.5}>
                                            <Typography 
                                                variant="h6" 
                                                sx={{ 
                                                    color: '#E67E22',
                                                    fontWeight: 700,
                                                    fontSize: '1.1rem'
                                                }}
                                            >
                                                NT${getLowestDiscountPrice(product.productId)}
                                            </Typography>
                                            <Typography 
                                                variant="body2" 
                                                sx={{ 
                                                    textDecoration: 'line-through',
                                                    color: 'text.secondary'
                                                }}
                                            >
                                                NT${getHighstPrice(product.productId)}
                                            </Typography>
                                        </Stack>
                                    ) : (
                                        <Typography 
                                            variant="h6" 
                                            sx={{ 
                                                color: '#2C3E50',
                                                fontWeight: 600,
                                                fontSize: '1.1rem'
                                            }}
                                        >
                                            NT${getLowestPrice(product.productId)}
                                        </Typography>
                                    )}
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>
                    ))}
                </Grid>
            )}

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

const addToFavoriteListToBackend = async (productId: number, token: string) => {
    console.log("productId:", productId)
    const postBody = {
        productId: productId,
    }
    const apiUrl = process.env.NEXT_PUBLIC_BACKEND_URL
    const response = await fetch(`${apiUrl}/User/AddToFavoriteList`, {
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

const removeFromFavoriteListToBackend = async (productId: number, token: string) => {

    const postBody = {
        productId: productId,
    }


    const apiUrl = process.env.NEXT_PUBLIC_BACKEND_URL
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


const getProductsFromBackend = async (kind: string, tag: string, cookieHeader?: string) => {

    const query = new URLSearchParams({
        tag: tag,
        kind: kind
    }).toString()

    console.log(query)
    const apiUrl = process.env.NEXT_PUBLIC_BACKEND_URL
    const response = await fetch(`${apiUrl}/Product/GetProductList?${query}`, {
        method: 'GET',
        credentials: 'include', //就算有加也沒用，在getserverprops 調用 cookie 要自己手動加
        headers: cookieHeader ? { 'Cookie': cookieHeader } : {}
    })

    return response.json();
}






const getProductsBasicInfoFromBackend = async (kind: string, tag: string, keyword?: string) => {

    const query = new URLSearchParams({
        tag: tag,
        kind: kind,
        query: keyword == undefined ? "" : keyword
    }).toString()

    console.log(query)
    const apiUrl = process.env.NEXT_PUBLIC_BACKEND_URL
    const response = await fetch(`${apiUrl}/Product/GetProductBasicInfoList?${query}`, {
        method: 'GET',

    })

    return response.json();
}


const getProductsDynamicInfoFromBackend = async (productIdList: number[]) => {


    const postBody = {
        productIdList: productIdList,
    }


    const apiUrl = process.env.NEXT_PUBLIC_BACKEND_URL
    const response = await fetch(`${apiUrl}/Product/GetProductDynamicInfoList`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',  // 設置 Content-Type 為 JSON
        },
        body: JSON.stringify(postBody)  // 將 postBody 轉換為 JSON 字串
    })

    return response.json();
}


