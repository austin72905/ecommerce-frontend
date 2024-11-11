import Layout from "@/components/layout/layout";
import { useCartStore, userUserInfoStore } from "@/store/store";

import type { AppProps } from "next/app";
import { parseCookies } from "nookies";
import { useEffect } from "react";
import { PersonalInfomation } from "./user/account";
import { ApiResponse } from "@/interfaces/api/response";
import { RespCode } from "@/enums/resp-code";


export default function App({ Component, pageProps }: AppProps) {


  const userInfo = userUserInfoStore((state) => state.userInfo)
  const setUserInfo = userUserInfoStore((state) => state.setUserInfo)

  const initializeCart=useCartStore((state)=>state.initializeCart)
  const cartContent=useCartStore((state)=>state.cartContent)


  //檢查購物車內容
  useEffect(()=>{
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      initializeCart(JSON.parse(savedCart));
    }
  },[])


  useEffect(() => {
    // 定義清理函數
    const handleBeforeUnload = () => {
      localStorage.setItem('cart', JSON.stringify(cartContent));
    };

    // 監聽 "beforeunload" 事件
    // 當用戶即將離開頁面時，可以將購物車數據或表單數據保存到 localStorage
    window.addEventListener('beforeunload', handleBeforeUnload);

    // 在卸載或頁面變更時清除事件監聽器
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [cartContent]);

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
          const result = await getUserInfo() as ApiResponse;

          console.log("result=", result)

          if(result.code!==RespCode.SUCCESS){
            return;
          }

          const userData = result.data as UserInfo

          
          const user: PersonalInfomation = {
            //userId: userData.userId,
            email: userData.email,
            name: userData.username?userData.username:userData.nickName,
            birthday: userData.birthday ? userData.birthday : "",
            type: userData.type,
            picture: userData.picture,
            phoneNumber:userData.phoneNumber,
            sex:userData.gender
          }
          setUserInfo(user)
          

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