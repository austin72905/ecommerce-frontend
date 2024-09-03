import Grid from '@mui/material/Grid';
import React, { useState } from 'react'

import { useRouter } from 'next/router';

import { cargoInfomation, orderInfoList, orderStepInfomationList } from '@/dummy-data/order-dummy-data';

import RecieveAddress from '@/components/user/order-record/recieve-address';

import CargoInfo from '@/components/user/order-record/cargo-info';
import OrderStep from '@/components/user/order-record/order-step';
import OrderInfo from '@/components/user/order-record/order-info';
import WithAuth from '@/components/auth/with-auth';


//訂單細節
const OrderDetailPage=()=> {

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

            {/*訂單流程 */}
            <Grid item xs={8} sx={{ border: "0px solid" }}>
                <OrderStep
                    orderInfo={orderInfo}
                    orderStepInfomationList={orderStepInfomationList}
                    achieveStep={achieveStep}
                    goBackToPurchaseOrder={goBackToPurchaseOrder}
                />
                
            </Grid>
            <Grid item xs={8} md={4} sx={{ border: "0px solid" }}>
               <RecieveAddress address={orderInfo.address}/>
            </Grid>
            
            {/*物流資訊 */}
            <Grid item xs={8} md={4} sx={{ border: "0px solid" }}>
                
                <CargoInfo
                    cargoInfomation={cargoInfomation}
                    cargoStep={cargoStep}
                />       
            </Grid>
            {/*訂單資訊 */}
            <Grid item xs={8} sx={{ border: "0px solid" }}>
                <OrderInfo
                    orderInfo={orderInfo}
                />            
            </Grid>
        </Grid>
    )
}


export default WithAuth(OrderDetailPage) ;





