import { Paper, Stack, Typography } from "@mui/material";
import { GridContainer } from "../ui/grid-container";
import { CheckoutInfomation } from "@/interfaces";


export default function PaymentAmount({checkoutInfomation,countTotalPrice}:PaymentAmountProps) {
    return (
        <>
            <Typography variant='body1' sx={{ fontWeight: "bold" }}>訂單金額</Typography>


            <Paper sx={{ mt: "15px", boxShadow: "none", border: "1px solid #d9d9d9" }}>


                <Stack sx={{ p: "30px" }} spacing={"30px"}>
                    <GridContainer
                        title={<Typography >商品金額</Typography>}
                        content={<Typography  >${countTotalPrice()}</Typography>}
                        columns={12}
                        xs={4}
                        sm={3}
                        md={2}
                    />

                    <GridContainer
                        title={<Typography >運費</Typography>}
                        content={<Typography >${checkoutInfomation.cargoPrice}</Typography>}
                        columns={12}
                        xs={4}
                        sm={3}
                        md={2}
                    />

                    <GridContainer
                        title={<Typography >總計</Typography>}
                        content={<Typography sx={{ color: "red" }}  >${countTotalPrice()}</Typography>}
                        columns={12}
                        xs={4}
                        sm={3}
                        md={2}
                    />

                    <GridContainer
                        title={<Typography >付款方式</Typography>}
                        content={<Typography>{checkoutInfomation.payWay}</Typography>}
                        columns={12}
                        xs={4}
                        sm={3}
                        md={2}
                    />
                </Stack>
            </Paper>
        </>
    )
}

interface PaymentAmountProps{
    checkoutInfomation:CheckoutInfomation;
    countTotalPrice: () => number;
}