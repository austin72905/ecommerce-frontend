import { useAlertMsgStore, userUserInfoStore, useSubscribeListStore } from "@/store/store";
import { Button, Menu, MenuItem, Typography } from "@mui/material";
import Link from "next/link";
import { Dispatch, SetStateAction } from "react";

export default function UserMenu({anchorElement,handleCancelAnchor}:UserMenu) {


    const userMenuOpen = Boolean(anchorElement)

    const setUserInfo = userUserInfoStore((state) => state.setUserInfo)
    const setAlertMsg = useAlertMsgStore((state) => state.setAlertMsg)


    const clearSubscribeIdList=useSubscribeListStore((state)=>state.clearSubscribeIdList)
    const handleLogout=async()=>{
        console.log("logout")
        await fetch("http://localhost:5025/User/UserLogout",{
            method:'GET',
            credentials:'include'
        })
        setAlertMsg("已成功登入")
        setUserInfo(null)
        clearSubscribeIdList()
    }

    return (
        <Menu disableScrollLock sx={{ border: "0px solid" }} anchorEl={anchorElement} open={userMenuOpen} onClick={handleCancelAnchor} onClose={handleCancelAnchor}>
            <MenuItem component={Link} href="/user/account" sx={{ border: "0px solid black" }}>
                <Typography variant='body2'>我的帳戶</Typography>
            </MenuItem>
            <MenuItem component={Link} href="/user/order-record">
                <Typography variant='body2'>訂單查詢</Typography>
            </MenuItem>
            <MenuItem component={Link} href="/user/subscribe-list" sx={{ border: "0px solid black" }}>
                <Typography variant='body2'>我的收藏</Typography>
            </MenuItem>
            <MenuItem component={Link} href="/user/modify-password">
                <Typography variant='body2'>修改密碼</Typography>
            </MenuItem>
            <MenuItem component={Link} href="/user/addressed">
                <Typography variant='body2'>常用地址</Typography>
            </MenuItem>
            <MenuItem component={Link} href="/login" onClick={handleLogout}>
                <Typography variant='body2'>登出</Typography>
            </MenuItem>
        </Menu>
    )
}

interface UserMenu {
    anchorElement:HTMLElement|null;
    handleCancelAnchor:()=>void;
}