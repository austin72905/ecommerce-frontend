import React, { useState } from 'react'


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
import { INPUT_FIELD } from '@/constant-value/constant';
import { validateEmail, validateNickName, validatePassword, validatePasswordConfirm, validateUserName, ValidationErrors } from '@/utils/validation';
import { ApiResponse } from '@/interfaces/api/response';
import { RespCode } from '@/enums/resp-code';

export default function SignUp() {
    const router = useRouter()

    const toLogin = () => {
        router.push("/login")
    }

    const toUserAccount = ()=>{
        const apiUrl =process.env.NEXT_PUBLIC_FRONTEND_URL
        window.location.href=`${apiUrl}/user/account`
    }

    // 紀錄 輸入是否合法
    const [errors, setErrors] = useState<ValidationErrors>({});
    const initSignUp: SignUp = { nickname: "", email: "", username: "", password: "", passwordConfirm: "" }
    const [signUp, setsignUp] = useState<SignUp>(initSignUp);

    const handleSignUpInput = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {

        let error: string | null

        //console.log("name:", e.target.name)

        switch (e.target.name as string) {
            case INPUT_FIELD.NICKNAME:
                error = validateNickName(e.target.value)
                if (error) {
                    setErrors(oldError => ({ ...oldError, nickname: error as string }))
                } else {
                    setErrors(oldError => ({ ...oldError, nickname: undefined }))
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

            case INPUT_FIELD.PASSWORD_CONFIRM:
                error = validatePasswordConfirm(e.target.value, signUp.password)
                if (error) {
                    setErrors(oldError => ({ ...oldError, passowrdConfirm: error as string }))
                } else {
                    setErrors(oldError => ({ ...oldError, passowrdConfirm: undefined }))
                }
                break;
        }



        setsignUp(info => {

            let newInfo: SignUp = { ...info }

            Object.getOwnPropertyNames(info).forEach(ele => {
                if (ele === e.target.name) {
                    newInfo[e.target.name as keyof SignUp] = e.target.value
                }
            })
            //console.log("now personalInfo ", newO)
            return newInfo
        })
    }

    const register = async () => {

        // 判斷是否都有輸入
        if (!Object.values(errors).every(value => value === undefined)) {
            console.log("errors:", errors)
            return
        }

        const result = await userRegister(signUp) as ApiResponse;


        console.log("result=", result)


        if (result.code != RespCode.SUCCESS) {

            console.log("註冊失敗")
            return;
        }


        toUserAccount()

    }




    return (

        <Stack justifyContent={"center"} direction={"row"} sx={{ width: "100%", border: "0px solid #9f9f9f", mt: { sm: 4, xs: 0 }, px: 2, borderRadius: "4px" }}>

            <Stack
                spacing={2.5}
                sx={{
                    width: "100%",
                    border: "0px solid",
                    minHeight: "800px",
                    maxWidth: "400px",
                    minWidth: {
                        sm: "400px",
                        xs: "300px"
                    },
                    my: 4
                }}
                justifyContent={"center"}>

                <Stack alignItems={"center"}>
                    <Typography variant='h6' sx={{ fontWeight: 'bold' }}>註冊新會員</Typography>
                </Stack>

                <InputSet label='姓名' placeholder='不得包含特殊符號 / $ . @ & #...' name={INPUT_FIELD.NICKNAME} value={signUp.nickname} errorMsg={errors.nickname} func={handleSignUpInput} />

                <InputSet label='信箱' placeholder='ex: asbc@gmail.com' name={INPUT_FIELD.EMAIL} value={signUp.email} errorMsg={errors.email} func={handleSignUpInput} />

                <InputSet label='帳號' placeholder='請輸入帳號,不得包含特殊符號 / $ . @ & #...' name={INPUT_FIELD.USERNAME} value={signUp.username} errorMsg={errors.username} func={handleSignUpInput} />

                <InputSet label='密碼' placeholder='請輸入密碼' name={INPUT_FIELD.PASSWORD} value={signUp.password} errorMsg={errors.password} func={handleSignUpInput} />

                <InputSet label='密碼確認' placeholder='請再次確認輸入密碼' name={INPUT_FIELD.PASSWORD_CONFIRM} value={signUp.passwordConfirm} errorMsg={errors.passowrdConfirm} func={handleSignUpInput} />

                <Stack sx={{ pt: 1 }}>
                    <Button variant='contained' size='large' fullWidth onClick={register}>加入會員</Button>
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
    disabled?: boolean;
    name?: string;
    value?: string;
    errorMsg?: string;
    func: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}


interface SignUp {
    nickname: string;
    email: string;
    username: string;
    password: string;
    passwordConfirm: string;
}

const InputSet = ({ label, placeholder, disabled, name, value, errorMsg, func }: InputSetProps) => {


    return (
        <Stack spacing={1} sx={{ pt: 1 }}>
            <Typography variant='body1' >{label}</Typography>
            <TextField value={value} placeholder={placeholder} disabled={disabled} name={name} onChange={func} autoComplete='off' fullWidth />
            <Typography variant='caption' sx={{ color: "red" }}>{errorMsg}</Typography>
        </Stack>
    )

}


// 後端方法
const userRegister = async (data: SignUp) => {
    const apiUrl= process.env.NEXT_PUBLIC_BACKEND_URL
    const response = await fetch(`${apiUrl}/User/UserRegister`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)

    })

    return response.json();
}