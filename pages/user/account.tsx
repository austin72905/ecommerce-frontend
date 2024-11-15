import React, { useEffect, useRef, useState } from 'react';
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
import { validateEmail, validateNickName, validatePhoneNumber, ValidationErrors } from '@/utils/validation';
import { INPUT_FIELD } from '@/constant-value/constant';
import { ApiResponse } from '@/interfaces/api/response';
import { RespCode } from '@/enums/resp-code';
import { UserInfo } from '@/interfaces/user';
import { useCsrfTokenStore, userUserInfoStore } from '@/store/store';
import { parseCookies } from 'nookies';




const MyAccountPage = () => {

  // personalInfo 的某些值從 undefined 變成了具體的值，導致非受控組件變成了受控組件
  const userInfo = userUserInfoStore((state) => state.userInfo)

  const setUserInfo = userUserInfoStore((state) => state.setUserInfo)

  const csrfToken = useCsrfTokenStore((state) => state.csrfToken)

  const setCsrfToken = useCsrfTokenStore((state) => state.setCsrfToken)

  const initPersonInfo: PersonalInfomation = { name: "", email: "", phoneNumber: "", birthday: `${thisYear - 10}/1/1`, sex: "男", type: "web", picture: "" }

  const [personalInfo, setPersonalInfo] = useState<PersonalInfomation>(initPersonInfo);

  // 紀錄 輸入是否合法
  const [errors, setErrors] = useState<ValidationErrors>({});

  const handlePersonalInfo = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {

    let error: string | null

    switch (e.target.name as string) {
      case INPUT_FIELD.NAME:
        error = validateNickName(e.target.value)
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
      const birthdatArr = o.birthday?.split("/")

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
  const saveChange = async () => {


    // 判斷是否都有輸入
    if (!Object.values(errors).every(value => value === undefined)) {
      console.log("errors:", errors)
      return
    }

    //console.log("personalInfo:", personalInfo)

    const data: UserInfo = {
      userId: 0,
      nickName: personalInfo.name,
      phoneNumber: personalInfo.phoneNumber,
      type: personalInfo.type,
      birthday: personalInfo.birthday,
      gender: personalInfo.sex,
      email: personalInfo.email,
      username: "",
      picture: personalInfo.picture
    }

    await modifyUserInfo(data, csrfToken as string)

    setisRenew(u => !u)

  }

  // 用 useRef 追蹤是否為初次渲染
  const isFirstRender = useRef(true);

  const [isRenew, setisRenew] = useState<boolean>(false)

  // 從後端獲取資料
  useEffect(() => {

    console.log("userInfo:", userInfo)
    if (userInfo !== null) {
      //console.log("userInfo", userInfo)
      setPersonalInfo(userInfo)
    }

    // 如果是第一次渲染，跳過 fetchData 的執行
    if (isFirstRender.current && userInfo !== null) {
      isFirstRender.current = false;
      return;
    }

    const fetchData = async () => {
      try {
        const result = await getUserInfo() as ApiResponse;
        console.log("result=", result)


        if (result.code != RespCode.SUCCESS) {

          console.log("獲取數據失敗")
          return;
        }


        if (result.data == null) {
          console.log("獲取數據失敗")
          return;
        }


        const data = result.data as UserInfo

        const personInfo: PersonalInfomation = {
          name: data.nickName === null ? "" : data.nickName,
          email: data.email,
          phoneNumber: data.phoneNumber === null ? "" : data.phoneNumber,
          birthday: data.birthday === null || data.birthday === undefined ? "2013/1/1" : data.birthday,
          sex: data.gender === null ? "" : data.gender,
          type: data.type ? data.type : "",
          picture: data.picture
        }

        const cookies = parseCookies();
        const sessionCsrfToken = cookies["X-CSRF-Token"] || null;
        setCsrfToken(sessionCsrfToken)

        //setPersonalInfo(personInfo)

        setUserInfo(personInfo)


      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    
    const fetchData = async () => {
      try {
        const result = await getUserInfo() as ApiResponse;
        console.log("result=", result)


        if (result.code != RespCode.SUCCESS) {

          console.log("獲取數據失敗")
          return;
        }


        if (result.data == null) {
          console.log("獲取數據失敗")
          return;
        }


        const data = result.data as UserInfo

        const personInfo: PersonalInfomation = {
          name: data.nickName === null ? "" : data.nickName,
          email: data.email,
          phoneNumber: data.phoneNumber === null ? "" : data.phoneNumber,
          birthday: data.birthday === null || data.birthday === undefined ? "2013/1/1" : data.birthday,
          sex: data.gender === null ? "" : data.gender,
          type: data.type ? data.type : "",
          picture: data.picture
        }

        const cookies = parseCookies();
        const sessionCsrfToken = cookies["X-CSRF-Token"] || null;
        setCsrfToken(sessionCsrfToken)

        //setPersonalInfo(personInfo)

        setUserInfo(personInfo)


      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchData()
  }, [isRenew])

  return (
    <Container sx={{ border: "0px solid" }} maxWidth='xl'>
      <Stack spacing={1} sx={{ minHeight: "700px", mx: 1, mt: 2.5, border: "1px solid #D9D9D9", borderRadius: "4px", backgroundColor: "white" }}>

        <ItemWrapper sx={{ mt: 4 }}>
          <Typography variant='h6' sx={{ fontWeight: "bold" }}>我的帳戶</Typography>
        </ItemWrapper>

        <InputSet label='姓名' placeholder='不得包含特殊符號 / $ . @ & # @...' name={INPUT_FIELD.NAME} value={personalInfo.name} errorMsg={errors.nickname} func={handlePersonalInfo} />
        <InputSet label='電話' placeholder='ex: 09xxxxxxxx' name={INPUT_FIELD.PHONE_NUMBER} value={personalInfo.phoneNumber} errorMsg={errors.phoneNumber} func={handlePersonalInfo} />
        <InputSet label='信箱' name={INPUT_FIELD.EMAIL} value={personalInfo.email} errorMsg={errors.email} func={handlePersonalInfo} disabled />


        <ItemWrapper>
          <Typography variant='caption' >生日</Typography>
          <Stack direction={"row"} spacing={3} sx={{ mt: 2 }}>
            <FormControl sx={{ width: "33%" }}>
              <InputLabel id="select-day" >日</InputLabel>
              <Select labelId="select-day" defaultValue={1} onChange={handleBirthday} name="day" value={Number(personalInfo.birthday?.split("/")[2])} label="日" inputProps={{ sx: { height: "15px" } }} MenuProps={{ PaperProps: { sx: { maxHeight: 300 } } }} size='small'>
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

  name?: string;
  phoneNumber?: string;
  email: string;
  birthday: string;
  sex?: string;
  picture?: string;
  type: string;
}

interface InputSetProps {
  label: string;
  disabled?: boolean;
  placeholder?: string;
  name?: string;
  value?: string;
  errorMsg?: string;
  func: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;

}

const InputSet = ({ label, placeholder, name, disabled, value, errorMsg, func }: InputSetProps) => {


  return (
    <Stack spacing={1} sx={{ pt: 1, px: 4 }}>
      <Typography variant='caption' >{label}</Typography>
      <TextField value={value} placeholder={placeholder} disabled={disabled} inputProps={{ sx: { height: "15px" } }} name={name} onChange={func} size='small' />
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

//後端方法
const getUserInfo = async () => {
  const response = await fetch("http://localhost:5025/User/GetUserInfo", {
    method: 'GET',
    credentials: 'include',

  })

  return response.json();
}

const modifyUserInfo = async (data: UserInfo, token: string) => {

  console.log("data:", data, "token:", token)

  const response = await fetch("http://localhost:5025/User/ModifyUserInfo", {
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