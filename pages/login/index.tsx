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

export default function Login() {

    const router = useRouter()

    const toSignUp = () => {
        router.push("/signup")
    }
    return (

        <Stack justifyContent={"center"} direction={"row"} sx={{ width:"100%",border: "0px solid #9f9f9f", mt: 4, borderRadius: "4px" }}>

            <Stack spacing={2.5} 
                    sx={{ 
                        width:"100%",
                        border: "0px solid", 
                        minHeight: "600px", 
                        maxWidth:"400px",
                        minWidth: {
                            sm:"400px",
                            xs:"300px"
                        } 
                        }} justifyContent={"center"}>
                <Stack alignItems={"center"}>
                    <Typography variant='h6' sx={{ fontWeight: 'bold' }}>會員登入</Typography>
                </Stack>

                <InputSet label='帳號' placeholder='請輸入帳號' />

                <Stack spacing={1} sx={{ pt: 1 }}>
                    <Typography variant='body1' >密碼</Typography>
                    <TextField placeholder={'請輸入密碼'} autoComplete='off' fullWidth />
                    <Stack sx={{ mt: 1 }} direction={"row"} justifyContent={"space-between"} alignItems={"center"}>
                        <FormControlLabel
                            sx={{ ml: "1px" }}
                            control={<Checkbox sx={{ width: "25px", height: "25px" }} />}
                            label={<Typography sx={{ px: 1 }} variant='subtitle2'>記住我</Typography>} />

                        <Typography variant='body2' sx={{ color: "#3E8FB2" }}>忘記密碼?</Typography>
                    </Stack>
                </Stack>

                <Stack spacing={1} sx={{ pt: 1 }}>
                    <Button variant='contained' size='large' fullWidth>登入</Button>
                </Stack>


                <Stack sx={{ pt: 1 }}>
                    <Stack spacing={1} direction={"row"}>
                        <Typography variant='body2' sx={{ color: "#9f9f9f" }}>還沒有帳號嗎?</Typography>
                        <Typography variant='body2' sx={{ color: "#3E8FB2", cursor: "pointer" }} onClick={toSignUp}>註冊新會員</Typography>
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