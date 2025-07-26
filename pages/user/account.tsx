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
import { Card, Grid, alpha, Avatar } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import CakeIcon from '@mui/icons-material/Cake';
import WcIcon from '@mui/icons-material/Wc';

import WithAuth from '@/components/auth/with-auth';
import { validateEmail, validateNickName, validatePhoneNumber, ValidationErrors } from '@/utils/validation';
import { INPUT_FIELD } from '@/constant-value/constant';
import { ApiResponse } from '@/interfaces/api/response';
import { RespCode } from '@/enums/resp-code';
import { UserInfo } from '@/interfaces/user';
import { useAlertMsgStore, useCsrfTokenStore, userUserInfoStore } from '@/store/store';
import { parseCookies } from 'nookies';

const MyAccountPage = () => {

  // personalInfo 的某些值從 undefined 變成了具體的值，導致非受控組件變成了受控組件
  const userInfo = userUserInfoStore((state) => state.userInfo)

  const setUserInfo = userUserInfoStore((state) => state.setUserInfo)

  const csrfToken = useCsrfTokenStore((state) => state.csrfToken)

  const setCsrfToken = useCsrfTokenStore((state) => state.setCsrfToken)

  const setAlertMsg = useAlertMsgStore(state => state.setAlertMsg)

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
          setErrors(oldError => ({ ...oldError, nickname: error as string }))
        } else {
          setErrors(oldError => ({ ...oldError, nickname: undefined }))
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

    const result = await modifyUserInfo(data, csrfToken as string) as ApiResponse

    if (result.code != RespCode.SUCCESS) {
      setAlertMsg(result.message)
      return
    }

    if (result.data == null) {
      setAlertMsg(result.message)
      return
    }

    setAlertMsg("修改成功")

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
    <Box sx={{ 
      backgroundColor: 'background.default',
      minHeight: '100vh',
      py: 4
    }}>
      <Container maxWidth='xl'>
        {/* 現代化標題區域 */}
        <Box sx={{ mb: 4 }}>
          <Typography 
            variant="h4" 
            sx={{ 
              fontWeight: 700,
              mb: 1,
              background: 'linear-gradient(45deg, #2C3E50, #34495E)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent'
            }}
          >
            我的帳戶
          </Typography>
          <Box sx={{
            height: '3px',
            width: '60px',
            background: 'linear-gradient(90deg, #E67E22, #F39C12)',
            borderRadius: 2,
            mb: 2
          }} />
          <Typography variant="subtitle1" sx={{ color: 'text.secondary' }}>
            管理您的個人資料與帳戶設定
          </Typography>
        </Box>

        {/* 現代化主要內容卡片 */}
        <Grid container spacing={4}>
          {/* 個人頭像卡片 */}
          <Grid item xs={12} md={4}>
            <Card sx={{ 
              borderRadius: 3,
              boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
              p: 4,
              textAlign: 'center',
              background: 'linear-gradient(135deg, #2C3E50 0%, #34495E 100%)',
              color: 'white'
            }}>
              <Avatar
                src={personalInfo.picture}
                sx={{ 
                  width: 120, 
                  height: 120, 
                  mx: 'auto', 
                  mb: 2,
                  border: '4px solid rgba(230, 126, 34, 0.3)'
                }}
              >
                <PersonIcon sx={{ fontSize: 60 }} />
              </Avatar>
              <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
                {personalInfo.name || '未設定姓名'}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                {personalInfo.email}
              </Typography>
            </Card>
          </Grid>

          {/* 個人資料表單卡片 */}
          <Grid item xs={12} md={8}>
            <Card sx={{ 
              borderRadius: 3,
              boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
              overflow: 'hidden'
            }}>
              <Box sx={{ 
                background: 'linear-gradient(135deg, #2C3E50 0%, #34495E 100%)',
                p: 3
              }}>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    color: 'white',
                    fontWeight: 600
                  }}
                >
                  個人資料
                </Typography>
              </Box>

              <Box sx={{ p: 4 }}>
                <Grid container spacing={3}>
                  {/* 姓名 */}
                  <Grid item xs={12} sm={6}>
                    <ModernInputField
                      label="姓名"
                      icon={<PersonIcon />}
                      placeholder="請輸入您的姓名"
                      name={INPUT_FIELD.NAME}
                      value={personalInfo.name}
                      error={errors.nickname}
                      onChange={handlePersonalInfo}
                    />
                  </Grid>

                  {/* 電話 */}
                  <Grid item xs={12} sm={6}>
                    <ModernInputField
                      label="電話"
                      icon={<PhoneIcon />}
                      placeholder="ex: 09xxxxxxxx"
                      name={INPUT_FIELD.PHONE_NUMBER}
                      value={personalInfo.phoneNumber}
                      error={errors.phoneNumber}
                      onChange={handlePersonalInfo}
                    />
                  </Grid>

                  {/* 信箱 */}
                  <Grid item xs={12}>
                    <ModernInputField
                      label="信箱"
                      icon={<EmailIcon />}
                      placeholder="您的電子郵件地址"
                      name={INPUT_FIELD.EMAIL}
                      value={personalInfo.email}
                      error={errors.email}
                      onChange={handlePersonalInfo}
                      disabled
                    />
                  </Grid>

                  {/* 生日 */}
                  <Grid item xs={12}>
                    <Box sx={{ mb: 2 }}>
                      <Stack direction="row" alignItems="center" sx={{ mb: 2 }}>
                        <CakeIcon sx={{ color: '#2C3E50', mr: 1 }} />
                        <Typography variant="body2" sx={{ fontWeight: 600, color: '#2C3E50' }}>
                          生日
                        </Typography>
                      </Stack>
                      <Grid container spacing={2}>
                        <Grid item xs={4}>
                          <FormControl fullWidth>
                            <InputLabel>年</InputLabel>
                            <Select
                              value={Number(personalInfo.birthday?.split("/")[0])}
                              onChange={handleBirthday}
                              name="year"
                              label="年"
                              sx={{
                                borderRadius: 2,
                                '& .MuiOutlinedInput-root': {
                                  '& fieldset': {
                                    borderColor: 'rgba(0,0,0,0.1)'
                                  },
                                  '&:hover fieldset': {
                                    borderColor: '#E67E22'
                                  },
                                  '&.Mui-focused fieldset': {
                                    borderColor: '#E67E22'
                                  }
                                }
                              }}
                            >
                              {yearList(2023).map(item => (
                                <MenuItem key={item} value={item}>
                                  {item}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </Grid>
                        <Grid item xs={4}>
                          <FormControl fullWidth>
                            <InputLabel>月</InputLabel>
                            <Select
                              value={Number(personalInfo.birthday.split("/")[1])}
                              onChange={handleBirthday}
                              name="month"
                              label="月"
                              sx={{
                                borderRadius: 2,
                                '& .MuiOutlinedInput-root': {
                                  '& fieldset': {
                                    borderColor: 'rgba(0,0,0,0.1)'
                                  },
                                  '&:hover fieldset': {
                                    borderColor: '#E67E22'
                                  },
                                  '&.Mui-focused fieldset': {
                                    borderColor: '#E67E22'
                                  }
                                }
                              }}
                            >
                              {dateList(12).map(item => (
                                <MenuItem key={item} value={item}>
                                  {item}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </Grid>
                        <Grid item xs={4}>
                          <FormControl fullWidth>
                            <InputLabel>日</InputLabel>
                            <Select
                              value={Number(personalInfo.birthday?.split("/")[2])}
                              onChange={handleBirthday}
                              name="day"
                              label="日"
                              sx={{
                                borderRadius: 2,
                                '& .MuiOutlinedInput-root': {
                                  '& fieldset': {
                                    borderColor: 'rgba(0,0,0,0.1)'
                                  },
                                  '&:hover fieldset': {
                                    borderColor: '#E67E22'
                                  },
                                  '&.Mui-focused fieldset': {
                                    borderColor: '#E67E22'
                                  }
                                }
                              }}
                            >
                              {dateList(31).map(item => (
                                <MenuItem key={item} value={item}>
                                  {item}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </Grid>
                      </Grid>
                    </Box>
                  </Grid>

                  {/* 性別 */}
                  <Grid item xs={12}>
                    <Box sx={{ mb: 2 }}>
                      <Stack direction="row" alignItems="center" sx={{ mb: 2 }}>
                        <WcIcon sx={{ color: '#2C3E50', mr: 1 }} />
                        <Typography variant="body2" sx={{ fontWeight: 600, color: '#2C3E50' }}>
                          性別
                        </Typography>
                      </Stack>
                      <FormControl>
                        <RadioGroup 
                          row 
                          value={personalInfo.sex} 
                          name="sex" 
                          onChange={handlePersonalInfo}
                        >
                          {[
                            { value: '男', label: '男性' },
                            { value: '女', label: '女性' },
                            { value: '其他', label: '其他' }
                          ].map((option) => (
                            <FormControlLabel 
                              key={option.value}
                              value={option.value} 
                              control={
                                <Radio 
                                  sx={{ 
                                    color: '#E67E22',
                                    '&.Mui-checked': {
                                      color: '#E67E22'
                                    }
                                  }} 
                                />
                              } 
                              label={option.label}
                              sx={{
                                mr: 4,
                                '& .MuiFormControlLabel-label': {
                                  fontWeight: 500
                                }
                              }}
                            />
                          ))}
                        </RadioGroup>
                      </FormControl>
                    </Box>
                  </Grid>

                  {/* 儲存按鈕 */}
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                      <Button 
                        variant="contained" 
                        size="large"
                        onClick={saveChange}
                        sx={{
                          backgroundColor: '#E67E22',
                          px: 4,
                          py: 1.5,
                          borderRadius: 2,
                          fontWeight: 600,
                          '&:hover': {
                            backgroundColor: '#D35400'
                          }
                        }}
                      >
                        儲存變更
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
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

// 現代化輸入欄位組件
const ModernInputField = ({ 
  label, 
  icon, 
  placeholder, 
  name, 
  disabled = false, 
  value, 
  error, 
  onChange 
}: {
  label: string;
  icon: React.ReactNode;
  placeholder?: string;
  name?: string;
  disabled?: boolean;
  value?: string;
  error?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}) => {

  return (
    <Box sx={{ mb: 2 }}>
      <Stack direction="row" alignItems="center" sx={{ mb: 1 }}>
        <Box component="span" sx={{ color: '#2C3E50', mr: 1, display: 'flex', alignItems: 'center' }}>
          {icon}
        </Box>
        <Typography variant="body2" sx={{ fontWeight: 600, color: '#2C3E50' }}>
          {label}
        </Typography>
      </Stack>
      <TextField
        fullWidth
        placeholder={placeholder}
        disabled={disabled}
        name={name}
        value={value}
        onChange={onChange}
        error={!!error}
        helperText={error}
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: 2,
            '& fieldset': {
              borderColor: 'rgba(0,0,0,0.1)'
            },
            '&:hover fieldset': {
              borderColor: disabled ? 'rgba(0,0,0,0.1)' : '#E67E22'
            },
            '&.Mui-focused fieldset': {
              borderColor: '#E67E22'
            },
            '&.Mui-disabled': {
              backgroundColor: '#F5F5F5'
            }
          }
        }}
      />
    </Box>
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
  const apiUrl= process.env.NEXT_PUBLIC_BACKEND_URL
  const response = await fetch(`${apiUrl}/User/GetUserInfo`, {
    method: 'GET',
    credentials: 'include',

  })

  return response.json();
}

const modifyUserInfo = async (data: UserInfo, token: string) => {

  console.log("data:", data, "token:", token)

  const apiUrl= process.env.NEXT_PUBLIC_BACKEND_URL
  const response = await fetch(`${apiUrl}/User/ModifyUserInfo`, {
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