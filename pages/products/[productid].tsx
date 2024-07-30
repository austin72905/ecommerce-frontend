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
import { Box, Button, List, ListItem, Stack, TextField, Typography } from "@mui/material";
import Grid from '@mui/material/Grid';
import { useRef, useState } from "react";
import Link from "next/link";

export default function ProductDetailPage() {

    const [activeSlide, setActiveSlide] = useState(0)

    const settings = {
        dots: true,
        infinite: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        nextArrow: <SampleNextArrow />,
        prevArrow: <SamplePrevArrow />,
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

    const handleLinkClick=(event: React.MouseEvent<HTMLAnchorElement, MouseEvent>, id: string)=>{
        event.preventDefault()
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }

    }

    return (
        <Box sx={{ px: 2 }}>
            <ul style={{position:"absolute"}}>
                <li>
                    <Link href="#" onClick={(e) => handleLinkClick(e, '#intro')}>intro</Link>
                </li>
                <li>
                    <Link href="#" onClick={(e) => handleLinkClick(e, '#spec')}>spec</Link>
                </li>
                <li>
                    <Link href="#" onClick={(e) => handleLinkClick(e, '#notice')}>notice</Link>
                </li>
            </ul>
            <Grid container columns={8} spacing={3} >
                <Grid item lg={4} md={4} sm={4} xs={8}>
                    <Stack direction={"column"} alignItems={"center"} sx={{ border: "0px solid" }}>

                        {/*輪播圖 */}
                        <Box sx={{ p: 2, m: 2, mb: 1, maxWidth: "400px", maxHeight: "400px", width: '100%', height: 'auto' }}>

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
                <Grid item lg={4} md={4} sm={4} xs={8}>
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
                <Grid item md={8}>
                    {/*tabs 等產品規格 */}
                    <Stack direction={"column"} alignItems={"center"} sx={{ width: '100%',minHeight:"400px",mt:5 }}>
                        <TabContext value={viewValue}>
                            <TabList onChange={handleView} >

                                <Tab value="商品介紹" label="商品介紹" sx={{ border: "1px solid #AFAFAF", borderTopLeftRadius: "4px", borderBottomLeftRadius: "4px" }}></Tab>
                                <Tab value="產品規格" label="產品規格" sx={{ border: "1px solid #AFAFAF" }}></Tab>
                                <Tab value="注意事項" label="注意事項" sx={{ border: "1px solid #AFAFAF", borderTopRightRadius: "4px", borderBottomRightRadius: "4px" }}></Tab>


                            </TabList>


                            <TabPanel value="商品介紹" >
                                <Stack spacing={3} direction={"column"} sx={{width:"100%"}}>
                                    
                                    <Typography >超質感暖男衛生紙，無論上廁所要擦屁股、感冒擤鼻涕、還是室友的鳥拉屎在地板上，只要你需要的時候，我都在。</Typography>
                                </Stack>
                            </TabPanel>


                            <TabPanel value="產品規格" >
                                <Stack spacing={3} direction={"column"}>
                                    
                                    <Typography >
                                        購買後5天內須要付款，未付款視為取消訂單，付款後會儘快出貨，商品物流情況詳情請在訂單查詢頁面追蹤
                                    </Typography>
                                    <List sx={{p:0,m:0}}>
                                        <ListItem sx={{p:0,m:0}}>
                                            <Typography>好男友暖男衛生紙10包</Typography>
                                        </ListItem>
                                        <ListItem  sx={{p:0,m:0}}>
                                            <Typography>每包有若干衛生紙</Typography>
                                        </ListItem>
                                        <ListItem  sx={{p:0,m:0}}>
                                            <Typography>封口處易脫落，使用請小心</Typography>
                                        </ListItem>
                                        <ListItem  sx={{p:0,m:0}}>
                                            <Typography>產品背面印有粉絲專頁instgram</Typography>
                                        </ListItem>
                                    </List>
                                    
                                    
                                </Stack>
                            </TabPanel>

                            <TabPanel value="注意事項" >
                                <Stack spacing={3} >
                                    
                                    <Typography >
                                        購買後5天內須要付款，未付款視為取消訂單，付款後會儘快出貨，商品物流情況詳情請在訂單查詢頁面追蹤
                                    </Typography>
                                    <Link href="#section1">aaa</Link>
                                </Stack>
                            </TabPanel>
                        </TabContext>
                    </Stack>


                </Grid>
                <Grid item xs={8}>
                    
                    <Box id="#intro" sx={{height:"500px"}}>商品介紹</Box>
                    </Grid>
                <Grid item xs={8}>
                    <Box id="#spec" sx={{height:"500px"}}>產品規格</Box>
                    </Grid>
                <Grid item xs={8}>
                    <Box id="#notice" sx={{height:"500px"}}>注意事項</Box>
                </Grid>

            </Grid>

        </Box>

    )
}




function SampleNextArrow(props: any) {
    const { className, style, onClick } = props;
    return (
        <div
            className={className}
            style={{ ...style, display: "block", right: "10px" }}
            onClick={onClick}
        />
    );
}



function SamplePrevArrow(props: any) {
    const { className, style, onClick } = props;
    return (
        <div
            className={className}
            style={{ ...style, display: "block", left: 10, zIndex: 1 }}
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