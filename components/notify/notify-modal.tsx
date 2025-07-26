import { Box, IconButton, Modal, Stack, Typography, useTheme, alpha, Fade, Grow } from "@mui/material";
import { useEffect, useState } from "react";
import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { styled, useMediaQuery } from "@mui/system";
import AboutPage from "@/pages/about";
import Link from "next/link";
import { useFirstVisitProductPageStore } from "@/store/store";
import { useRouter } from "next/router";

export default function NotifyModal() {

    const [open, setopen] = useState(false);

    const handleClose = () => {
        setopen(false);
        sethasVisited()
    }

    const hasVisited=useFirstVisitProductPageStore((state) => state.hasVisited);
    const sethasVisited=useFirstVisitProductPageStore((state) => state.sethasVisited);

    const router=useRouter()
    const theme = useTheme()
    const isSmallScreen: boolean = useMediaQuery(theme.breakpoints.down('sm'))
    const isXSScreen: boolean = useMediaQuery(('(max-width:430px)'))

    useEffect(() => {
        if(router.pathname==="/products" && !hasVisited){
            setopen(true);
        }else{
            setopen(false);
        }
    }, [router])

    return (
        <Modal
            open={open}
            disableScrollLock
            slotProps={{
                backdrop: {
                    sx: {
                        backgroundColor: alpha('#000', 0.6),
                        backdropFilter: 'blur(8px)',
                    }
                }
            }}
        >
            <Fade in={open} timeout={300}>
                <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: isXSScreen ? '90vw' : isSmallScreen ? 450 : 600,
                    maxWidth: 600,
                    bgcolor: 'background.paper',
                    borderRadius: 4,
                    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
                    overflow: 'hidden',
                    outline: 'none',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                }}>
                    {/* 標題欄 */}
                    <Box sx={{
                        background: 'linear-gradient(135deg, #2C3E50 0%, #34495E 100%)',
                        px: 3,
                        py: 2.5,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        position: 'relative',
                        '&::after': {
                            content: '""',
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            height: '1px',
                            background: 'linear-gradient(90deg, transparent 0%, rgba(230, 126, 34, 0.5) 50%, transparent 100%)'
                        }
                    }}>
                        <Stack direction="row" spacing={2} alignItems="center">
                            <Box sx={{
                                width: 40,
                                height: 40,
                                borderRadius: '50%',
                                background: 'rgba(255, 255, 255, 0.2)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                backdropFilter: 'blur(10px)'
                            }}>
                                <InfoOutlinedIcon sx={{ color: 'white', fontSize: 24 }} />
                            </Box>
                            <Typography 
                                variant='h6' 
                                sx={{ 
                                    color: 'white', 
                                    fontWeight: 700,
                                    textShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                }}
                            >
                                歡迎通知
                            </Typography>
                        </Stack>

                        <IconButton 
                            onClick={handleClose} 
                            sx={{ 
                                color: 'white',
                                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                backdropFilter: 'blur(10px)',
                                border: '1px solid rgba(255, 255, 255, 0.2)',
                                width: 36,
                                height: 36,
                                transition: 'all 0.3s ease',
                                '&:hover': { 
                                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                                    transform: 'scale(1.1)',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                                }
                            }}
                        >
                            <ClearOutlinedIcon sx={{ fontSize: 20 }} />
                        </IconButton>
                    </Box>

                    {/* 內容區域 */}
                    <Box sx={{ 
                        overflow: 'auto', 
                        maxHeight: '70vh',
                        background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)'
                    }}>
                        <Box sx={{ p: 4 }}>
                            <Grow in={open} timeout={500}>
                                <Box>
                                    {/* 標題 */}
                                    <Box sx={{ 
                                        textAlign: 'center', 
                                        mb: 4,
                                        position: 'relative'
                                    }}>
                                        <Typography 
                                            variant="h4" 
                                            sx={{ 
                                                fontWeight: 800,
                                                background: 'linear-gradient(135deg, #E67E22 0%, #F39C12 100%)',
                                                backgroundClip: 'text',
                                                WebkitBackgroundClip: 'text',
                                                color: 'transparent',
                                                mb: 1
                                            }}
                                        >
                                            關於此網站
                                        </Typography>
                                        <Typography 
                                            variant="body1" 
                                            sx={{ 
                                                color: 'text.secondary',
                                                fontWeight: 500
                                            }}
                                        >
                                            歡迎來到我們的 Demo 線上商店
                                        </Typography>
                                    </Box>

                                    {/* 內容 */}
                                    <Box sx={{ 
                                        background: 'rgba(230, 126, 34, 0.05)',
                                        borderRadius: 3,
                                        p: 3,
                                        border: '1px solid rgba(230, 126, 34, 0.1)',
                                        position: 'relative',
                                        '&::before': {
                                            content: '""',
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            right: 0,
                                            height: '3px',
                                            background: 'linear-gradient(90deg, #E67E22 0%, #F39C12 100%)',
                                            borderRadius: '3px 3px 0 0'
                                        }
                                    }}>
                                        <Typography 
                                            variant="h6" 
                                            sx={{ 
                                                fontWeight: 700,
                                                color: '#E67E22',
                                                mb: 2,
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 1
                                            }}
                                        >
                                            <Box sx={{
                                                width: 8,
                                                height: 8,
                                                borderRadius: '50%',
                                                backgroundColor: '#E67E22'
                                            }} />
                                            簡介
                                        </Typography>
                                        <Typography 
                                            component="p" 
                                            sx={{ 
                                                lineHeight: 1.8,
                                                color: 'text.primary',
                                                fontSize: '1rem',
                                                '& a': {
                                                    color: '#E67E22',
                                                    textDecoration: 'none',
                                                    fontWeight: 600,
                                                    position: 'relative',
                                                    '&::after': {
                                                        content: '""',
                                                        position: 'absolute',
                                                        bottom: -2,
                                                        left: 0,
                                                        right: 0,
                                                        height: '2px',
                                                        background: 'linear-gradient(90deg, #E67E22 0%, #F39C12 100%)',
                                                        transform: 'scaleX(0)',
                                                        transition: 'transform 0.3s ease'
                                                    },
                                                    '&:hover::after': {
                                                        transform: 'scaleX(1)'
                                                    }
                                                }
                                            }}
                                        >
                                            這個 Demo 線上商店主要是想透過實際的應用場景，展示軟體技術的練習，非商業用途。網站使用前後端分離架構，詳細說明可以到{' '}
                                            <Link href={'/about'}>關於頁面</Link> 查看完整資訊。
                                        </Typography>
                                    </Box>

                                    {/* 底部按鈕 */}
                                    <Box sx={{ 
                                        textAlign: 'center', 
                                        mt: 4,
                                        pt: 3,
                                        borderTop: '1px solid rgba(0,0,0,0.1)'
                                    }}>
                                        <Typography 
                                            variant="body2" 
                                            sx={{ 
                                                color: 'text.secondary',
                                                mb: 2
                                            }}
                                        >
                                            感謝您的使用！
                                        </Typography>
                                    </Box>
                                </Box>
                            </Grow>
                        </Box>
                    </Box>
                </Box>
            </Fade>
        </Modal>
    )
}

const ItemWrapper = styled(Box)({
    paddingTop: "5px",
    paddingLeft: "20px",
    paddingRight: "20px"
})