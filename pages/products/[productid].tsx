import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import styled from '@mui/system/styled'
import ProductImage4 from '/public/images/coat1.jpg'
import ProductImage5 from '/public/images/coat2.jpg'
import Image from "next/image";
import { AppBar, Box, Button, Card, CardContent, CardHeader, CardMedia, Checkbox, Container, Divider, IconButton, List, ListItem, ListItemButton, ListItemText, SpeedDial, SpeedDialIcon, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tabs, TextField, Toolbar, Typography, TypographyOwnProps, useMediaQuery, useTheme } from "@mui/material";
import Grid from '@mui/material/Grid';
import { ChangeEvent, Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import Link from "next/link";

import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { useRouter } from "next/router";
import { GetServerSideProps } from "next";
import { getProducts, getProdcctById } from "@/dummy-data/dummy-data";
import { ProductInfomation, ProductInfomationCount } from "@/interfaces";
import { useCartStore, useSubscribeListStore } from "@/store/store";
import GoToTopButton from "@/components/layout/speed-dial-group";
import GridContent from "@/components/ui/gridContent";

export default function ProductDetailPage({ product }: ProductDetailPageProps) {

    if (!product) {
        return <p>無商品資訊...</p>
    }




    const [recommendProducts, setrecommendProducts] = useState<ProductInfomation[] | null>(null);
    // 你可能感興趣
    useEffect(() => {
        const products = getProducts()
        setrecommendProducts(products)
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
        nextArrow: <SampleNextArrow isSmallScreen={isSmallScreen} />,
        prevArrow: <SamplePrevArrow isSmallScreen={isSmallScreen} />,

        beforeChange: (current: any, next: any) => setActiveSlide(next)


    }


    const settingsYouMayInterested = {
        infinite: true,
        slidesToShow: 3,
        slidesToScroll: 1,
        nextArrow: <SampleNextArrow isSmallScreen={isSmallScreen} />,
        prevArrow: <SamplePrevArrow isSmallScreen={isSmallScreen} />,


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
            /*
            
                getBoundingClientRect().top 拿到的是ele的上緣相對於視窗的位置

                window.scrollY 滑動的距離

                需要加上滑動的距離才能計算元素在頁面的絕對位置
            
            */

            const offsetTop = element.getBoundingClientRect().top + window.scrollY;
            const offset = 110

            window.scrollTo({
                top: offsetTop - offset,
                behavior: 'smooth',
            });
            //element.scrollIntoView({ behavior: 'smooth' });
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


        if (currentScrollPos > 100) { // 设置滚动距离阈值
            setShowNavBar(true);
        } else {
            setShowNavBar(false);
        }
        scrollPosition.current = currentScrollPos;
    };



    // 監聽scroll，離開頁面時再將監聽去掉
    useEffect(() => {


        const onScroll = () => {
            handleScroll();
        };
        window.addEventListener('scroll', onScroll);
        return () => {
            window.removeEventListener('scroll', onScroll);
        };
    }, []);


    const handleScrollTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    }

    const router = useRouter();

    const goToProductDetail = (productId: string) => {
        router.push(`/products/${productId}`)
    }


    const addProductToCart = () => {
        addToCart({ ...product, selectSize: selectSize, selectColor: selectColor }, itemCount)
    }

    const goToCheckoutDirectly = () => {
        addProductToCart()
        router.push("/checkout")

    }

    return (
        <Box sx={{ px: 0 }}>



            <AnchorNavbar showNavBar={showNavBar} handleLinkClick={handleLinkClick} />

            <BottomBar
                product={product}
                addProductToCart={addProductToCart}
                goToCheckoutDirectly={goToCheckoutDirectly}

            />

            <Grid container columns={8} spacing={3} >
                <Grid item lg={4} md={4} sm={4} xs={8}  >
                    <Stack direction={"column"} alignItems={"center"} sx={{ border: "0px solid", mb: 10 }}>
                        {/*輪播圖 */}
                        <Box sx={{ p: 0, m: 2, mb: 1, maxWidth: "400px", maxHeight: "400px", width: '100%', height: 'auto' }}>

                            <Slider {...settings} ref={sliderRef} >
                                {product?.images && product?.images.map((img, index) => (
                                    <Box key={index} sx={{ position: 'relative', width: '100%', paddingBottom: '120%' }}>
                                        <Image src={img} alt={`img${index}`} fill style={{ objectFit: "cover" }} />
                                    </Box>
                                ))}
                            </Slider>

                        </Box>

                    </Stack>
                </Grid>

                <Grid item lg={4} md={4} sm={4} xs={8}>
                    {/*購買資訊 */}
                    <PurchaseDetail
                        columns={8}
                        xs={2}
                        sm={2.5}
                        md={2}
                        lg={1.5}
                        product={product}
                        itemCount={itemCount}
                        selectColor={selectColor}
                        selectSize={selectSize}
                        addProductToCart={addProductToCart}
                        goToCheckoutDirectly={goToCheckoutDirectly}
                        setItemCount={setItemCount}
                        setSelectColor={setSelectColor}
                        setSelectSize={setSelectSize}

                    />
                </Grid>

                {/*大圖區 */}
                <Grid item xs={8} sx={{ mt: 6 }} >
                    <Grid container columns={8} rowSpacing={1} sx={{ px: { xs: 3, sm: 10, md: 20 }, width: "100%" }}>
                        <Grid item xs={8} sx={{ mb: 1 }}>
                            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                                商品圖
                            </Typography>

                        </Grid>
                        <Grid item xs={8}>
                            <Divider />
                        </Grid>
                        <Grid item xs={8}>
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
                                    src={ProductImage5}
                                    alt="product information5"
                                    fill
                                    style={{ objectFit: "cover" }}
                                />
                            </Box>
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
                                    src={ProductImage4}
                                    alt="product information4"
                                    fill
                                    style={{ objectFit: "cover" }}
                                />
                            </Box>

                        </Grid>
                    </Grid>
                </Grid>

                <Grid item xs={8} sx={{ mt: 6 }} >

                    {/*商品介紹*/}
                    <ProductIntroduce
                        productInfomation={product}
                        columns={8}
                        xs={2.5}
                        md={1}
                        id="#intro"
                    />
                </Grid>

                <Grid item xs={8} sx={{ mt: 6 }} >

                    <Grid id="#spec" container columns={8} rowSpacing={1} sx={{ px: { xs: 3, sm: 10, md: 20 }, width: "100%" }}>
                        <Grid item xs={8} sx={{ mb: 1 }}>
                            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                                尺寸參考
                            </Typography>

                        </Grid>
                        <Grid item xs={8}>
                            <Divider />
                        </Grid>
                        <Grid item xs={8}>
                            <SizeTable sizeTable={sizeTable} />
                        </Grid>
                    </Grid>

                </Grid>

                <Grid item xs={8} sx={{ mt: 6 }} >

                    <Grid id="#notice" container columns={8} rowSpacing={1} sx={{ px: { xs: 3, sm: 10, md: 20 }, width: "100%" }}>
                        <Grid item xs={8} sx={{ mb: 1 }}>
                            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                                注意事項
                            </Typography>

                        </Grid>
                        <Grid item xs={8}>
                            <Divider />
                        </Grid>
                        <Grid item xs={8}>
                            <Typography component="p" sx={{ my: 3 }}>
                                購買後5天內須要付款，未付款視為取消訂單，付款後會儘快出貨，商品物流情況詳情請在訂單查詢頁面追蹤
                            </Typography>
                        </Grid>
                    </Grid>

                </Grid>

                <Grid item xs={8} sx={{ mt: 6 }} >

                    <Grid container columns={8} rowSpacing={1} sx={{ px: { xs: 3, sm: 10, md: 20 }, width: "100%" }}>
                        <Grid item xs={8} sx={{ mb: 1 }}>
                            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                                你可能也會喜歡
                            </Typography>

                        </Grid>
                        <Grid item xs={8}>
                            <Box >
                                <Slider {...settingsYouMayInterested} >
                                    {recommendProducts && recommendProducts.map((product) => (
                                        <CustomSilde key={product.productId} product={product} goToProductDetail={goToProductDetail} />
                                    ))}
                                </Slider>
                            </Box>

                        </Grid>
                    </Grid>

                </Grid>

            </Grid>

        </Box >

    )
}




interface ProductDetailPageProps {
    product: ProductInfomation | null
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

    const product = getProdcctById(productId)


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
const ProductIntroduce = ({ productInfomation, xs, md, columns, id }: ProductIntroduceProps) => {


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
                <GridContent
                    title={<Typography variant="subtitle1">顏色</Typography>}
                    content={<Typography variant="subtitle1">
                        {productInfomation.colorDescription?.join(", ")}
                    </Typography>
                    }
                    xs={xs} md={md}
                    columns={columns}
                />
            </Grid>


            <Grid item xs={columns}>
                <GridContent
                    title={<Typography variant="subtitle1">尺寸</Typography>}
                    content={
                        <Typography variant="subtitle1">
                            {productInfomation.size?.join(", ")}
                        </Typography>
                    }
                    xs={xs} md={md}
                    columns={columns}
                />
            </Grid>

            <Grid item xs={columns}>
                <GridContent
                    title={<Typography variant="subtitle1">商品材質</Typography>}
                    content={
                        <Typography variant="subtitle1">
                            {productInfomation.material?.join(", ")}
                        </Typography>
                    }
                    xs={xs} md={md}
                    columns={columns}
                />

            </Grid>

            <Grid item xs={columns}>
                <GridContent
                    title={<Typography variant="subtitle1">商品編號</Typography>}
                    content={
                        <Typography variant="subtitle1">
                            {productInfomation.productId}
                        </Typography>
                    }
                    xs={xs} md={md}
                    columns={columns}
                />

            </Grid>

            <Grid item xs={columns}>
                <GridContent
                    title={<Typography variant="subtitle1">洗滌方式</Typography>}
                    content={
                        <Typography variant="subtitle1">
                            {productInfomation.howToWash}
                        </Typography>
                    }
                    xs={xs} md={md}
                    columns={columns}
                />
            </Grid>



            <Grid item xs={columns}>
                <GridContent
                    title={<Typography variant="subtitle1">商品特色</Typography>}
                    content={<Typography variant="subtitle1">
                        {productInfomation.features}
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
    product: ProductInfomation | null,
    selectSize: string;
    selectColor: string;
    itemCount: number;
    setSelectSize: Dispatch<SetStateAction<string>>;
    setSelectColor: Dispatch<SetStateAction<string>>;
    setItemCount: Dispatch<SetStateAction<number>>;
    addProductToCart: () => void
    goToCheckoutDirectly: () => void
}

/**
 * 購買資訊
 * @component 
 */
const PurchaseDetail = ({ xs, sm, md, lg, columns, product, selectSize, selectColor, itemCount, setItemCount, setSelectSize, setSelectColor, addProductToCart, goToCheckoutDirectly }: PurchaseDetailProps) => {


    if (!product) {
        return <p>無商品資訊...</p>
    }

    const contentxs: number = columns - xs;
    const contentsm: number = columns - sm
    const contentmd: number = columns - md
    const contentlg: number = columns - lg


    const subscribeIdList = useSubscribeListStore((state) => state.subscribeIdList())
    const addToList = useSubscribeListStore((state) => state.addToList)
    const removeFromList = useSubscribeListStore((state) => state.removeFromList)

    const handeClickSubscribe = (e: ChangeEvent<HTMLInputElement>, product: ProductInfomation) => {

        if (e.target.checked) {
            addToList(product)
        } else {
            removeFromList(product.productId)
        }
    }


    const handleCountMinus = () => {
        setItemCount(i => {
            if (i - 1 < 0) {
                return 0
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

    return (
        <Grid container alignItems={"center"} columns={columns} rowSpacing={5} sx={{ px: 5, width: "100%" }} >
            <Grid item xs={8} sx={{ px: 0 }}>
                <Stack direction={"row"} justifyContent={"space-between"}>
                    <Typography variant='h5' sx={{ fontWeight: "bold", margin: "30px", mx: 0 }}>{product.title}</Typography>
                    <Checkbox checked={subscribeIdList.includes(product.productId)} icon={<FavoriteBorderIcon />} onChange={(e) => { handeClickSubscribe(e, product) }} checkedIcon={<FavoriteIcon sx={{ color: "red" }} />} />
                </Stack>

            </Grid>

            <Grid item xs={columns}>
                <GridContent
                    xs={xs} sm={sm} md={md} lg={lg}
                    columns={columns}
                    title={<Typography variant='body2'>售價</Typography>}
                    content={
                        <Stack direction={"row"} sx={{ alignItems: "center" }} spacing={1}>
                            <Typography variant='subtitle1' sx={{ textDecoration: "line-through", color: "red" }}>${product.price}</Typography>
                            <Typography sx={{ fontWeight: "bold", fontSize: "24px" }}>${product.price}</Typography>
                        </Stack>
                    }
                    alignItems="center"
                />
            </Grid>

            {/*顏色 */}
            <Grid item xs={columns}>
                <GridContent
                    xs={xs} sm={sm} md={md} lg={lg}
                    columns={columns}
                    title={<Typography variant='body2'>顏色</Typography>}
                    content={
                        <Grid container columns={8} spacing={1}>
                            {
                                product.color
                                    ?
                                    product.color.map((s, index) => (

                                        <Grid key={s} item xs={2} sm={2.5} md={2} lg={1}>
                                            <Stack onClick={() => { setSelectColor(s) }} alignItems={"center"}
                                                sx={{ border: s === selectColor ? "1px solid #61D1BD" : "1px solid #d9d9d9", width: "30px", p: 0.5, borderRadius: "4px", cursor: "pointer" }}>
                                                <Box sx={{ background: s, minWidth: "30px", minHeight: "30px" }}></Box>

                                            </Stack>
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
                    }
                    alignItems="center"
                />

            </Grid>


            <Grid item xs={columns}>

                <GridContent
                    xs={xs} sm={sm} md={md} lg={lg}
                    columns={columns}
                    title={<Typography variant='body2'>規格</Typography>}
                    content={
                        <Grid container columns={8} spacing={1}>
                            {
                                product.size
                                    ?
                                    product.size.map((s, index) => (

                                        <Grid key={s} item xs={2} sm={2.5} md={2} lg={1}>
                                            <Stack onClick={() => { setSelectSize(s) }} alignItems={"center"} sx={{ border: s === selectSize ? "1px solid #61D1BD" : "1px solid #d9d9d9", minWidth: "25px", minHeight: "25px", p: 0.5, borderRadius: "4px", cursor: "pointer" }}>
                                                <Typography >{s}</Typography>
                                            </Stack>
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
                    }
                    alignItems="center"
                />

            </Grid>

            <Grid item xs={columns}>
                <GridContent
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


const fakeProductInfomation: ProductInfomation =
{
    title: "超時尚流蘇几皮外套",
    productId: "26790367",
    stock: 60,
    price: 100,
    size: ["S", "M", "L", "XL", "2XL", "3XL"],
    color: ["black", "wheat", "brown"],
    colorDescription: ["黑色", "白色", "深藍色", "灰色", "深灰色", "紅色"],
    material: ["聚酯纖維", "聚氨酯纖維"],
    howToWash: "洗衣機（水溫40度）, 不可乾洗, 不可烘乾。本商品會在流汗或淋雨弄濕時，或因摩擦而染色到其他衣物上，敬請注意。",
    features: "其實我也不知道要說什麼...a 其實我也不知道要說什麼...a 其實我也不知道要說什麼...a"

}



interface ProductIntroduceProps {
    productInfomation: ProductInfomation;
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
    product: ProductInfomation;

    goToProductDetail: (productId: string) => void
}

/**
 * 你可能也會喜歡
 * @component
 */
const CustomSilde = ({ product, goToProductDetail }: CustomSildeProps) => {


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
                        <Typography>NT${product.price}</Typography>
                        <Typography variant="subtitle2" sx={{ textDecoration: 'line-through' }}>定價NT${product.price}</Typography>
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




interface GoToTopButtonProps {
    handleScrollTop: () => void;
}

interface BottomBarProps {
    product: ProductInfomation,
    addProductToCart: () => void
    goToCheckoutDirectly: () => void
}


/**
 * 顯示於底部的bar，當screen size  小於 md 才會出現
 * 
 * @component
 */
const BottomBar = ({ product, addProductToCart, goToCheckoutDirectly }: BottomBarProps) => {
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