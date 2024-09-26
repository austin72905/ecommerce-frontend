import React, { useEffect, useState } from 'react';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import styled from '@mui/system/styled';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';

import WithAuth from '@/components/auth/with-auth';
import { validateEmail, validateName, validatePhoneNumber, ValidationErrors } from '@/utils/validation';
import { INPUT_FIELD } from '@/constant-value/constant';




const MyAccountPage = () => {

  const initPersonInfo: PersonalInfomation = { userId: "", name: "", email: "", phoneNumber: "", birthday: `${thisYear - 10}/1/1`, sex: "男", type: "web" }

  const [personalInfo, setPersonalInfo] = useState<PersonalInfomation>(initPersonInfo);

  // 紀錄 輸入是否合法
  const [errors, setErrors] = useState<ValidationErrors>({});

  const handlePersonalInfo = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    
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
          setErrors(oldError => ({ ...oldError, phoneNumber: error as string  }))
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
    }

   

    setPersonalInfo(o => {

      let newO: PersonalInfomation = { ...o }

      Object.getOwnPropertyNames(o).forEach(ele => {
        if (ele === e.target.name) {
          newO[e.target.name as keyof PersonalInfomation] = e.target.value
        }
      })
      //console.log("now personalInfo ", newO)
      return newO
    })
  }

  const handleBirthday = (e: SelectChangeEvent<number>) => {

    setPersonalInfo(o => {
      const birthdatArr = o.birthday.split("/")
      let newBirthday = ""
      switch (e.target.name) {
        case "day":
          newBirthday = `${birthdatArr[0]}/${birthdatArr[1]}/${e.target.value}`
          break;
        case "month":
          newBirthday = `${birthdatArr[0]}/${e.target.value}/${birthdatArr[2]}`
          break;
        case "year":
          newBirthday = `${e.target.value}/${birthdatArr[1]}/${birthdatArr[2]}`
          break;
        default:
          return o;

      }
      //console.log("newBirthday ", newBirthday)
      return { ...o, birthday: newBirthday }

    })

  }

  //儲存變更
  const saveChange=()=>{
    if(Object.entries(errors).length!==0){
      console.log("data not complete")
      return
    }
  }


  return (
    <Container sx={{ border: "0px solid" }} maxWidth='xl'>
      <Stack spacing={1} sx={{ minHeight: "700px", mx: 1, mt: 2.5, border: "1px solid #D9D9D9", borderRadius: "4px", backgroundColor: "white" }}>

        <ItemWrapper sx={{ mt: 4 }}>
          <Typography variant='h6' sx={{ fontWeight: "bold" }}>我的帳戶</Typography>
        </ItemWrapper>

        <InputSet label='姓名' placeholder='不得包含特殊符號 / $ . @ & # @...' name={INPUT_FIELD.NAME} value={personalInfo.name} errorMsg={errors.username} func={handlePersonalInfo} />
        <InputSet label='電話' placeholder='ex: 09xxxxxxxx' name={INPUT_FIELD.PHONE_NUMBER} value={personalInfo.phoneNumber} errorMsg={errors.phoneNumber} func={handlePersonalInfo} />
        <InputSet label='信箱' placeholder='ex: asbc@gmail.com' name={INPUT_FIELD.EMAIL} value={personalInfo.email} errorMsg={errors.email} func={handlePersonalInfo} />


        <ItemWrapper>
          <Typography variant='caption' >生日</Typography>
          <Stack direction={"row"} spacing={3} sx={{ mt: 2 }}>
            <FormControl sx={{ width: "33%" }}>
              <InputLabel id="select-day" >日</InputLabel>
              <Select labelId="select-day" defaultValue={1} onChange={handleBirthday} name="day" value={Number(personalInfo.birthday.split("/")[2])} label="日" inputProps={{ sx: { height: "15px" } }} MenuProps={{ PaperProps: { sx: { maxHeight: 300 } } }} size='small'>
                {
                  dateList(31).map(item => (
                    <MenuItem key={item} value={item}>
                      {item}
                    </MenuItem>
                  ))
                }
              </Select>
            </FormControl>
            <FormControl sx={{ width: "33%" }}>
              <InputLabel id="select-month" >月</InputLabel>
              <Select labelId="select-month" defaultValue={1} onChange={handleBirthday} name="month" value={Number(personalInfo.birthday.split("/")[1])} label="月" inputProps={{ sx: { height: "15px" } }} MenuProps={{ PaperProps: { sx: { maxHeight: 300 } } }} size='small'>
                {
                  dateList(12).map(item => (
                    <MenuItem key={item} value={item}>
                      {item}
                    </MenuItem>
                  ))
                }
              </Select>
            </FormControl>

            <FormControl sx={{ width: "33%" }}>
              <InputLabel id="select-year" >年</InputLabel>
              <Select labelId="select-year" defaultValue={thisYear - 10} onChange={handleBirthday} name="year" value={Number(personalInfo.birthday.split("/")[0])} label="年" inputProps={{ sx: { height: "15px" } }} MenuProps={{ PaperProps: { sx: { maxHeight: 300 } } }} size='small'>
                {
                  yearList(2023).map(item => (
                    <MenuItem key={item} value={item}>
                      {item}
                    </MenuItem>
                  ))
                }
              </Select>
            </FormControl>


          </Stack>

        </ItemWrapper>

        <ItemWrapper>
          <FormControl>
            <Typography variant='caption' >性別</Typography>
            <RadioGroup row defaultValue={"男"} name="sex" value={personalInfo.sex} onChange={handlePersonalInfo}>
              <FormControlLabel value={"男"} control={<Radio sx={{ color: "#D9D9D9" }} />} label="男" />
              <FormControlLabel value={"女"} control={<Radio sx={{ color: "#D9D9D9" }} />} label="女" />
              <FormControlLabel value={"其他"} control={<Radio sx={{ color: "#D9D9D9" }} />} label="其他" />
            </RadioGroup>
          </FormControl>
        </ItemWrapper>

        <ItemWrapper sx={{ pt: 3 }}>
          <Button variant="contained" sx={{ "& .MuiButton-text": { color: "white" } }} onClick={saveChange}>儲存變更</Button>
        </ItemWrapper>
      </Stack>
    </Container>
  )
}

export default WithAuth(MyAccountPage);

export interface PersonalInfomation {
  userId: string;
  name: string;
  phoneNumber?: string;
  email: string;
  birthday: string;
  sex?: string;
  picture?: string;
  type: string;
}

interface InputSetProps {
  label: string;
  placeholder: string;
  name?: string;
  value?: string;
  errorMsg?: string;
  func: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;

}

const InputSet = ({ label, placeholder, name, value, errorMsg, func }: InputSetProps) => {


  return (
    <Stack spacing={1} sx={{ pt: 1, px: 4 }}>
      <Typography variant='caption' >{label}</Typography>
      <TextField value={value} placeholder={placeholder} inputProps={{ sx: { height: "15px" } }} name={name} onChange={func} size='small' />
      <Typography variant='caption' sx={{ color: "red" }}>{errorMsg}</Typography>
    </Stack>
  )

}

const ItemWrapper = styled(Box)({
  paddingTop: "8px",
  paddingLeft: "32px",
  paddingRight: "32px"
})

const dateList = (n: number) => {
  let daysList: number[] = []
  for (let index = 1; index < n + 1; index++) {

    daysList.push(index);
  }

  return daysList;
}

const thisYear = 2023

const yearList = (thisYear: number) => {
  let daysList: number[] = []
  for (let index = thisYear - 10; index > thisYear - 30; index--) {

    daysList.push(index);
  }

  return daysList;
}