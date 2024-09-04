import Layout from "@/components/layout/layout";
import { userUserInfoStore } from "@/store/store";

import type { AppProps } from "next/app";
import { parseCookies } from "nookies";
import { useEffect } from "react";
import { PersonalInfomation } from "./user/account";

import Cookies from 'js-cookie';

export default function App({ Component, pageProps }: AppProps) {


  const userInfo = userUserInfoStore((state) => state.userInfo)
  const setUserInfo = userUserInfoStore((state) => state.setUserInfo)
  //檢查是否登陸
  useEffect(() => {

    const cookies = parseCookies();
    //const hasSessionId =Cookies.get("has-session-id")

    const hasSessionId = cookies["has-session-id"] || null;
    console.log('hasSessionId:',hasSessionId);
    if (hasSessionId) {
      console.log('hasSessionId:',hasSessionId);
      //請求後端

      const fetchData = async () => {
        try {
          const result = await getUserInfo() as UserInfo;

          console.log("result=", result)

          if (result) {
            const user: PersonalInfomation = {
              userId: result.userId,
              email: result.email,
              name: result.username,
              birthday: result.birthday ? result.birthday : "",
              type: result.type,
              picture: result.picture
            }
            setUserInfo(user)
          }

        } catch (error) {
          console.error('Error fetching data:', error)
        }
      }


      fetchData()


    } else {
      console.log('Session ID not found');
    }

  }, [])



  const getUserInfo = async () => {


   
    const url = `http://localhost:5025/User/GetUserInfo`

    const response = await fetch(url, {
      method: 'GET',
      credentials:'include'
    })


    return response.json();
  }

  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>

  )
}


interface UserInfo {
  birthday?: string;
  email: string;
  gender?: string;
  nickName?: string;
  phoneNumber?: string;
  picture?: string;
  type: string;
  userId: string;
  username: string;
}