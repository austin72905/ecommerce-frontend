import React from 'react'


import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import styled from '@mui/system/styled';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';

import Checkbox from '@mui/material/Checkbox';
import { useRouter } from 'next/router';

export default function SignUp() {
    const router = useRouter()

    const toLogin = () => {
        router.push("/login")
    }
    return (

        <Stack justifyContent={"center"} direction={"row"} sx={{ width:"100%",border: "0px solid #9f9f9f", mt:{ sm:4,xs:0 }, px:2,borderRadius: "4px" }}>

            <Stack 
                spacing={2.5} 
                sx={{ 
                    width:"100%",
                    border: "0px solid", 
                    minHeight: "800px", 
                    maxWidth:"400px",
                    minWidth: {
                        sm:"400px",
                        xs:"300px"
                    } ,
                    my: 4 
                }} 
                justifyContent={"center"}>

                <Stack alignItems={"center"}>
                    <Typography variant='h6' sx={{ fontWeight: 'bold' }}>註冊新會員</Typography>
                </Stack>

                <InputSet label='姓名' placeholder='不得包含特殊符號 / $ . @ & # @...' />

                <InputSet label='信箱' placeholder='ex: asbc@gmail.com' />

                <InputSet label='帳號' placeholder='請輸入帳號' />

                <InputSet label='密碼' placeholder='請輸入密碼' />

                <InputSet label='密碼確認' placeholder='請再次確認輸入密碼' />

                <Stack sx={{ pt: 1 }}>
                    <Button variant='contained' size='large' fullWidth>加入會員</Button>
                </Stack>

                <Stack sx={{ pt: 1 }}>

                    <Stack spacing={1} direction={"row"}>
                        <Typography variant='body2' sx={{ color: "#9f9f9f" }}>已經有會員了?</Typography>
                        <Typography variant='body2' sx={{ color: "#3E8FB2", cursor: "pointer" }} onClick={toLogin}>登入</Typography>
                    </Stack>
                </Stack>

            </Stack>


        </Stack>



    )
}


const ItemWrapper = styled(Box)({
    paddingTop: "5px",

})


interface InputSetProps {
    label: string;
    placeholder: string;
}

const InputSet = ({ label, placeholder }: InputSetProps) => {


    return (
        <Stack spacing={1} sx={{ pt: 1 }}>
            <Typography variant='body1' >{label}</Typography>
            <TextField placeholder={placeholder} autoComplete='off' fullWidth />
        </Stack>
    )

}