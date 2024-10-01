import { OrderStepStatus } from "@/enums/order-step";
import { OrderAddress } from "./address";
import { CargoInfomation, CargoStepInfomation } from "./cargo";
import { ProductInfomationCount } from "./product";

export interface OrderStepInfo {
    status: OrderStepStatus;
    updatedAt: string;

}

export interface OrderStepInfomation {
    status:number;
    unachieveDescription: string;
    achieveDescription: string;
    date: string
}


export interface OrderInfomation {
    recordCode: string;
    productList: ProductInfomationCount[];
    //productName: string;
    //prouctPrice: number;
    orderPrice: number;
    //size: string;
    //count: number;
    address: OrderAddress;
    status: number;
    shippingPrice: number;
    payWay: string;
    shipInfomation: CargoInfomation[];
    orderStepInfomation: OrderStepInfo[];

}



export interface CheckoutInfomation {
    productPrice: number;
    cargoPrice: number;
    titlePrice: number;
    payWay: string;
}

export interface ProductData {
    name: string;
    price: number;
}

export interface RecieverInfo {
    name: string;
    phoneNumber: string;
    mail: string;
}

export interface RecievePlaceInfo {
    recieveWay: string;
    recieveStore: string;
    recieveAddress: string;
}


