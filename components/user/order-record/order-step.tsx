import { Box, Divider, Paper, Stack, Step, StepLabel, Stepper, Typography } from "@mui/material";
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import { OrderInfomation, OrderStepInfomation } from "@/interfaces";
import { orderStatusMap } from "@/enums/order-status";
import { OrderStepStatus } from "@/enums/order-step";

export default function OrderStep({ orderInfo, orderStepInfomationList, achieveStep, goBackToPurchaseOrder }: OrderStepProps) {
    console.log("achieveStep=", achieveStep)
    const stepStatus = orderStepInfomationList.map(orderstep => orderstep.status)
    console.log(stepStatus)
    const activeStep = stepStatus.includes(OrderStepStatus.OrderCompleted) || stepStatus.includes(OrderStepStatus.OrderCanceled) ? achieveStep + 1 : achieveStep
    console.log("activeStep=", activeStep)
    return (
        <Paper sx={{ boxShadow: "none", border: "1px solid #d9d9d9" }}>
            <Stack>
                <Stack onClick={goBackToPurchaseOrder} direction={"row"} sx={{ border: "0px solid", '&:hover': { cursor: "pointer" }, width: 100, height: 30, mt: 1, ml: 1, mb: 0 }}>
                    <KeyboardArrowLeftIcon />
                    <Typography>上一頁</Typography>
                </Stack>
                <Divider />
                <Stack direction={"row"} spacing={3} justifyContent={"end"} sx={{ mr: 3, mt: 3 }}>
                    <Typography>訂單編號 : {orderInfo.recordCode}</Typography>
                    <Typography sx={{ color: orderStatusMap.get(orderInfo.status)?.color }}>{orderStatusMap.get(orderInfo.status)?.description}訂單</Typography>{/**#96DB8B #ef6060 */}
                </Stack>

                {/*訂單流程圖 */}
                <Box sx={{ border: "0px solid", mt: 1, ml: 1, py: 4, px: 4 }}>
                    {/*activeStep 0 開始， 在該步驟，該步驟會變active，超過該步驟，會變打勾，未到的會是unactive */}
                    <Stepper activeStep={activeStep} alternativeLabel >
                        {orderStepInfomationList.map((step, index) => (
                            <Step key={step.unachieveDescription} >
                                <StepLabel>
                                    <Stack>
                                        <Typography variant='caption'>
                                            {achieveStep > index ? step.achieveDescription : step.unachieveDescription}
                                        </Typography>
                                        <Typography variant='caption'>
                                            {achieveStep >= index ? step.date : ""}
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

interface OrderStepProps {
    goBackToPurchaseOrder: () => void;
    achieveStep: number;
    orderInfo: OrderInfomation;
    orderStepInfomationList: OrderStepInfomation[];
}

