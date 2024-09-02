import { useAlertMsgStore } from "@/store/store";
import { Alert } from "@mui/material";
import { useEffect, useState } from "react";

export default function AlertMsg(){

    const alertMsg =useAlertMsgStore(state=>state.alertMsg)
    const setAlertMsg =useAlertMsgStore(state=>state.setAlertMsg)

    useEffect(() => {

        let timer = setTimeout(() => {
            setAlertMsg("")
        }, 2000);

        return () => {
            clearTimeout(timer)
        }
    }, [alertMsg])



    return(
        <Alert
                severity="success"
                sx={{
                    position: "fixed",
                    top: alertMsg?"10%":"-20%",
                    transition:"top 0.5s",
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: {
                        xs: "80%",
                        md: "60%",
                        lg: "40%"
                    },

                }}
            >
                {alertMsg}
            </Alert>
    )
}