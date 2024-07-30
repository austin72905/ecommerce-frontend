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
import ProductImage2 from '/public/images/輪播圖2.jpg'
import ProductImage3 from '/public/images/輪播圖3.jpg'
import Image from "next/image";
import { AppBar, Box, Button, Card, CardContent, CardHeader, Container, Divider, List, ListItem, ListItemButton, ListItemText, Stack, Tabs, TextField, Toolbar, Typography, useMediaQuery, useTheme } from "@mui/material";
import Grid from '@mui/material/Grid';
import { useEffect, useRef, useState } from "react";
import Link from "next/link";


import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'


export default function ProductDetailPage() {

    const [activeSlide, setActiveSlide] = useState(0)
    
    const theme =useTheme()
    const isSmallScreen:boolean=useMediaQuery(theme.breakpoints.down('sm'))
    const settings = {
        dots: true,
        infinite: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        nextArrow: <SampleNextArrow isSmallScreen={isSmallScreen}/>,
        prevArrow: <SamplePrevArrow isSmallScreen={isSmallScreen}/>,
        appendDots: (dots: any) => (
            <div
                style={{
                    position: 'absolute',
                    bottom: '15px',
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'center'
                }}
            >
                <ul style={{ margin: '0px' }}>{dots}</ul>
            </div>
        ),
        beforeChange: (current: any, next: any) => setActiveSlide(next)


    }

    const [productInfo, setProductInfo] = useState<ProductInfomationCount>({ ...fakeProductInfomation, count: 1 })
    const [selectSize, setSelectSize] = useState("")

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
        ProductImage3,]


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


    return (
        <Box sx={{ px: 0 }}>

            <AppBar
                position="fixed"
                sx={{
                    top: showNavBar ? { sm: "64px", xs: "56px" } : '-50px',
                    height: "50px",
                    opacity: "0.9",
                    transition: 'top 0.3s',
                    zIndex: "1"
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
            <Grid container columns={8} spacing={3} >
                <Grid item lg={4} md={4} sm={4} xs={8}  >
                    <Stack direction={"column"} alignItems={"center"} sx={{ border: "0px solid" }}>

                        {/*輪播圖 */}
                        <Box sx={{ p: 0, m: 2, mb: 1, maxWidth: "400px", maxHeight: "400px", width: '100%', height: 'auto' }}>

                            <Slider {...settings} ref={sliderRef} >
                                <Box sx={{ position: 'relative', width: '100%', paddingBottom: '100%' }}>
                                    <Image src={ProductImage} alt="ProductImage" fill style={{ objectFit: "cover" }} />
                                </Box>
                                <Box sx={{ position: 'relative', width: '100%', paddingBottom: '100%' }}>
                                    <Image src={ProductImage1} alt="ProductImage1" fill style={{ objectFit: "cover" }} />
                                </Box>
                                <Box sx={{ position: 'relative', width: '100%', paddingBottom: '100%' }}>
                                    <Image src={ProductImage2} alt="ProductImage2" fill style={{ objectFit: "cover" }} />
                                </Box>
                                <Box sx={{ position: 'relative', width: '100%', paddingBottom: '100%' }}>
                                    <Image src={ProductImage3} alt="ProductImage3" fill style={{ objectFit: "cover" }} />
                                </Box>



                            </Slider>

                        </Box>

                        <Box >
                            <List sx={{ border: "0px solid", width: "300px", height: "52px", padding: 0, margin: 0, justifyContent: "center", alignItems: "center", display: "flex", flexDirection: "row" }}>

                                {imgList.map((item, index) => (
                                    <ListItem key={index} sx={{ px: 0 }} onClick={() => { handleSlider(index) }}>
                                        <Box sx={{ width: "50px", height: "50px", border: activeSlide === index ? "1px orange solid" : "none" }}>
                                            <Image src={item} alt="ProductImage" width={50} height={50} />
                                        </Box>
                                    </ListItem>
                                ))}

                            </List>
                        </Box>

                    </Stack>



                </Grid>
                <Grid item lg={4} md={4} sm={4} xs={8} >
                    <Stack direction={"column"} alignItems={"center"} sx={{ width: '100%' }}>
                        <Stack sx={{ maxWidth: "400px", width: '100%', border: "0px solid" }} >
                            <Stack>
                                <Typography variant='h5' sx={{ fontWeight: "bold", margin: "30px" }}>好男人需要時我都在衛生紙(10入)</Typography>
                            </Stack>
                            <Stack sx={{
                                my:
                                {
                                    md: "30px",
                                    sm: "10px"
                                }
                            }}>
                                <Typography variant='subtitle1' sx={{ mx: "30px" }}>100%純棉</Typography>
                                <Typography variant='subtitle1' sx={{ mx: "30px" }}>立體修身剪裁(圖示的部分)</Typography>
                                <Typography variant='subtitle1' sx={{ mx: "30px" }}>吸水性強(衛生紙?)</Typography>

                            </Stack>
                            <Stack direction={"row"} alignItems={'center'} spacing={3} sx={{ mx: "30px", mb: "10px" }}>
                                <Typography variant='body2'>售價</Typography>

                                <Stack direction={"row"} sx={{ alignItems: "center" }} spacing={1}>
                                    <Typography variant='subtitle1' sx={{ textDecoration: "line-through", color: "red" }}>$1000</Typography>
                                    <Typography sx={{ fontWeight: "bold", fontSize: "24px" }}>$100</Typography>
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
                                {/*數量欄 */}
                                <Box sx={{ display: "flex", ml: "30px" }}>
                                    <RemoveIcon onClick={handleCountMinus} sx={{ "&:hover": { cursor: "pointer" }, color: "#AFAFAF", border: "solid 1px", height: "38px", width: "38px", borderTopLeftRadius: "4px", borderBottomLeftRadius: "4px" }} />
                                    <TextFieldWrapper value={itemCount} size='small' inputProps={{ style: { textAlign: "center" } }} ></TextFieldWrapper>
                                    <AddIcon onClick={handleCountPlus} sx={{ "&:hover": { cursor: "pointer" }, color: "#AFAFAF", border: "solid 1px", height: "38px", width: "38px", borderTopRightRadius: "4px", borderBottomRightRadius: "4px" }} />
                                </Box>
                            </Stack>
                            <Box sx={{ flexFlow: 1, border: "0px solid", display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
                                <Stack direction={"row"} sx={{ m: "30px", mb: "0px", mt: "60px", border: "0px solid" }} spacing={"10px"}>
                                    <Button variant="outlined" >加入購物車</Button>
                                    <Button variant="contained">直接購買</Button>
                                </Stack>
                            </Box>

                        </Stack>
                    </Stack>


                </Grid>

                <Grid item xs={8} sx={{ mt: 6 }}>
                    <Divider />
                    <Box id="#intro" sx={{ height: "auto", mt: 1 }} >

                        <Accordion id="#intro" sx={{ boxShadow: "none" }}>
                            <AccordionSummary
                                expandIcon={<ArrowDropDownIcon />}
                                aria-controls="panel1-content"
                            >
                                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                                    商品介紹
                                </Typography>
                            </AccordionSummary>
                            <AccordionDetails sx={{ height: "400px" }}>
                                <Typography component="p" sx={{ my: 3 }}>
                                    超質感暖男衛生紙，無論上廁所要擦屁股、感冒擤鼻涕、還是室友的鳥拉屎在地板上，只要你需要的時候，我都在。
                                </Typography>
                            </AccordionDetails>
                        </Accordion>




                    </Box>
                </Grid>
                <Grid item xs={8}>
                    <Divider />
                    <Box id="#spec" sx={{ height: "auto", mt: 1  }} >

                        <Accordion sx={{ boxShadow: "none" }}>
                            <AccordionSummary
                                expandIcon={<ArrowDropDownIcon />}
                                aria-controls="panel2-content"
                            >
                                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                                    產品規格
                                </Typography>
                            </AccordionSummary>
                            <AccordionDetails sx={{ height: "400px" }}>
                                <Typography component="p" sx={{ my: 3 }}>
                                    購買後5天內須要付款，未付款視為取消訂單，付款後會儘快出貨，商品物流情況詳情請在訂單查詢頁面追蹤
                                </Typography>
                            </AccordionDetails>
                        </Accordion>




                    </Box>

                </Grid>
                <Grid item xs={8}>
                    <Divider />
                    <Box id="#notice" sx={{ height: "auto", mt: 1 }} >

                        <Accordion sx={{ boxShadow: "none" }}>
                            <AccordionSummary
                                expandIcon={<ArrowDropDownIcon />}
                                aria-controls="panel3-content"
                            >
                                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                                    注意事項
                                </Typography>
                            </AccordionSummary>
                            <AccordionDetails sx={{ height: "400px" }}>
                                <Typography component="p" sx={{ my: 3 }}>
                                    購買後5天內須要付款，未付款視為取消訂單，付款後會儘快出貨，商品物流情況詳情請在訂單查詢頁面追蹤
                                </Typography>
                            </AccordionDetails>
                        </Accordion>




                    </Box>

                </Grid>

            </Grid>

        </Box>

    )
}




function SampleNextArrow(props: any) {
    const { className, style, onClick,isSmallScreen } = props;
    return (
        <div
            className={className}
            style={{ ...style, display: isSmallScreen?"none":"block", right: "10px" }}
            onClick={onClick}
        />
    );
}



function SamplePrevArrow(props: any) {
    const { className, style, onClick,isSmallScreen } = props;
    return (
        <div
            className={className}
            style={{ ...style, display: isSmallScreen?"none":"block", left: 10, zIndex: 1 }}
            onClick={onClick}
        />
    );
}


const fakeProductInfomation: ProductInfomation =
{
    title: "好男人需要時我都在衛生紙(10入)",
    productId: 1,
    stock: 60,
    price: 100,
    size: ["S", "M", "L", "XL"]
}



interface ProductInfomation {
    productId: number;
    title: string;
    price: number;
    stock: number;

    size?: string[];
    selectSize?: string;
}


interface ProductInfomationCount extends ProductInfomation {
    count: number
}


const TextFieldWrapper = styled(TextField)(
    {
        /*修改 focus 時外框的顏色  */
        "& .MuiOutlinedInput-root.Mui-focused": {
            "& > fieldset": {
                borderColor: "#AFAFAF"
            }
        },
        /*修改外框的弧度 */
        '& fieldset': { borderRadius: "0px" },
        maxWidth: "70px",

    })


const ListWrapper = styled("ul")(
    {
        paddingLeft: "0px",
        margin: "0px"
    })