import { CargoInfomation } from "@/interfaces/cargo";
import { Box, Paper, Stack, Step, StepIconProps, StepLabel, Stepper, styled, Typography } from "@mui/material";

export default function CargoInfo({ cargoInfomation,cargoStep }: CargoInfoProps) {
    return (
        <Paper sx={{ height: "250px", boxShadow: "none", border: "1px solid #d9d9d9" }}>
            <Stack spacing={4} sx={{ ml: 3, mt: 3, pb: 3 }}>
                <Typography sx={{ fontWeight: "bold" }}>物流詳細情況</Typography>
                <Box sx={{ display: "flex", justifyContent: "center", border: "0px solid", mt: 1, ml: 1, py: 0, px: 0 }}>
                    <Stepper activeStep={cargoStep} orientation='vertical' >
                        {cargoInfomation.map((step, index) => (
                            <Step key={step.description}>
                                <StepLabel sx={{ '&.MuiStepLabel-root': { p: 0, m: 0 } }} StepIconComponent={StepIcon}>
                                    <Stack direction={"row"} spacing={"10px"}>
                                        <Typography variant='caption'>
                                            {step.date}
                                        </Typography>
                                        <Typography variant='caption'>
                                            {step.description}
                                        </Typography>


                                    </Stack>

                                </StepLabel>
                            </Step>
                        ))}
                    </Stepper>
                </Box>
            </Stack>

        </Paper>
    )
}


const StepIcon = (props: StepIconProps) => {

    const { active, completed, className } = props
    //console.log("active", active)

    return (
        <StepIconRoot>
            {completed ? (
                <div />
            ) : (
                <div className="step-uncompleted" />
            )}
        </StepIconRoot>

    )
}



const StepIconRoot = styled('div')(({ theme }) => ({
    marginLeft: "5px",
    borderRadius: '50%',
    background: theme.palette.primary.main,
    width: 15,
    height: 15,
    '& .step-uncompleted': {
        borderRadius: '50%',
        width: 15,
        height: 15,
        backgroundColor: '#AFAFAF',
    },

}))


interface CargoInfoProps {
    cargoInfomation: CargoInfomation[];
    cargoStep:number
}