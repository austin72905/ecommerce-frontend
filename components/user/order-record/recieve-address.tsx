import { OrderAddress } from "@/interfaces/address";
import { Paper, Stack, Typography } from "@mui/material"

export default function RecieveAddress({address}:RecieveAddressProps){
    return (
        <Paper sx={{ height: "250px", boxShadow: "none", border: "1px solid #d9d9d9" }}>

                    <Stack spacing={4} sx={{ p: 3 }}>
                        <Typography sx={{ fontWeight: "bold" }}>收件地址</Typography>
                        <Stack spacing={1}>
                            <Typography variant='caption'>{address.receiver}</Typography>
                            <Typography variant='caption'>{address.phoneNumber}</Typography>
                            <Typography variant='caption'>
                                {address.shippingAddress}
                            </Typography>
                        </Stack>
                    </Stack>

                </Paper>
    )
}


interface RecieveAddressProps{
    address:OrderAddress;
}

 

