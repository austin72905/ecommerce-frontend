import { RecieverInfo } from "@/interfaces";
import { Checkbox, FormControlLabel, Paper, Stack, TextField, Typography } from "@mui/material";

export default function RecieverInfomation({ recieverInfo, handleCheckRecieverInfo,handleRecieverInfo }: SubscriberInfoProps) {
    return (
        <>
            <Typography variant='body1' sx={{ fontWeight: "bold" }}>收件人資訊</Typography>

            <Paper sx={{ mt: "15px", boxShadow: "none", border: "1px solid #d9d9d9" }}>
                <Stack sx={{ m: "30px" }} direction={"row"} spacing={"10px"} alignItems={"center"}>
                    <FormControlLabel control={<Checkbox onChange={handleCheckRecieverInfo} />} label="同訂購人資訊" />
                </Stack>

                <Stack sx={{ m: "30px" }} direction={"row"} spacing={"10px"} alignItems={"center"}>
                    <Typography sx={{ mr: "10px", minWidth: "30px" }} variant='caption' >姓名</Typography>
                    <TextField value={recieverInfo.name} name="name" onChange={handleRecieverInfo} placeholder='不得包含特殊符號 / $ . @ & # @...' inputProps={{ sx: { height: "15px" } }} sx={{ marginTop: "10px" }} size='small' fullWidth />
                </Stack>
                <Stack sx={{ m: "30px" }} direction={"row"} spacing={"10px"} alignItems={"center"}>
                    <Typography sx={{ mr: "10px", minWidth: "30px" }} variant='caption' >電話</Typography>
                    <TextField value={recieverInfo.phoneNumber} name="phoneNumber" onChange={handleRecieverInfo} placeholder='ex: 09xxxxxxxx' inputProps={{ sx: { height: "15px" } }} sx={{ marginTop: "10px" }} size='small' fullWidth />
                </Stack>
                <Stack sx={{ m: "30px" }} direction={"row"} spacing={"10px"} alignItems={"center"}>
                    <Typography sx={{ mr: "10px", minWidth: "30px" }} variant='caption' >信箱</Typography>
                    <TextField value={recieverInfo.mail} name="mail" onChange={handleRecieverInfo} placeholder='ex: asbc@gmail.com' inputProps={{ sx: { height: "15px" } }} sx={{ my: "10px" }} size='small' fullWidth />
                </Stack>


            </Paper>

        </>
    )
}

interface SubscriberInfoProps {
    recieverInfo: RecieverInfo;
    handleCheckRecieverInfo: (e: React.ChangeEvent<HTMLInputElement>) => void
    handleRecieverInfo : (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
}