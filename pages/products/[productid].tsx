import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import styled from '@mui/system/styled'
import ProductImage from '/public/images/朋朋衛生紙商品圖.jpg'
import ProductImage1 from '/public/images/輪播圖1.jpg'
import ProductImage2 from '/public/images/coat4.jpg'
import ProductImage3 from '/public/images/coat3.jpg'
import ProductImage4 from '/public/images/coat1.jpg'
import ProductImage5 from '/public/images/coat2.jpg'
import Image from "next/image";
import { AppBar, Box, Button, Card, CardContent, CardHeader, CardMedia, Container, Divider, IconButton, List, ListItem, ListItemButton, ListItemText, SpeedDial, SpeedDialIcon, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tabs, TextField, Toolbar, Typography, useMediaQuery, useTheme } from "@mui/material";
import Grid, { GridSize } from '@mui/material/Grid';
import { useEffect, useRef, useState } from "react";
import Link from "next/link";


import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { useRouter } from "next/router";

export default function ProductDetailPage() {

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

    const [productInfo, setProductInfo] = useState<ProductInfomationCount>({ ...fakeProductInfomation, count: 1 })
    const [selectSize, setSelectSize] = useState("")
    const [selectColor, setSelectColor] = useState("")

    const [itemCount, setItemCount] = useState<number>(1)

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

    const [viewValue, setviewValue] = useState<string>("商品介紹")

    const handleView = (e: React.SyntheticEvent, newVal: string) => {
        setviewValue(newVal)
    }

    const imgList = [
        ProductImage,
        ProductImage1,
        ProductImage2,
        ProductImage3,
        ProductImage4
    ]

    const products = [
        { id: 1, pic: ProductImage, title: "好朋友衛生紙" },
        { id: 2, pic: ProductImage2, title: "好朋友衛生紙" },
        { id: 3, pic: ProductImage3, title: "好朋友衛生紙" },
        { id: 4, pic: ProductImage4, title: "好朋友衛生紙" },
        { id: 5, pic: ProductImage5, title: "好朋友衛生紙" }
    ]


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
            element.scrollIntoView({ behavior: 'smooth' });
        }


    }


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

    const goToProductDetail = () => {
        router.push("/products/7aa1aas61cx1vs6d54fa96")
    }

    return (
        <Box sx={{ px: 0 }}>

            <SpeedDial
                ariaLabel="SpeedDial basic example"
                sx={{
                    position: "fixed",
                    bottom: "150px",
                    right: "30px",
                    '& .MuiFab-primary': {
                        width: 45,
                        height: 45,
                        bgcolor: "white",
                        boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.2)",
                        border: "0px solid grey",
                        opacity: "0.8"

                    }
                }}
                open={false}
                icon={<KeyboardArrowUpIcon sx={{ color: "grey" }} />}
                onClick={handleScrollTop}

            >

            </SpeedDial>

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
                                        <ListItemText sx={{ color: "grey" }} primary="產品規格" />
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


            <AppBar
                position="fixed"
                sx={{
                    top: "auto",
                    bottom: {
                        lg: "-50px",

                        xs: "0px"
                    },
                    transition: "bottom 0.3s",
                    height: "50px",
                    opacity: "0.9",
                    zIndex: "999",
                    border: "solid 0px black",
                    backgroundColor:"white"
                }}>
                <Container sx={{ px: 0 }}>
                    <Toolbar sx={{ height: "50px", minHeight: "50px !important", display: 'flex' }}>
                        <Stack direction={"row"} alignItems={"center"} sx={{ width: "100%" }} spacing={2}>
                            <Typography sx={{color:"grey"}}>NT100</Typography>
                            <Stack direction={"row"} justifyContent={"flex-end"} sx={{ flexGrow: 1, gap: 1, justifyContent: "flex-end", border: "0px solid black" }}>
                                <Button variant="outlined" sx={{ flexGrow: 1}}>加入購物車</Button>
                                <Button variant="contained" sx={{ flexGrow: 1 }}>直接購買</Button>
                            </Stack>

                        </Stack>
                    </Toolbar>
                </Container>

            </AppBar>

            <Grid container columns={8} spacing={3} >
                <Grid item lg={4} md={4} sm={4} xs={8}  >
                    <Stack direction={"column"} alignItems={"center"} sx={{ border: "0px solid", mb: 10 }}>

                        {/*輪播圖 */}
                        <Box sx={{ p: 0, m: 2, mb: 1, maxWidth: "400px", maxHeight: "400px", width: '100%', height: 'auto' }}>

                            <Slider {...settings} ref={sliderRef} >
                                <Box sx={{ position: 'relative', width: '100%', paddingBottom: '120%' }}>
                                    <Image src={ProductImage4} alt="ProductImage4" fill style={{ objectFit: "cover" }} />
                                </Box>
                                <Box sx={{ position: 'relative', width: '100%', paddingBottom: '120%' }}>
                                    <Image src={ProductImage1} alt="ProductImage1" fill style={{ objectFit: "cover" }} />
                                </Box>
                                <Box sx={{ position: 'relative', width: '100%', paddingBottom: '120%' }}>
                                    <Image src={ProductImage2} alt="ProductImage2" fill style={{ objectFit: "cover" }} />
                                </Box>
                                <Box sx={{ position: 'relative', width: '100%', paddingBottom: '120%' }}>
                                    <Image src={ProductImage3} alt="ProductImage3" fill style={{ objectFit: "cover" }} />
                                </Box>
                                <Box sx={{ position: 'relative', width: '100%', paddingBottom: '120%' }}>
                                    <Image src={ProductImage} alt="ProductImage" fill style={{ objectFit: "cover" }} />
                                </Box>


                            </Slider>

                        </Box>



                    </Stack>



                </Grid>
                <Grid item lg={4} md={4} sm={4} xs={8}>

                    <Grid container alignItems={"center"} columns={8} rowSpacing={5} sx={{ px: 5, width: "100%" }} >
                        <Grid item xs={8} sx={{ px: 0 }}>
                            <Typography variant='h5' sx={{ fontWeight: "bold", margin: "30px", mx: 0 }}>好男人需要時我都在衛生紙(10入)</Typography>
                        </Grid>

                        <Grid item xs={2} sm={2.5} md={2} lg={1.5}>
                            <Typography variant='body2'>售價</Typography>
                        </Grid>

                        <Grid item xs={6} sm={5.5} md={6} lg={6.5}>
                            <Stack direction={"row"} sx={{ alignItems: "center" }} spacing={1}>
                                <Typography variant='subtitle1' sx={{ textDecoration: "line-through", color: "red" }}>$1000</Typography>
                                <Typography sx={{ fontWeight: "bold", fontSize: "24px" }}>$100</Typography>
                            </Stack>
                        </Grid>

                        <Grid item xs={2} sm={2.5} md={2} lg={1.5}>
                            <Typography variant='body2'>顏色</Typography>
                        </Grid>

                        <Grid item xs={6} sm={5.5} md={6} lg={6.5}>

                            {/*顏色 */}
                            <Grid container columns={8} >
                                {
                                    productInfo.color
                                        ?
                                        productInfo.color.map((s, index) => (

                                            <Grid item xs={2} sm={2.5} md={2} lg={1}>
                                                <Stack key={s} onClick={() => { setSelectColor(s) }} alignItems={"center"}
                                                    sx={{ border: s === selectColor ? "1px solid #61D1BD" : "1px solid #d9d9d9", width: "30px", p: 0.5, borderRadius: "4px", cursor: "pointer" }}>
                                                    <Box sx={{ background: s, minWidth: "30px", minHeight: "30px" }}></Box>

                                                </Stack>
                                            </Grid>


                                        ))
                                        :

                                        <Stack alignItems={"center"} sx={{ border: "1px solid #d9d9d9", width: "40px", p: 0.5, borderRadius: "4px" }}>
                                            <Typography sx={{ color: "#AFAFAF" }} variant='caption'>標準</Typography>
                                        </Stack>
                                }
                            </Grid>

                            
                        </Grid>

                        <Grid item xs={2} sm={2.5} md={2} lg={1.5}>
                            <Typography variant='body2'>規格</Typography>
                        </Grid>

                        <Grid item xs={6} sm={5.5} md={6} lg={6.5}>
                            {/*規格 */}
                            <Grid container columns={8} spacing={1}>
                                {
                                    productInfo.size
                                        ?
                                        productInfo.size.map((s, index) => (

                                            <Grid item xs={2} sm={2.5} md={2} lg={1}>
                                                <Stack key={s} onClick={() => { setSelectSize(s) }} alignItems={"center"} sx={{ border: s === selectSize ? "1px solid #61D1BD" : "1px solid #d9d9d9", minWidth: "25px", minHeight: "25px", p: 0.5, borderRadius: "4px", cursor: "pointer" }}>
                                                    <Typography >{s}</Typography>
                                                </Stack>
                                            </Grid>


                                        ))
                                        :

                                        <Stack alignItems={"center"} sx={{ border: "1px solid #d9d9d9", width: "40px", p: 0.5, borderRadius: "4px" }}>
                                            <Typography sx={{ color: "#AFAFAF" }} variant='caption'>標準</Typography>
                                        </Stack>
                                }
                            </Grid>

                        </Grid>

                        <Grid item xs={2} sm={2.5} md={2} lg={1.5}>
                            <Typography variant='body2'>數量</Typography>
                        </Grid>

                        <Grid item xs={6} sm={5.5} md={6} lg={6.5}>
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                                <RemoveIcon onClick={handleCountMinus} sx={{ "&:hover": { cursor: "pointer" }, color: "#AFAFAF", border: "solid 1px", height: "30px", width: "30px", borderRadius: "4px" }} />
                                <TextFieldWrapper value={itemCount} size='small' inputProps={{ style: { textAlign: "center" } }} ></TextFieldWrapper>
                                <AddIcon onClick={handleCountPlus} sx={{ "&:hover": { cursor: "pointer" }, color: "#AFAFAF", border: "solid 1px", height: "30px", width: "30px", borderRadius: "4px" }} />
                            </Box>
                        </Grid>

                        <Grid item xs={8}>
                            <Stack direction={"row"} justifyContent={"start"} sx={{ gap: 1, mt: 5, border: "0px solid black", display: { xs: "none", sm: "none", md: "none", lg: "flex" } }}>
                                <Button variant="outlined" disableRipple sx={{ flexGrow: 1 }}>加入購物車</Button>
                                <Button variant="contained" disableRipple sx={{ flexGrow: 1 }}>直接購買</Button>
                            </Stack>
                        </Grid>
                    </Grid>



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
                        productInfomation={fakeProductInfomation}
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
                                    {products.map((product) => (
                                        <CustomSilde key={product.id} product={product} goToProductDetail={goToProductDetail} />

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


interface SizeTableProps {
    sizeTable: SizeTableDetails[]
}

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

            <Grid item xs={xs} md={md}>
                <Typography variant="subtitle1">
                    顏色
                </Typography>
            </Grid>
            <Grid item xs={columns - xs} md={columns - md}>
                <Typography variant="subtitle1">
                    {productInfomation.colorDescription?.join(", ")}
                </Typography>
            </Grid>
            <Grid item xs={xs} md={md}>
                <Typography variant="subtitle1">
                    尺寸
                </Typography>
            </Grid>
            <Grid item xs={columns - xs} md={columns - md}>
                <Typography variant="subtitle1">
                    {productInfomation.size?.join(", ")}
                </Typography>
            </Grid>
            <Grid item xs={xs} md={md}>
                <Typography variant="subtitle1">
                    商品材質
                </Typography>
            </Grid>
            <Grid item xs={columns - xs} md={columns - md}>
                <Typography variant="subtitle1">
                    {productInfomation.material?.join(", ")}
                </Typography>
            </Grid>
            <Grid item xs={xs} md={md}>
                <Typography variant="subtitle1">
                    商品編號
                </Typography>
            </Grid>
            <Grid item xs={columns - xs} md={columns - md}>
                <Typography variant="subtitle1">
                    {productInfomation.productId}
                </Typography>
            </Grid>
            <Grid item xs={xs} md={md}>
                <Typography variant="subtitle1">
                    洗滌方式
                </Typography>
            </Grid>
            <Grid item xs={columns - xs} md={columns - md}>
                <Typography variant="subtitle1">
                    {productInfomation.howToWash}
                </Typography>
            </Grid>
            <Grid item xs={xs} md={md}>
                <Typography variant="subtitle1">
                    商品特色
                </Typography>
            </Grid>
            <Grid item xs={columns - xs} md={columns - md}>
                <Typography variant="subtitle1">
                    {productInfomation.features}
                </Typography>
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

interface ProductInfomation {
    productId: string;
    title: string;
    price: number;
    stock: number;
    color?: string[];
    size?: string[];
    selectSize?: string;
    howToWash?: string;
    features?: string;
    material?: string[];
    colorDescription?: string[];
}


interface ProductInfomationCount extends ProductInfomation {
    count: number
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


const ListWrapper = styled("ul")(
    {
        paddingLeft: "0px",
        margin: "0px"
    })


const CustomSilde = (props: any) => {
    const { index, product, goToProductDetail, ...otherProps } = props;

    return (
        <Box {...otherProps} style={{ margin: "10px" }}>
            <Card sx={{ boxShadow: "none" }}>
                <CardMedia sx={{ '&:hover': { cursor: "pointer" } }} onClick={goToProductDetail}>

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
                            src={product.pic}
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
                        <Typography sx={{ fontWeight: { md: "bold", xs: "normal" }, fontSize: { xs: "14px" }, '&:hover': { cursor: "pointer" } }} onClick={goToProductDetail}>好男人需要時我都在衛生</Typography>
                        <Typography>NT$100</Typography>
                        <Typography variant="subtitle2" sx={{ textDecoration: 'line-through' }}>定價NT$1000</Typography>
                    </Stack>
                </CardContent>

            </Card>
        </Box>
    )
}




// #region

{/* <Stack direction={"column"} alignItems={"center"} sx={{ width: '100%', mb: { xs: 0, sm: 8 }, minHeight: "500px" }}>
                        <Stack sx={{ maxWidth: "400px", width: '100%', border: "0px solid" }} >
                            <Stack>
                                <Typography variant='h5' sx={{ fontWeight: "bold", margin: "30px" }}>好男人需要時我都在衛生紙(10入)</Typography>
                            </Stack>

                            <Stack direction={"row"} alignItems={'center'} spacing={3} sx={{ mx: "30px", mb: "10px" }}>
                                <Typography variant='body2'>售價</Typography>

                                <Stack direction={"row"} sx={{ alignItems: "center" }} spacing={1}>
                                    <Typography variant='subtitle1' sx={{ textDecoration: "line-through", color: "red" }}>$1000</Typography>
                                    <Typography sx={{ fontWeight: "bold", fontSize: "24px" }}>$100</Typography>
                                </Stack>

                            </Stack>
                           
                            <Stack direction={"row"} alignItems={'center'} spacing={3} sx={{ mx: "30px", mt: "10px", mb: "20px" }}>
                                <Typography variant='body2'>顏色</Typography>
                                <Stack direction={"row"} spacing={1}>
                                    {
                                        productInfo.color
                                            ?
                                            productInfo.color.map((s, index) => (
                                                <Stack key={s} onClick={() => { setSelectColor(s) }} alignItems={"center"}
                                                    sx={{ border: s === selectColor ? "1px solid #61D1BD" : "1px solid #d9d9d9", width: "30px", p: 0.5, borderRadius: "4px", cursor: "pointer" }}>
                                                    <Box sx={{ background: s, minWidth: "30px", minHeight: "30px" }}></Box>

                                                </Stack>
                                            ))
                                            :

                                            <Stack alignItems={"center"} sx={{ border: "1px solid #d9d9d9", width: "40px", p: 0.5, borderRadius: "4px" }}>
                                                <Typography sx={{ color: "#AFAFAF" }} variant='caption'>標準</Typography>
                                            </Stack>
                                    }

                                </Stack>
                            </Stack>
                            <Stack direction={"row"} alignItems={'center'} spacing={3} sx={{ mx: "30px", mt: "10px", mb: "20px" }}>
                                <Typography variant='body2'>規格</Typography>
                                <Stack direction={"row"} spacing={1}>
                                    {
                                        productInfo.size
                                            ?
                                            productInfo.size.map((s, index) => (
                                                <Stack key={s} onClick={() => { setSelectSize(s) }} alignItems={"center"} sx={{ border: s === selectSize ? "1px solid #61D1BD" : "1px solid #d9d9d9", width: "40px", p: 0.5, borderRadius: "4px", cursor: "pointer" }}>
                                                    <Typography >{s}</Typography>
                                                </Stack>
                                            ))
                                            :

                                            <Stack alignItems={"center"} sx={{ border: "1px solid #d9d9d9", width: "40px", p: 0.5, borderRadius: "4px" }}>
                                                <Typography sx={{ color: "#AFAFAF" }} variant='caption'>標準</Typography>
                                            </Stack>
                                    }

                                </Stack>
                            </Stack>

                            <Stack direction={"row"} alignItems={'center'} spacing={3} sx={{ mx: "30px" }}>
                                <Typography variant='body2'>數量</Typography>
                                
                                <Box sx={{ display: "flex", ml: "30px" }}>
                                    <RemoveIcon onClick={handleCountMinus} sx={{ "&:hover": { cursor: "pointer" }, color: "#AFAFAF", border: "solid 1px", height: "38px", width: "38px", borderTopLeftRadius: "4px", borderBottomLeftRadius: "4px" }} />
                                    <TextFieldWrapper value={itemCount} size='small' inputProps={{ style: { textAlign: "center" } }} ></TextFieldWrapper>
                                    <AddIcon onClick={handleCountPlus} sx={{ "&:hover": { cursor: "pointer" }, color: "#AFAFAF", border: "solid 1px", height: "38px", width: "38px", borderTopRightRadius: "4px", borderBottomRightRadius: "4px" }} />
                                </Box>
                            </Stack>

                            <Stack direction={"row"} justifyContent={"flex-end"} sx={{ flexGrow: 1, gap: 1, mt: 5, px: 3.5, border: "0px solid black", display: { xs: "none", sm: "none", md: "none", lg: "flex" } }}>
                                <Button variant="outlined" disableRipple sx={{ flexGrow: 1 }}>加入購物車</Button>
                                <Button variant="contained" disableRipple sx={{ flexGrow: 1 }}>直接購買</Button>
                            </Stack>

                        </Stack>
                    </Stack>

                     */}
// # endregion