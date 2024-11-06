export interface SubmitOrderReq {
    items: OrderItem[]
    shippingFee: number
    shippingAddress: string
    receiverName: string
    receiverPhone: string
}



export interface OrderItem {
    productId: number
    variantId?: number
    quantity: number
}