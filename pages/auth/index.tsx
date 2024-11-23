import { useCsrfTokenStore, userUserInfoStore } from "@/store/store"
import { useSearchParams } from "next/navigation"
import { useRouter } from "next/router"
import { useEffect } from "react"
import { PersonalInfomation } from "../user/account"
import { Container } from "@mui/material"
import { ApiResponse } from "@/interfaces/api/response"
import { RespCode } from "@/enums/resp-code"
import { parseCookies } from "nookies"


export default function AuthLogin() {

    // 用來處理 auth 登陸，將從google auth server接受的到授權碼傳給後端接口
    const router = useRouter()
    const search = useSearchParams();


    const setUserInfo = userUserInfoStore((state) => state.setUserInfo)

    const setCsrfToken = useCsrfTokenStore((state) => state.setCsrfToken)

    useEffect(() => {

        if (router.isReady) {
            const query = router.query
            //console.log("query",query)
            // 本頁面是提供獲取Oauth驗證碼後，請求後端，如果直接請求本頁面，就返回登入頁面
            if (!query || !query.code || !query.state) {
                router.replace('/login')
                return;
            }

            const state: string | undefined = query.state as string | undefined

            if (!state) {
                router.replace('/login')
                return;
            }

            // google-login:/跳轉路徑
            const stateArr = state.split(':')

            const data = { code: query.code, redirect_url: stateArr[1], state: stateArr[0] }

            const fetchData = async () => {
                try {
                    const result = await userAuthLogin(data) as ApiResponse;
                    console.log("result=", result)


                    if (result.code != RespCode.SUCCESS) {

                        router.replace("/login")
                        return;
                    }


                    if (result.data == null) {
                        router.replace("/login")
                        return;
                    }


                    const userData = result.data as AuthLoginResp

                    const user: PersonalInfomation = {
                        //userId:userData.userInfo.userId,
                        email: userData.userInfo.email,
                        name: userData.userInfo.nickName ? userData.userInfo.nickName : userData.userInfo.username,  //userData.username?userData.username:userData.nickName
                        birthday: userData.userInfo.birthday ? userData.userInfo.birthday : "",
                        type: userData.userInfo.type,
                        picture: userData.userInfo.picture,
                        sex: userData.userInfo.gender,
                        phoneNumber: userData.userInfo.phoneNumber,
                    }

                    const cookies = parseCookies();
                    const sessionCsrfToken = cookies["X-CSRF-Token"] || null;
                    setCsrfToken(sessionCsrfToken)


                    setUserInfo(user)

                    //如果有帶跳轉地址就跳轉
                    if (userData.redirectUrl) {
                        router.replace(userData.redirectUrl)
                    }



                } catch (error) {
                    console.error('Error fetching data:', error)
                }
            }


            fetchData()
        }




    }, [router.isReady, router.query])
    // 必備參數 code
    // 跳轉 state
    // redirect_url (從state裡面取)
    const userAuthLogin = async (data: {}) => {
        const apiUrl= process.env.NEXT_PUBLIC_BACKEND_URL

        const response = await fetch(`${apiUrl}/User/AuthLogin`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })

        return response.json();
    }

    return (
        <Container>
            驗證中...
        </Container>
    )

}

interface AuthProps {
    code: string;
    state: string;
}

interface AuthLoginResp {
    redirectUrl: string | null;
    userInfo: UserInfo;
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