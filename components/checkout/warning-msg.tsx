import { Paper, Typography } from "@mui/material";

export default function WarningMsg() {
    return (
        <>
            <Typography variant='body1' sx={{ fontWeight: "bold" }}>下單須知</Typography>

            <Paper sx={{ mt: "15px", boxShadow: "none", border: "1px solid #d9d9d9" }}>
                <Typography sx={{ p: "30px" }}>
                    購買後5天內須要付款，未付款視為取消訂單，付款後會儘快出貨，商品物流情況詳情請在訂單查詢頁面追蹤
                </Typography>
                <Typography sx={{ p: "10px", px: "30px", color: "#ef6060" }}>
                    綠界支付測試卡號:4311-9511-1111-1111


                </Typography>
                <Typography sx={{ py: "10px", px: "30px", color: "#ef6060" }}>
                    有效日期:12/29
                </Typography>
                <Typography sx={{ py: "10px", px: "30px", color: "#ef6060" }}>
                    信用卡安全碼:111
                </Typography>

                <Typography sx={{ py: "30px", px: "30px" }}>
                    測試支付後，會自動模擬物流進度跟訂單進度，請到訂單查詢 - 訂單詳情查看
                </Typography>
            </Paper>
        </>
    )
}