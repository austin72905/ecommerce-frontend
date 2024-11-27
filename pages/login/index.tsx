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
import { INPUT_FIELD } from '@/constant-value/constant';
import { validatePassword, validateUserName, ValidationErrors } from '@/utils/validation';
import { ApiResponse } from '@/interfaces/api/response';
import { RespCode } from '@/enums/resp-code';
import { useAlertErrorMsgStore, useAlertMsgStore } from '@/store/store';

export default function Login() {

    const setAlertMsg = useAlertMsgStore((state) => state.setAlertMsg)
    const setAlertErrorMsg=useAlertErrorMsgStore((state)=>state.setAlertErrorMsg)
    const [isRenew, setisRenew] = useState<boolean>(false)
    const router = useRouter()

    const toSignUp = () => {
        router.push("/signup")
    }


    const toUserAccount = ()=>{
        // router.replace("/user/account").then(()=>{
        //     console.log("跳轉錄由")
        // })
        const apiUrl =process.env.NEXT_PUBLIC_FRONTEND_URL
        window.location.href=`${apiUrl}/user/account`

    }

    //預設Oauth 完之後跳轉的頁面
    const [redirectAfterAuth, setredirectAfterAuth] = useState("/products")

    useEffect(() => {
        if (router.isReady) {
            const query = router.query

            const redirectUrl = query.redirect as string;

            if (redirectUrl) {
                setredirectAfterAuth(redirectUrl)
            }
        }

    }, [router.isReady, router.query])

    const handleCGoogleLogin = async () => {

        const apiUrl =process.env.NEXT_PUBLIC_FRONTEND_URL

        const query = new URLSearchParams({
            client_id: "88199731036-4ve6gh6a0vdj63j41r4gnhd7cf8s8kpr.apps.googleusercontent.com",
            redirect_uri: `${apiUrl}/auth`,
            response_type: "code",
            scope: "openid profile email",
            state: `google-login:${redirectAfterAuth}`,
        }).toString()

        const url = `https://accounts.google.com/o/oauth2/v2/auth?${query}`
        window.location.href = url

    }

    // 驗證輸入
    const [errors, setErrors] = useState<ValidationErrors>({});
    const [input, setinput] = useState<Login>({ username: "", password: "" })

    const handleLoginInput = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {

        let error: string | null

        console.log("name:", e.target.name)

        switch (e.target.name as string) {

            case INPUT_FIELD.USERNAME:
                error = validateUserName(e.target.value)
                if (error) {
                    setErrors(oldError => ({ ...oldError, username: error as string }))
                } else {
                    setErrors(oldError => ({ ...oldError, username: undefined }))
                }
                break;

            case INPUT_FIELD.PASSWORD:
                error = validatePassword(e.target.value)
                if (error) {
                    setErrors(oldError => ({ ...oldError, password: error as string }))
                } else {
                    setErrors(oldError => ({ ...oldError, password: undefined }))
                }
                break;


        }


        setinput(info => {

            let newInfo: Login = { ...info }

            Object.getOwnPropertyNames(info).forEach(ele => {
                if (ele === e.target.name) {
                    newInfo[e.target.name as keyof Login] = e.target.value
                }
            })
            //console.log("now personalInfo ", newO)
            return newInfo
        })
    }


    const login = async () => {
       

        // 判斷是否都有輸入
        if (!Object.values(errors).every(value => value === undefined)) {
            console.log("errors:", errors)
            return
        }

        const result = await userLogin(input) as ApiResponse;


        console.log("result=", result)


        if (result.code != RespCode.SUCCESS) {

            setAlertErrorMsg(result.message)
            //console.log(result.message)
            return;
        }


        toUserAccount()
    }

    useEffect(()=>{
        if(isRenew){
            toUserAccount()
        }
    },[isRenew])

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


                <InputSet label='帳號' placeholder='請輸入帳號' name={INPUT_FIELD.USERNAME} value={input.username} errorMsg={errors.username} func={handleLoginInput} />

                <InputSet label='密碼' placeholder='請輸入密碼' name={INPUT_FIELD.PASSWORD} value={input.password} errorMsg={errors.password} func={handleLoginInput} />

                <Stack spacing={1} sx={{ pt: 1 }}>
                    <Stack sx={{ mt: 1 }} direction={"row"} justifyContent={"space-between"} alignItems={"center"}>
                        <FormControlLabel
                            sx={{ ml: "1px" }}
                            control={<Checkbox sx={{ width: "25px", height: "25px" }} />}
                            label={<Typography sx={{ px: 1 }} variant='subtitle2'>記住我</Typography>} />

                        <Typography variant='body2' sx={{ color: "#3E8FB2" }}>忘記密碼?</Typography>
                    </Stack>
                </Stack>

                <Stack spacing={1} sx={{ pt: 1 }}>
                    <Button variant='contained' size='large' onClick={login} fullWidth>登入</Button>
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
    placeholder?: string;
    disabled?: boolean;
    name?: string;
    value?: string;
    errorMsg?: string;
    func: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const InputSet = ({ label, placeholder, disabled, errorMsg, name, value, func }: InputSetProps) => {


    return (
        <Stack spacing={1} sx={{ pt: 1 }}>
            <Typography variant='body1' >{label}</Typography>
            <TextField value={value} placeholder={placeholder} disabled={disabled} name={name} onChange={func} autoComplete='off' fullWidth />
            <Typography variant='caption' sx={{ color: "red" }}>{errorMsg}</Typography>
        </Stack>
    )

}


interface Login {
    username: string;
    password: string;
}

// 後端
const userLogin = async (data: Login) => {


    const apiUrl= process.env.NEXT_PUBLIC_BACKEND_URL

    const response = await fetch(`${apiUrl}/User/UserLogin`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)

    })

    return response.json();
}