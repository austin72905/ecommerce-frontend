import { Avatar, Badge, Box, InputBase, List, ListItem, ListItemAvatar, ListItemText, Paper, Stack, Typography, useMediaQuery, useTheme } from "@mui/material"
import React, { useEffect, useRef, useState } from "react"
import LogoImage from '@/public/images/logo.jpg'


import ChatOutlinedIcon from '@mui/icons-material/ChatOutlined';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import SendIcon from '@mui/icons-material/Send';
import { io, Socket } from "socket.io-client";


import 'dayjs/locale/zh-tw'; 
import dayjs from 'dayjs';

dayjs.locale('zh-tw');

interface ChatRoomProps {
    chatOpen: boolean;
    handleToggleChatRoom: () => void;
}

const ChatRoom = ({ chatOpen, handleToggleChatRoom }: ChatRoomProps) => {

    const [msg, setMsg] = useState<string>("")
    const [recieveMsges, setRecieveMsges] = useState<Chat[]>([]);


    useEffect(() => {
        socket = io('http://localhost:3333',{
            withCredentials:true
        }) // 連接socket.io 服務器

        // 監聽服務器傳來的訊息
        socket.on('send-message', (data: Chat) => {
            console.log("get a message from server:",data)
            setRecieveMsges((prevMsgs) => [...prevMsgs, data])
        })

        socket.on('join-room-request',({ roomId })=>{
            socket.emit('join-room', { roomId });
        })

        // 斷開 連結
        return () => {
            if (socket) {
                socket.disconnect();
            }
        }

    }, [])

    // 傳送訊息
    const sendMsg = () => {
        if(msg===""){
            return
        }
        const formattedDate = dayjs().format('YYYY/M/D A hh:mm');
        const data: Chat = {
            isAdmin: false,
            msg: msg,
            date: formattedDate,
            isTodayFirstMsg: true,
            reciever_id:"admin",
            sender_id:"test"
        }
        // 因為socketio 只送給對方，不送給自己
        setRecieveMsges((prevMsgs) => [...prevMsgs, data])
        socket.emit('message-from-client', data);
        setMsg('')
    }

    // 處理按下鍵盤事件
    const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            sendMsg(); // 按下 Enter 觸發送訊息
        }
    };

    const messagesEndRef = useRef<HTMLDivElement | null>(null); // 用於滾動到最下方

    // 當新訊息添加時，自動滾動到最下方
    useEffect(() => {
        //只有自己輸入的訊息要滑到最下方
        if(recieveMsges.length>0 &&!recieveMsges[recieveMsges.length-1].isAdmin){
            messagesEndRef.current?.scrollIntoView({ behavior: 'auto' });
        }
        
    }, [recieveMsges]); // 監聽 messages 的變化

    const theme = useTheme()
    const isXSScreen: boolean = useMediaQuery(('(max-width:480px)'))

    /**
     * 聊天室大小
     * height 350px
     * width  280px
     * 
     */
    return (
        <Box sx={{ bottom: "0px", right: isXSScreen ? "0px" : "30px", width: isXSScreen ? "100%" : "280px", height: isXSScreen ? "100%" : "435px", display: chatOpen ? "block" : "none", border: "0px solid #9c9c9c", position: "fixed", zIndex: 9999 }} >
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
                    <Stack flexGrow={1} sx={{ overflow: 'auto', overflowX: "hidden" }}>
                        <List sx={{ width: "100%", border: "0px solid red" }}>
                            {
                                recieveMsges.map((chat, index) =>
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
                         {/* 自動滾動到這個 div */}
                        <div ref={messagesEndRef} />
                    </Stack>




                    {/*訊息輸入框 */}
                    <Stack direction={"row"} sx={{ justifyContent: "end", border: "0px solid #d9d9d9", height: "auto" }} >
                        <Paper sx={{ border: "1px solid #d9d9d9", boxShadow: "none", display: 'flex', alignItems: 'center', width: "100%", height: 35 }}>

                            <InputBase
                                sx={{ ml: 1, flex: 1 }}
                                placeholder="輸入訊息"
                                inputProps={{ 'aria-label': '輸入訊息' }}
                                onChange={(e) => setMsg(e.target.value)}
                                value={msg}
                                onKeyDown={handleKeyPress}
                            />

                            <SendIcon sx={{ p: '10px', width: "20px", height: "20px", borderRadius: "0px", '&:hover': { cursor: "pointer" } }} aria-label="send" onClick={sendMsg} />

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
    sender_id:string;
    reciever_id:string;
    chatroom_id?:string;
    timeStamp?:string;
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



//socket.io

let socket: Socket

interface ServerToClientEvents {
    message: (data: Chat) => void;
}

interface ClientToServerEvents {
    message: (data: Chat) => void;
}

export default ChatRoom;

