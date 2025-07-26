import { ListItemButton, ListItemText, SxProps, Theme, alpha } from "@mui/material";
import Link from "next/link";
import { ReactNode } from "react";
import { UrlObject } from "url";

export default function NavLink({ setOpen, href, children, sx }: NavLinkProps) {

    return (
        <Link passHref href={href}
            style={{ color: 'inherit', textDecoration: "none" }}>
            <ListItemButton 
                sx={{ 
                    ...sx,
                    borderRadius: 2,
                    transition: 'all 0.3s ease',
                    position: 'relative',
                    overflow: 'hidden',
                    '&:hover': {
                        backgroundColor: alpha('#E67E22', 0.1),
                        transform: 'translateX(4px)',
                        '& .MuiListItemText-primary': {
                            color: '#F39C12'
                        }
                    },
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        bottom: 0,
                        width: 0,
                        backgroundColor: '#E67E22',
                        transition: 'width 0.3s ease'
                    },
                    '&:hover::before': {
                        width: '3px'
                    }
                }} 
                disableRipple 
                onClick={() => setOpen(false)}
            >
                <ListItemText 
                    sx={{ 
                        color: "white",
                        '& .MuiListItemText-primary': {
                            fontSize: '0.9rem',
                            fontWeight: 500,
                            transition: 'color 0.3s ease'
                        }
                    }} 
                    primary={children} 
                />
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