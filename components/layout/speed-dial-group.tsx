import { SpeedDial, Stack } from "@mui/material"

import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { useState } from "react";


interface GoToTopButtonProps {
    handleScrollTop: () => void;
}

/**
 * 畫面移動到最上方的按鈕
 * 
 * @component
 */
const GoToTopButton = ({ handleScrollTop }: GoToTopButtonProps) => {


    return (
        <>
            <Stack sx={{
                position: "fixed",
                bottom: "150px",
                right: "30px",
                zIndex: 999
            }}

            >
                

                <SpeedDial
                    ariaLabel="SpeedDial to the top"
                    sx={{

                        '& .MuiFab-primary': {
                            width: 45,
                            height: 45,
                            bgcolor: "white",
                            boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.2)",
                            border: "0px solid grey",
                            opacity: "0.8"

                        },

                    }}
                    FabProps={{
                        sx: {
                            '&:hover': {
                                backgroundColor: '#d9d9d9', // 自定义悬停颜色
                            },
                        },
                    }}
                    open={false}
                    icon={<KeyboardArrowUpIcon sx={{ color: "grey" }} />}
                    onClick={handleScrollTop}

                />
            </Stack>

            
        </>



    )
}







export default GoToTopButton;