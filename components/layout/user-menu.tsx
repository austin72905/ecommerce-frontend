import { ProductInfomationCount } from "@/interfaces";
import { ApiResponse } from "@/interfaces/api/response";
import { Cart, CartItem, mergeCartContent } from "@/pages/cart";
import { useAlertMsgStore, useCartStore, userUserInfoStore, useSubscribeListStore } from "@/store/store";
import { Menu, MenuItem, Typography } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/router";


export default function UserMenu({ anchorElement, handleCancelAnchor }: UserMenu) {

    const router=useRouter()
    const userMenuOpen = Boolean(anchorElement)

    const userInfo = userUserInfoStore((state) => state.userInfo)
    const setUserInfo = userUserInfoStore((state) => state.setUserInfo)
    const setAlertMsg = useAlertMsgStore((state) => state.setAlertMsg)
    const initializeCart = useCartStore((state) => state.initializeCart)
    const cartContent = useCartStore((state) => state.cartContent)


    const clearSubscribeIdList = useSubscribeListStore((state) => state.clearSubscribeIdList)
    const handleLogout = async () => {
        console.log("logout")

        // 清空購物車前應該要將原本購物車內容同步到後端
        await syncCartcontent(cartContent)

        const apiUrl= process.env.NEXT_PUBLIC_BACKEND_URL
        await fetch(`${apiUrl}/User/UserLogout`, {
            method: 'GET',
            credentials: 'include'
        })
        setAlertMsg("已成功登出")
        setUserInfo(null)
        clearSubscribeIdList()
        // 已經使用zustand persist 所以註解此行
        // 登出時將 購物車清掉，因為登入時，已經加入的購物車
        //localStorage.removeItem('cart');

        
        
        initializeCart([])
        goToLogin()

    }

    const syncCartcontent =async (content: ProductInfomationCount[])=>{
        try {
            console.log(" syncCartcontent 合併購物車")
            const cartItems = content.map(item => {
                const cartItem: CartItem = {
                    productVariantId: item.selectedVariant?.variantID,
                    quantity: item.count
                }

                return cartItem;
            })
            const cart: Cart = {
                items: cartItems,
                isCover: true
            }
            const result = await mergeCartContent(cart) as ApiResponse;

            //console.log("mergeCartContent result=", result)


        } catch (error) {
            console.error('Error syncCartcontent data:', error)
        }
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