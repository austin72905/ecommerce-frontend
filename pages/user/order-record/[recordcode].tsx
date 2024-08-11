
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import styled from '@mui/system/styled';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Paper from '@mui/material/Paper';
import Stepper from '@mui/material/Stepper';

import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import { StepIconProps } from '@mui/material/StepIcon';

import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';

import React, { useState } from 'react'

import ProductImage from '/public/images/coat2.jpg'
import { Divider, useMediaQuery } from '@mui/material';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { orderInfoList } from '@/dummy-data/order-dummy-data';


//訂單細節
export default function OrderDetailPage() {

    const router = useRouter()

    const { recordcode } = router.query

    const orderInfo = orderInfoList.find(order => order.recordCode === recordcode)


    if (!orderInfo) {
        return <p>訂單不存在</p>
    }

    const [achieveStep, setAchieveStep] = useState<number>(2)

    const [cargoStep, setCargoStep] = useState<number>(1)

    const goBackToPurchaseOrder = () => {
        router.push("/user/order-record")
    }

    return (
        <Grid rowSpacing={"20px"} columnSpacing={"20px"} container columns={8} sx={{ border: "0px solid", marginRight: "10px" }}>

            <Grid item xs={8} sx={{ border: "0px solid" }}>

                <Paper sx={{ boxShadow: "none", border: "1px solid #d9d9d9" }}>
                    <Stack>
                        <Stack onClick={goBackToPurchaseOrder} direction={"row"} sx={{ border: "0px solid", '&:hover': { cursor: "pointer" }, width: 100, height: 30, mt: 1, ml: 1, mb: 0 }}>
                            <KeyboardArrowLeftIcon />
                            <Typography>上一頁</Typography>
                        </Stack>
                        <Divider />
                        <Stack direction={"row"} spacing={3} justifyContent={"end"} sx={{ mr: 3, mt: 3 }}>
                            <Typography>訂單編號 : {orderInfo.recordCode}</Typography>
                            <Typography sx={{ color: orderStatusColor.get(orderInfo.status) }}>{orderStatus.get(orderInfo.status)}訂單</Typography>{/**#96DB8B #ef6060 */}
                        </Stack>
                        {/*訂單流程圖 */}
                        <Box sx={{ border: "0px solid", mt: 1, ml: 1, py: 4, px: 4 }}>
                            <Stepper activeStep={achieveStep} alternativeLabel>
                                {orderStepInfomationList.map((step, index) => (
                                    <Step key={step.unachieveDescription}>
                                        <StepLabel>
                                            <Stack>
                                                <Typography variant='caption'>
                                                    {achieveStep > index ? step.achieveDescription : step.unachieveDescription}
                                                </Typography>
                                                <Typography variant='caption'>
                                                    {achieveStep > index ? step.date : ""}
                                                </Typography>

                                            </Stack>

                                        </StepLabel>
                                    </Step>
                                ))}
                            </Stepper>
                        </Box>
                    </Stack>
                </Paper>

            </Grid>
            <Grid item xs={8} md={4} sx={{ border: "0px solid" }}>

                <Paper sx={{ height: "250px", boxShadow: "none", border: "1px solid #d9d9d9" }}>

                    <Stack spacing={4} sx={{ p: 3 }}>
                        <Typography sx={{ fontWeight: "bold" }}>收件地址</Typography>
                        <Stack spacing={1}>
                            <Typography variant='caption'>{orderInfo.address.receiver}</Typography>
                            <Typography variant='caption'>{orderInfo.address.phoneNumber}</Typography>
                            <Typography variant='caption'>
                                {orderInfo.address.cargoAddress}
                            </Typography>
                        </Stack>
                    </Stack>

                </Paper>
            </Grid>
            <Grid item xs={8} md={4} sx={{ border: "0px solid" }}>
                <Paper sx={{ height: "250px", boxShadow: "none", border: "1px solid #d9d9d9" }}>
                    <Stack spacing={4} sx={{ ml: 3, mt: 3, pb: 3 }}>
                        <Typography sx={{ fontWeight: "bold" }}>物流詳細情況</Typography>
                        <Box sx={{ display: "flex", justifyContent: "center", border: "0px solid", mt: 1, ml: 1, py: 0, px: 0 }}>
                            <Stepper activeStep={cargoStep} orientation='vertical' >
                                {cargoInfomation.map((step, index) => (
                                    <Step key={step.description}>
                                        <StepLabel sx={{ '&.MuiStepLabel-root': { p: 0, m: 0 } }} StepIconComponent={StepIcon}>
                                            <Stack direction={"row"} spacing={"10px"}>
                                                <Typography variant='caption'>
                                                    {step.date}
                                                </Typography>
                                                <Typography variant='caption'>
                                                    {step.description}
                                                </Typography>


                                            </Stack>

                                        </StepLabel>
                                    </Step>
                                ))}
                            </Stepper>
                        </Box>
                    </Stack>

                </Paper>
            </Grid>
            <Grid item xs={8} sx={{ border: "0px solid" }}>
                <Paper sx={{ boxShadow: "none", border: "1px solid #d9d9d9" }}>
                    <Stack spacing={0} sx={{ ml: 3, mt: 3, pb: 3 }}>
                        <Typography sx={{ fontWeight: "bold" }}>訂單資訊</Typography>
                        {orderInfo.productList.map((item, index) => (
                            <Card key={index} sx={{ width: "100%", boxShadow: "none", border: "solid 0px #D9D9D9" }}>
                                <Grid container columns={12} sx={{ border: "1px solid #D9D9D9" }}>
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
                                        <CardContent sx={{ border: "0px solid red", pl: 4, pr: 4, height: "80px" }}>
                                            <Grid container columns={8} sx={{ border: "0px solid green", height: "100px" }}>
                                                <Grid item xs={6} sx={{ border: "0px solid" }}>
                                                    <Box sx={{ border: "0px solid", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                                                        <Typography sx={{ fontWeight: "bold", '&:hover': { cursor: "pointer" } }}>{item.product.title}</Typography>
                                                        <Typography variant='caption'>規格 : {item.product.selectSize}</Typography>
                                                        <Typography >x 1</Typography>
                                                    </Box>
                                                </Grid>
                                                <Grid item xs={8} sm={2} >
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

                            </Card>
                        ))}


                        <Grid container columns={12}>
                            <Grid item xs={4} sm={6} md={9}></Grid>
                            {/*靠右 */}
                            <Grid item xs={8} sm={6} md={3}>
                                <Grid container columns={4} sx={{ mt: 4, pr: 4 }}>
                                    <Grid item xs={2}>
                                        <Stack spacing={3} sx={{ border: "0px solid", alignItems: "start" }}>
                                            <Typography >
                                                商品金額
                                            </Typography>
                                            <Typography >
                                                運費
                                            </Typography>
                                            <Typography >
                                                總計
                                            </Typography>
                                            <Typography >
                                                付款方式
                                            </Typography>
                                        </Stack>
                                    </Grid>
                                    <Grid item xs={2}>
                                        <Stack spacing={3} sx={{ border: "0px solid", alignItems: "end" }}>
                                            <Typography >
                                                NT${orderInfo.prouctPrice}
                                            </Typography>
                                            <Typography >
                                                NT${orderInfo.cargoPrice}
                                            </Typography>
                                            <Typography sx={{ color: "#ef6060", fontWeight: "bold" }}>
                                                NT${orderInfo.orderPrice}
                                            </Typography>
                                            <Typography >
                                                {orderInfo.payWay}
                                            </Typography>
                                        </Stack>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Stack>

                </Paper>
            </Grid>
        </Grid>
    )
}


interface OrderDetailProps {
    orderInfo: OrderInfomation;

}

interface OrderInfomation {
    recordCode: string;
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

interface CargoInfomation {
    description: string;
    date: string;
}

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

const orderAddress: OrderAddress = {
    receiver: "王大明",
    phoneNumber: "(+886)964816276",
    cargoAddress: "7-11 雅典門市 台中市南區三民西路377號西川一路1號 店號950963"
}


// const orderInfo: OrderInfomation = {
//     recordCode: "TX20230122063253",
//     productName: "好男人需要時我都在衛生紙(10入)",
//     prouctPrice: 100,
//     orderPrice: 139,
//     count: 1,
//     size: "標準規格",
//     address: orderAddress,
//     cargoInfomation: cargoInfomation,
//     orderStepInfomation: orderStepInfomationList,
//     status: "1",
//     cargoPrice: 39,
//     payWay: "LinePay"
// }


// const orderInfoList: OrderInfomation[] = [
//     orderInfo,
//     { ...orderInfo, recordCode: "TX20230122063254" },
//     { ...orderInfo, status: "4" },
//     { ...orderInfo, status: "2", recordCode: "TX20230122063256" },
//     { ...orderInfo, status: "3", recordCode: "TX20230122063257" }
// ]


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

