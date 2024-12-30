import { Box, IconButton, Modal, Stack, Typography, useTheme } from "@mui/material";
import { useEffect, useState } from "react";
import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined';
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

    return <Modal
        open={open}
        disableScrollLock

        slotProps={{
            backdrop: {
                sx: {
                    backgroundColor: "rgba(0, 0, 0, 0)", // 設置透明
                }
            }
        }}

    >
        <Box sx={{
            position: 'absolute',
            top: '40%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: isXSScreen?350:isSmallScreen?400:600,
            height: 'auto',
            maxHeight:600,
            bgcolor: 'background.paper',
            border: '1px solid #d9d9d9',
            borderRadius: "4px",
            boxShadow: "none",

            overflow: 'hidden',
            outline: 'none'

        }}>
            <Stack direction={"row"} justifyContent={"space-between"} sx={{ border: "0px solid", px: "20px", py: "15px", backgroundColor: "primary.main" }}>

                <ItemWrapper sx={{ pl: "0px", pt: "0px" }}>
                    <Typography variant='h6' >通知</Typography>

                </ItemWrapper>

                <IconButton onClick={handleClose} sx={{ "&:hover": { backgroundColor: "#d9d9d9" }, border: "0px solid #d9d9d9", backgroundColor: "primary.main", boxShadow: "none", width: "30px", height: "30px" }}>
                    <ClearOutlinedIcon />
                </IconButton>

            </Stack>

            <Box
                sx={{ overflow: 'scroll', height: 'auto' }}
            >
                <Box sx={{ m: "30px" }}>
                    <Box sx={{ my: 2 }}>
                        <Typography variant="h4" textAlign={"center"}>關於此網站</Typography>
                    </Box>

                    <Box >
                        <Stack sx={{ m: "30px" }} spacing={2}>
                            <Typography variant={"h5"} sx={{ fontWeight: "bold" }}>簡介</Typography>
                            <Typography component={"p"} >
                                這個Demo 線上商店主要是想透過實際的應用場景，展示軟體技術的練習，非商業用途。網站使用前後端分離，詳細說明可以到 <Link href={'/about'}>關於</Link> 頁面查看
                            </Typography>
                        </Stack>
                                            
                    </Box>



                </Box>
            </Box>
        </Box>
    </Modal>
}


const ItemWrapper = styled(Box)({
    paddingTop: "5px",
    paddingLeft: "20px",
    paddingRight: "20px"
})