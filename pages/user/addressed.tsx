import React, { useEffect, useState } from 'react'
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import styled from '@mui/system/styled';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';

import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PersonIcon from '@mui/icons-material/Person';
import PhoneIcon from '@mui/icons-material/Phone';
import StoreIcon from '@mui/icons-material/Store';
import Backdrop from '@mui/material/Backdrop';
import { FormControl, MenuItem, Select, SelectChangeEvent, useMediaQuery, useTheme, Card, Chip, alpha } from '@mui/material';
import { GridContainer } from '@/components/ui/grid-container';
import { useAlertErrorMsgStore, useAlertMsgStore, useCsrfTokenStore } from '@/store/store';
import WithAuth from '@/components/auth/with-auth';
import { INPUT_FIELD } from '@/constant-value/constant';
import { validateAddress, validateEmail, validateNickName, validatePhoneNumber, validateRecieveStore, ValidationErrors } from '@/utils/validation';
import { UserShipAddress } from '@/interfaces';
import { ApiResponse } from '@/interfaces/api/response';
import { RespCode } from '@/enums/resp-code';

const AddressPage = () => {

    const initAddress: AddressInfo = { id: 0, name: "", phoneNumber: "", recieverAddress: "", recieveStore: "", recieveWay: "", isDefaultAddress: false }

    const [editedAddress, setEditedAddress] = useState<AddressInfo>(initAddress)

    const csrfToken = useCsrfTokenStore((state) => state.csrfToken)

    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);

    const handleClose = () => {
        setEditedAddress(initAddress)
        setOpen(false)
        setErrors({})
    }

    const handleEditModal = (e: React.MouseEvent, content: AddressInfo) => {
        setEditedAddress(content)
        setOpen(true)
    }

    // 紀錄 輸入是否合法
    const [errors, setErrors] = useState<ValidationErrors>({});

    const theme = useTheme()
    const isSmallScreen: boolean = useMediaQuery(theme.breakpoints.down('sm'))
    const isXSScreen: boolean = useMediaQuery(('(max-width:430px)'))

    const style = {
        position: 'absolute' as 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: isXSScreen ? 360 : isSmallScreen ? 420 : 520,
        bgcolor: 'background.paper',
        borderRadius: 3,
        boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
        backdropFilter: 'blur(10px)',
        px: isSmallScreen ? 3 : 4,
        py: 3
    };

    const [isRenew, setisRenew] = useState<boolean>(false)

    const [defaultAddressList, setDefaultAddressList] = useState<AddressInfo[]>([])
    // 從後端獲取常用地址
    useEffect(() => {

        const fetchData = async () => {
            try {
                const result = await getUserShippingAddress() as ApiResponse;
                console.log("result=", result)

                if (result.code != RespCode.SUCCESS) {
                    console.log("獲取數據失敗")
                    return;
                }

                if (result.data == null) {
                    console.log("獲取數據失敗")
                    return;
                }

                const data = result.data as UserShipAddress[]

                const addressListData: AddressInfo[] = data.map(ua => {
                    const userAddress: AddressInfo = {
                        id: ua.addressId,
                        name: ua.recipientName,
                        phoneNumber: ua.phoneNumber,
                        recieverAddress: ua.addressLine,
                        recieveWay: ua.recieveWay,
                        recieveStore: ua.recieveStore,
                        isDefaultAddress: ua.isDefault
                    }
                    return userAddress
                })

                setDefaultAddressList(addressListData)

            } catch (error) {
                console.error('Error fetching data:', error)
            }
        }

        fetchData()
    }, [isRenew])

    // onChange
    const handleEditedAddress = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {

        let error: string | null

        switch (e.target.name as string) {
            case INPUT_FIELD.NAME:
                error = validateNickName(e.target.value)
                if (error) {
                    setErrors(oldError => ({ ...oldError, nickname: error as string }))
                } else {
                    setErrors(oldError => ({ ...oldError, nickname: undefined }))
                }
                break;

            case INPUT_FIELD.PHONE_NUMBER:
                error = validatePhoneNumber(e.target.value)

                if (error) {
                    setErrors(oldError => ({ ...oldError, phoneNumber: error as string }))
                } else {

                    setErrors(oldError => ({ ...oldError, phoneNumber: undefined }))
                }
                break;

            case INPUT_FIELD.EMAIL:
                error = validateEmail(e.target.value)
                if (error) {
                    setErrors(oldError => ({ ...oldError, email: error as string }))
                } else {
                    setErrors(oldError => ({ ...oldError, email: undefined }))
                }
                break;

            case INPUT_FIELD.RECIEVE_STORE:
                error = validateRecieveStore(e.target.value)
                if (error) {
                    setErrors(oldError => ({ ...oldError, recieveStore: error as string }))
                } else {
                    setErrors(oldError => ({ ...oldError, recieveStore: undefined }))
                }
                break;

            case INPUT_FIELD.RECIEVER_ADDRESS:
                error = validateAddress(e.target.value)
                if (error) {
                    setErrors(oldError => ({ ...oldError, shippingAddress: error as string }))
                } else {
                    setErrors(oldError => ({ ...oldError, shippingAddress: undefined }))
                }
                break;
        }

        setEditedAddress(o => {

            let newO: any = { ...o }

            Object.getOwnPropertyNames(o).forEach(ele => {
                if (ele === e.target.name) {

                    newO[e.target.name as keyof any] = e.target.value
                }
            })
            //console.log("newO ", newO)
            return newO
        })
    }

    const setAlertMsg = useAlertMsgStore(state => state.setAlertMsg)
    const setAlertErrorMsg=useAlertErrorMsgStore(state=>state.setAlertErrorMsg)

    const changeDefaultAddress = (e: React.MouseEvent, i: number) => {

        setDefaultAddressList(temp => {
            temp.forEach((ele, index) => {
                if (ele.id != i) {
                    ele.isDefaultAddress = false
                } else {
                    ele.isDefaultAddress = true
                }

                return ele
            })

            return [...temp]
        })

        setAlertMsg("修改預設地址成功")

    }

    const handleRecieveWay = (e: SelectChangeEvent) => {

        setEditedAddress(o => {

            let newO: any = { ...o }

            Object.getOwnPropertyNames(o).forEach(ele => {
                if (ele === e.target.name) {

                    newO[e.target.name as keyof any] = e.target.value
                }
            })
            //console.log("newO ", newO)
            return newO
        })
    }

    const addNewAddress = async () => {
        console.log(editedAddress)

        // 判斷是否都有輸入
        if (!Object.values(errors).every(value => value === undefined)) {
            console.log("errors:", errors)
            return
        }

        const data: UserShipAddress = {
            addressId: editedAddress.id,
            recipientName: editedAddress.name,
            recieveWay: editedAddress.recieveWay,
            recieveStore: editedAddress.recieveStore,
            phoneNumber: editedAddress.phoneNumber,
            addressLine: editedAddress.recieverAddress,
            isDefault: false
        }

        if (editedAddress.id === 0) {
            try {
                const result = await addShippingAddress(data, csrfToken as string) as ApiResponse;

                console.log("addNewAddress result=", result)

                if (result.code != RespCode.SUCCESS) {
                    setAlertErrorMsg(result.message)
                    return;
                }
                setAlertMsg("新增地址成功")

            } catch (error) {
                console.log("修改異常")
            }

        } else {

            try {
                const result = await modifyShippingAddress(data, csrfToken as string) as ApiResponse;

                console.log("addNewAddress result=", result)

                if (result.code != RespCode.SUCCESS ) {
                    setAlertErrorMsg(result.message)
                    return;
                }

                setAlertMsg("修改地址成功")
            } catch (error) {

                console.log("修改異常")
            }

        }

        handleClose()

        setisRenew(u => !u)
    }

    const deleteAddress = async (address: AddressInfo) => {

        //console.log(address)

        const data: UserShipAddress = {
            addressId: address.id,
            recipientName: address.name,
            recieveWay: address.recieveWay,
            recieveStore: address.recieveStore,
            phoneNumber: address.phoneNumber,
            addressLine: address.recieverAddress,
            isDefault: address.isDefaultAddress
        }

        const result =await deleteShippingAddress(data, csrfToken as string)
        console.log("deleteAddress result:",result)
        if (result.code != RespCode.SUCCESS) {
            setAlertErrorMsg(result.message)
            return;
        }

        setAlertMsg("刪除地址成功")

        setisRenew(u => !u)
    }

    const setDefaultAddress = async (address: AddressInfo) => {

        console.log(address)

        const data: UserShipAddress = {
            addressId: address.id,
            recipientName: address.name,
            recieveWay: address.recieveWay,
            recieveStore: address.recieveStore,
            phoneNumber: address.phoneNumber,
            addressLine: address.recieverAddress,
            isDefault: address.isDefaultAddress
        }

        const result =await setDefaultShippingAddress(data, csrfToken as string)
        if (result.code != RespCode.SUCCESS) {
            setAlertErrorMsg(result.message)
            return;
        }
        setisRenew(u => !u) //重新去後端取值
        setAlertMsg("修改預設地址成功")
    }

    return (
        <Box sx={{ 
            backgroundColor: 'background.default',
            minHeight: '100vh',
            py: 4
        }}>
            <Container maxWidth='xl'>
                {/* 現代化標題區域 */}
                <Box sx={{ mb: 4 }}>
                    <Typography 
                        variant="h4" 
                        sx={{ 
                            fontWeight: 700,
                            mb: 1,
                            background: 'linear-gradient(45deg, #2C3E50, #34495E)',
                            backgroundClip: 'text',
                            WebkitBackgroundClip: 'text',
                            color: 'transparent'
                        }}
                    >
                        常用地址管理
                    </Typography>
                    <Box sx={{
                        height: '3px',
                        width: '80px',
                        background: 'linear-gradient(90deg, #E67E22, #F39C12)',
                        borderRadius: 2,
                        mb: 2
                    }} />
                    <Typography variant="subtitle1" sx={{ color: 'text.secondary' }}>
                        管理您的收件地址，讓購物更便利
                    </Typography>
                </Box>

                {/* 現代化主要內容卡片 */}
                <Card sx={{ 
                    borderRadius: 3,
                    boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
                    overflow: 'hidden'
                }}>
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
                                收件地址列表
                            </Typography>
                            <Button 
                                variant="contained"
                                startIcon={<AddIcon />}
                                onClick={handleOpen}
                                sx={{
                                    backgroundColor: '#E67E22',
                                    '&:hover': {
                                        backgroundColor: '#D35400'
                                    }
                                }}
                            >
                                新增地址
                            </Button>
                        </Stack>
                    </Box>

                    <Box sx={{ p: 3 }}>
                        {defaultAddressList.length === 0 ? (
                            <Box sx={{
                                textAlign: 'center',
                                py: 8,
                                color: 'text.secondary'
                            }}>
                                <LocationOnIcon sx={{ fontSize: 64, mb: 2, opacity: 0.3 }} />
                                <Typography variant="h6" sx={{ mb: 1 }}>
                                    尚未添加任何地址
                                </Typography>
                                <Typography variant="body2">
                                    點擊「新增地址」按鈕來添加您的第一個收件地址
                                </Typography>
                            </Box>
                        ) : (
                            <Grid container spacing={3}>
                                {defaultAddressList.map((address, index) => (
                                    <Grid item xs={12} md={6} lg={4} key={index}>
                                        <ModernAddressCard
                                            address={address}
                                            handleEditModal={handleEditModal}
                                            deleteAddress={deleteAddress}
                                            setDefaultAddress={setDefaultAddress}
                                        />
                                    </Grid>
                                ))}
                            </Grid>
                        )}
                    </Box>
                </Card>

                {/* 現代化新增/編輯地址對話框 */}
                <Modal 
                    open={open} 
                    onClose={handleClose} 
                    disableScrollLock 
                    closeAfterTransition 
                    BackdropComponent={Backdrop} 
                    BackdropProps={{ 
                        timeout: 500,
                        sx: { 
                            backgroundColor: 'rgba(44, 62, 80, 0.8)',
                            backdropFilter: 'blur(8px)'
                        }
                    }}
                >
                    <Fade in={open}>
                        <Box sx={style}>
                            {/* 對話框標題 */}
                            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
                                <Typography 
                                    variant="h5" 
                                    sx={{ 
                                        fontWeight: 700,
                                        color: '#2C3E50'
                                    }}
                                >
                                    {editedAddress.id === 0 ? '新增常用地址' : '編輯地址'}
                                </Typography>
                                <IconButton 
                                    onClick={handleClose}
                                    sx={{
                                        backgroundColor: alpha('#E67E22', 0.1),
                                        '&:hover': {
                                            backgroundColor: alpha('#E67E22', 0.2),
                                            transform: 'scale(1.1)'
                                        }
                                    }}
                                >
                                    <ClearOutlinedIcon />
                                </IconButton>
                            </Stack>

                            {/* 表單內容 */}
                            <Box sx={{
                                backgroundColor: '#FAFAFA',
                                borderRadius: 2,
                                p: 3
                            }}>
                                <Grid container spacing={3}>
                                    <Grid item xs={12} sm={6}>
                                        <ModernFormField
                                            label="收件人"
                                            icon={<PersonIcon />}
                                            placeholder="請輸入收件人姓名"
                                            name={INPUT_FIELD.NAME}
                                            value={editedAddress.name}
                                            error={errors.username}
                                            onChange={handleEditedAddress}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <ModernFormField
                                            label="聯絡電話"
                                            icon={<PhoneIcon />}
                                            placeholder="ex: 09xxxxxxxx"
                                            name={INPUT_FIELD.PHONE_NUMBER}
                                            value={editedAddress.phoneNumber}
                                            error={errors.phoneNumber}
                                            onChange={handleEditedAddress}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Typography variant="body2" sx={{ fontWeight: 600, mb: 1, color: '#2C3E50' }}>
                                            取件方式
                                        </Typography>
                                        <FormControl fullWidth>
                                            <Select
                                                value={editedAddress.recieveWay}
                                                onChange={handleRecieveWay}
                                                name={INPUT_FIELD.RECIEVE_WAY}
                                                sx={{
                                                    borderRadius: 2,
                                                    '& .MuiOutlinedInput-root': {
                                                        '& fieldset': {
                                                            borderColor: 'rgba(0,0,0,0.1)'
                                                        },
                                                        '&:hover fieldset': {
                                                            borderColor: '#E67E22'
                                                        },
                                                        '&.Mui-focused fieldset': {
                                                            borderColor: '#E67E22'
                                                        }
                                                    }
                                                }}
                                            >
                                                <MenuItem value="UNIMARTC2C">7-11</MenuItem>
                                                <MenuItem value="FAMIC2C">全家</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <ModernFormField
                                            label="取件門市"
                                            icon={<StoreIcon />}
                                            placeholder="ex: 台中門市"
                                            name={INPUT_FIELD.RECIEVE_STORE}
                                            value={editedAddress.recieveStore}
                                            error={errors.recieveStore}
                                            onChange={handleEditedAddress}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <ModernFormField
                                            label="收件地址"
                                            icon={<LocationOnIcon />}
                                            placeholder="請輸入完整收件地址"
                                            name={INPUT_FIELD.RECIEVER_ADDRESS}
                                            value={editedAddress.recieverAddress}
                                            error={errors.shippingAddress}
                                            onChange={handleEditedAddress}
                                        />
                                    </Grid>
                                </Grid>

                                {/* 按鈕區域 */}
                                <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 4 }}>
                                    <Button 
                                        onClick={handleClose} 
                                        variant="outlined"
                                        sx={{
                                            borderColor: '#2C3E50',
                                            color: '#2C3E50',
                                            '&:hover': {
                                                borderColor: '#34495E',
                                                backgroundColor: alpha('#2C3E50', 0.05)
                                            }
                                        }}
                                    >
                                        取消
                                    </Button>
                                    <Button 
                                        variant="contained" 
                                        onClick={addNewAddress}
                                        sx={{
                                            backgroundColor: '#E67E22',
                                            '&:hover': {
                                                backgroundColor: '#D35400'
                                            }
                                        }}
                                    >
                                        {editedAddress.id === 0 ? '新增地址' : '儲存變更'}
                                    </Button>
                                </Stack>
                            </Box>
                        </Box>
                    </Fade>
                </Modal>
            </Container>
        </Box>
    )
}

