import { Menu, MenuItem, Typography } from "@mui/material";
import Link from "next/link";
import { Dispatch, SetStateAction } from "react";

export default function UserMenu({anchorElement,handleCancelAnchor}:UserMenu) {


    const userMenuOpen = Boolean(anchorElement)

    return (
        <Menu disableScrollLock sx={{ border: "0px solid" }} anchorEl={anchorElement} open={userMenuOpen} onClick={handleCancelAnchor} onClose={handleCancelAnchor}>
            <MenuItem component={Link} href="/user/account" sx={{ border: "0px solid black" }}>
                <Typography variant='body2'>我的帳戶</Typography>
            </MenuItem>
            <MenuItem component={Link} href="/user/purchase">
                <Typography variant='body2'>訂單查詢</Typography>
            </MenuItem>
            <MenuItem component={Link} href="/user/collection-list">
                <Typography variant='body2'>願望清單</Typography>
            </MenuItem>
            <MenuItem component={Link} href="/user/modify-password">
                <Typography variant='body2'>修改密碼</Typography>
            </MenuItem>
            <MenuItem component={Link} href="/user/addressed">
                <Typography variant='body2'>常用地址</Typography>
            </MenuItem>
        </Menu>
    )
}

interface UserMenu {
    anchorElement:HTMLElement|null;
    handleCancelAnchor:()=>void;
}