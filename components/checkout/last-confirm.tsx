import { Paper, Stack, Typography } from "@mui/material";
import { GridContainer } from "../ui/grid-container";
import { CheckoutInfomation, RecievePlaceInfo, RecieverInfo } from "@/interfaces";

export function LastConfirm({ recieveStoreInfo, checkoutInfomation, recieverInfo }: LastConfirmProps) {
    return (
        <>
            <Typography variant='body1' sx={{ fontWeight: "bold" }}>最後確認</Typography>

            <Paper sx={{ mt: "15px", boxShadow: "none", border: "1px solid #d9d9d9" }}>



                <Stack sx={{ p: "30px" }} spacing={"30px"}>
                    <GridContainer
                        title={<Typography   >寄送方式</Typography>}
                        content={<Typography  >{recieveStoreInfo.recieveWay}取貨</Typography>}
                        columns={12}
                        xs={4}
                        sm={3}
                        md={2}
                    />

                    <GridContainer
                        title={<Typography  >付款方式</Typography>}
                        content={<Typography >{checkoutInfomation.payWay}</Typography>}
                        columns={12}
                        xs={4}
                        sm={3}
                        md={2}
                    />

                    <GridContainer
                        title={<Typography  >收件人</Typography>}
                        content={<Typography >{recieverInfo.name}</Typography>}
                        columns={12}
                        xs={4}
                        sm={3}
                        md={2}
                    />

                    <GridContainer
                        title={<Typography  >連絡電話</Typography>}
                        content={<Typography  >{recieverInfo.phoneNumber}</Typography>}
                        columns={12}
                        xs={4}
                        sm={3}
                        md={2}
                    />
                    <GridContainer
                        title={<Typography >信箱</Typography>}
                        content={<Typography>{recieverInfo.mail}</Typography>}
                        columns={12}
                        xs={4}
                        sm={3}
                        md={2}
                    />
                    <GridContainer
                        title={<Typography  >取件地址</Typography>}
                        content={<Typography  >{recieveStoreInfo.recieveStore}門市-{recieveStoreInfo.recieveAddress}</Typography>}
                        columns={12}
                        xs={4}
                        sm={3}
                        md={2}
                    />
                    <GridContainer
                        title={<Typography>總付款金額</Typography>}
                        content={<Typography sx={{ color: "red" }}  >${checkoutInfomation.titlePrice}</Typography>}
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

interface LastConfirmProps {
    recieveStoreInfo: RecievePlaceInfo;
    checkoutInfomation: CheckoutInfomation;
    recieverInfo: RecieverInfo;
}