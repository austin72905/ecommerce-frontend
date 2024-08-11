import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import styled from '@mui/system/styled';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import CardActions from '@mui/material/CardActions';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import Stepper from '@mui/material/Stepper';
import MobileStepper from '@mui/material/MobileStepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepConnector, { stepConnectorClasses } from '@mui/material/StepConnector';
import { StepIconProps } from '@mui/material/StepIcon';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';


import React, { useState } from 'react'

import ProductImage from '/public/images/coat2.jpg'
import { CardHeader, Divider, useMediaQuery } from '@mui/material';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { ProductInfomationCount } from '@/interfaces';
import { orderInfoList } from '@/dummy-data/order-dummy-data';

export default function OrderRecordPage() {

    const { pathname } = useRouter();
    //console.log("pathname",pathname)
    const lastPath = pathname.split('/')
    //console.log("lastPath",lastPath)

    //const [orderInfoDetail, setOrderInfoDetail] = useState<OrderInfomation>(null)


    //{lastPath.includes("TX")?}
    return (
        <Box sx={{ px: 2 }}>
            <PurchaseRecord />
        </Box>


    )
}

const orderStates: string[] = [
    "所有訂單",
    "待付款",
    "待出貨",
    "待取貨",
    "已完成",
    "已取消",
    "退貨/款"
]

const StepIcon = (props: StepIconProps) => {

    const { active, completed, className } = props
    //console.log("active", active)

    return (
        <StepIconRoot>
            {completed ? (
                <div />
            ) : (
                <div className="step-uncompleted" />
            )}
        </StepIconRoot>

    )
}

const StepIconRoot = styled('div')(({ theme }) => ({
    marginLeft: "5px",
    borderRadius: '50%',
    background: theme.palette.primary.main,
    width: 15,
    height: 15,
    '& .step-uncompleted': {
        borderRadius: '50%',
        width: 15,
        height: 15,
        backgroundColor: '#AFAFAF',
    },

}))




const StepDetailConnector = styled(StepConnector)(({ theme }) => ({
    [`&.${stepConnectorClasses.active}`]: {

    },
    [`&.${stepConnectorClasses.completed}`]: {
        [`& .${stepConnectorClasses.root}`]: {
            background: theme.palette.primary.main
        },
    },
}))

interface OrderStepInfomation {
    unachieveDescription: string;
    achieveDescription: string;
    date: string
}

const orderStepInfomationList: OrderStepInfomation[] = [
    {
        unachieveDescription: "訂單未成立",
        achieveDescription: "訂單已成立",
        date: "2022-12-10 13:10:16"
    },
    {
        unachieveDescription: "未收到款項",
        achieveDescription: "已收款",
        date: "2022-12-14 00:01:55"
    },
    {
        unachieveDescription: "尚未出貨",
        achieveDescription: "已出貨",
        date: "2022-12-15 08:30:33"
    },
    {
        unachieveDescription: "尚未完成訂單",
        achieveDescription: "已完成訂單",
        date: "2022-12-22 10:10:09"
    },
]


interface CargoInfomation {
    description: string;
    date: string;
}

const cargoInfomation: CargoInfomation[] = [
    {
        description: "買家取件成功",
        date: "2022-12-20 10:10:09"
    },
    {
        description: "包裹已送達",
        date: "2022-12-18 01:30:33"
    },
    {
        description: "包裹寄送中",
        date: "2022-12-16 08:01:55"
    },
    {
        description: "已寄件",
        date: "2022-12-15 00:10:16"
    },
]


const orderAddress: OrderAddress = {
    receiver: "王大明",
    phoneNumber: "(+886)964816276",
    cargoAddress: "7-11 雅典門市 台中市南區三民西路377號西川一路1號 店號950963"
}

interface PurchaseRecordProps {
    //setOrderInfoDetail: React.Dispatch<React.SetStateAction<OrderInfomation>>;
}


interface OrderInfomation {
    recordCode: string;
    productList: ProductInfomationCount[];
    productName: string;
    prouctPrice: number;
    orderPrice: number;
    size: string;
    count: number;
    address: OrderAddress;
    status: string;
    cargoPrice: number;
    payWay: string;
    cargoInfomation: CargoInfomation[];
    orderStepInfomation: OrderStepInfomation[];

}

