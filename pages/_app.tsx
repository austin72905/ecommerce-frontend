import Layout from "@/components/layout/layout";
import { useCartStore, useCsrfTokenStore, userUserInfoStore } from "@/store/store";

import type { AppProps } from "next/app";
import { parseCookies } from "nookies";
import { useEffect, useRef } from "react";
import { PersonalInfomation } from "./user/account";
import { ApiResponse } from "@/interfaces/api/response";
import { RespCode } from "@/enums/resp-code";
import { Cart, CartItem, mergeCartContent } from "./cart";
import { ProductInfomationCount } from "@/interfaces";


export default function App({ Component, pageProps }: AppProps) {

  // 生產環境不打印 || process.env.NODE_ENV ==="development"
  if(process.env.NODE_ENV ==="production" ){
    console.log = () => {};
    console.warn = () => {};
    console.error = () => {};
  }

  const userInfo = userUserInfoStore((state) => state.userInfo)
  const setUserInfo = userUserInfoStore((state) => state.setUserInfo)

  const csrfToken=useCsrfTokenStore((state)=>state.csrfToken)

  const setCsrfToken=useCsrfTokenStore((state)=>state.setCsrfToken)

  const initializeCart = useCartStore((state) => state.initializeCart)
  const cartContent = useCartStore((state) => state.cartContent)


  //檢查購物車內容
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {

      initializeCart(JSON.parse(savedCart));
    }



  }, [])


  // useEffect(() => {
  //   // 定義清理函數
  //   const handleBeforeUnload = () => {
  //     localStorage.setItem('cart', JSON.stringify(cartContent));
  //   };

  //   // 監聽 "beforeunload" 事件
  //   // 當用戶即將離開頁面時，可以將購物車數據或表單數據保存到 localStorage
  //   window.addEventListener('beforeunload', handleBeforeUnload);

  //   // 在卸載或頁面變更時清除事件監聽器
  //   return () => {
  //     window.removeEventListener('beforeunload', handleBeforeUnload);
  //   };
  // }, [cartContent]);

  //檢查是否登陸
  useEffect(() => {

    const cookies = parseCookies();
    //const hasSessionId =Cookies.get("has-session-id")

    const hasSessionId = cookies["has-session-id"] || null;
    const sessionCsrfToken = cookies["X-CSRF-Token"] || null;
    console.log('hasSessionId:', hasSessionId);
    if (hasSessionId) {
      console.log('hasSessionId:', hasSessionId);
      //請求後端

      const fetchData = async () => {
        try {
          const result = await getUserInfo() as ApiResponse;

          console.log("result=", result)

          if (result.code !== RespCode.SUCCESS) {
            return;
          }

          const userData = result.data as UserInfo


          const user: PersonalInfomation = {
            //userId: userData.userId,
            email: userData.email,
            name: userData.nickName ? userData.nickName : userData.username,
            birthday: userData.birthday ? userData.birthday : "",
            type: userData.type,
            picture: userData.picture,
            phoneNumber: userData.phoneNumber ? userData.phoneNumber : "",
            sex: userData.gender ? userData.gender : ""
          }
          setUserInfo(user)

          setCsrfToken(sessionCsrfToken)


        } catch (error) {
          console.error('Error fetching data:', error)
        }
      }


      fetchData()


    } else {
      console.log('Session ID not found');
    }

  }, [])

  const cartContentRef = useRef(cartContent);

  useEffect(() => {
    console.log("pp cartContent 更新")
    cartContentRef.current = cartContent; // 更新最新的 cartContent
  }, [cartContent]);

  useEffect(() => {
    // 登陸狀態
    if (userInfo) {


      const mergeCartenthData = async (content: ProductInfomationCount[]) => {
        try {
          //console.log("content:", content)

          const cartItems = content.map(item => {
            const cartItem: CartItem = {
              productVariantId: item.selectedVariant?.variantID,
              quantity: item.count
            }

            return cartItem;
          })
          const cart: Cart = {
            items: cartItems
          }
          const result = await mergeCartContent(cart) as ApiResponse;

          //console.log("mergeCartContent _app result=", result)

          if (result.code !== RespCode.SUCCESS) {
            return;
          }

          const data =result.data as ProductInfomationCount[]          

          // 同步到 store
          if(data){
            initializeCart(data)
          }
        

        } catch (error) {
          console.error('Error fetching data:', error)
        }
      }


      //const savedCart = localStorage.getItem('cart');

     
      mergeCartenthData(cartContentRef.current);
      

    }
  }, [userInfo])


  const getUserInfo = async () => {

    const apiUrl= process.env.NEXT_PUBLIC_BACKEND_URL

    const url = `${apiUrl}/User/GetUserInfo`

    const response = await fetch(url, {
      method: 'GET',
      credentials: 'include'
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