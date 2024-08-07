import { useRouter } from "next/router";
import { useEffect } from "react";

export default function UserPage(){
    const router =useRouter()

    useEffect(()=>{
        router.replace("/user/account")
    },[])
    

    return (
        <>UserPage</>
    )
}