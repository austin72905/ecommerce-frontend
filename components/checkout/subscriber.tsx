import { RecieverInfo } from "@/interfaces";
import { Paper, Stack, TextField, Typography } from "@mui/material";

export default function SubscriberInfo({orderInfo,handleOrderInfo}:SubscriberInfoProps) {
    return (
        <>
            <Typography variant='body1' sx={{ fontWeight: "bold" }}>訂購人資訊</Typography>

            <Paper sx={{ mt: "15px", boxShadow: "none", border: "1px solid #d9d9d9" }}>

                <Stack sx={{ m: "30px" }} direction={"row"} spacing={"10px"} alignItems={"center"}>
                    <Typography sx={{ mr: "10px", minWidth: "30px" }} variant='caption' >姓名</Typography>
                    <TextField value={orderInfo.name} name="name" onChange={handleOrderInfo} placeholder='不得包含特殊符號 / $ . @ & # @...' inputProps={{ sx: { height: "15px" } }} sx={{ marginTop: "10px" }} size='small' fullWidth />
                </Stack>
                <Stack sx={{ m: "30px" }} direction={"row"} spacing={"10px"} alignItems={"center"}>
                    <Typography sx={{ mr: "10px", minWidth: "30px" }} variant='caption' >電話</Typography>
                    <TextField value={orderInfo.phoneNumber} name="phoneNumber" onChange={handleOrderInfo} placeholder='ex: 09xxxxxxxx' inputProps={{ sx: { height: "15px" } }} sx={{ marginTop: "10px" }} size='small' fullWidth />
                </Stack>
                <Stack sx={{ m: "30px" }} direction={"row"} spacing={"10px"} alignItems={"center"}>
                    <Typography sx={{ mr: "10px", minWidth: "30px" }} variant='caption' >信箱</Typography>
                    <TextField value={orderInfo.mail} name="mail" onChange={handleOrderInfo} placeholder='ex: asbc@gmail.com' inputProps={{ sx: { height: "15px" } }} sx={{ my: "10px" }} size='small' fullWidth />
                </Stack>


            </Paper>
        </>
    )
} 

interface SubscriberInfoProps{
    orderInfo:RecieverInfo;
    handleOrderInfo : (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>void
}