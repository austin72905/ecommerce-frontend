import { useAlertMsgStore, userUserInfoStore } from "@/store/store";
import { useRouter } from "next/router";
import { parseCookies } from "nookies";
import { ComponentType, ReactNode, useEffect, useState } from "react";

const WithAuth = <P extends object>(Component: ComponentType<P>) => {


    const ComponentWithdAuth = (props: P) => {
        const router = useRouter()
        const userInfo = userUserInfoStore((state) => state.userInfo)

        const setAlertMsg = useAlertMsgStore((state) => state.setAlertMsg)

        //計時器 
        let timeoutId: ReturnType<typeof setTimeout> | null = null;
        const { query, pathname } = router;

        const cookies = parseCookies();
        //const hasSessionId =Cookies.get("has-session-id")
    
        const hasSessionId = cookies["has-session-id"] || null;
        useEffect(() => {


            if (!hasSessionId) {
                
                let newPath = pathname

                Object.entries(query).forEach(([key, value]) => {
                    console.log("key=", key)
                    console.log("value=", value)
                    newPath = newPath.replace(`[${key}]`, value as string)
                })
                console.log("new pathname=", newPath)
                if(router.isReady){
                    setAlertMsg("請先登入")
                    
                    timeoutId = setTimeout(() => {
                        router.replace(`/login?redirect=${newPath}`)
                    }, 1000);
                }
                
 
            }

            return ()=>{
                if (timeoutId) {
                    clearTimeout(timeoutId)
                }
            }


        }, [router.isReady])


        

        // 如果已經驗證，渲染組件
        if (userInfo) {
            return <Component  {...props} />
        }

        // 如果未驗證，不渲染內容或顯示loading狀態
        return null;

    }



    return ComponentWithdAuth
}


export default WithAuth;