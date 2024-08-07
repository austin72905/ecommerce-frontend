import React, { useState } from 'react'
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import styled from '@mui/system/styled';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

export default function ModifyPasswordPage() {

    const initInputData: VerifyPassword = { oldPassword: "", newPassword: "", confirmNewPassword: "" }
    const [inputData, setInputData] = useState<VerifyPassword>(initInputData);


    const handleInputData = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {


        setInputData(o => {

            let newO: VerifyPassword = { ...o }

            Object.getOwnPropertyNames(o).forEach(ele => {
                if (ele === e.target.name) {
                    newO[e.target.name as keyof VerifyPassword] = e.target.value
                }
            })
            //console.log("newO ", newO)
            return newO
        })
    }

    const verifyInput = () => {
        Object.getOwnPropertyNames(inputData).forEach(ele => {
            if (!inputData[ele as keyof VerifyPassword]) {
                console.log(`${ele} 輸入值不可為空`)
            }
        })
        let regu = "^[ ]+$"
        let re=new RegExp(regu)
        
        if(inputData.oldPassword==="" || re.test(inputData.oldPassword)){
            console.log("舊密碼不得為空")
            return
        }
        if(inputData.newPassword==="" || re.test(inputData.newPassword)){
            console.log("新密碼不得為空")
            return
        }
        if(inputData.confirmNewPassword==="" || re.test(inputData.confirmNewPassword)){
            console.log("確認密碼不得為空")
            return
        }

        if(inputData.oldPassword===inputData.newPassword){
            console.log("新舊密碼不得相同")
            return
        }

        if(inputData.newPassword.length<8){
            console.log("請輸入8個字元以上的英文字母及數字，不可使用特殊符號。")
            return
        }

        if(inputData.newPassword!==inputData.confirmNewPassword){
            console.log("確認密碼輸入錯誤")
            return
        }

        console.log("修改成功")
    }

    const modifyPassword = () => {
        verifyInput()
    }




    return (
        <Container sx={{ border: "0px solid" }} maxWidth='xl'>
            <Stack spacing={1} sx={{ minHeight: "500px", mx: 1, mt: 2.5, border: "1px solid #D9D9D9", borderRadius: "4px", backgroundColor: "white" }}>
                <ItemWrapper sx={{ mt: 4 }}>
                    <Typography variant='h6' sx={{ fontWeight: "bold" }}>更改密碼</Typography>
                </ItemWrapper>

                <InputSet func={handleInputData} name="oldPassword" label='舊密碼' placeholder='請輸入舊密碼' />
                <InputSet func={handleInputData} name="newPassword" label='新密碼' placeholder='請輸入新密碼' helperText="請輸入8個字元以上的英文字母及數字，不可使用特殊符號。" />
                <InputSet func={handleInputData} name="confirmNewPassword" label='新密碼確認' placeholder='請再次確認輸入新密碼' />

                <ItemWrapper sx={{ pt: 5 }}>
                    <Button onClick={modifyPassword} variant="contained" sx={{ color: "white" }}>確認修改</Button>
                </ItemWrapper>
            </Stack>
        </Container>
    )
}

const ItemWrapper = styled(Box)({
    paddingTop: "8px",
    paddingLeft: "32px",
    paddingRight: "32px"
})

interface VerifyPassword {
    oldPassword: string;
    newPassword: string;
    confirmNewPassword: string;
}

interface InputSetProps {
    label: string;
    placeholder: string;
    helperText?: string;
    value?: string;
    name?: string;
    func?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
}

const InputSet = ({ label, placeholder, helperText, name, value, func }: InputSetProps) => {


    return (
        <Stack spacing={1} sx={{ pt: 1, px: 4 }}>
            <Typography variant='caption' >{label}</Typography>
            <TextField name={name} onChange={func} value={value} helperText={helperText} placeholder={placeholder} inputProps={{ sx: { height: "15px" } }} size='small' />
        </Stack>
    )

}