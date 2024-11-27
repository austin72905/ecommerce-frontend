import { useAlertErrorMsgStore } from "@/store/store";
import { Alert } from "@mui/material";
import { useEffect } from "react";

export default function AlertErrorMsg(){

    const alerErrortMsg =useAlertErrorMsgStore(state=>state.alerErrortMsg)
    const setAlertErrorMsg =useAlertErrorMsgStore(state=>state.setAlertErrorMsg)

    useEffect(() => {

        let timer = setTimeout(() => {
            setAlertErrorMsg("")
        }, 1500);

        return () => {
            clearTimeout(timer)
        }
    }, [alerErrortMsg])



    return(
        <Alert
                severity="error"
                sx={{
                    position: "fixed",
                    top: alerErrortMsg?"10%":"-20%",
                    transition:"top 0.5s",
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: {
                        xs: "80%",
                        md: "60%",
                        lg: "40%"
                    },
                    zIndex:9999

                }}
            >
                {alerErrortMsg}
            </Alert>
    )
}