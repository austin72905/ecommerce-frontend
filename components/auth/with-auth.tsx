import { userUserInfoStore } from "@/store/store";
import { useRouter } from "next/router";
import { ComponentType, ReactNode, useEffect, useState } from "react";

const WithAuth = <P extends object>(Component: ComponentType<P>) => {


    const ComponentWithdAuth = (props: P) => {
        const router = useRouter()
        const userInfo = userUserInfoStore((state) => state.userInfo)
        const { query, pathname } = router;

    
        useEffect(() => {


            if (!userInfo) {

                let newPath = pathname

                Object.entries(query).forEach(([key, value]) => {
                    console.log("key=", key)
                    console.log("value=", value)
                    newPath = newPath.replace(`[${key}]`, value as string)
                })
                console.log("new pathname=", newPath)
                if(router.isReady){
                    router.replace(`/login?redirect=${newPath}`)
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