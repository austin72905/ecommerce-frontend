import { RecievePlaceInfo } from "@/interfaces";
import { Button, FormControl, FormControlLabel, Grid, Paper, Radio, RadioGroup, Stack, Typography } from "@mui/material";


export default function CargoWay({ recieveStoreInfo, handleRecieveWay,handleAddressDrawerOpen,selectShipmentStoreMap }: CargoWayProps) {


    return (
        <>
            <Typography variant='body1' sx={{ fontWeight: "bold" }}>商品運送方式</Typography>

            <Paper sx={{ mt: "15px", boxShadow: "none", border: "1px solid #d9d9d9" }}>

                <Grid container columns={8} sx={{ border: "0px solid red" }}>
                    <Grid item xs={8} >
                        <FormControl sx={{ border: "0px solid red", width: "100%" }}>
                            <RadioGroup value={recieveStoreInfo.recieveWay} onChange={handleRecieveWay} sx={{ mx: "0px", my: "0px", border: "0px solid #d9d9d9" }}>
                                <FormControlLabel sx={{ backgroundColor: "#d9d9d9", mx: "0px", my: "0px", border: "1px solid #d9d9d9" }} value={"UNIMARTC2C"} control={<Radio sx={{ color: "#D9D9D9" }} />} label="7-11" />
                                <FormControlLabel sx={{ mx: "0px", my: "0px", border: "1px solid #d9d9d9" }} value={"FAMIC2C"} control={<Radio sx={{ color: "#D9D9D9" }} />} label="全家" />

                            </RadioGroup>
                        </FormControl>

                    </Grid>
                </Grid>

            </Paper>

            <Stack direction={"row"} spacing={2} sx={{ mt: "15px" }}>
                <Button variant='contained' sx={{ backgroundColor: "#EFB878", color: "black", "&:hover": { backgroundColor: "#EFB878" } }} onClick={selectShipmentStoreMap}>選擇門市</Button>
                <Button variant='outlined' onClick={handleAddressDrawerOpen}>選擇常用地址</Button>
            </Stack>

            <Stack spacing={"5px"} sx={{ mt: "15px" }}>
                <Stack direction={"row"} spacing={"15px"}>
                    <Typography variant='body2' >門市名稱:</Typography>

                    <Typography variant='body2' >{recieveStoreInfo.recieveStore}</Typography>
                </Stack>
                <Stack direction={"row"} spacing={"15px"}>
                    <Typography variant='body2' >門市地址:</Typography>

                    <Typography variant='body2' >{recieveStoreInfo.recieveAddress}</Typography>
                </Stack>

            </Stack>

        </>
    )
}

interface CargoWayProps {
    recieveStoreInfo: RecievePlaceInfo;
    handleRecieveWay: (e: React.ChangeEvent<HTMLInputElement>) => void
    selectShipmentStoreMap: () => Promise<void>
    handleAddressDrawerOpen:()=>void
}


/*

{
    "MerchantID":"2000933",
    "MerchantTradeNo":"RK45723",
    "LogisticsSubType":"UNIMARTC2C",
    "CVSStoreID":"131386",
    "CVSStoreName":"建盛門市",
    "CVSAddress":"新竹市東區建中一路52號1樓",
    "CVSTelephone":"",
    "CVSOutSide":"0",
    "ExtraData":""}

*/