import { useAlertMsgStore, useCartStore, userUserInfoStore, useSubscribeListStore } from "@/store/store";
import { Button, Menu, MenuItem, Typography } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/router";
import { Dispatch, SetStateAction } from "react";

export default function UserMenu({ anchorElement, handleCancelAnchor }: UserMenu) {

    const router=useRouter()
    const userMenuOpen = Boolean(anchorElement)

    const userInfo = userUserInfoStore((state) => state.userInfo)
    const setUserInfo = userUserInfoStore((state) => state.setUserInfo)
    const setAlertMsg = useAlertMsgStore((state) => state.setAlertMsg)
    const initializeCart = useCartStore((state) => state.initializeCart)


    const clearSubscribeIdList = useSubscribeListStore((state) => state.clearSubscribeIdList)
    const handleLogout = async () => {
        console.log("logout")

        const apiUrl= process.env.NEXT_PUBLIC_BACKEND_URL
        await fetch(`${apiUrl}/User/UserLogout`, {
            method: 'GET',
            credentials: 'include'
        })
        setAlertMsg("已成功登出")
        setUserInfo(null)
        clearSubscribeIdList()
        // 登出時將 購物車清掉，因為登入時，已經加入的購物車
        localStorage.removeItem('cart');
        initializeCart([])
        goToLogin()

    }

    const goToLogin=()=>{
        router.replace("/login")
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

            {
                userInfo?.type == "google-login" ? null
                    :
                    <MenuItem component={Link} href="/user/modify-password">
                        <Typography variant='body2'>修改密碼</Typography>
                    </MenuItem>

            }

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
    anchorElement: HTMLElement | null;
    handleCancelAnchor: () => void;
}