const orderStatus = new Map([
    ["1", "已完成"],
    ["0", "待取貨"],
    ["2", "已取消"],
    ["3", "待付款"],
    ["4", "待出貨"],
    ["5", "退貨/款"]
])

const orderStatusColor = new Map([
    ["1", "#ef6060"],
    ["0", "#96DB8B"],
    ["2", "#7E7E7E"],
    ["3", "#96DB8B"],
    ["4", "#96DB8B"],
    ["5", "#7E7E7E"]
])

interface OrderAddress {
    receiver: string;
    phoneNumber: string;
    cargoAddress: string;
}





//訂單頁面
const PurchaseRecord = ({ }: PurchaseRecordProps) => {

    const router = useRouter();
    const [viewValue, setviewValue] = useState<string>("所有訂單")

    const handleView = (e: React.SyntheticEvent, newVal: string) => {
        setviewValue(newVal)
    }

    const goOrderDetail = (orderInfo: OrderInfomation) => {
        //setOrderInfoDetail(orderInfo)
        //console.log(orderInfo.recordCode)
        router.push(`/user/order-record/${orderInfo.recordCode}`)
    }

    const isSmallScreen = useMediaQuery('(max-width:700px)');
    return (
        <Grid container columns={8} sx={{ border: "0px solid", mr: 1 }}>
            <Grid item xs={8}>
                <TabContext value={viewValue}>
                    <TabList variant={isSmallScreen ? 'scrollable' : 'fullWidth'} onChange={handleView} allowScrollButtonsMobile scrollButtons="auto" sx={{ border: "1px solid #D9D9D9", borderRadius: "4px", mr: 1, backgroundColor: "white" }}>
                        {orderStates.map(orderState => (
                            <Tab key={orderState} value={orderState} label={orderState} sx={{ border: "0px solid #AFAFAF", borderTopLeftRadius: "4px", borderBottomLeftRadius: "4px" }}></Tab>
                        ))}
                    </TabList>
                    {orderStates.map(orderState => (
                        <TabPanel key={orderState} value={orderState} sx={{ px: 0, mr: 1 }}>


                            <Stack direction={"row"} sx={{ justifyContent: "end", my: 3 }}>
                                {/*搜尋欄 */}
                                <Paper sx={{ border: "1px solid #d9d9d9", boxShadow: "none", display: 'flex', alignItems: 'center', width: 350, height: 35 }}>
                                    <IconButton type="button" sx={{ p: 1, width: 35, height: 35, borderRadius: "0px", '&:hover': { background: "white" } }} aria-label="search">
                                        <SearchIcon />
                                    </IconButton>
                                    <InputBase
                                        sx={{ ml: 1, flex: 1 }}
                                        placeholder="輸入訂單編號或是商品名稱查詢訂單"
                                        inputProps={{ 'aria-label': '輸入訂單編號或是商品名稱查詢訂單' }}
                                    />
                                </Paper>

                            </Stack>

                            {/*訂單們 */}
                            <List>
                                {
                                    orderInfoList.map((info, index) => {

                                        if (orderStatus.get(info.status) != viewValue && viewValue != "所有訂單") {
                                            return null
                                        }

                                        return (
                                            <ListItem key={index} sx={{ px: 0 }}>

                                                <Card sx={{ width: "100%", boxShadow: "none", border: "solid 1px #D9D9D9" }}>
                                                    <CardHeader sx={{ py: 1, pr: 4 }} title={
                                                        <Stack direction={"row"} justifyContent={"space-between"} alignItems={"center"}>
                                                            <Stack spacing={1} direction={"row"} justifyContent={"flex-end"}>
                                                                <Typography>訂單號:</Typography>
                                                                <Typography sx={{ border: "0px solid black", color: "red" }}>{info.recordCode}</Typography>
                                                            </Stack>
                                                            <Typography variant='caption' sx={{ color: orderStatusColor.get(info.status) }}>{orderStatus.get(info.status)}</Typography>

                                                        </Stack>


                                                    } />


                                                    <CardContent sx={{ p: 0 }}>
                                                        {
                                                            info.productList.map((item, indexItem) => (
                                                                <Card key={indexItem} sx={{ width: "100%", boxShadow: "none", border: "solid 1px #D9D9D9" }}>
                                                                    <Grid container columns={12} sx={{ border: "0px solid purple" }}>
                                                                        
                                                                        {/*圖片 */}
                                                                        <Grid item xs={4} sm={2}>
                                                                            <CardMedia
                                                                                sx={{
                                                                                    position: 'relative',
                                                                                    width: '100%',
                                                                                    height: '100%',
                                                                                    maxWidth: '130px',
                                                                                    border: '0px solid black',
                                                                                    overflow: 'hidden',
                                                                                    p:1
                                                                                }}
                                                                            >
                                                                                <Box
                                                                                    sx={{
                                                                                        width: '100%',
                                                                                        height: 0,
                                                                                        paddingBottom: '100%',
                                                                                        position: 'relative',
                                                                                    }}
                                                                                >
                                                                                    <Image
                                                                                        src={item.product.coverImg}
                                                                                        alt="product information5"
                                                                                        layout="fill"
                                                                                        style={{ objectFit: 'cover' }}
                                                                                    />
                                                                                </Box>
                                                                            </CardMedia>
                                                                        </Grid>
                                                                        <Grid item xs={8} sm={10} sx={{ border: "0px solid orange" }}>
                                                                            <CardContent sx={{ border: "0px solid red", px: 4}}>
                                                                                <Grid container columns={8} sx={{ border: "0px solid green"}}>
                                                                                    <Grid item xs={8} sm={6} sx={{ border: "0px solid" }}>
                                                                                        <Box sx={{ border: "0px solid", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                                                                                            <Typography sx={{ fontWeight: "bold", '&:hover': { cursor: "pointer" } }} onClick={() => { goOrderDetail(info) }}>{item.product.title}</Typography>
                                                                                            <Typography variant='caption'>規格 : {info.size}</Typography>
                                                                                            <Typography >x {info.count}</Typography>
                                                                                        </Box>
                                                                                    </Grid>
                                                                                    <Grid item xs={8} sm={2}>
                                                                                        <Box sx={{ display: "flex", flexDirection: "row"}}>
                                                                                            <Stack sx={{ alignItems: "end" }} spacing={3}>

                                                                                                <Typography>NT${item.product.price}</Typography>
                                                                                            </Stack>
                                                                                        </Box>

                                                                                    </Grid>
                                                                                </Grid>
                                                                            </CardContent>
                                                                        </Grid>
                                                                    </Grid>

                                                                    <Divider />




                                                                </Card>
                                                            ))
                                                        }

                                                        {/*訂單金額 */}
                                                        <Stack sx={{ alignItems: "end", pr: 4,mt:2 }} spacing={4}>
                                                            <Stack direction={"row"} sx={{ mt: 3 }} spacing={0.5}>
                                                                <Typography >
                                                                    訂單金額 :
                                                                </Typography>
                                                                <Typography sx={{ color: "#ef6060", fontWeight: "bold" }}>
                                                                    NT${info.orderPrice}
                                                                </Typography>
                                                            </Stack>


                                                        </Stack>
                                                    </CardContent>



                                                    <CardActions sx={{ pr: 4, py: 3, display: "flex", flexDirection: "row", justifyContent: "end" }}>
                                                        {info.status === "3" ? <Button variant="contained" sx={{ backgroundColor: "#EFB878", color: "black", "&:hover": { backgroundColor: "#EFB878" } }}>取消訂單</Button> : null}
                                                        <Button variant="outlined" onClick={() => { goOrderDetail(info) }}>訂單詳情</Button>
                                                        <Button variant="contained">重新購買</Button>
                                                    </CardActions>
                                                </Card>

                                            </ListItem>
                                        )


                                    })
                                }

                            </List>
                        </TabPanel>
                    ))}


                </TabContext>
            </Grid>
        </Grid>
    )
}