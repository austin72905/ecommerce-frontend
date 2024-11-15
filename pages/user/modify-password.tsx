import React, { useState } from 'react'
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import styled from '@mui/system/styled';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { validatePassword, validatePasswordConfirm, ValidationErrors } from '@/utils/validation';
import { INPUT_FIELD } from '@/constant-value/constant';
import { ApiResponse } from '@/interfaces/api/response';
import { RespCode } from '@/enums/resp-code';
import { useAlertMsgStore, useCsrfTokenStore } from '@/store/store';

const ModifyPasswordPage = () => {

    const initInputData: ModifyPassword = { oldPassword: "", password: "", passwordConfirm: "" }
    const [inputData, setInputData] = useState<ModifyPassword>(initInputData);

    const csrfToken=useCsrfTokenStore((state)=>state.csrfToken)


    const setAlertMsg = useAlertMsgStore((state) => state.setAlertMsg)


    // 紀錄 輸入是否合法
    const [errors, setErrors] = useState<ValidationErrors>({});

    const handleInputData = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {



        let error: string | null

        switch (e.target.name as string) {


            case INPUT_FIELD.PASSWORD:
                error = validatePassword(e.target.value)

                if (error) {
                    setErrors(oldError => ({ ...oldError, password: error as string }))
                } else {

                    setErrors(oldError => ({ ...oldError, password: undefined }))
                }
                break;

            case INPUT_FIELD.PASSWORD_CONFIRM:
                error = validatePasswordConfirm(e.target.value, inputData.password)
                if (error) {
                    setErrors(oldError => ({ ...oldError, passowrdConfirm: error as string }))
                } else {
                    setErrors(oldError => ({ ...oldError, passowrdConfirm: undefined }))
                }
                break;
        }

        setInputData(o => {

            let newO: ModifyPassword = { ...o }

            Object.getOwnPropertyNames(o).forEach(ele => {
                if (ele === e.target.name) {
                    newO[e.target.name as keyof ModifyPassword] = e.target.value
                }
            })
            //console.log("newO ", newO)
            return newO
        })
    }



    const modifyPassword = async () => {
        console.log("inputData:", inputData)
        const result = await modifyPasswordToBackend(inputData,csrfToken as string) as ApiResponse;



        if (result == null || result.code != RespCode.SUCCESS) {
            setAlertMsg(result.message)
            console.log(result.message)
            return;
        }
        setAlertMsg("修改密碼成功")

        // 重製 輸入的密碼
        setInputData(initInputData)

    }




    return (
        <Container sx={{ border: "0px solid" }} maxWidth='xl'>
            <Stack spacing={1} sx={{ minHeight: "500px", mx: 1, mt: 2.5, border: "1px solid #D9D9D9", borderRadius: "4px", backgroundColor: "white" }}>
                <ItemWrapper sx={{ mt: 4 }}>
                    <Typography variant='h6' sx={{ fontWeight: "bold" }}>更改密碼</Typography>
                </ItemWrapper>

                <InputSet func={handleInputData} name="oldPassword" value={inputData.oldPassword} label='舊密碼' placeholder='請輸入舊密碼' />
                <InputSet func={handleInputData} label='新密碼' placeholder='請輸入新密碼' name={INPUT_FIELD.PASSWORD} value={inputData.password} errorMsg={errors.password} helperText="請輸入8個字元以上的英文字母及數字，不可使用特殊符號。" />
                <InputSet func={handleInputData} label='新密碼確認' name={INPUT_FIELD.PASSWORD_CONFIRM} value={inputData.passwordConfirm} errorMsg={errors.passowrdConfirm} placeholder='請再次確認輸入新密碼' />

                <ItemWrapper sx={{ pt: 5 }}>
                    <Button onClick={modifyPassword} variant="contained" sx={{ color: "white" }}>確認修改</Button>
                </ItemWrapper>
            </Stack>
        </Container>
    )
}


export default ModifyPasswordPage;

const ItemWrapper = styled(Box)({
    paddingTop: "8px",
    paddingLeft: "32px",
    paddingRight: "32px"
})

interface ModifyPassword {
    oldPassword: string;
    password: string;
    passwordConfirm: string;
}

interface InputSetProps {
    label: string;
    placeholder: string;
    helperText?: string;
    errorMsg?: string;
    value?: string;
    name?: string;
    func?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
}

const InputSet = ({ label, placeholder, helperText, name, errorMsg, value, func }: InputSetProps) => {


    return (
        <Stack spacing={1} sx={{ pt: 1, px: 4 }}>
            <Typography variant='caption' >{label}</Typography>
            <TextField name={name} onChange={func} value={value} helperText={helperText} placeholder={placeholder} inputProps={{ sx: { height: "15px" } }} size='small' autoComplete='off' />
            <Typography variant='caption' sx={{ color: "red" }}>{errorMsg}</Typography>
        </Stack>
    )

}


// 後端請求
const modifyPasswordToBackend = async (data: ModifyPassword,token:string) => {

    const response = await fetch("http://localhost:5025/User/ModifyPassword", {
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