import { CargoStepInfomation } from "@/interfaces/cargo";
import { Box, Stack, Step, StepIconProps, StepLabel, Stepper, styled, Typography, StepConnector, stepConnectorClasses } from "@mui/material";
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

// 現代化垂直步驟連接器
const ModernVerticalStepConnector = styled(StepConnector)(({ theme }) => ({
    [`&.${stepConnectorClasses.vertical}`]: {
        marginLeft: 22,
        padding: 0,
    },
    [`& .${stepConnectorClasses.line}`]: {
        borderLeftWidth: 2,
        borderLeftStyle: 'solid',
        borderLeftColor: '#E0E0E0',
        minHeight: 40,
    },
    [`&.${stepConnectorClasses.active} .${stepConnectorClasses.line}`]: {
        borderLeftColor: '#E67E22',
    },
    [`&.${stepConnectorClasses.completed} .${stepConnectorClasses.line}`]: {
        borderLeftColor: '#27AE60',
    },
}));

// 現代化步驟圖標
const ModernCargoStepIconRoot = styled('div')<{ ownerState: { completed?: boolean; active?: boolean } }>(
    ({ theme, ownerState }) => ({
        backgroundColor: ownerState.completed ? '#27AE60' : ownerState.active ? '#E67E22' : '#E0E0E0',
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
        border: `3px solid ${ownerState.completed ? '#27AE60' : ownerState.active ? '#E67E22' : '#E0E0E0'}`,
    }),
);

function ModernCargoStepIcon(props: any) {
    const { active, completed, className } = props;

    return (
        <ModernCargoStepIconRoot ownerState={{ completed, active }} className={className}>
            {completed ? <CheckCircleIcon /> : active ? <AccessTimeIcon /> : <RadioButtonUncheckedIcon />}
        </ModernCargoStepIconRoot>
    );
}

export default function CargoInfo({ cargoInfomation }: CargoInfoProps) {
    return (
        <Box sx={{ height: '100%' }}>
            {/* 現代化標題區域 */}
            <Box sx={{ 
                background: 'linear-gradient(135deg, #2C3E50 0%, #34495E 100%)',
                p: 3
            }}>
                <Typography 
                    variant="h6" 
                    sx={{ 
                        color: 'white',
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1
                    }}
                >
                    <LocalShippingIcon />
                    物流追蹤
                </Typography>
            </Box>

            {/* 物流時間軸 */}
            <Box sx={{ p: 3 }}>
                {cargoInfomation.length === 0 ? (
                    <Box sx={{
                        textAlign: 'center',
                        py: 4,
                        color: 'text.secondary'
                    }}>
                        <LocalShippingIcon sx={{ fontSize: 48, mb: 2, opacity: 0.3 }} />
                        <Typography variant="body2">
                            暫無物流資訊
                        </Typography>
                    </Box>
                ) : (
                    <Stepper 
                        activeStep={cargoInfomation.length} 
                        orientation="vertical"
                        connector={<ModernVerticalStepConnector />}
                        sx={{
                            '& .MuiStepLabel-root': {
                                padding: 0,
                                '& .MuiStepLabel-labelContainer': {
                                    marginLeft: 2,
                                },
                            },
                        }}
                    >
                        {cargoInfomation.map((step, index) => {
                            const isCompleted = step.updatedAt !== "";
                            const isActive = index === 0 && step.updatedAt !== "";

                            return (
                                <Step key={step.description} completed={isCompleted}>
                                    <StepLabel 
                                        StepIconComponent={(props) => 
                                            <ModernCargoStepIcon 
                                                {...props} 
                                                active={isActive}
                                                completed={isCompleted}
                                            />
                                        }
                                    >
                                        <Box sx={{ py: 1 }}>
                                            <Typography 
                                                variant="body1" 
                                                sx={{ 
                                                    fontWeight: 600,
                                                    color: isCompleted ? '#27AE60' : 'text.primary',
                                                    mb: 0.5
                                                }}
                                            >
                                                {step.description}
                                            </Typography>
                                            {step.updatedAt && (
                                                <Typography 
                                                    variant="body2" 
                                                    sx={{ 
                                                        color: 'text.secondary',
                                                        fontSize: '0.875rem'
                                                    }}
                                                >
                                                    {step.updatedAt}
                                                </Typography>
                                            )}
                                        </Box>
                                    </StepLabel>
                                </Step>
                            )
                        })}
                    </Stepper>
                )}
            </Box>
        </Box>
    )
}

interface CargoInfoProps {
    cargoInfomation: CargoStepInfomation[];
    cargoStep: number
}