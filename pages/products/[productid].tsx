import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import styled from '@mui/system/styled'
import Image from "next/image";
import { AppBar, Box, Button, Card, CardContent, CardMedia, Checkbox, Container, Divider, IconButton, List, ListItem, ListItemButton, ListItemText, SpeedDial, SpeedDialIcon, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tabs, TextField, ToggleButton, ToggleButtonGroup, Toolbar, Typography, TypographyOwnProps, useMediaQuery, useTheme, alpha, Chip, Badge } from "@mui/material";
import Grid from '@mui/material/Grid';
import { ChangeEvent, Dispatch, SetStateAction, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next";
import { ProductBasic, ProductDynamic, ProductInfomation, ProductInfomationCount, ProductInfomationFavorite, ProductVariant } from "@/interfaces";
import { useAlertMsgStore, useCartStore, userUserInfoStore, useSubscribeListStore } from "@/store/store";
import { GridContainer } from "@/components/ui/grid-container";
import { ApiResponse } from "@/interfaces/api/response";
import { RespCode } from "@/enums/resp-code";

export default function ProductDetailPage({ product }: ProductDetailPageProps) {

    const [count, setCount] = useState(0);
    const [recommendProducts, setrecommendProducts] = useState<ProductInfomationFavorite[] | null>(null);
    const [dynamicInfo, setdynamicInfo] = useState<ProductDynamic[]>()

    // 請求商品動態數據、庫存、價格等
    useEffect(() => {
        
        const fetchData = async (productId: number) => {
            try {
                const result = await getProductDynamicInfoFromBackend(productId) as ApiResponse;
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

        fetchData(product.productId)

    }, [product])

    const filterProductVariant = (productId: number) => {
        console.log("productId=", productId)
        console.log("dynamicInfo=", dynamicInfo)
        var variants =dynamicInfo?.find(p => p.productId === productId)?.variants
        return variants || []
    }

    const filterProductIsVariant = (productId: number) => {
        return dynamicInfo?.find(p => p.productId === productId)?.isFavorite as boolean
    }

    const combineToProductInfo = (basic: ProductBasic) => {
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

    // 你可能感興趣
    useEffect(() => {

        const fetchData = async () => {
            try {
                const response = await getRecommendationFromBackend(product.productId.toString()) as ApiResponse<ProductInfomationFavorite[]>;

                if (response.code != RespCode.SUCCESS) {
                    return
                }

                const products = response.data
                console.log("fetch products", products)
                setrecommendProducts(products)

            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        if (product) {
            fetchData();
        }

    }, [])

    //從store 取值
    const addToCart = useCartStore((state) => state.addToCart)

    const [activeSlide, setActiveSlide] = useState(0)

    const theme = useTheme()
    const isSmallScreen: boolean = useMediaQuery(theme.breakpoints.down('sm'))
    const settings = {
        dots: true,
        infinite: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        nextArrow: <ModernNextArrow isSmallScreen={isSmallScreen} />,
        prevArrow: <ModernPrevArrow isSmallScreen={isSmallScreen} />,
        beforeChange: (current: any, next: any) => setActiveSlide(next),
        appendDots: (dots: any) => (
            <div style={{
                position: 'absolute',
                bottom: '15px',
                width: '100%',
                display: 'flex',
                justifyContent: 'center'
            }}>
                <ul style={{ 
                    margin: '0px',
                    display: 'flex',
                    gap: '8px',
                    listStyle: 'none',
                    padding: 0
                }}>{dots}</ul>
            </div>
        ),
        customPaging: (i: number) => (
            <div style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 255, 255, 0.5)',
                border: '2px solid rgba(255, 255, 255, 0.8)',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
            }} />
        )
    }

    const settingsYouMayInterested = {
        infinite: true,
        slidesToShow: 3,
        slidesToScroll: 1,
        nextArrow: <ModernNextArrow isSmallScreen={isSmallScreen} />,
        prevArrow: <ModernPrevArrow isSmallScreen={isSmallScreen} />,
        responsive: [
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
        ]
    }

    const [viewValue, setviewValue] = useState<string>("商品介紹")

    const handleView = (e: React.SyntheticEvent, newVal: string) => {
        setviewValue(newVal)
    }

    let sliderRef = useRef<Slider | null>(null)

    const handleSlider = (index: number) => {
        if (sliderRef.current) {
            sliderRef.current.slickGoTo(index)
        }
    }

    const handleLinkClick = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>, id: string) => {
        event.preventDefault()
        const element = document.getElementById(id);
        if (element) {
            const offsetTop = element.getBoundingClientRect().top + window.scrollY;
            const offset = 110

            window.scrollTo({
                top: offsetTop - offset,
                behavior: 'smooth',
            });
        }
    }

    // 需要定義在父組件，因為buttonbar也會用到
    const [selectSize, setSelectSize] = useState("")
    const [selectColor, setSelectColor] = useState("")
    const [itemCount, setItemCount] = useState<number>(1)

    const [showNavBar, setShowNavBar] = useState(false);
    const scrollPosition = useRef(0);

    const handleScroll = () => {
        const currentScrollPos = window.scrollY;

        if (currentScrollPos > 100) {
            setShowNavBar(true);
        } else {
            setShowNavBar(false);
        }
        scrollPosition.current = currentScrollPos;
    };

    //計時器 
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    
    // 監聽scroll，離開頁面時再將監聽去掉
    useEffect(() => {
        const onScroll = () => {
            handleScroll();
        };
        window.addEventListener('scroll', onScroll);
        return () => {
            window.removeEventListener('scroll', onScroll);

            //刪除計時器
            if (timeoutId) {
                clearTimeout(timeoutId)
            }
        };
    }, []);

    const handleScrollTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    }

    const router = useRouter();
    const setAlertMsg = useAlertMsgStore((state) => state.setAlertMsg)

    const goToProductDetail = (productId: number) => {
        router.push(`/products/${productId}`)
    }

    const [selectVariant, setselectVariant] = useState<undefined | ProductVariant>(undefined)

    const addProductToCart = () => {
        // 還未選擇規格
        if(!selectVariant){
            setAlertMsg("尚未選擇顏色與尺寸")
            return
        }

        setAlertMsg("加入購物車成功")
        var productInfo = combineToProductInfo(product)
        addToCart({ ...productInfo }, selectVariant, itemCount)
    }
    
    const userInfo = userUserInfoStore((state) => state.userInfo)
    
    const goToCheckoutDirectly = () => {
        // 還未選擇規格
        if(!selectVariant){
            setAlertMsg("尚未選擇顏色與尺寸")
            return
        }
        var productInfo = combineToProductInfo(product)
        addToCart({ ...productInfo }, selectVariant, itemCount)

        if (!userInfo) {
            setAlertMsg("請先登入")

            timeoutId = setTimeout(() => {
                router.push(`/login?redirect=/checkout`)
            }, 1000);
            return
        } else {
            router.push("/checkout")
        }
    }

    // 模擬評分數據
    const rating = 4.5;
    const reviewCount = 127;

    if (!product) {
        return (
            <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                minHeight: '50vh',
                backgroundColor: 'background.default'
            }}>
                <Typography variant="h6" sx={{ color: 'text.secondary' }}>
                    載入商品資訊中...
                </Typography>
            </Box>
        )
    }

    return (
        <Box sx={{ 
            backgroundColor: 'background.default',
            minHeight: '100vh'
        }}>
            <ModernAnchorNavbar showNavBar={showNavBar} handleLinkClick={handleLinkClick} />

            <ModernBottomBar
                productFavoritate={comineToProductInfoFavroiate(product)}
                addProductToCart={addProductToCart}
                goToCheckoutDirectly={goToCheckoutDirectly}
            />

            <Container maxWidth="xl" sx={{ py: 4 }}>
                <Grid container spacing={4}>
                    {/* 商品圖片區域 */}
                    <Grid item lg={6} md={6} sm={12} xs={12}>
                        <Box sx={{
                            position: 'sticky',
                            top: 100,
                            borderRadius: 3,
                            overflow: 'hidden',
                            backgroundColor: 'white',
                            boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
                            p: 2
                        }}>
                            <Box sx={{ 
                                borderRadius: 2,
                                overflow: 'hidden',
                                position: 'relative'
                            }}>
                                <Slider {...settings} ref={sliderRef}>
                                {product?.images && product?.images.map((img, index) => (
                                        <Box key={index} sx={{ 
                                            position: 'relative', 
                                            width: '100%', 
                                            paddingBottom: '100%',
                                            borderRadius: 2,
                                            overflow: 'hidden'
                                        }}>
                                            <Image 
                                                src={img} 
                                                alt={`商品圖片 ${index + 1}`} 
                                                fill 
                                                priority 
                                                style={{ 
                                                    objectFit: "cover",
                                                    borderRadius: '8px'
                                                }} 
                                            />
                                    </Box>
                                ))}
                            </Slider>

                                {/* 商品標籤 */}
                                <Box sx={{
                                    position: 'absolute',
                                    top: 16,
                                    left: 16,
                                    zIndex: 2
                                }}>
                                    <Chip
                                        label="熱門商品"
                                        size="small"
                                        sx={{
                                            backgroundColor: '#E67E22',
                                            color: 'white',
                                            fontWeight: 'bold',
                                            fontSize: '0.75rem'
                                        }}
                                    />
                        </Box>
                            </Box>
                        </Box>
                </Grid>

                    {/* 商品詳情區域 */}
                    <Grid item lg={6} md={6} sm={12} xs={12}>
                        {dynamicInfo && (
                            <ModernPurchaseDetail
                        productFavorite={comineToProductInfoFavroiate(product)}
                        itemCount={itemCount}
                        selectVariant={selectVariant}
                        setselectVariant={setselectVariant}
                        addToCart={addToCart}
                        goToCheckoutDirectly={goToCheckoutDirectly}
                        setItemCount={setItemCount}
                                rating={rating}
                                reviewCount={reviewCount}
                    />
                        )}
                </Grid>
                        </Grid>

                {/* 商品大圖區 */}
                <Box id="images" sx={{ mt: 8 }}>
                    <ModernSectionTitle title="商品圖片" />
                    <Grid container spacing={2}>
                            {product.images?.map((img, index) => (
                            <Grid item lg={6} md={6} sm={12} xs={12} key={index}>
                                <Box sx={{
                                        position: 'relative',
                                        width: '100%',
                                    paddingBottom: '100%',
                                    borderRadius: 3,
                                        overflow: 'hidden',
                                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                                    transition: 'transform 0.3s ease',
                                    '&:hover': {
                                        transform: 'scale(1.02)'
                                    }
                                }}>
                                    <Image
                                        src={img}
                                        alt={`商品詳細圖片 ${index + 1}`}
                                        fill
                                        style={{ objectFit: "cover" }}
                                    />
                                </Box>
                            </Grid>
                            ))}
                        </Grid>
                </Box>

                {/* 商品介紹 */}
                <Box sx={{ mt: 8 }}>
                    <ModernProductIntroduce
                        productFavoritate={comineToProductInfoFavroiate(product)}
                        id="intro"
                    />
                </Box>

                {/* 尺寸參考 */}
                <Box sx={{ mt: 8 }}>
                    <ModernSectionTitle title="尺寸參考" id="spec" />
                    <ModernSizeTable sizeTable={sizeTable} />
                </Box>

                {/* 注意事項 */}
                <Box sx={{ mt: 8 }}>
                    <ModernSectionTitle title="注意事項" id="notice" />
                    <Box sx={{
                        backgroundColor: 'white',
                        borderRadius: 3,
                        p: 4,
                        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                        border: '1px solid rgba(230, 126, 34, 0.1)'
                    }}>
                        <Typography variant="body1" sx={{ 
                            lineHeight: 1.8,
                            color: 'text.secondary'
                        }}>
                            購買後5天內須要付款，未付款視為取消訂單，付款後會儘快出貨，商品物流情況詳情請在訂單查詢頁面追蹤。
                            <br />
                            商品實際顏色可能因螢幕設定而略有差異，請以實品為準。
                            </Typography>
                    </Box>
                </Box>

                {/* 推薦商品 */}
                <Box sx={{ mt: 8 }}>
                    <ModernSectionTitle title="您可能也會喜歡" />
                    <Box sx={{ mt: 3 }}>
                        <Slider {...settingsYouMayInterested}>
                                    {recommendProducts && recommendProducts.map((p) => (
                                <Box key={p.product.productId} sx={{ px: 1 }}>
                                    <ModernCustomSlide 
                                        productFavorite={p} 
                                        goToProductDetail={goToProductDetail} 
                                    />
                                </Box>
                                    ))}
                                </Slider>
                            </Box>
                </Box>
            </Container>

            {/* 自定義樣式 */}
            <style jsx global>{`
                .slick-dots li button:before {
                    display: none;
                }
                .slick-dots li {
                    margin: 0 4px;
                }
                .slick-dots li div {
                    background-color: rgba(255, 255, 255, 0.5) !important;
                    border: 2px solid rgba(255, 255, 255, 0.8) !important;
                    transition: all 0.3s ease !important;
                }
                .slick-dots li.slick-active div {
                    background-color: #E67E22 !important;
                    border-color: #E67E22 !important;
                    transform: scale(1.2);
                }
            `}</style>
        </Box>
    )
}

