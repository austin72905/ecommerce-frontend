import { FormControl, FormControlLabel, Grid, Paper, Radio, RadioGroup, Typography } from "@mui/material";

export default function PaymentWay() {
    return (
        <>
            <Typography variant='body1' sx={{ fontWeight: "bold" }}>付款方式</Typography>

            <Paper sx={{ mt: "15px", boxShadow: "none", border: "1px solid #d9d9d9" }}>

                <Grid container columns={8} sx={{ border: "0px solid red" }}>
                    <Grid item xs={8} >
                        <FormControl sx={{ width: "100%" }}>
                            <RadioGroup sx={{ mx: "0px", my: "0px", border: "0px solid #d9d9d9" }}>
                                <FormControlLabel sx={{ backgroundColor: "#d9d9d9", mx: "0px", my: "0px", border: "1px solid #d9d9d9" }} value={"銀行匯款"} control={<Radio disabled checked sx={{ color: "#D9D9D9" }} />} label="銀行匯款" />


                            </RadioGroup>
                        </FormControl>
                    </Grid>
                </Grid>




            </Paper>
        </>
    )
}