export default WithAuth(AddressPage);


const recieveWayMap = new Map<string, string>([
    ["UNIMARTC2C", "7-11"],
    ["FAMIC2C", "全家"],
])


const ItemWrapper = styled(Box)({
    paddingTop: "5px",
    paddingLeft: "30px",
    paddingRight: "30px"
})



interface RecieverInfoProps {
    handleEditModal: (e: React.MouseEvent, content: AddressInfo) => void;
    deleteAddress: (address: AddressInfo) => Promise<void>;
    setDefaultAddress: (address: AddressInfo) => Promise<void>;
    address: AddressInfo;
}

const addressContent = new Map([
    ["收件人", "王大明"],
    ["連絡電話", "0945864315"],
    ["信箱", "Laopigu@gmail.com"],
    ["取件門市", "7-11 雅典門市"],
    ["取件地址", "台中市南區三民西路377號西川一路1號"],
])

const addressTitle = new Map([
    ["name", "收件人"],
    ["phoneNumber", "連絡電話"],
    ["email", "信箱"],
    ["recieveWay", "取件方式"],
    ["recieveStore", "取件門市"],
    ["recieverAddress", "取件地址"]
])

interface AddressInfo {
    id: number;
    name: string;
    phoneNumber: string;
    recieverAddress: string;
    recieveStore: string;
    recieveWay: string;
    isDefaultAddress: boolean;
}

