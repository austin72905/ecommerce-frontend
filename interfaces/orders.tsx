import { OrderAddress } from "./address";
import { CargoInfomation } from "./cargo";
import { ProductInfomationCount } from "./product";

export interface OrderStepInfomation {
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
    status: string;
    cargoPrice: number;
    payWay: string;
    cargoInfomation: CargoInfomation[];
    orderStepInfomation: OrderStepInfomation[];

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


