import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { Collapse, Drawer, IconButton, List, ListItemButton, ListItemText, Stack, SxProps, Theme, Box, Typography, Divider, alpha } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import Link from "next/link";
import { Fragment, useState } from "react";
import NavLink from "../navLink";
import { routes } from "@/routes/routes";
import { UrlObject } from "url";

function SideNavBar({ open, setOpen }: SideNavBarProps) {

    return (
        <Drawer
            PaperProps={{
                sx: { 
                    backgroundColor: "linear-gradient(180deg, #2C3E50 0%, #34495E 100%)",
                    background: "linear-gradient(180deg, #2C3E50 0%, #34495E 100%)",
                    width: 280,
                    borderTopRightRadius: 16,
                    borderBottomRightRadius: 16,
                    boxShadow: '0 8px 40px rgba(0,0,0,0.2)'
                }
            }}
            open={open} 
            onClose={() => setOpen(false)}
        >
            {/* 標頭區域 */}
            <Box sx={{
                p: 2,
                borderBottom: '1px solid rgba(255,255,255,0.1)',
                position: 'relative'
            }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography 
                        variant="h6" 
                        sx={{ 
                            fontWeight: 700,
                            background: 'linear-gradient(45deg, #E67E22, #F39C12)',
                            backgroundClip: 'text',
                            WebkitBackgroundClip: 'text',
                            color: 'transparent'
                        }}
                    >
                        商品分類
                    </Typography>
                    <IconButton 
                        disableRipple 
                        onClick={() => setOpen(false)}
                        sx={{
                            backgroundColor: alpha('#FFFFFF', 0.1),
                            color: 'white',
                            '&:hover': {
                                backgroundColor: alpha('#E67E22', 0.2),
                                transform: 'scale(1.1)'
                            },
                            transition: 'all 0.3s ease'
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                </Stack>
            </Box>

            <nav>
                <List sx={{ 
                    width: "100%", 
                    p: 1,
                    '& .MuiListItemButton-root': {
                        borderRadius: 2,
                        mx: 1,
                        mb: 0.5,
                        transition: 'all 0.3s ease',
                        position: 'relative',
                        overflow: 'hidden',
                        '&:hover': {
                            backgroundColor: alpha('#E67E22', 0.15),
                            transform: 'translateX(8px)',
                            '&::before': {
                                width: '4px'
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
                        }
                    }
                }}>
                    {routes.map((route, index) => (
                        <Fragment key={index}>
                            {route.nestedRoute && (
                                <NestedLink
                                    href={route.nestedRoute.href}
                                    title={route.nestedRoute.title}
                                    setOpen={setOpen}
                                >
                                    {route.innerRoutes && route.innerRoutes.map((innerRoute) => (
                                        <NavLink
                                            href={innerRoute.href}
                                            setOpen={setOpen}
                                            sx={{ 
                                                pl: 4,
                                                ml: 2,
                                                borderLeft: '2px solid rgba(230, 126, 34, 0.3)',
                                                '&:hover': {
                                                    borderLeft: '2px solid #E67E22'
                                                }
                                            }}
                                            key={innerRoute.title}
                                        >
                                            {innerRoute.title}
                                        </NavLink>
                                    ))}
                                </NestedLink>
                            )}

                            {route.singleRoute && (
                                <NavLink
                                    href={route.singleRoute.href}
                                    setOpen={setOpen}
                                    key={route.singleRoute.title}
                                >
                                    {route.singleRoute.title}
                                </NavLink>
                            )}
                        </Fragment>
                    ))}
                </List>
            </nav>

            {/* 底部裝飾 */}
            <Box sx={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: 60,
                background: 'linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.3) 100%)',
                borderBottomRightRadius: 16
            }} />
        </Drawer>
    )
}

const useOpenState = (initState = false) => {
    const [open, setOpen] = useState<boolean>(initState)

    // typescript 編譯時會把他當作  字面量
    return [open, setOpen] as const;
}

interface SideNavBarProps {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

interface NestedLinkProps {
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    title: string;
    href: string | UrlObject;
    sx?: SxProps<Theme>;
    children?: React.ReactNode;
}

const NestedLink = ({ setOpen, children, title, href, sx }: NestedLinkProps) => {

    const [expandOpen, setExpandOpen] = useState<boolean>(false)

    const handleExpandClick = () => {
        setExpandOpen(op => {
            return !op
        });
    };

    return (
        <>
            <ListItemButton 
                sx={{ 
                    ...sx,
                    '&:hover .expand-icon': {
                        transform: 'scale(1.2)',
                        color: '#E67E22'
                    }
                }} 
                disableRipple 
                onClick={handleExpandClick}
            >
                <ListItemText
                    sx={{ 
                        color: "white",
                        '& .MuiListItemText-primary': {
                            fontWeight: 600,
                            fontSize: '1rem'
                        }
                    }}
                    primary={
                        <Link
                            passHref
                            href={href}
                            style={{ color: 'inherit', textDecoration: "none" }}
                            onClick={() => setOpen(false)}
                        >
                            {title}
                        </Link>
                    } 
                />

                {expandOpen ? 
                    <ExpandLess 
                        className="expand-icon"
                        sx={{ 
                            color: "#E67E22", 
                            transition: 'all 0.3s ease' 
                        }} 
                    /> : 
                    <ExpandMore 
                        className="expand-icon"
                        sx={{ 
                            color: "rgba(255,255,255,0.7)", 
                            transition: 'all 0.3s ease' 
                        }} 
                    />
                }
            </ListItemButton >
            
            {/*內層 nav */}
            <Collapse in={expandOpen} timeout="auto" unmountOnExit>
                <List sx={{
                    backgroundColor: alpha('#000000', 0.1),
                    borderRadius: 1,
                    mx: 1,
                    mb: 1,
                    border: '1px solid rgba(230, 126, 34, 0.1)'
                }}>
                    {children}
                </List>
            </Collapse>
        </>
    )
}

export default SideNavBar;

export { useOpenState }