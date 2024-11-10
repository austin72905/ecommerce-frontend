import React, { useState } from 'react'
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
import { useAlertMsgStore } from '@/store/store';
import WithAuth from '@/components/auth/with-auth';
import { INPUT_FIELD } from '@/constant-value/constant';
import { validateAddress, validateEmail, validateName, validatePhoneNumber, validateRecieveStore, ValidationErrors } from '@/utils/validation';



const AddressPage = () => {

    const initAddress: AddressInfo = { id: 0, name: "", phoneNumber: "", recieverAddress: "", recieveStore: "", recieveWay: "", isDefaultAddress: false }

    const [editedAddress, setEditedAddress] = useState<AddressInfo>(initAddress)

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




    // onChange
    const handleEditedAddress = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {

        let error: string | null

        switch (e.target.name as string) {
            case INPUT_FIELD.NAME:
                error = validateName(e.target.value)
                if (error) {
                    setErrors(oldError => ({ ...oldError, username: error as string }))
                } else {
                    setErrors(oldError => ({ ...oldError, username: undefined }))
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

    const [defaultAddressList, setDefaultAddressList] = useState(recieverInfoList)


    const setAlertMsg = useAlertMsgStore(state => state.setAlertMsg)

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

    const addNewAddress = () => {
        console.log(editedAddress)
        handleClose()
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
                                <TextField value={editedAddress.recieveStore} onChange={handleEditedAddress} name={INPUT_FIELD.RECIEVE_STORE} placeholder='ex: 台中門市' inputProps={{ sx: { height: "15px" } }}  sx={{ marginTop: "10px" }} size='small' fullWidth />
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





const ItemWrapper = styled(Box)({
    paddingTop: "5px",
    paddingLeft: "30px",
    paddingRight: "30px"
})



interface RecieverInfoProps {
    handleEditModal: (e: React.MouseEvent, content: AddressInfo) => void;
    changeDefaultAddress: (e: React.MouseEvent, i: number) => void;
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

const recieveWayMap =new Map<string,string>([
    ["UNIMARTC2C","7-11"],
    ["FAMIC2C","全家"],
])

const RecieverInfo = ({ handleEditModal, changeDefaultAddress, content, isSmallScreen, isXSScreen }: RecieverInfoProps) => {
    return (
        <Paper sx={{ mt: 2, boxShadow: "none", border: `1px solid ${content.isDefaultAddress ? "#61D1BD" : "#d9d9d9"}` }}>

            <Grid container columns={12} sx={{ p: 4 }} >
                <Grid item xs={12} sm={9} md={9} >
                    <Grid container columns={12} spacing={1}>
                        {
                            Object.getOwnPropertyNames(content).map((n, index) => {

                                if (n === "isDefaultAddress" || n === "id") {
                                    return null
                                }

                                // 寄件方式
                                if( n ==="recieveWay"){
                                    return (
                                        <React.Fragment key={n}>
                                        <Grid item xs={12}>
                                            <GridContainer
                                                xs={5} sm={2}
                                                columns={12}
                                                title={<Typography sx={{ minWidth: "30px" }} variant='subtitle2' >{addressTitle.get(n)}</Typography>}
                                                content={
                                                    <Typography sx={{ minWidth: "30px" }} variant='subtitle2'  >{recieveWayMap.get(content[n as keyof AddressInfo] as string)}</Typography>
                                                }
                                            />
                                        </Grid>

                                    </React.Fragment>
                                    )
                                }

                                return (
                                    <React.Fragment key={n}>
                                        <Grid item xs={12}>
                                            <GridContainer
                                                xs={5} sm={2}
                                                columns={12}
                                                title={<Typography sx={{ minWidth: "30px" }} variant='subtitle2' >{addressTitle.get(n)}</Typography>}
                                                content={
                                                    <Typography sx={{ minWidth: "30px" }} variant='subtitle2'  >{content[n as keyof AddressInfo]}</Typography>
                                                }
                                            />
                                        </Grid>

                                    </React.Fragment>
                                )

                            })


                        }
                    </Grid>
                </Grid>

                <Grid item xs={12} sm={3} md={3} sx={{ border: "0px solid #d9d9d9" }}>

                    {!isSmallScreen &&
                        <Stack spacing={0.5} alignItems={"end"} justifyContent={"space-between"} sx={{ border: "0px solid", height: "100%", width: "100%" }}>
                            <Stack spacing={0.5} sx={{ border: "0px solid" }} direction={"row"}>
                                <Button onClick={(e) => { handleEditModal(e, content) }} variant='outlined' sx={{ border: "1px solid #d9d9d9", color: "#AFAFAF" }}>編輯地址</Button>
                                <IconButton>
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
                                    <Button variant='outlined' onClick={(e) => { changeDefaultAddress(e, content.id) }} sx={{ width: "135px" }}>設為預設地址</Button>
                            }



                        </Stack>
                    }

                    {isSmallScreen &&
                        <Stack spacing={"20px"} sx={{ mt: "10px" }}>
                            <Stack direction={"row"} spacing={0.5} justifyContent={"space-between"} sx={{ border: "0px solid", }}>

                                <Button onClick={(e) => { handleEditModal(e, content) }} variant='outlined' sx={{ border: "1px solid #d9d9d9", color: "#AFAFAF" }}>編輯地址</Button>
                                <IconButton>
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
                                    <Button variant='outlined' onClick={(e) => { changeDefaultAddress(e, content.id) }} sx={{ width: "135px" }}>設為預設地址</Button>
                            }
                        </Stack>



                    }




                </Grid>



            </Grid>



        </Paper>
    )
}