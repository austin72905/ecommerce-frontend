import { userUserInfoStore } from "@/store/store"
import { useSearchParams } from "next/navigation"
import { useRouter } from "next/router"
import { useEffect } from "react"
import { PersonalInfomation } from "../user/account"


export default function AuthLogin() {

    // 用來處理 auth 登陸，將從google auth server接受的到授權碼傳給後端接口
    const router = useRouter()
    const search = useSearchParams();


    const setUserInfo = userUserInfoStore((state) => state.setUserInfo)

    useEffect(() => {

        if (router.isReady) {
            const query = router.query
            console.log("query",query)
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
                    const result =await userAuthLogin(data) as AuthLoginResp;

                    console.log("result=", result)

                    if(result.userInfo){
                        const user:PersonalInfomation={
                            userId:result.userInfo.userId,
                            email:result.userInfo.email,
                            name:result.userInfo.username,
                            birthday:result.userInfo.birthday?result.userInfo.birthday:"",
                            type:result.userInfo.type,
                            picture:result.userInfo.picture
                        }
                        setUserInfo(user)
                    }

                    if(result.redirectUrl){
                        router.replace(result.redirectUrl)
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
        const response = await fetch("http://localhost:5025/User/AuthLogin", {
            method: 'POST',
            credentials:'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })

        return response.json();
    }

    return (
        <>
            auth
        </>
    )

}

interface AuthProps {
    code: string;
    state: string;
}

interface AuthLoginResp{
    redirectUrl:string;
    userInfo:UserInfo;
}

interface UserInfo{
    birthday?:string;
    email:string;
    gender?:string;
    nickName?:string;
    phoneNumber?:string;
    picture?:string;
    type:string;
    userId:string;
    username:string;
}