const aContent: AddressInfo = {
    id: 1,
    name: "王大明",
    phoneNumber: "0945864315",
    recieverAddress: "台中市南區三民西路377號西川一路1號",
    recieveStore: "雅典門市",
    recieveWay: "UNIMARTC2C",
    isDefaultAddress: false
}

const recieverInfoList: AddressInfo[] = [
    aContent,
    { ...aContent, id: 2 },
    { ...aContent, id: 3 },
    { ...aContent, id: 4 },
]



// 後端請求
const addShippingAddress = async (data: UserShipAddress, token: string) => {
    const apiUrl = process.env.NEXT_PUBLIC_BACKEND_URL
    const response = await fetch(`${apiUrl}/User/AddShippingAddress`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRF-Token': token
        },
        body: JSON.stringify(data)
    })

    return response.json();
}

const modifyShippingAddress = async (data: UserShipAddress, token: string) => {
    const apiUrl = process.env.NEXT_PUBLIC_BACKEND_URL
    const response = await fetch(`${apiUrl}/User/ModifyShippingAddress`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRF-Token': token
        },
        body: JSON.stringify(data)
    })

    return response.json();
}

const deleteShippingAddress = async (data: UserShipAddress, token: string) => {
    const apiUrl = process.env.NEXT_PUBLIC_BACKEND_URL
    const response = await fetch(`${apiUrl}/User/DeleteShippingAddress`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRF-Token': token
        },
        body: JSON.stringify(data)
    })

    return response.json();
}


