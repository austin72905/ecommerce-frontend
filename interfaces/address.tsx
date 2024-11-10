export interface OrderAddress {
    receiver: string;
    recieveWay:string;
    recieveStore:string;
    email?:string;
    phoneNumber: string;
    shippingAddress: string;
}

// 後端使用的
export interface UserShipAddress{
    addressId:number;
    recipientName:string;
    phoneNumber:string;
    recieveWay:string;
    recieveStore:string;
    addressLine:string;
    isDefault:boolean;

}