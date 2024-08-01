import { ListItemButton, ListItemText, SxProps, Theme } from "@mui/material";
import Link from "next/link";
import { ReactNode } from "react";
import { UrlObject } from "url";

export default function NavLink({ setOpen, href, children, sx }: NavLinkProps) {

    return (
        <Link passHref href={href}
            style={{ color: 'inherit', textDecoration: "none" }}>
            <ListItemButton sx={{ ...sx }} disableRipple onClick={() => setOpen(false)}>
                <ListItemText sx={{ color: "white" }} primary={children} />
            </ListItemButton >
        </Link>
    )
}


interface NavLinkProps {
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    href: string | UrlObject;
    sx?: SxProps<Theme>;
    children?: ReactNode;
}