// 現代化箭頭組件
function ModernNextArrow(props: any) {
    const { onClick, isSmallScreen } = props;
    return (
        <IconButton
            onClick={onClick}
            sx={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 2,
                backgroundColor: alpha('#FFFFFF', 0.9),
                backdropFilter: 'blur(10px)',
                color: '#2C3E50',
                width: 40,
                height: 40,
                display: isSmallScreen ? 'none' : 'flex',
                transition: 'all 0.3s ease',
                '&:hover': {
                    backgroundColor: '#E67E22',
                    color: 'white',
                    transform: 'translateY(-50%) scale(1.1)'
                }
            }}
        >
            <ArrowForwardIosIcon />
        </IconButton>
    );
}

function ModernPrevArrow(props: any) {
    const { onClick, isSmallScreen } = props;
    return (
        <IconButton
            onClick={onClick}
            sx={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 2,
                backgroundColor: alpha('#FFFFFF', 0.9),
                backdropFilter: 'blur(10px)',
                color: '#2C3E50',
                width: 40,
                height: 40,
                display: isSmallScreen ? 'none' : 'flex',
                transition: 'all 0.3s ease',
                '&:hover': {
                    backgroundColor: '#E67E22',
                    color: 'white',
                    transform: 'translateY(-50%) scale(1.1)'
                }
            }}
        >
            <ArrowBackIosIcon />
        </IconButton>
    );
}

