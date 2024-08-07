import { Avatar, Badge, Box, InputBase, List, ListItem, ListItemAvatar, ListItemText, Paper, Stack, Typography, useMediaQuery, useTheme } from "@mui/material"
import React from "react"
import LogoImage from '@/public/images/logo.jpg'


import ChatOutlinedIcon from '@mui/icons-material/ChatOutlined';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import SendIcon from '@mui/icons-material/Send';

interface ChatRoomProps {
    chatOpen: boolean;
    handleToggleChatRoom: () => void;
}

const ChatRoom = ({ chatOpen, handleToggleChatRoom }: ChatRoomProps) => {


    const theme = useTheme()
    const isXSScreen: boolean = useMediaQuery(('(max-width:480px)'))

    /**
     * 聊天室大小
     * height 350px
     * width  280px
     * 
     */
    return (
        <Box sx={{ bottom: "0px", right: isXSScreen?"0px":"30px", width: isXSScreen?"100%":"280px", height: isXSScreen?"100%":"435px", display: chatOpen ? "block" : "none", border: "0px solid #9c9c9c", position: "fixed", zIndex: 9999 }} >
            <Paper sx={{ width: "100%", height: "100%", border: "0px solid #9c9c9c" }}>

                <Stack direction={"column"} sx={{ height: "100%" }}>
                    {/*聊天室top */}
                    <Stack onClick={handleToggleChatRoom} justifyContent={"space-between"} direction={"row"} sx={{ background: "#61D1BD", border: "0px solid #9c9c9c", width: "100%", minHeight: "35px", alignItems: "center" }} >
                        <Stack alignItems={"center"} sx={{ border: "0px solid #9c9c9c" }} direction={"row"} >
                            <Badge badgeContent={chatRecord.length} max={99} color='error' >
                                <ChatOutlinedIcon style={{ color: 'white' }} sx={{ width: "25px", height: "25px", pl: "15px" }} />
                            </Badge>

                            <Typography variant='body1' sx={{ pl: "15px", letterSpacing: "5px", color: "white" }}>聯絡賣家</Typography>
                        </Stack>

                        <Box sx={{ mr: "10px" }} >
                            {chatOpen ?
                                <ArrowDropDownIcon sx={{ color: "white", "&:hover": { color: "black" } }} />
                                :
                                <ArrowDropUpIcon sx={{ color: "white", "&:hover": { color: "black" } }} />
                            }


                        </Box>


                    </Stack>
                    {/*聊天紀錄 */}
                    <Stack flexGrow={1} sx={{overflow: 'auto',overflowX:"hidden"}}>
                        <List sx={{ width: "100%" ,border: "0px solid red" }}>
                            {
                                chatRecord.map((chat, index) =>
                                (

                                    <React.Fragment key={index}>

                                        {/*是否寫是時間 */}
                                        {
                                            chat.isTodayFirstMsg
                                                ?
                                                <ListItem sx={{ py: "1px", px: "10px", border: "0px solid #d9d9d9" }}>
                                                    <ListItemText sx={{ border: "0px solid #d9d9d9" }} primary={<Stack direction={"row"} justifyContent={"center"}><Typography variant='caption'>{chat.date}</Typography></Stack>} />
                                                </ListItem>
                                                :
                                                null
                                        }
                                        {
                                            chat.isAdmin
                                                ?
                                                <ListItem alignItems="flex-start" sx={{ border: "0px solid #d9d9d9", py: "1px", px: "10px" }}>
                                                    <ListItemAvatar sx={{ '&.MuiListItemAvatar-root': { minWidth: "40px" }, border: "0px solid #d9d9d9", mr: "5px" }}>
                                                        <Avatar alt="LogoImage" src={LogoImage.src} />
                                                    </ListItemAvatar>
                                                    <Stack spacing={"2px"} direction={"row"} sx={{ border: "0px solid #d9d9d9" }}>
                                                        <ListItemText sx={{ py: "6px", px: "10px", border: "1px solid #d9d9d9", borderRadius: "20px" }} primary={<Typography variant='subtitle2' sx={{ border: "0px solid #d9d9d9" }} >{chat.msg}</Typography>} />
                                                    </Stack>
                                                </ListItem>
                                                :
                                                <ListItem sx={{ border: "0px solid #d9d9d9", display: "flex", flexDirection: "row", justifyContent: "end", py: "1px", px: "10px" }}>
                                                    <Box sx={{ border: "0px solid #d9d9d9" }}>
                                                        <ListItemText sx={{ py: "6px", px: "10px", backgroundColor: "#96DB8B", border: "1px solid #d9d9d9", borderRadius: "20px" }} primary={<Typography variant='subtitle2' sx={{ border: "0px solid #d9d9d9" }} >{chat.msg}</Typography>} />
                                                    </Box>

                                                </ListItem>
                                        }

                                    </React.Fragment>

                                ))
                            }

                        </List>

                    </Stack>




                    {/*訊息輸入框 */}
                    <Stack direction={"row"} sx={{ justifyContent: "end", border: "0px solid #d9d9d9", height: "auto" }} >
                        <Paper sx={{ border: "1px solid #d9d9d9", boxShadow: "none", display: 'flex', alignItems: 'center', width: "100%", height: 35 }}>

                            <InputBase
                                sx={{ ml: 1, flex: 1 }}
                                placeholder="輸入訊息"
                                inputProps={{ 'aria-label': '輸入訊息' }}
                            />

                            <SendIcon sx={{ p: '10px', width: "20px", height: "20px", borderRadius: "0px", '&:hover': { cursor: "pointer" } }} aria-label="send" />

                        </Paper>
                    </Stack>


                </Stack>


            </Paper>

        </Box>
    )
}

