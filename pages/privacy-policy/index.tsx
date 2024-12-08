import { Box, Stack, Typography } from "@mui/material";

export default function PrivacyPolicy() {
    return <>
        <Box sx={{ m: "30px" }}>
            <Typography variant={"h4"} textAlign={"center"}>隱私權政策</Typography>
            <Typography component={"p"} sx={{ m: "30px" }}>最後更新日期: 2024/12/8</Typography>

            <Stack sx={{ m: "30px" }} spacing={2}>
                <Typography variant={"h5"} sx={{fontWeight:"bold"}}>簡介</Typography>
                <Typography component={"p"} >
                    我們非常重視您的隱私。本隱私權政策旨在向您說明我們如何收集、使用、共享和保護您的個人信息。當您使用我們的應用程式或網站時，即表示您同意本隱私權政策的內容。
                </Typography>
            </Stack>

            <Stack sx={{ m: "30px" }} spacing={2}>
                <Typography variant={"h5"} sx={{fontWeight:"bold"}}>我們收集的信息</Typography>
                <Typography component={"p"} sx={{ m: "30px" }} >我們可能收集以下類型的信息： <br/>
                    1. 個人識別信息：例如您的姓名、電子郵件地址。<br/>
                    2. 技術信息：例如您的設備類型、瀏覽器類型、IP 地址。<br/>
                    3. 使用數據：例如您如何使用我們的服務，包括訪問的頁面和點擊的功能。
                </Typography>
            </Stack>


            <Stack sx={{ m: "30px" }} spacing={2}>
                <Typography variant={"h5"} sx={{fontWeight:"bold"}}>我們如何使用您的信息</Typography>
                <Typography component={"p"} sx={{ m: "30px"}}>我們收集的信息可能用於以下用途：<br/>
                    1. 提供和改進我們的服務。<br/>
                    2. 處理您的請求或查詢。<br/>
                    3. 發送有關產品更新和促銷的通知（若您選擇接收）。<br/>
                    4. 分析數據以改進我們的網站和應用程式。</Typography>

            </Stack>


            <Stack sx={{ m: "30px" }} spacing={2}>
                <Typography variant={"h5"} sx={{fontWeight:"bold"}}>我們如何共享您的信息</Typography>
                <Typography component={"p"} sx={{ m: "30px" }}>我們可能在以下情況下與第三方共享您的信息：<br/>
                    1. 第三方服務提供商：為我們提供技術支持或數據處理服務的公司。<br/>
                    2. 法律要求：若法律要求或政府機構請求，我們可能共享您的信息。<br/>
                    3. 業務轉讓：若我們的公司被併購或出售，您的信息可能會作為資產之一轉移。
                </Typography>

            </Stack>


            <Stack sx={{ m: "30px" }} spacing={2}>
                <Typography variant={"h5"} sx={{fontWeight:"bold"}}> 資料安全性</Typography>
                <Typography component={"p"} sx={{ m: "30px" }}>
                    我們採取合理的技術和組織措施來保護您的個人數據免受未經授權的訪問、使用或洩露。然而，互聯網數據傳輸並非絕對安全，我們無法保證完全的安全性。
                </Typography>
            </Stack>


            <Stack sx={{ m: "30px" }} spacing={2}>
                <Typography variant={"h5"} sx={{fontWeight:"bold"}}>Cookie 和追蹤技術</Typography>
                <Typography component={"p"} sx={{ m: "30px" }}>
                    我們可能使用 Cookie 和其他追蹤技術來增強用戶體驗、分析流量和提供定制內容。您可以通過瀏覽器設置來管理或禁用 Cookie。
                </Typography>
            </Stack>


            <Stack sx={{ m: "30px" }} spacing={2}>
                <Typography variant={"h5"} sx={{fontWeight:"bold"}}>隱私政策的變更</Typography>
                <Typography component={"p"} sx={{ m: "30px" }}>
                    我們可能會不定期更新本隱私權政策。所有變更將發布在此頁面，並註明更新日期。
                </Typography>
            </Stack>

        </Box>
    </>
}