// 現代化區段標題組件
const ModernSectionTitle = ({ title, id }: { title: string; id?: string }) => (
    <Box id={id} sx={{ mb: 3 }}>
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
            {title}
        </Typography>
        <Box sx={{
            height: '3px',
            width: '60px',
            background: 'linear-gradient(90deg, #E67E22, #F39C12)',
            borderRadius: 2
        }} />
    </Box>
);

// 後端
const getRecommendationFromBackend = async (productId: string) => {

    const query = new URLSearchParams({
        productId: productId
    }).toString()

    //console.log(query)
    const apiUrl = process.env.NEXT_PUBLIC_BACKEND_URL
    const response = await fetch(`${apiUrl}/Product/GetRecommendationProduct?${query}`, {
        method: 'GET',
        credentials: 'include',

    })

    return response.json();
}

// const getRecommendationBasicInfoFromBackend = async (productId: string) => {

//     const query = new URLSearchParams({
//         productId: productId
//     }).toString()

//     //console.log(query)
//     const apiUrl = process.env.NEXT_PUBLIC_BACKEND_URL
//     const response = await fetch(`${apiUrl}/Product/GetRecommendationProductBasicInfo?${query}`, {
//         method: 'GET',
//         credentials: 'include',

//     })

//     return response.json();
// }

const getProductInfoFromBackend = async (productId: string) => {

    const query = new URLSearchParams({ productId: productId }).toString()

    console.log(query)

    const apiUrl = process.env.NEXT_PUBLIC_BACKEND_URL

    const response = await fetch(`${apiUrl}/Product/GetProductById?${query}`, {
        method: 'GET',
        credentials: 'include',

    })

    return response.json();
}


const getProductBasicInfoFromBackend = async (productId: number) => {

    const query = new URLSearchParams({
        productId: productId.toString()
    }).toString()

    console.log(query)
    const apiUrl = process.env.NEXT_PUBLIC_BACKEND_URL
    const response = await fetch(`${apiUrl}/Product/GetProductBasicInfoById?${query}`, {
        method: 'GET',

    })

    return response.json();
}

const getProductDynamicInfoFromBackend = async (productId: number) => {

    const postBody = {
        productId: productId,
    }


    const apiUrl = process.env.NEXT_PUBLIC_BACKEND_URL
    const response = await fetch(`${apiUrl}/Product/GetProductDynamicInfo`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',  // 設置 Content-Type 為 JSON
        },
        body: JSON.stringify(postBody)  // 將 postBody 轉換為 JSON 字串
    })

    return response.json();
}

interface RecommendationData {
    products: ProductInfomationFavorite[]
}

interface ProductDetailData {
    product: ProductInfomationFavorite
}

interface ProductDetailPageProps {
    product: ProductBasic
}

export const getServerSideProps: GetServerSideProps<ProductDetailPageProps> = async (context) => {

    const { params } = context

    const productId = params?.productid;

    console.log("productId=", productId)

    if (!productId || typeof productId !== "string") {
        return {
            notFound: true
        }
    }

    // params   segement  看你目錄怎麼定義的

    //const product = getProdcctById(Number(productId))

    const response = await getProductBasicInfoFromBackend(Number(productId)) as ApiResponse<ProductBasic>

    if (response.code != RespCode.SUCCESS) {
        return {
            notFound: true
        }
    }

    const product = response.data

    return {
        props: {
            product
        }
    }
}


interface SizeTableProps {
    sizeTable: SizeTableDetails[]
}

/**
 * 尺寸表
 * @component 
 */
const SizeTable = ({ sizeTable }: SizeTableProps) => {


    return (
        <TableContainer>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell></TableCell>
                        <TableCell>XS</TableCell>
                        <TableCell>S</TableCell>
                        <TableCell>M</TableCell>
                        <TableCell>L</TableCell>
                        <TableCell>XL</TableCell>
                        <TableCell>XXL</TableCell>
                        <TableCell>3L</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {sizeTable.map((row) => (
                        <TableRow key={row.title}>
                            <TableCell>{row.title}</TableCell>
                            <TableCell>{row.size.xs}</TableCell>
                            <TableCell>{row.size.s}</TableCell>
                            <TableCell>{row.size.m}</TableCell>
                            <TableCell>{row.size.l}</TableCell>
                            <TableCell>{row.size.xl}</TableCell>
                            <TableCell>{row.size.xxl}</TableCell>
                            <TableCell>{row.size.xxxl}</TableCell>
                        </TableRow>
                    ))}

                </TableBody>
            </Table>
        </TableContainer>
    )
}


/**
 * 商品介紹
 * @component 
 */
const ProductIntroduce = ({ productFavoritate, xs, md, columns, id }: ProductIntroduceProps) => {

    const { product } = productFavoritate
    return (
        <Grid id={id} container columns={columns} rowSpacing={1} sx={{ px: { xs: 3, sm: 10, md: 20 }, width: "100%" }}>
            <Grid item xs={8} sx={{ mb: 1 }}>
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                    商品介紹
                </Typography>

            </Grid>
            <Grid item xs={columns}>
                <Divider />
            </Grid>


            <Grid item xs={columns}>
                <GridContainer
                    title={<Typography variant="subtitle1">商品材質</Typography>}
                    content={
                        <Typography variant="subtitle1">
                            {product.material?.join(", ")}
                        </Typography>
                    }
                    xs={xs} md={md}
                    columns={columns}
                />

            </Grid>

            <Grid item xs={columns}>
                <GridContainer
                    title={<Typography variant="subtitle1">商品編號</Typography>}
                    content={
                        <Typography variant="subtitle1">
                            {product.productId}
                        </Typography>
                    }
                    xs={xs} md={md}
                    columns={columns}
                />

            </Grid>

            <Grid item xs={columns}>
                <GridContainer
                    title={<Typography variant="subtitle1">洗滌方式</Typography>}
                    content={
                        <Typography variant="subtitle1">
                            {product.howToWash}
                        </Typography>
                    }
                    xs={xs} md={md}
                    columns={columns}
                />
            </Grid>



            <Grid item xs={columns}>
                <GridContainer
                    title={<Typography variant="subtitle1">商品特色</Typography>}
                    content={<Typography variant="subtitle1">
                        {product.features}
                    </Typography>
                    }
                    xs={xs} md={md}
                    columns={columns}
                />
            </Grid>


        </Grid>
    )
}


interface PurchaseDetailProps {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    columns: number;
    productFavorite: ProductInfomationFavorite,
    itemCount: number;
    selectVariant: ProductVariant | undefined
    setselectVariant: Dispatch<SetStateAction<ProductVariant | undefined>>
    setItemCount: Dispatch<SetStateAction<number>>;
    addToCart: (product: ProductInfomation, selectVariant: ProductVariant | undefined, count: number) => void
    goToCheckoutDirectly: () => void
}

/**
 * 購買資訊
 * @component 
 */
