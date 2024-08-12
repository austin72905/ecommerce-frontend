import { Paper, Typography } from "@mui/material";

export default function WarningMsg() {
    return (
        <>
            <Typography variant='body1' sx={{ fontWeight: "bold" }}>下單須知</Typography>

            <Paper sx={{ mt: "15px", boxShadow: "none", border: "1px solid #d9d9d9" }}>
                <Typography sx={{ p: "30px" }}>
                    購買後5天內須要付款，未付款視為取消訂單，付款後會儘快出貨，商品物流情況詳情請在訂單查詢頁面追蹤
                </Typography>
            </Paper>
        </>
    )
}