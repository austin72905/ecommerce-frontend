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
import Backdrop from '@mui/material/Backdrop';
import { FormControl, MenuItem, Select, SelectChangeEvent, useMediaQuery, useTheme } from '@mui/material';
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
        width: isXSScreen ? 340 : isSmallScreen ? 400 : 500,
        bgcolor: 'background.paper',
        border: '1px solid #d9d9d9',
        borderRadius: "4px",
        boxShadow: "none",
        px: isSmallScreen ? "15px" : "30px",
        py: "20px"
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
        <Container sx={{ border: "0px solid" }} maxWidth='xl'>

            <Paper sx={{ border: "1px solid #d9d9d9", boxShadow: "none", mx: 1, mt: 2.5, minHeight: "500px" }}>
                <Stack spacing={3} sx={{ mt: 1 }}>
                    <Stack sx={{ mt: 4, px: "30px" }}>
                        <Typography variant='h6' sx={{ fontWeight: "bold" }}>常用地址</Typography>
                    </Stack>
                    <Stack sx={{ mt: 4, px: 4 }} direction="row" justifyContent="end">
                        <Button variant='outlined' onClick={handleOpen}>新增常用地址</Button>
                    </Stack>

                    {
                        defaultAddressList.map((c, index) =>
                        (
                            <RecieverInfo
                                key={index}
                                handleEditModal={handleEditModal}
                                content={c}
                                changeDefaultAddress={changeDefaultAddress}
                                deleteAddress={deleteAddress}
                                setDefaultAddress={setDefaultAddress}
                                isSmallScreen={isSmallScreen}
                                isXSScreen={isXSScreen}
                            />
                        ))
                    }



                </Stack>



            </Paper>

            <Modal open={open} onClose={handleClose} disableScrollLock closeAfterTransition BackdropComponent={Backdrop} BackdropProps={{ timeout: 500 }}>
                <Fade in={open} >
                    <Box sx={style}>


                        <Stack direction={"row"} justifyContent={"space-between"}>

                            <ItemWrapper sx={{ pl: "10px", pt: "0px" }}>
                                <Typography variant='h6' >新增常用地址</Typography>

                            </ItemWrapper>

                            <IconButton onClick={handleClose} sx={{ "&:hover": { backgroundColor: "#d9d9d9" }, border: "0px solid #d9d9d9", backgroundColor: "white", boxShadow: "none", width: "30px", height: "30px" }}>
                                <ClearOutlinedIcon />
                            </IconButton>

                        </Stack>



                        <Stack spacing={"10px"} sx={{ minHeight: "450px", marginLeft: "2px", marginRight: "2px", my: "10px", border: "1px solid #D9D9D9", borderRadius: "4px", backgroundColor: "white" }}>


                            <ItemWrapper sx={{ pt: "20px" }}>
                                <Typography variant='subtitle2' >收件人</Typography>
                                <TextField value={editedAddress.name} onChange={handleEditedAddress} name={INPUT_FIELD.NAME} placeholder='不得包含特殊符號 / $ . @ & # @...' inputProps={{ sx: { height: "15px" } }} sx={{ marginTop: "10px" }} size='small' fullWidth />
                                <Typography variant='caption' sx={{ color: "red" }}>{errors.username}</Typography>
                            </ItemWrapper>
                            <ItemWrapper >
                                <Typography variant='subtitle2' >聯絡電話</Typography>
                                <TextField value={editedAddress.phoneNumber} onChange={handleEditedAddress} name={INPUT_FIELD.PHONE_NUMBER} placeholder='ex: 09xxxxxxxx' inputProps={{ sx: { height: "15px" } }} sx={{ marginTop: "10px" }} size='small' fullWidth />
                                <Typography variant='caption' sx={{ color: "red" }}>{errors.phoneNumber}</Typography>
                            </ItemWrapper>

                            <ItemWrapper >
                                <Typography variant='subtitle2' >取件方式</Typography>

                                <FormControl fullWidth sx={{ marginTop: "10px" }} >
                                    <Select
                                        value={editedAddress.recieveWay}
                                        onChange={handleRecieveWay}
                                        size='small'
                                        name={INPUT_FIELD.RECIEVE_WAY}
                                        sx={{ height: "35px" }}
                                    >
                                        <MenuItem value="UNIMARTC2C">7-11</MenuItem>
                                        <MenuItem value="FAMIC2C">全家</MenuItem>
                                    </Select>
                                </FormControl>

                            </ItemWrapper>
                            <ItemWrapper >
                                <Typography variant='subtitle2' >取件門市</Typography>
                                <TextField value={editedAddress.recieveStore} onChange={handleEditedAddress} name={INPUT_FIELD.RECIEVE_STORE} placeholder='ex: 台中門市' inputProps={{ sx: { height: "15px" } }} sx={{ marginTop: "10px" }} size='small' fullWidth />
                                <Typography variant='caption' sx={{ color: "red" }}>{errors.recieveStore}</Typography>
                            </ItemWrapper>
                            <ItemWrapper >
                                <Typography variant='subtitle2' >收件地址</Typography>
                                <TextField value={editedAddress.recieverAddress} onChange={handleEditedAddress} name={INPUT_FIELD.RECIEVER_ADDRESS} placeholder='收件地址' inputProps={{ sx: { height: "15px" } }} sx={{ marginTop: "10px" }} size='small' fullWidth />
                                <Typography variant='caption' sx={{ color: "red" }}>{errors.shippingAddress}</Typography>
                            </ItemWrapper>

                            <ItemWrapper sx={{ pt: "40px", pb: "20px" }}>
                                <Stack direction={"row"} justifyContent={"space-around"}>
                                    <Button onClick={handleClose} variant='outlined'>取消</Button>
                                    <Button variant='contained' onClick={addNewAddress}>確定</Button>
                                </Stack>
                            </ItemWrapper>

                        </Stack>
                    </Box>
                </Fade>

            </Modal>
        </Container>
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
    changeDefaultAddress: (e: React.MouseEvent, i: number) => void;
    deleteAddress: (address: AddressInfo) => Promise<void>;
    setDefaultAddress: (address: AddressInfo) => Promise<void>
    content: AddressInfo;
    isSmallScreen: boolean;
    isXSScreen: boolean;
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

