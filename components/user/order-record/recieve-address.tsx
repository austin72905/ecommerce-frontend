import { OrderAddress } from "@/interfaces/address";
import { Box, Stack, Typography } from "@mui/material";
import PersonIcon from '@mui/icons-material/Person';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import StoreIcon from '@mui/icons-material/Store';
import EmailIcon from '@mui/icons-material/Email';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';

export default function RecieveAddress({ address }: RecieveAddressProps) {
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
                    <LocationOnIcon />
                    收件地址
                </Typography>
            </Box>

            {/* 地址詳細資訊 */}
            <Box sx={{ p: 3 }}>
                <Stack spacing={3}>
                    <AddressItem
                        icon={<PersonIcon />}
                        label="收件人"
                        value={address.receiver}
                    />
                    <AddressItem
                        icon={<PhoneIcon />}
                        label="聯絡電話"
                        value={address.phoneNumber}
                    />
                    <AddressItem
                        icon={<LocationOnIcon />}
                        label="收件地址"
                        value={address.shippingAddress}
                    />
                    <AddressItem
                        icon={<LocalShippingIcon />}
                        label="配送方式"
                        value={address.recieveWay}
                    />
                    <AddressItem
                        icon={<StoreIcon />}
                        label="取件店舖"
                        value={address.recieveStore}
                    />
                    <AddressItem
                        icon={<EmailIcon />}
                        label="電子郵件"
                        value={address.email}
                    />
                </Stack>
            </Box>
        </Box>
    )
}

// 地址項目組件
const AddressItem = ({ icon, label, value }: {
    icon: React.ReactNode;
    label: string;
    value: string | undefined;
}) => (
    <Stack direction="row" spacing={2} alignItems="flex-start">
        <Box sx={{ 
            color: '#E67E22',
            mt: 0.2,
            minWidth: 20,
            display: 'flex',
            justifyContent: 'center'
        }}>
            {icon}
        </Box>
        <Box sx={{ flex: 1 }}>
            <Typography 
                variant="body2" 
                sx={{ 
                    color: 'text.secondary',
                    fontWeight: 500,
                    mb: 0.5
                }}
            >
                {label}
            </Typography>
            <Typography 
                variant="body1" 
                sx={{ 
                    fontWeight: 600,
                    color: 'text.primary',
                    wordBreak: 'break-word'
                }}
            >
                {value || '未提供'}
            </Typography>
        </Box>
    </Stack>
);

interface RecieveAddressProps {
    address: OrderAddress;
}



