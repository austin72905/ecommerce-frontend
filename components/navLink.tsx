import { ListItemButton, ListItemText } from "@mui/material";
import Link from "next/link";

export default function NavLink(props: any) {
    const { setOpen,href,children,sx } = props
    return (
        <Link passHref href={href}
            style={{ color: 'inherit', textDecoration: "none" }}>
            <ListItemButton sx={{...sx}} disableRipple onClick={() => setOpen(false)}>
                <ListItemText sx={{ color: "white" }} primary={
                    children
                } />


            </ListItemButton >
        </Link>
    )
}