const RecieverInfo = ({ handleEditModal, changeDefaultAddress, deleteAddress, setDefaultAddress, content, isSmallScreen, isXSScreen }: RecieverInfoProps) => {
    return (
        <Paper sx={{ mt: 2, boxShadow: "none", border: `1px solid ${content.isDefaultAddress ? "#61D1BD" : "#d9d9d9"}` }}>

            <Grid container columns={12} sx={{ p: 4 }} >
                <Grid item xs={12} sm={9} md={9} >
                    <Grid container columns={12} spacing={1}>

                        <Grid item xs={12}>
                            <GridContainer
                                xs={5} sm={2}
                                columns={12}
                                title={<Typography sx={{ minWidth: "30px" }} variant='subtitle2' >收件人</Typography>}
                                content={
                                    <Typography sx={{ minWidth: "30px" }} variant='subtitle2'  >{content.name}</Typography>
                                }
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <GridContainer
                                xs={5} sm={2}
                                columns={12}
                                title={<Typography sx={{ minWidth: "30px" }} variant='subtitle2' >連絡電話</Typography>}
                                content={
                                    <Typography sx={{ minWidth: "30px" }} variant='subtitle2'  >{content.phoneNumber}</Typography>
                                }
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <GridContainer
                                xs={5} sm={2}
                                columns={12}
                                title={<Typography sx={{ minWidth: "30px" }} variant='subtitle2' >取件地址</Typography>}
                                content={
                                    <Typography sx={{ minWidth: "30px" }} variant='subtitle2'  >{content.recieverAddress}</Typography>
                                }
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <GridContainer
                                xs={5} sm={2}
                                columns={12}
                                title={<Typography sx={{ minWidth: "30px" }} variant='subtitle2' >取件門市</Typography>}
                                content={
                                    <Typography sx={{ minWidth: "30px" }} variant='subtitle2'  >{content.recieveStore}</Typography>
                                }
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <GridContainer
                                xs={5} sm={2}
                                columns={12}
                                title={<Typography sx={{ minWidth: "30px" }} variant='subtitle2' >取件方式</Typography>}
                                content={
                                    <Typography sx={{ minWidth: "30px" }} variant='subtitle2'  >{recieveWayMap.get(content.recieveWay as string)}</Typography>
                                }
                            />
                        </Grid>

                    </Grid>
                </Grid>

                <Grid item xs={12} sm={3} md={3} sx={{ border: "0px solid #d9d9d9" }}>

                    {!isSmallScreen &&
                        <Stack spacing={0.5} alignItems={"end"} justifyContent={"space-between"} sx={{ border: "0px solid", height: "100%", width: "100%" }}>
                            <Stack spacing={0.5} sx={{ border: "0px solid" }} direction={"row"}>
                                <Button onClick={(e) => { handleEditModal(e, content) }} variant='outlined' sx={{ border: "1px solid #d9d9d9", color: "#AFAFAF" }}>編輯地址</Button>
                                <IconButton onClick={(e) => { deleteAddress(content) }}>
                                    <DeleteIcon />
                                </IconButton>

                            </Stack>
                            {
                                content.isDefaultAddress
                                    ?
                                    <Stack justifyContent={"center"} alignItems={"center"} sx={{ height: "40px", width: "135px", backgroundColor: "#61D1BD", borderRadius: "4px" }}>
                                        <Typography variant='button' sx={{ color: "white" }}>預設地址</Typography>
                                    </Stack>
                                    :
                                    <Button variant='outlined' onClick={(e) => { setDefaultAddress(content) }} sx={{ width: "135px" }}>設為預設地址</Button>
                            }



                        </Stack>
                    }

                    {isSmallScreen &&
                        <Stack spacing={"20px"} sx={{ mt: "10px" }}>
                            <Stack direction={"row"} spacing={0.5} justifyContent={"space-between"} sx={{ border: "0px solid", }}>

                                <Button onClick={(e) => { handleEditModal(e, content) }} variant='outlined' sx={{ border: "1px solid #d9d9d9", color: "#AFAFAF" }}>編輯地址</Button>
                                <IconButton onClick={(e) => { deleteAddress(content) }}>
                                    <DeleteIcon />
                                </IconButton>






                            </Stack>

                            {
                                content.isDefaultAddress
                                    ?
                                    <Stack justifyContent={"center"} alignItems={"center"} sx={{ height: "40px", width: "135px", backgroundColor: "#61D1BD", borderRadius: "4px" }}>
                                        <Typography variant='button' sx={{ color: "white" }}>預設地址</Typography>
                                    </Stack>
                                    :
                                    <Button variant='outlined' onClick={(e) => { setDefaultAddress(content) }} sx={{ width: "135px" }}>設為預設地址</Button>
                            }
                        </Stack>



                    }




                </Grid>



            </Grid>



        </Paper>
    )
}