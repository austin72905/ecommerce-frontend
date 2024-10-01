const orderStatus = new Map([
    [1, "已完成"],
    [0, "待取貨"],
    [2, "已取消"],
    [3, "待付款"],
    [4, "待出貨"],
    [5, "退貨/款"]
])

const orderStatusColor = new Map([
    [1, "#ef6060"],
    [0, "#96DB8B"],
    [2, "#7E7E7E"],
    [3, "#96DB8B"],
    [4, "#96DB8B"],
    [5, "#7E7E7E"]
])




const enum OrderStatus {
    /// <summary>
    /// 訂單已創建
    /// </summary>
    Created = 0,
    /// <summary>
    /// 等待付款
    /// </summary>
    WaitingForPayment = 1,

    /// <summary>
    /// 等待出貨
    /// </summary>
    WaitingForShipment = 2,

    /// <summary>
    /// 等待取貨
    /// </summary>
    WaitPickup = 3,

    /// <summary>
    /// 已完成
    /// </summary>
    Completed = 4,

    /// <summary>
    /// 已取消
    /// </summary>
    Canceled = 5,

    /// <summary>
    /// 退貨/款
    /// </summary>
    Refund = 6
}


const orderStatusMap = new Map([
    [OrderStatus.Created, { description: "已創建", color: "#96DB8B" }],
    [OrderStatus.WaitingForPayment, { description: "待付款", color: "#96DB8B" }],
    [OrderStatus.WaitingForShipment, { description: "待出貨", color: "#96DB8B" }],
    [OrderStatus.WaitPickup, { description: "待取貨", color: "#96DB8B" }],
    [OrderStatus.Completed, { description: "已完成", color: "#ef6060" }],
    [OrderStatus.Canceled, { description: "已取消", color: "#7E7E7E" }],
    [OrderStatus.Refund, { description: "已退貨/款", color: "#7E7E7E" }],
])



export { OrderStatus, orderStatusMap }