const setDefaultShippingAddress = async (data: UserShipAddress, token: string) => {
    const apiUrl = process.env.NEXT_PUBLIC_BACKEND_URL
    const response = await fetch(`${apiUrl}/User/SetDefaultShippingAddress`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRF-Token': token
        },
        body: JSON.stringify(data)
    })

    return response.json();
}

const getUserShippingAddress = async () => {
    const apiUrl = process.env.NEXT_PUBLIC_BACKEND_URL
    const response = await fetch(`${apiUrl}/User/GetUserShippingAddress`, {
        method: 'GET',
        credentials: 'include',

    })

    return response.json();
}

const ModernAddressCard = ({ address, handleEditModal, deleteAddress, setDefaultAddress }: RecieverInfoProps) => {
    return (
        <Card sx={{ 
            borderRadius: 2,
            boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
            '&:hover': {
                boxShadow: '0 8px 24px rgba(0,0,0,0.12)'
            }
        }}>
            <Box sx={{ p: 3, pb: 2 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>{address.name}</Typography>
                    <Chip
                        label={address.isDefaultAddress ? '預設地址' : ''}
                        size="small"
                        sx={{
                            backgroundColor: address.isDefaultAddress ? '#61D1BD' : '#E0E0E0',
                            color: address.isDefaultAddress ? 'white' : 'text.primary',
                            fontWeight: 600,
                            borderRadius: 1,
                            '& .MuiChip-label': {
                                px: 1.5
                            }
                        }}
                    />
                </Stack>
                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>{address.phoneNumber}</Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>{address.recieverAddress}</Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>{address.recieveStore}</Typography>
            </Box>
            <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                p: 2, 
                borderTop: '1px solid #eee'
            }}>
                <Stack direction="row" spacing={1}>
                    <IconButton onClick={(e) => handleEditModal(e, address)}>
                        <EditIcon />
                    </IconButton>
                    <IconButton onClick={(e) => deleteAddress(address)}>
                        <DeleteIcon />
                    </IconButton>
                </Stack>
                <Button 
                    variant="outlined" 
                    onClick={(e) => setDefaultAddress(address)}
                    sx={{ 
                        borderColor: '#E67E22', 
                        color: '#E67E22', 
                        '&:hover': {
                            borderColor: '#D35400',
                            backgroundColor: alpha('#E67E22', 0.05)
                        }
                    }}
                >
                    設為預設
                </Button>
            </Box>
        </Card>
    )
}

const ModernFormField = ({ label, icon, placeholder, name, value, error, onChange }: {
    label: string;
    icon: React.ReactNode;
    placeholder: string;
    name: string;
    value: string;
    error: string | undefined;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}) => {
    return (
        <Box sx={{ mb: 2 }}>
            <Stack direction="row" alignItems="center" sx={{ mb: 1 }}>
                <Box component="span" sx={{ color: '#2C3E50', mr: 1, display: 'flex', alignItems: 'center' }}>
                    {icon}
                </Box>
                <Typography variant="body2" sx={{ fontWeight: 600, color: '#2C3E50' }}>{label}</Typography>
            </Stack>
            <TextField
                fullWidth
                placeholder={placeholder}
                name={name}
                value={value}
                onChange={onChange}
                error={!!error}
                helperText={error}
                sx={{
                    '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                            borderColor: 'rgba(0,0,0,0.1)'
                        },
                        '&:hover fieldset': {
                            borderColor: '#E67E22'
                        },
                        '&.Mui-focused fieldset': {
                            borderColor: '#E67E22'
                        }
                    }
                }}
            />
        </Box>
    )
}