import Grid from '@mui/material/Grid';
import React, { useEffect, useState } from 'react'

import { useRouter } from 'next/router';

import { cargoInfomation, orderInfoList, orderStepInfomationList } from '@/dummy-data/order-dummy-data';

import RecieveAddress from '@/components/user/order-record/recieve-address';

import CargoInfo from '@/components/user/order-record/cargo-info';
import OrderStep from '@/components/user/order-record/order-step';
import OrderInfo from '@/components/user/order-record/order-info';
import WithAuth from '@/components/auth/with-auth';
import { ApiResponse } from '@/interfaces/api/response';
import { RespCode } from '@/enums/resp-code';
import { CargoInfomation, CargoStepInfomation, OrderInfomation, OrderStepInfo, OrderStepInfomation } from '@/interfaces';
import { format } from 'date-fns';
import { OrderStepStatus } from '@/enums/order-step';
import { ShipmentStatus } from '@/enums/shipment-status';


//訂單細節
const OrderDetailPage = () => {

    const router = useRouter()

    const { recordcode } = router.query

    //const orderInfo = orderInfoList.find(order => order.recordCode === recordcode)




    const [achieveStep, setAchieveStep] = useState<number>(2)

    const [cargoStep, setCargoStep] = useState<number>(1)

    const goBackToPurchaseOrder = () => {
        router.push("/user/order-record")
    }

    const goToProductDetail =(productId:number)=>{
        router.push(`/products/${productId}`)
    }

  
    
    const [orderInfo, setOrderInfo] = useState<OrderInfomation | null>()

    //請求後端
    const getOrderInfo = async (query: string) => {

        const response = await fetch(`http://localhost:5025/Order/GetOrderInfo?${query}`, {
            method: 'GET',
            credentials: 'include',
        })

        return response.json();
    }

    // 請求後端
    useEffect(() => {

        const fetchData = async () => {
            try {
                const query = new URLSearchParams({ recordcode: recordcode as string }).toString();

                const result = await getOrderInfo(query) as ApiResponse;
                console.log("result=", result)


                if (result.code != RespCode.SUCCESS) {

                    console.log("獲取數據失敗")
                    return;
                }


                if (result.data == null) {
                    console.log("獲取數據失敗")
                    return;
                }


                const orderData = result.data as OrderInfomation


                setOrderInfo(orderData)
                setAchieveStep(orderData.orderStepInfomation.length - 1)


            } catch (error) {
                console.error('Error fetching data:', error)
            }
        }


        fetchData()
    }, [router.isReady])


    if (!orderInfo) {
        return <p>訂單不存在</p>
    }


    // 步驟轉成
    // 有些進行中的狀態，不用打上時間
    const orderStepInfomationList: OrderStepInfomation[] = generateOrderStepInfomationList(orderInfo.orderStepInfomation)

    console.log(orderStepInfomationList)
    const shipmentStepList: CargoStepInfomation[] = generateShipmentStepList(orderInfo.shipInfomation)

    return (
        <Grid rowSpacing={"20px"} columnSpacing={"20px"} container columns={8} sx={{ border: "0px solid", marginRight: "10px" }}>

            {/*訂單流程 */}
            <Grid item xs={8} sx={{ border: "0px solid" }}>
                <OrderStep
                    orderInfo={orderInfo}
                    orderStepInfomationList={orderStepInfomationList}
                    achieveStep={orderStepInfomationList.length - 1}
                    goBackToPurchaseOrder={goBackToPurchaseOrder}
                />

            </Grid>
            <Grid item xs={8} md={4} sx={{ border: "0px solid" }}>
                <RecieveAddress address={orderInfo.address} />
            </Grid>

            {/*物流資訊 */}
            <Grid item xs={8} md={4} sx={{ border: "0px solid" }}>

                <CargoInfo
                    cargoInfomation={shipmentStepList}
                    cargoStep={cargoStep}
                />
            </Grid>
            {/*訂單資訊 */}
            <Grid item xs={8} sx={{ border: "0px solid" }}>
                <OrderInfo
                    orderInfo={orderInfo}
                    goToProductDetail={goToProductDetail}
                />
            </Grid>
        </Grid>
    )
}


export default WithAuth(OrderDetailPage);