const PurchaseDetail = ({ xs, sm, md, lg, columns, productFavorite, itemCount, selectVariant, setselectVariant, setItemCount, addToCart, goToCheckoutDirectly }: PurchaseDetailProps) => {



    const { product, isFavorite } = productFavorite

    const router = useRouter()
    const { query } = router
    const contentxs: number = columns - xs;
    const contentsm: number = columns - sm
    const contentmd: number = columns - md
    const contentlg: number = columns - lg


    const subscribeIdList = useSubscribeListStore((state) => state.subscribeIdList())
    const addToList = useSubscribeListStore((state) => state.addToList)
    const removeFromList = useSubscribeListStore((state) => state.removeFromList)

    const setAlertMsg = useAlertMsgStore((state) => state.setAlertMsg)



    const userInfo = userUserInfoStore((state) => state.userInfo)

    //計時器 
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    const handeClickSubscribe = (e: ChangeEvent<HTMLInputElement>, product: ProductInfomation) => {


        if (!userInfo) {
            setAlertMsg("請先登入")


            timeoutId = setTimeout(() => {
                router.push(`/login?redirect=/products/${query.productid}`)
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


    const handleCountMinus = () => {
        setItemCount(i => {
            if (i - 1 <= 0) {
                return 1
            }

            return i - 1
        })
    }

    const handleCountPlus = () => {
        setItemCount(i => {
            if (i + 1 > 10) {
                return 10
            }

            return i + 1
        })
    }

    const addProductToCart = () => {
        if (product.variants) {
            if (!selectVariant) {
                setAlertMsg("請選擇顏色與尺寸")
                return
            }
        }
        addToCart({ ...product }, selectVariant, itemCount)
        setAlertMsg("新增購物車成功")
    }

    //顏色與規格
    const groupByColor = product.variants.reduce((acc: any, variant: ProductVariant) => {

        if (!acc[variant.color]) {
            acc[variant.color] = [];
        }
        acc[variant.color].push(variant);
        return acc;
    }, {});

    const setSizeDisabled = (size: string): boolean => {

        const variantOfSelectColor: ProductVariant[] = groupByColor[colorVal]

        if (!variantOfSelectColor) {
            return false
        }
        // 有找到尺寸代表可選，所以要取反
        return !Boolean(variantOfSelectColor.find(v => v.size == size))
    }

    const setColorDisabled = (color: string): boolean => {

        const variantOfSelectSize: ProductVariant[] = groupBySize[sizeVal]

        if (!variantOfSelectSize) {
            return false
        }
        // 有找到顏色代表可選，所以要取反
        return !Boolean(variantOfSelectSize.find(v => v.color == color))
    }


    const groupBySize = product.variants.reduce((acc: any, variant: ProductVariant) => {

        if (!acc[variant.size]) {
            acc[variant.size] = [];
        }
        acc[variant.size].push(variant);
        return acc;
    }, {});



    const colors = product.variants.reduce((acc: string[], variant: ProductVariant) => {
        // 如果acc中沒有該color，則將其加入
        if (!acc.includes(variant.color)) {
            acc.push(variant.color);
        }
        return acc;
    }, []);

    const sizes = product.variants.reduce((acc: string[], variant: ProductVariant) => {
        // 如果acc中沒有該size，則將其加入
        if (!acc.includes(variant.size)) {
            acc.push(variant.size);
        }
        return acc;
    }, []);

    const [colorVal, setcolorVal] = useState("")

    const handleColor = (event: any, newColor: string) => {
        setcolorVal(newColor)
    }

    const [sizeVal, setsizeVal] = useState("")

    const handleSize = (event: any, newSize: string) => {
        setsizeVal(newSize)
    }


    //監控選擇並組合成variant
    useEffect(() => {
        //console.log("color:",colorVal,"sizeval:",sizeVal)
        const selectv = product.variants.find(v => v.color === colorVal && v.size === sizeVal)
        //console.log("selectv=",selectv)
        setselectVariant(selectv)

    }, [colorVal, sizeVal])

    useEffect(() => {

        if (selectVariant) {
            if (itemCount > selectVariant.stock) {
                setItemCount(1)
            }
        }


    }, [selectVariant])



    const getLowestPrice = (product: ProductInfomation) => {
        const priceList = product.variants.map(v => v.price).sort((a, b) => a - b)
        return priceList[0]


    }

    const getHighstPrice = (product: ProductInfomation) => {
        const priceList = product.variants.map(v => v.price).sort((a, b) => a - b)
        return priceList[priceList.length - 1]


    }


    const getLowestDiscountPrice = (product: ProductInfomation) => {
        const priceList = product.variants
            .filter(v => v.discountPrice !== null)
            .map(v => v.discountPrice as number)
            .sort((a, b) => a - b)

        //console.log("priceList:", priceList)
        return priceList[0]

    }



    if (!productFavorite) {
        return <p>無商品資訊...</p>
    }





    return (
        <Grid container alignItems={"center"} columns={columns} rowSpacing={5} sx={{ px: 5, width: "100%" }} >
            <Grid item xs={8} sx={{ px: 0 }}>
                <Stack direction={"row"} justifyContent={"space-between"}>
                    <Typography variant='h5' sx={{ fontWeight: "bold", margin: "30px", mx: 0 }}>{product.title}</Typography>
                    <Checkbox checked={subscribeIdList.includes(product.productId)} icon={<FavoriteBorderIcon />} onChange={(e) => { handeClickSubscribe(e, product) }} checkedIcon={<FavoriteIcon sx={{ color: "red" }} />} />
                </Stack>

            </Grid>

            <Grid item xs={columns}>
                <GridContainer
                    xs={xs} sm={sm} md={md} lg={lg}
                    columns={columns}
                    title={<Typography variant='body2'>售價</Typography>}
                    content={
                        <Stack direction={"row"} sx={{ alignItems: "center" }} spacing={1}>
                            {
                                selectVariant ?
                                    selectVariant.discountPrice ?
                                        <>
                                            <Typography variant='subtitle1' sx={{ textDecoration: "line-through", color: "#ef6060" }}>${selectVariant.price}</Typography>
                                            <Typography sx={{ fontWeight: "bold", fontSize: "24px" }}>${selectVariant.discountPrice}</Typography>
                                        </>
                                        :
                                        <Typography variant='subtitle1' >${selectVariant.price}</Typography>
                                    :
                                    <Typography variant={"subtitle2"} sx={{ color: "gray" }}>還未選擇款式顏色</Typography>
                            }

                        </Stack>
                    }
                    alignItems="center"
                />
            </Grid>

            {/*顏色 */}
            <Grid item xs={columns}>
                <GridContainer
                    xs={xs} sm={sm} md={md} lg={lg}
                    columns={columns}
                    title={<Typography variant='body2'>顏色</Typography>}
                    content={

                        <ToggleButtonGroup
                            value={colorVal}
                            onChange={handleColor}
                            exclusive
                            sx={{ border: "0px solid", width: "100%" }}
                        >
                            <Grid container columns={8} spacing={1} alignItems={"center"}>
                                {
                                    product.variants
                                        ?
                                        colors.map((c, index) => (

                                            <Grid key={c} item xs={2} sm={2.5} md={2} lg={1.5}>
                                                <ToggleButton color="primary" disabled={setColorDisabled(c)} fullWidth size="small" disableRipple value={c}>{c}</ToggleButton>
                                            </Grid>


                                        ))
                                        :
                                        <Grid item xs={2} sm={2.5} md={2} lg={1}>
                                            <Stack alignItems={"center"} sx={{ border: "1px solid #d9d9d9", p: 0.5, borderRadius: "4px" }}>
                                                <Typography sx={{ color: "#AFAFAF" }} variant='caption'>標準</Typography>
                                            </Stack>
                                        </Grid>
                                }
                            </Grid>
                        </ToggleButtonGroup>
                    }
                    alignItems="center"
                />

            </Grid>


            <Grid item xs={columns}>

                <GridContainer
                    xs={xs} sm={sm} md={md} lg={lg}
                    columns={columns}
                    title={<Typography variant='body2'>規格</Typography>}
                    content={
                        <ToggleButtonGroup
                            value={sizeVal}
                            onChange={handleSize}
                            exclusive
                            sx={{ border: "0px solid", width: "100%" }}
                        >
                            <Grid container columns={8} spacing={1} >
                                {
                                    product.variants
                                        ?
                                        sizes.map((s, index) => (

                                            <Grid key={s} item xs={2} sm={2.5} md={2} lg={1.5}>
                                                <ToggleButton color="primary" disabled={setSizeDisabled(s)} fullWidth size="small" disableRipple value={s}>{s}</ToggleButton>
                                            </Grid>


                                        ))
                                        :

                                        <Grid item xs={2} sm={2.5} md={2} lg={1}>
                                            <Stack alignItems={"center"} sx={{ border: "1px solid #d9d9d9", p: 0.5, borderRadius: "4px" }}>
                                                <Typography sx={{ color: "#AFAFAF" }} variant='caption'>標準</Typography>
                                            </Stack>
                                        </Grid>

                                }
                            </Grid>
                        </ToggleButtonGroup>
                    }
                    alignItems="center"
                />

            </Grid>

            <Grid item xs={columns}>
                <GridContainer
                    xs={xs} sm={sm} md={md} lg={lg}
                    columns={columns}
                    title={<Typography variant='body2'>數量</Typography>}
                    content={
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                            <RemoveIcon onClick={handleCountMinus} sx={{ "&:hover": { cursor: "pointer" }, color: "#AFAFAF", border: "solid 1px", height: "30px", width: "30px", borderRadius: "4px" }} />
                            <TextFieldWrapper value={itemCount} size='small' inputProps={{ style: { textAlign: "center" } }} ></TextFieldWrapper>
                            <AddIcon onClick={handleCountPlus} sx={{ "&:hover": { cursor: "pointer" }, color: "#AFAFAF", border: "solid 1px", height: "30px", width: "30px", borderRadius: "4px" }} />
                        </Box>
                    }
                    alignItems="center"
                />

            </Grid>

            <Grid item xs={8}>
                <Stack direction={"row"} justifyContent={"start"} sx={{ gap: 1, mt: 5, border: "0px solid black", display: { xs: "none", sm: "none", md: "flex", lg: "flex" } }}>

                    <Button variant="outlined" disableRipple sx={{ flexGrow: 1 }} onClick={addProductToCart}>加入購物車</Button>
                    <Button variant="contained" disableRipple sx={{ flexGrow: 1 }} onClick={goToCheckoutDirectly}>直接購買</Button>
                </Stack>
            </Grid>
        </Grid>
    )
}


function SampleNextArrow(props: any) {
    const { className, style, onClick, isSmallScreen } = props;
    return (
        <div
            className={className}
            style={{ ...style, display: isSmallScreen ? "none" : "block", right: "10px" }}
            onClick={onClick}
        />
    );
}



function SamplePrevArrow(props: any) {
    const { className, style, onClick, isSmallScreen } = props;
    return (
        <div
            className={className}
            style={{ ...style, display: isSmallScreen ? "none" : "block", left: 10, zIndex: 1 }}
            onClick={onClick}
        />
    );
}





interface ProductIntroduceProps {
    productFavoritate: ProductInfomationFavorite;
    xs: number;
    md: number;
    columns: number;
    id?: string | undefined
}




interface SizeTableDetails {
    title: string;
    size: Size;
}

interface Size {
    xs: string;
    s: string;
    m: string;
    l: string;
    xl: string;
    xxl: string;
    xxxl: string;
}

const sizeTable: SizeTableDetails[] = [
    {
        title: "身長",
        size: { xs: "X", s: "66", m: "67", l: "68", xl: "68.5", xxl: "69", xxxl: "70" }
    },
    {
        title: "胸寬",
        size: { xs: "53", s: "54", m: "54", l: "55", xl: "55.5", xxl: "56", xxxl: "56" }
    },
    {
        title: "袖長",
        size: { xs: "X", s: "77", m: "78.5", l: "78.5", xl: "79", xxl: "80", xxxl: "81" }
    }
]


const TextFieldWrapper = styled(TextField)(
    {
        /*修改 focus 時外框的顏色  */
        "& .MuiOutlinedInput-root.Mui-focused": {
            "& > fieldset": {
                borderColor: "white",

            }
        },
        /*修改外框的弧度 */
        '& fieldset': { borderRadius: "0px" },
        maxWidth: "70px",
        '& .MuiOutlinedInput-root': {
            '& fieldset': {
                border: 'none',
            }
        },

    })



interface CustomSildeProps {
    productFavorite: ProductInfomationFavorite;

    goToProductDetail: (productId: number) => void
}

/**
 * 你可能也會喜歡
 * @component
 */
const CustomSilde = ({ productFavorite, goToProductDetail }: CustomSildeProps) => {

    const { product } = productFavorite

    //console.log("CustomSilde product:",product)


    //console.log("slide product",product)

    const getLowestPrice = (product: ProductInfomation) => {
        const priceList = product.variants.map(v => v.price).sort((a, b) => a - b)
        return priceList[0]


    }

    const getHighstPrice = (product: ProductInfomation) => {
        const priceList = product.variants.map(v => v.price).sort((a, b) => a - b)
        return priceList[priceList.length - 1]


    }


    const getLowestDiscountPrice = (product: ProductInfomation) => {
        const priceList = product.variants
            .filter(v => v.discountPrice !== null)
            .map(v => v.discountPrice as number)
            .sort((a, b) => a - b)

        console.log("priceList:", priceList)
        return priceList[0]

    }



    return (
        <Box style={{ margin: "10px" }}>
            <Card sx={{ boxShadow: "none" }}>
                <CardMedia sx={{ '&:hover': { cursor: "pointer" } }} onClick={() => { goToProductDetail(product.productId) }}>

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
                    maxHeight: "250px",
                    px: { sm: 1, xs: 0 }
                }}>
                    <Stack spacing={1} sx={{ border: "0px solid black" }}>
                        <Typography sx={{ fontWeight: { md: "bold", xs: "normal" }, fontSize: { xs: "14px" }, '&:hover': { cursor: "pointer" } }} onClick={() => { goToProductDetail(product.productId) }}>{product.title}</Typography>
                        {
                            product.variants.filter(v => v.discountPrice) ?
                                <Stack direction={"row"} spacing={"15px"}>
                                    <Typography variant="subtitle2" sx={{ textDecoration: 'line-through' }}>定價NT${getHighstPrice(product)}</Typography>
                                    <Typography sx={{ color: "#ef6060" }}>${getLowestDiscountPrice(product)}</Typography>
                                </Stack>

                                :
                                <Stack direction={"row"} spacing={"15px"}>
                                    <Typography variant="subtitle2">定價NT${getLowestPrice(product)}</Typography>
                                </Stack>

                        }

                    </Stack>
                </CardContent>

            </Card>
        </Box>
    )
}




interface AnchorNavbarProps {
    showNavBar: boolean;
    handleLinkClick: (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>, id: string) => void
}


/**
 * scroll高度導航到同一畫面指定id的位置 
 * 
 * @component
 */
const AnchorNavbar = ({ showNavBar, handleLinkClick }: AnchorNavbarProps) => {
    return (
        <AppBar
            position="fixed"
            sx={{
                top: showNavBar ? { sm: "64px", xs: "56px" } : '-50px',
                height: "50px",
                opacity: "0.9",
                transition: 'top 0.3s',
                zIndex: "1",

            }}>
            <Container sx={{ px: 0 }}>
                <Toolbar sx={{ height: "50px", minHeight: "50px !important", display: 'flex', justifyContent: 'center' }}>
                    <nav>
                        <List sx={{ display: "flex", flexDirection: "row" }}>
                            <Link href="#" style={{ color: 'inherit', textDecoration: "none" }} onClick={(e) => handleLinkClick(e, '#intro')}>
                                <ListItemButton disableRipple >
                                    <ListItemText sx={{ color: "grey" }} primary="商品介紹" />
                                </ListItemButton>
                            </Link>
                            <Link href="#" style={{ color: 'inherit', textDecoration: "none" }} onClick={(e) => handleLinkClick(e, '#spec')}>
                                <ListItemButton disableRipple >
                                    <ListItemText sx={{ color: "grey" }} primary="尺寸參考" />
                                </ListItemButton>
                            </Link>
                            <Link href="#" style={{ color: 'inherit', textDecoration: "none" }} onClick={(e) => handleLinkClick(e, '#notice')}>
                                <ListItemButton disableRipple >
                                    <ListItemText sx={{ color: "grey" }} primary="注意事項" />
                                </ListItemButton>
                            </Link>
                        </List>

                    </nav>
                </Toolbar>
            </Container>

        </AppBar>
    )
}

// 現代化錨點導航欄
const ModernAnchorNavbar = ({ showNavBar, handleLinkClick }: AnchorNavbarProps) => {
    return (
        <AppBar
            position="fixed"
            sx={{
                top: showNavBar ? { sm: "70px", xs: "64px" } : '-60px',
                height: "60px",
                backgroundColor: alpha('#2C3E50', 0.95),
                backdropFilter: 'blur(20px)',
                transition: 'all 0.3s ease',
                zIndex: 1200,
                borderBottom: '1px solid rgba(230, 126, 34, 0.2)'
            }}
        >
            <Container>
                <Toolbar sx={{ 
                    height: "60px", 
                    minHeight: "60px !important", 
                    display: 'flex', 
                    justifyContent: 'center' 
                }}>
                    <nav>
                        <List sx={{ 
                            display: "flex", 
                            flexDirection: "row",
                            gap: 2
                        }}>
                            {[
                                { label: "商品介紹", id: "#intro" },
                                { label: "商品圖片", id: "#images" },
                                { label: "尺寸參考", id: "#spec" },
                                { label: "注意事項", id: "#notice" }
                            ].map((item) => (
                                <Link 
                                    key={item.id}
                                    href="#" 
                                    style={{ color: 'inherit', textDecoration: "none" }} 
                                    onClick={(e) => handleLinkClick(e, item.id)}
                                >
                                    <ListItemButton 
                                        disableRipple
                                        sx={{
                                            borderRadius: 2,
                                            px: 3,
                                            transition: 'all 0.3s ease',
                                            '&:hover': {
                                                backgroundColor: alpha('#E67E22', 0.1),
                                                transform: 'translateY(-2px)'
                                            }
                                        }}
                                    >
                                        <ListItemText 
                                            sx={{ 
                                                color: "white",
                                                '& .MuiListItemText-primary': {
                                                    fontWeight: 500,
                                                    fontSize: '0.9rem'
                                                }
                                            }} 
                                            primary={item.label} 
                                        />
                                    </ListItemButton>
                                </Link>
                            ))}
                        </List>
                    </nav>
                </Toolbar>
            </Container>
        </AppBar>
    )
}

// 現代化底部購買欄
interface ModernBottomBarProps {
    productFavoritate: ProductInfomationFavorite,
    addProductToCart: () => void
    goToCheckoutDirectly: () => void
}

const ModernBottomBar = ({ productFavoritate, addProductToCart, goToCheckoutDirectly }: ModernBottomBarProps) => {
    const { product } = productFavoritate

    return (
        <AppBar
            position="fixed"
            sx={{
                top: "auto",
                bottom: {
                    lg: "-70px",
                    md: "-70px",
                    xs: "0px"
                },
                transition: "all 0.3s ease",
                height: "70px",
                backgroundColor: 'white',
                borderTop: '1px solid rgba(0,0,0,0.1)',
                boxShadow: '0 -4px 20px rgba(0,0,0,0.08)',
                zIndex: 1300
            }}
        >
            <Container>
                <Toolbar sx={{ 
                    height: "70px", 
                    minHeight: "70px !important",
                    display: 'flex',
                    alignItems: 'center'
                }}>
                    <Stack 
                        direction="row" 
                        alignItems="center" 
                        sx={{ width: "100%" }} 
                        spacing={3}
                    >
                        <Box sx={{ display: { xs: 'block', md: 'none' } }}>
                            <Typography 
                                variant="h6" 
                                sx={{ 
                                    color: '#E67E22',
                                    fontWeight: 700
                                }}
                            >
                                NT${product.price}
                            </Typography>
                        </Box>
                        
                        <Stack 
                            direction="row" 
                            sx={{ 
                                flexGrow: 1, 
                                gap: 2,
                                justifyContent: "flex-end"
                            }}
                        >
                            <Button 
                                variant="outlined" 
                                size="large"
                                onClick={addProductToCart}
                                sx={{
                                    flexGrow: 1,
                                    maxWidth: 200,
                                    borderColor: '#E67E22',
                                    color: '#E67E22',
                                    '&:hover': {
                                        borderColor: '#D35400',
                                        backgroundColor: alpha('#E67E22', 0.1)
                                    }
                                }}
                            >
                                加入購物車
                            </Button>
                            <Button 
                                variant="contained" 
                                size="large"
                                onClick={goToCheckoutDirectly}
                                sx={{
                                    flexGrow: 1,
                                    maxWidth: 200,
                                    backgroundColor: '#E67E22',
                                    '&:hover': {
                                        backgroundColor: '#D35400'
                                    }
                                }}
                            >
                                立即購買
                            </Button>
                        </Stack>
                    </Stack>
                </Toolbar>
            </Container>
        </AppBar>
    )
}

// 現代化商品介紹組件
interface ModernProductIntroduceProps {
    productFavoritate: ProductInfomationFavorite;
    id?: string;
}

const ModernProductIntroduce = ({ productFavoritate, id }: ModernProductIntroduceProps) => {
    const { product } = productFavoritate;

    const infoItems = [
        { label: "商品材質", value: product.material?.join(", ") },
        { label: "商品編號", value: product.productId?.toString() },
        { label: "洗滌方式", value: product.howToWash },
        { label: "商品特色", value: product.features }
    ];

    return (
        <Box id={id}>
            <ModernSectionTitle title="商品介紹" />
            <Box sx={{
                backgroundColor: 'white',
                borderRadius: 3,
                p: 4,
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
            }}>
                <Grid container spacing={3}>
                    {infoItems.map((item, index) => (
                        <Grid item xs={12} md={6} key={index}>
                            <Box sx={{
                                p: 3,
                                borderRadius: 2,
                                backgroundColor: '#FAFAFA',
                                border: '1px solid rgba(230, 126, 34, 0.1)'
                            }}>
                                <Typography 
                                    variant="subtitle1" 
                                    sx={{ 
                                        fontWeight: 600,
                                        color: '#2C3E50',
                                        mb: 1
                                    }}
                                >
                                    {item.label}
                                </Typography>
                                <Typography 
                                    variant="body1" 
                                    sx={{ color: 'text.secondary' }}
                                >
                                    {item.value || "無資料"}
                                </Typography>
                            </Box>
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </Box>
    );
};

// 現代化尺寸表組件
const ModernSizeTable = ({ sizeTable }: { sizeTable: SizeTableDetails[] }) => {
    return (
        <Box sx={{
            backgroundColor: 'white',
            borderRadius: 3,
            overflow: 'hidden',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
        }}>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow sx={{ backgroundColor: '#2C3E50' }}>
                            <TableCell sx={{ color: 'white', fontWeight: 600 }}></TableCell>
                            {['XS', 'S', 'M', 'L', 'XL', 'XXL', '3L'].map((size) => (
                                <TableCell 
                                    key={size}
                                    sx={{ 
                                        color: 'white', 
                                        fontWeight: 600,
                                        textAlign: 'center'
                                    }}
                                >
                                    {size}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {sizeTable.map((row, index) => (
                            <TableRow 
                                key={row.title}
                                sx={{
                                    backgroundColor: index % 2 === 0 ? '#FAFAFA' : 'white',
                                    '&:hover': {
                                        backgroundColor: alpha('#E67E22', 0.05)
                                    }
                                }}
                            >
                                <TableCell sx={{ fontWeight: 600, color: '#2C3E50' }}>
                                    {row.title}
                                </TableCell>
                                <TableCell sx={{ textAlign: 'center' }}>{row.size.xs}</TableCell>
                                <TableCell sx={{ textAlign: 'center' }}>{row.size.s}</TableCell>
                                <TableCell sx={{ textAlign: 'center' }}>{row.size.m}</TableCell>
                                <TableCell sx={{ textAlign: 'center' }}>{row.size.l}</TableCell>
                                <TableCell sx={{ textAlign: 'center' }}>{row.size.xl}</TableCell>
                                <TableCell sx={{ textAlign: 'center' }}>{row.size.xxl}</TableCell>
                                <TableCell sx={{ textAlign: 'center' }}>{row.size.xxxl}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

// 現代化推薦商品卡片
const ModernCustomSlide = ({ productFavorite, goToProductDetail }: CustomSildeProps) => {
    const { product } = productFavorite;

    const getLowestPrice = (product: ProductInfomation) => {
        const priceList = product.variants.map(v => v.price).sort((a, b) => a - b)
        return priceList[0];
    }

    const hasDiscount = () => {
        return product.variants.some(v => v.discountPrice !== null);
    }

    return (
        <Card sx={{
            height: '100%',
            borderRadius: 3,
            overflow: 'hidden',
            transition: 'all 0.3s ease',
            border: '1px solid rgba(0,0,0,0.05)',
            '&:hover': {
                transform: 'translateY(-8px)',
                boxShadow: '0 20px 40px rgba(0,0,0,0.12)',
                border: '1px solid rgba(230, 126, 34, 0.3)'
            }
        }}>
            <CardMedia 
                sx={{ 
                    '&:hover': { cursor: "pointer" },
                    position: 'relative'
                }} 
                onClick={() => goToProductDetail(product.productId)}
            >
                <Box sx={{
                    position: 'relative',
                    width: '100%',
                    height: 0,
                    paddingBottom: '120%',
                    overflow: 'hidden',
                }}>
                    <Image
                        src={product.coverImg}
                        alt={product.title}
                        fill
                        style={{ objectFit: "cover" }}
                    />
                    
                    {hasDiscount() && (
                        <Chip
                            label="特價"
                            size="small"
                            sx={{
                                position: 'absolute',
                                top: 12,
                                left: 12,
                                backgroundColor: '#E67E22',
                                color: 'white',
                                fontWeight: 'bold'
                            }}
                        />
                    )}
                </Box>
            </CardMedia>
            
            <CardContent sx={{ p: 2.5 }}>
                <Typography 
                    variant="h6"
                    sx={{ 
                        fontWeight: 600,
                        fontSize: '1rem',
                        mb: 1,
                        lineHeight: 1.4,
                        color: '#2C3E50',
                        '&:hover': { 
                            cursor: "pointer",
                            color: '#E67E22'
                        },
                        transition: 'color 0.2s ease'
                    }} 
                    onClick={() => goToProductDetail(product.productId)}
                >
                    {product.title}
                </Typography>
                
                <Typography 
                    variant="h6" 
                    sx={{ 
                        color: '#E67E22',
                        fontWeight: 700,
                        fontSize: '1.1rem'
                    }}
                >
                    NT${getLowestPrice(product)}
                </Typography>
            </CardContent>
        </Card>
    );
};

// 現代化購買詳情組件的接口
interface ModernPurchaseDetailProps {
    productFavorite: ProductInfomationFavorite;
    itemCount: number;
    selectVariant: ProductVariant | undefined;
    setselectVariant: Dispatch<SetStateAction<ProductVariant | undefined>>;
    addToCart: (product: ProductInfomation, selectVariant: ProductVariant | undefined, count: number) => void;
    goToCheckoutDirectly: () => void;
    setItemCount: Dispatch<SetStateAction<number>>;
    rating: number;
    reviewCount: number;
}

// 現代化購買詳情組件
const ModernPurchaseDetail = ({ 
    productFavorite, 
    itemCount, 
    selectVariant, 
    setselectVariant, 
    addToCart, 
    goToCheckoutDirectly, 
    setItemCount,
    rating,
    reviewCount 
}: ModernPurchaseDetailProps) => {
    
    const { product, isFavorite } = productFavorite;
    const router = useRouter();
    const setAlertMsg = useAlertMsgStore((state) => state.setAlertMsg);
    const userInfo = userUserInfoStore((state) => state.userInfo);
    const subscribeIdList = useSubscribeListStore((state) => state.subscribeIdList());
    const addToList = useSubscribeListStore((state) => state.addToList);
    const removeFromList = useSubscribeListStore((state) => state.removeFromList);

    // 處理收藏功能
    const handleFavoriteToggle = () => {
        if (!userInfo) {
            setAlertMsg("請先登入");
            setTimeout(() => {
                router.push(`/login?redirect=${router.asPath}`);
            }, 1000);
            return;
        }

        if (subscribeIdList.includes(product.productId)) {
            removeFromList(product.productId);
        } else {
            addToList(product);
        }
    };

    // 數量控制
    const handleCountMinus = () => {
        setItemCount(i => i > 1 ? i - 1 : 1);
    };

    const handleCountPlus = () => {
        setItemCount(i => i < 10 ? i + 1 : 10);
    };

    // 購買功能
    const addProductToCart = () => {
        if (!selectVariant) {
            setAlertMsg("請選擇顏色與尺寸");
            return;
        }
        addToCart(product, selectVariant, itemCount);
        setAlertMsg("新增購物車成功");
    };

    return (
        <Box sx={{
            backgroundColor: 'white',
            borderRadius: 3,
            p: 4,
            boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
            position: 'sticky',
            top: 100
        }}>
            {/* 商品標題和收藏 */}
            <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 3 }}>
                <Typography 
                    variant="h4" 
                    sx={{ 
                        fontWeight: 700,
                        color: '#2C3E50',
                        lineHeight: 1.3,
                        flex: 1,
                        mr: 2
                    }}
                >
                    {product.title}
                </Typography>
                <IconButton
                    onClick={handleFavoriteToggle}
                    sx={{
                        backgroundColor: alpha('#E67E22', 0.1),
                        '&:hover': {
                            backgroundColor: alpha('#E67E22', 0.2),
                            transform: 'scale(1.1)'
                        }
                    }}
                >
                    {subscribeIdList.includes(product.productId) ? 
                        <FavoriteIcon sx={{ color: '#E67E22' }} /> : 
                        <FavoriteBorderIcon sx={{ color: '#666' }} />
                    }
                </IconButton>
            </Stack>

            {/* 評分 */}
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {[...Array(5)].map((_, index) => (
                        <StarIcon
                            key={index}
                            sx={{
                                fontSize: '1.2rem',
                                color: index < Math.floor(rating) ? '#FFD700' : '#E0E0E0'
                            }}
                        />
                    ))}
                </Box>
                <Typography variant="body2" sx={{ color: 'text.secondary', ml: 1 }}>
                    {rating} ({reviewCount} 則評價)
                </Typography>
            </Stack>

            {/* 價格 */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                    售價
                </Typography>
                {selectVariant ? (
                    selectVariant.discountPrice ? (
                        <Stack direction="row" alignItems="center" spacing={2}>
                            <Typography 
                                variant="h5" 
                                sx={{ 
                                    textDecoration: "line-through", 
                                    color: "text.secondary" 
                                }}
                            >
                                NT${selectVariant.price}
                            </Typography>
                            <Typography 
                                variant="h4" 
                                sx={{ 
                                    fontWeight: 700,
                                    color: '#E67E22'
                                }}
                            >
                                NT${selectVariant.discountPrice}
                            </Typography>
                        </Stack>
                    ) : (
                        <Typography 
                            variant="h4" 
                            sx={{ 
                                fontWeight: 700,
                                color: '#2C3E50'
                            }}
                        >
                            NT${selectVariant.price}
                        </Typography>
                    )
                ) : (
                    <Typography variant="body2" sx={{ color: "text.secondary" }}>
                        請選擇商品規格
                    </Typography>
                )}
            </Box>

            {/* 顏色選擇 */}
            <Box sx={{ mb: 3 }}>
                <Typography variant="body2" sx={{ mb: 2, fontWeight: 600 }}>
                    顏色
                </Typography>
                {/* 這裡需要實現顏色選擇邏輯 */}
            </Box>

            {/* 尺寸選擇 */}
            <Box sx={{ mb: 3 }}>
                <Typography variant="body2" sx={{ mb: 2, fontWeight: 600 }}>
                    尺寸
                </Typography>
                {/* 這裡需要實現尺寸選擇邏輯 */}
            </Box>

            {/* 數量選擇 */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="body2" sx={{ mb: 2, fontWeight: 600 }}>
                    數量
                </Typography>
                <Stack direction="row" alignItems="center" spacing={2}>
                    <IconButton
                        onClick={handleCountMinus}
                        sx={{
                            border: '1px solid #E0E0E0',
                            borderRadius: 2,
                            '&:hover': {
                                backgroundColor: alpha('#E67E22', 0.1),
                                borderColor: '#E67E22'
                            }
                        }}
                    >
                        <RemoveIcon />
                    </IconButton>
                    <Typography 
                        variant="h6" 
                        sx={{ 
                            minWidth: 50,
                            textAlign: 'center',
                            fontWeight: 600
                        }}
                    >
                        {itemCount}
                    </Typography>
                    <IconButton
                        onClick={handleCountPlus}
                        sx={{
                            border: '1px solid #E0E0E0',
                            borderRadius: 2,
                            '&:hover': {
                                backgroundColor: alpha('#E67E22', 0.1),
                                borderColor: '#E67E22'
                            }
                        }}
                    >
                        <AddIcon />
                    </IconButton>
                </Stack>
            </Box>

            {/* 購買按鈕 */}
            <Stack spacing={2} sx={{ display: { xs: "none", md: "flex" } }}>
                <Button 
                    variant="outlined" 
                    size="large"
                    fullWidth
                    onClick={addProductToCart}
                    sx={{
                        borderColor: '#E67E22',
                        color: '#E67E22',
                        py: 1.5,
                        '&:hover': {
                            borderColor: '#D35400',
                            backgroundColor: alpha('#E67E22', 0.1)
                        }
                    }}
                >
                    加入購物車
                </Button>
                <Button 
                    variant="contained" 
                    size="large"
                    fullWidth
                    onClick={goToCheckoutDirectly}
                    sx={{
                        backgroundColor: '#E67E22',
                        py: 1.5,
                        '&:hover': {
                            backgroundColor: '#D35400'
                        }
                    }}
                >
                    立即購買
                </Button>
            </Stack>
        </Box>
    );
};

// 類型定義
interface ProductDetailPageProps {
    product: ProductBasic
}




interface GoToTopButtonProps {
    handleScrollTop: () => void;
}

interface BottomBarProps {
    productFavoritate: ProductInfomationFavorite,
    addProductToCart: () => void
    goToCheckoutDirectly: () => void
}


/**
 * 顯示於底部的bar，當screen size  小於 md 才會出現
 * 
 * @component
 */
const BottomBar = ({ productFavoritate, addProductToCart, goToCheckoutDirectly }: BottomBarProps) => {

    const { product } = productFavoritate

    return (
        <AppBar
            position="fixed"
            sx={{
                top: "auto",
                bottom: {
                    lg: "-50px",
                    md: "-50px",
                    xs: "0px"
                },
                transition: "bottom 0.3s",
                height: "50px",
                opacity: "0.9",
                zIndex: "999",
                border: "solid 0px black",
                backgroundColor: "white"
            }}>
            <Container sx={{ px: 0 }}>
                <Toolbar sx={{ height: "50px", minHeight: "50px !important", display: 'flex' }}>
                    <Stack direction={"row"} alignItems={"center"} sx={{ width: "100%" }} spacing={2}>
                        <Typography sx={{ color: "grey" }}>NT{product.price}</Typography>
                        <Stack direction={"row"} justifyContent={"flex-end"} sx={{ flexGrow: 1, gap: 1, justifyContent: "flex-end", border: "0px solid black" }}>
                            <Button variant="outlined" sx={{ flexGrow: 1 }} onClick={addProductToCart}>加入購物車</Button>
                            <Button variant="contained" sx={{ flexGrow: 1 }} onClick={goToCheckoutDirectly}>直接購買</Button>
                        </Stack>

                    </Stack>
                </Toolbar>
            </Container>

        </AppBar>
    )
}