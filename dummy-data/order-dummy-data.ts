import { OrderInfomation, ProductInfomation, ProductInfomationCount } from "@/interfaces";

import ProductImage from '/public/images/朋朋衛生紙商品圖.jpg'
import ProductImage1 from '/public/images/coat1.jpg'
import ProductImage2 from '/public/images/coat2.jpg'
import ProductImage3 from '/public/images/coat3.jpg'
import ProductImage4 from '/public/images/coat4.jpg'
import ProductImage5 from '/public/images/coat5.jpg'



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





const imgList = [
    ProductImage,
    ProductImage1,
    ProductImage2,
    ProductImage3,
    ProductImage4,
    ProductImage5
]


const fakeProductsList: ProductInfomationCount[] = [

    {
        count: 1,
        product: {
            title: "超時尚流蘇几皮外套",
            productId: "26790367",
            stock: 60,
            price: 100,
            size: ["S", "M", "L", "XL", "2XL", "3XL"],
            color: ["black", "wheat", "brown"],
            colorDescription: ["黑色", "白色", "深藍色", "灰色", "深灰色", "紅色"],
            material: ["聚酯纖維", "聚氨酯纖維"],
            howToWash: "洗衣機（水溫40度）, 不可乾洗, 不可烘乾。本商品會在流汗或淋雨弄濕時，或因摩擦而染色到其他衣物上，敬請注意。",
            features: "其實我也不知道要說什麼...a 其實我也不知道要說什麼...a 其實我也不知道要說什麼...a",
            images: imgList,
            coverImg: ProductImage1

        }
    },
    {
        count: 1,
        product: {
            title: "超時尚流蘇几皮外套",
            productId: "26790367",
            stock: 60,
            price: 100,
            size: ["S", "M", "L", "XL", "2XL", "3XL"],
            color: ["black", "wheat", "brown"],
            colorDescription: ["黑色", "白色", "深藍色", "灰色", "深灰色", "紅色"],
            material: ["聚酯纖維", "聚氨酯纖維"],
            howToWash: "洗衣機（水溫40度）, 不可乾洗, 不可烘乾。本商品會在流汗或淋雨弄濕時，或因摩擦而染色到其他衣物上，敬請注意。",
            features: "其實我也不知道要說什麼...a 其實我也不知道要說什麼...a 其實我也不知道要說什麼...a",
            images: imgList,
            coverImg: ProductImage1

        }
    },
    {
        count: 1,
        product: {
            title: "紫色格紋大衣",
            productId: "26790368",
            stock: 5,
            price: 598,
            size: ["S", "M", "L", "XL", "2XL"],
            color: ["black", "wheat", "purple"],
            colorDescription: ["黑色", "米色", "子色"],
            material: ["聚酯纖維", "聚氨酯纖維"],
            howToWash: "洗衣機（水溫40度）, 不可乾洗, 不可烘乾。本商品會在流汗或淋雨弄濕時，或因摩擦而染色到其他衣物上，敬請注意。",
            features: "其實我也不知道要說什麼...a 其實我也不知道要說什麼...a 其實我也不知道要說什麼...a",
            images: imgList,
            coverImg: ProductImage4

        }
    },

]



const orderInfo: OrderInfomation = {
    recordCode: "TX20230122063253",
    productList: fakeProductsList,
    //productName: "好男人需要時我都在衛生紙(10入)",
    //prouctPrice: 100,
    orderPrice: 139,
    //count: 1,
    //size: "標準規格",
    address: orderAddress,
    cargoInfomation: cargoInfomation,
    orderStepInfomation: orderStepInfomationList,
    status: "1",
    cargoPrice: 39,
    payWay: "LinePay"
}





const orderInfoList: OrderInfomation[] = [
    orderInfo,
    { ...orderInfo, recordCode: "TX20230122063254" },
    { ...orderInfo, status: "4" },
    { ...orderInfo, status: "2", recordCode: "TX20230122063256" },
    { ...orderInfo, status: "3", recordCode: "TX20230122063257" }
]


export { orderInfoList,orderStepInfomationList,orderInfo,cargoInfomation,orderStatus,orderStatusColor }