const generateOrderStepInfomationList = (orderInfoStepList: OrderStepInfo[] | undefined) => {

    if (!orderInfoStepList) {
        return []
    }
    // 不管怎樣就是只顯示這4個
    //可以用後面覆蓋前面的
    let list: OrderStepInfomation[] = [
    ]


    orderInfoStepList.forEach((step, index) => {
        //可以用後面覆蓋前面的
        if (step.status === OrderStepStatus.Created) {
            list.push({
                status: OrderStepStatus.Created,
                unachieveDescription: "訂單未成立",
                achieveDescription: "訂單已成立",
                date: format(step.updatedAt, 'yyyy-MM-dd HH:mm:ss')
            })

            list.push({
                status: OrderStepStatus.WaitingForPayment,
                unachieveDescription: "等待付款",
                achieveDescription: "等待付款",
                date: ""
            })

        }


        if (step.status === OrderStepStatus.PaymentReceived) {
            list[1].status = OrderStepStatus.PaymentReceived
            list[1].achieveDescription = "已收款"
            list[1].date = format(step.updatedAt, 'yyyy-MM-dd HH:mm:ss')

            list.push({
                status: OrderStepStatus.WaitingForShipment,
                unachieveDescription: "等待出貨",
                achieveDescription: "等待出貨",
                date: ""
            })
        }

        // 出貨 start


        if (step.status === OrderStepStatus.ShipmentCompleted) {
            list[2].status = OrderStepStatus.ShipmentCompleted
            list[2].unachieveDescription = "已出貨"
            list[2].achieveDescription = "已出貨"
            list[2].date = format(step.updatedAt, 'yyyy-MM-dd HH:mm:ss')

            list.push({
                status: OrderStepStatus.OrderCompleted,
                unachieveDescription: "尚未完成訂單",
                achieveDescription: "尚未完成訂單",
                date: ""
            })
        }
        // 出貨 end


        if (step.status === OrderStepStatus.OrderCompleted) {

            list[3].status = OrderStepStatus.OrderCompleted
            list[3].unachieveDescription = "訂單已完成"
            list[3].achieveDescription = "訂單已完成"
            list[3].date = format(step.updatedAt, 'yyyy-MM-dd HH:mm:ss')

        }

        //取消訂單
        if (step.status === OrderStepStatus.OrderCanceled) {

            //等待付款、等待運送，就直接replace， or push
            if (list[list.length - 1].status === OrderStepStatus.WaitingForPayment || list[list.length - 1].status === OrderStepStatus.WaitingForShipment || list[list.length - 1].status === OrderStepStatus.OrderCompleted) {

                list[list.length - 1].status = OrderStepStatus.OrderCanceled
                list[list.length - 1].unachieveDescription = "訂單已取消"
                list[list.length - 1].achieveDescription = "訂單已取消"
                list[list.length - 1].date = format(step.updatedAt, 'yyyy-MM-dd HH:mm:ss')
            } else {
                list.push({
                    status: OrderStepStatus.OrderCanceled,
                    unachieveDescription: "訂單已取消",
                    achieveDescription: "訂單已取消",
                    date: format(step.updatedAt, 'yyyy-MM-dd HH:mm:ss')
                })
            }




        }


    })

    return list;
}

//shipmentStatus 1 3 4 5 才需要寫進去
/*

        /// <summary>
        /// 尚未出貨
        /// </summary>
        Pending = 0,

        /// <summary>
        /// 包裹已寄出
        /// </summary>
        Shipped = 1,

        /// <summary>
        /// 包裹運送中
        /// </summary>
        InTransit = 2,

        /// <summary>
        /// 包裹已送達指定的配送站 (配送中)
        /// </summary>
        OutForDelivery = 3,

        /// <summary>
        /// 買家已取件或包裹已送達
        /// </summary>
        Delivered = 4,


        /// <summary>
        /// 買家已取件成功
        /// </summary>
        PickedUpByCustomer = 5,

        /// <summary>
        /// 包裹配送失敗（例如買家不在）
        /// </summary>
        DeliveryFailed = 6,

        /// <summary>
        /// 包裹已退回給發貨方
        /// </summary>
        Returned = 7
*/
const generateShipmentStepList = (shipmentStepList: CargoInfomation[]) => {

    let list: CargoStepInfomation[] = []

    shipmentStepList.forEach(step => {
        if (step.status === ShipmentStatus.Pending) {
            list.push({
                description: "尚未出貨",
                updatedAt: ""
            })
        }

        if (step.status === ShipmentStatus.Shipped) {
            list[0].description = "包裹已寄出"
            list[0].updatedAt = format(step.updatedAt, 'yyyy-MM-dd HH:mm:ss')
        }

        if (step.status === ShipmentStatus.InTransit) {
            list.push({
                description: "包裹運送中",
                updatedAt: ""
            })
        }

        if (step.status === ShipmentStatus.OutForDelivery) {
            list[1].description = "包裹已送達指定的配送站"
            list[1].updatedAt = format(step.updatedAt, 'yyyy-MM-dd HH:mm:ss')

        }

        if (step.status === ShipmentStatus.Delivered) {
            list.push({
                description: "包裹已送達",
                updatedAt: format(step.updatedAt, 'yyyy-MM-dd HH:mm:ss')
            })
        }

        if (step.status === ShipmentStatus.PickedUpByCustomer) {
            list.push({
                description: "買家已取件成功",
                updatedAt: format(step.updatedAt, 'yyyy-MM-dd HH:mm:ss')
            })
        }


        if (step.status === ShipmentStatus.DeliveryFailed) {


            list.push({
                description: "包裹配送失敗",
                updatedAt: format(step.updatedAt, 'yyyy-MM-dd HH:mm:ss')
            })


        }

        if (step.status === ShipmentStatus.Returned) {
            list.push({
                description: "包裹已退回給發貨方",
                updatedAt: format(step.updatedAt, 'yyyy-MM-dd HH:mm:ss')
            })

        }



    })

    return list.reverse()



}

/*
    (有Shipped 就取Shipped)
    Pending  準備出貨  (不打時間)
    Shipped  包裹已寄出

    InTransit 不顯示 (繼續用 Shipped)


    OutForDelivery  包裹已送達指定的配送站

    Delivered  已取件


    最多就顯示4個

*/