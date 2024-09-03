import React, { useEffect, useState } from 'react'

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
import Image from 'next/image';


import GoogleIcon from '/public/images/google-icon.png'

export default function Login() {

    const router = useRouter()

    const toSignUp = () => {
        router.push("/signup")
    }

    //預設Oauth 完之後跳轉的頁面
    const [redirectAfterAuth,setredirectAfterAuth]=useState("/products")

    useEffect(()=>{
        if(router.isReady){
            const query =router.query

            const redirectUrl =query.redirect as string;

            if(redirectUrl){
                setredirectAfterAuth(redirectUrl)
            }
        }
        
    },[router.isReady, router.query])

    const handleCGoogleLogin = async () => {

        const query = new URLSearchParams({
            client_id: "88199731036-4ve6gh6a0vdj63j41r4gnhd7cf8s8kpr.apps.googleusercontent.com",
            redirect_uri: "http://localhost:3000/auth",
            response_type: "code",
            scope: "openid profile email",
            state: `google-login:${redirectAfterAuth}`,
        }).toString()

        const url = `https://accounts.google.com/o/oauth2/v2/auth?${query}`
        window.location.href =url
        // const response = await fetch(url)
        // if (!response.ok) {
        //     throw new Error('Network response was not ok ' + response.statusText);
        // }

        // // 將回應解析為 JSON
        // const data = await response.json();

        // // 處理 JSON 資料
        // console.log(data);
    }

    return (

        <Stack alignItems={"center"} sx={{ width: "100%", border: "0px solid #9f9f9f", mt: { sm: 4, xs: 0 }, px: 2, borderRadius: "4px" }}>

            <Stack spacing={2.5}
                sx={{
                    width: "100%",
                    border: "0px solid",
                    minHeight: "600px",
                    maxWidth: "400px",
                    minWidth: {
                        sm: "400px",
                        xs: "300px"
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

            <Stack sx={{
                width: "100%",
                border: "0px solid",
                maxWidth: "400px",
                minWidth: {
                    sm: "400px",
                    xs: "300px"
                }
            }} justifyContent={"center"}>
                <Stack
                    direction={"row"}
                    spacing={1}
                    sx={{ py: 1, width: "100%", border: "1px solid #9f9f9f", cursor: "pointer", borderRadius: "5px" }}
                    alignItems={"center"}
                    justifyContent={"center"}
                    onClick={handleCGoogleLogin}
                >
                    <Image src={GoogleIcon} width={30} alt='google icon' />
                    <Typography variant="subtitle1">使用google 帳號登入</Typography>
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