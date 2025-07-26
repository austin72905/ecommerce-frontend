import { Box, Divider, Paper, Stack, Step, StepLabel, Stepper, Typography, StepConnector, stepConnectorClasses, StepIcon } from "@mui/material";
import { styled, alpha } from '@mui/material/styles';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CancelIcon from '@mui/icons-material/Cancel';
import { OrderInfomation, OrderStepInfomation } from "@/interfaces";
import { orderStatusMap } from "@/enums/order-status";
import { OrderStepStatus } from "@/enums/order-step";

// 現代化步驟連接器
const ModernStepConnector = styled(StepConnector)(({ theme }) => ({
    [`&.${stepConnectorClasses.alternativeLabel}`]: {
        top: 22,
    },
    [`&.${stepConnectorClasses.active}`]: {
        [`& .${stepConnectorClasses.line}`]: {
            background: 'linear-gradient(90deg, #E67E22, #F39C12)',
            height: 3,
            border: 0,
            borderRadius: 1,
        },
    },
    [`&.${stepConnectorClasses.completed}`]: {
        [`& .${stepConnectorClasses.line}`]: {
            background: 'linear-gradient(90deg, #27AE60, #2ECC71)',
            height: 3,
            border: 0,
            borderRadius: 1,
        },
    },
    [`& .${stepConnectorClasses.line}`]: {
        height: 3,
        border: 0,
        backgroundColor: '#E0E0E0',
        borderRadius: 1,
    },
}));

// 現代化步驟圖標
const ModernStepIconRoot = styled('div')<{ ownerState: { completed?: boolean; active?: boolean; canceled?: boolean } }>(
    ({ theme, ownerState }) => ({
        backgroundColor: ownerState.canceled ? '#E74C3C' : ownerState.completed ? '#27AE60' : ownerState.active ? '#E67E22' : '#E0E0E0',
        zIndex: 1,
        color: '#fff',
        width: 44,
        height: 44,
        display: 'flex',
        borderRadius: '50%',
        justifyContent: 'center',
        alignItems: 'center',
        boxShadow: ownerState.active || ownerState.completed ? '0 4px 12px rgba(0,0,0,0.15)' : 'none',
        transition: 'all 0.3s ease',
        border: `3px solid ${ownerState.canceled ? '#E74C3C' : ownerState.completed ? '#27AE60' : ownerState.active ? '#E67E22' : '#E0E0E0'}`,
        '&:hover': {
            transform: 'scale(1.1)',
        }
    }),
);

function ModernStepIcon(props: any) {
    const { active, completed, className, icon, canceled } = props;

    const icons: { [index: string]: React.ReactElement } = {
        1: <AccessTimeIcon />,
        2: <AccessTimeIcon />,
        3: <AccessTimeIcon />,
        4: <CheckCircleIcon />,
    };

    return (
        <ModernStepIconRoot ownerState={{ completed, active, canceled }} className={className}>
            {canceled ? <CancelIcon /> : completed ? <CheckCircleIcon /> : active ? <AccessTimeIcon /> : <RadioButtonUncheckedIcon />}
        </ModernStepIconRoot>
    );
}

export default function OrderStep({ orderInfo, orderStepInfomationList, achieveStep, goBackToPurchaseOrder }: OrderStepProps) {
    console.log("achieveStep=", achieveStep)
    const stepStatus = orderStepInfomationList.map(orderstep => orderstep.status)
    console.log(stepStatus)
    const activeStep = stepStatus.includes(OrderStepStatus.OrderCompleted) || stepStatus.includes(OrderStepStatus.OrderCanceled) ? achieveStep + 1 : achieveStep
    console.log("activeStep=", activeStep)
    
    const isCanceled = stepStatus.includes(OrderStepStatus.OrderCanceled);
    const statusInfo = orderStatusMap.get(orderInfo.status);

    return (
        <Box>
            {/* 現代化標題區域 */}
            <Box sx={{ 
                background: 'linear-gradient(135deg, #2C3E50 0%, #34495E 100%)',
                p: 3
            }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography 
                        variant="h6" 
                        sx={{ 
                            color: 'white',
                            fontWeight: 600
                        }}
                    >
                        訂單狀態
                    </Typography>
                    <Box sx={{ 
                        backgroundColor: alpha(statusInfo?.color || '#E67E22', 0.2),
                        color: statusInfo?.color || '#E67E22',
                        px: 2,
                        py: 1,
                        borderRadius: 2,
                        fontWeight: 600,
                        fontSize: '0.875rem'
                    }}>
                        {statusInfo?.description}
                    </Box>
                </Stack>
            </Box>

            {/* 現代化步驟流程 */}
            <Box sx={{ p: 4 }}>
                <Stepper 
                    activeStep={activeStep} 
                    alternativeLabel 
                    connector={<ModernStepConnector />}
                    sx={{
                        '& .MuiStepLabel-root': {
                            '& .MuiStepLabel-label': {
                                marginTop: 2,
                                fontSize: '0.875rem',
                                fontWeight: 500,
                                '&.Mui-active': {
                                    color: '#E67E22',
                                    fontWeight: 600,
                                },
                                '&.Mui-completed': {
                                    color: '#27AE60',
                                    fontWeight: 600,
                                },
                            },
                        },
                    }}
                >
                    {orderStepInfomationList.map((step, index) => {
                        const isStepCompleted = achieveStep > index;
                        const isStepActive = achieveStep === index;
                        const isStepCanceled = isCanceled && index === orderStepInfomationList.length - 1;

                        return (
                            <Step key={step.unachieveDescription}>
                                <StepLabel 
                                    StepIconComponent={(props) => 
                                        <ModernStepIcon 
                                            {...props} 
                                            canceled={isStepCanceled}
                                        />
                                    }
                                >
                                    <Box sx={{ textAlign: 'center' }}>
                                        <Typography 
                                            variant="body2" 
                                            sx={{ 
                                                fontWeight: 600,
                                                color: isStepCanceled ? '#E74C3C' : isStepCompleted ? '#27AE60' : isStepActive ? '#E67E22' : 'text.secondary',
                                                mb: 0.5
                                            }}
                                        >
                                            {achieveStep > index ? step.achieveDescription : step.unachieveDescription}
                                        </Typography>
                                        {(achieveStep >= index && step.date) && (
                                            <Typography 
                                                variant="caption" 
                                                sx={{ 
                                                    color: 'text.secondary',
                                                    fontSize: '0.75rem'
                                                }}
                                            >
                                                {step.date}
                                            </Typography>
                                        )}
                                    </Box>
                                </StepLabel>
                            </Step>
                        )
                    })}
                </Stepper>
            </Box>
        </Box>
    )
}

interface OrderStepProps {
    goBackToPurchaseOrder: () => void;
    achieveStep: number;
    orderInfo: OrderInfomation;
    orderStepInfomationList: OrderStepInfomation[];
}