interface Chat {
    isAdmin: boolean;
    msg: string;
    date: string;
    isTodayFirstMsg: boolean;
}


const chatRecord: Chat[] = [
    {
        isAdmin: true,
        msg: "請問有下單嗎?請問有下單嗎?請問有下單嗎?請問有下單嗎?請問有下單嗎?請問有下單嗎?請問有下單嗎?請問有下單嗎?請問有下單嗎?請問有下單嗎?請問有下單嗎?請問有下單嗎?",
        date: "2023/2/5 下午06:29",
        isTodayFirstMsg: true
    },
    {
        isAdmin: false,
        msg: "是的，請問何時出貨?",
        date: "2023/2/5 下午07:29",
        isTodayFirstMsg: false
    },
    {
        isAdmin: false,
        msg: "一次買10個可以免運嗎?",
        date: "2023/2/5 下午07:30",
        isTodayFirstMsg: false
    },
    {
        isAdmin: false,
        msg: "??",
        date: "2023/2/6 下午13:30",
        isTodayFirstMsg: true
    },
    {
        isAdmin: true,
        msg: "付款完就會出貨",
        date: "2023/2/8 下午01:13",
        isTodayFirstMsg: true
    },
    {
        isAdmin: false,
        msg: "那麼晚才回是不想做生意了?",
        date: "2023/2/8 下午01:30",
        isTodayFirstMsg: false
    },
    {
        isAdmin: false,
        msg: "那麼晚才回是不想做生意了?",
        date: "2023/2/8 下午01:30",
        isTodayFirstMsg: false
    },
    {
        isAdmin: false,
        msg: "那麼晚才回是不想做生意了?",
        date: "2023/2/8 下午01:30",
        isTodayFirstMsg: false
    },
    {
        isAdmin: false,
        msg: "那麼晚才回是不想做生意了?",
        date: "2023/2/8 下午01:30",
        isTodayFirstMsg: false
    },
    {
        isAdmin: false,
        msg: "那麼晚才回是不想做生意了?",
        date: "2023/2/8 下午01:30",
        isTodayFirstMsg: false
    },
    {
        isAdmin: false,
        msg: "那麼晚才回是不想做生意了?",
        date: "2023/2/8 下午01:30",
        isTodayFirstMsg: false
    },
    {
        isAdmin: true,
        msg: "請問有下單嗎?請問有下單嗎?請問有下單嗎?請問有下單嗎?請問有下單嗎?請問有下單嗎?請問有下單嗎?請問有下單嗎?請問有下單嗎?請問有下單嗎?請問有下單嗎?請問有下單嗎?",
        date: "2023/2/5 下午06:29",
        isTodayFirstMsg: true
    },
    {
        isAdmin: true,
        msg: "請問有下單嗎?請問有下單嗎?請問有下單嗎?請問有下單嗎?請問有下單嗎?請問有下單嗎?請問有下單嗎?請問有下單嗎?請問有下單嗎?請問有下單嗎?請問有下單嗎?請問有下單嗎?",
        date: "2023/2/5 下午06:29",
        isTodayFirstMsg: true
    },
    {
        isAdmin: true,
        msg: "請問有下單嗎?請問有下單嗎?請問有下單嗎?請問有下單嗎?請問有下單嗎?請問有下單嗎?請問有下單嗎?請問有下單嗎?請問有下單嗎?請問有下單嗎?請問有下單嗎?請問有下單嗎?",
        date: "2023/2/5 下午06:29",
        isTodayFirstMsg: true
    },
    {
        isAdmin: true,
        msg: "請問有下單嗎?請問有下單嗎?請問有下單嗎?請問有下單嗎?請問有下單嗎?請問有下單嗎?請問有下單嗎?請問有下單嗎?請問有下單嗎?請問有下單嗎?請問有下單嗎?請問有下單嗎?",
        date: "2023/2/5 下午06:29",
        isTodayFirstMsg: true
    },



]

export default ChatRoom;