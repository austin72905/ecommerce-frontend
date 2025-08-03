import { Box, Link, List, ListItem, Stack, Typography } from "@mui/material";

export default function AboutPage() {
    return (
        <>
            <Box sx={{ m: "30px" }}>
                <Box sx={{ my: 2 }}>
                    <Typography variant="h4" textAlign={"center"}>關於此網站</Typography>
                </Box>

                <Box >
                    <Stack sx={{ m: "30px" }} spacing={2}>
                        <Typography variant={"h5"} sx={{ fontWeight: "bold" }}>簡介</Typography>
                        <Typography component={"p"} >
                            這個Demo 線上商店主要是想透過實際的應用場景，展示軟體技術的練習，非商業用途。網站使用前後端分離，以下介紹使用技術
                        </Typography>
                    </Stack>

                    <Stack sx={{ m: "30px" }} spacing={2}>
                        <Typography variant={"h5"} sx={{ fontWeight: "bold" }}>前端</Typography>
                        <Typography component={"p"} sx={{ lineHeight: "40px" }}>

                            1. next.js (page router) : 想要增加SEO和路由開箱即用，商品頁面主要資訊使用SSR，細節資訊使用CSR，實現SEO外也調節服務器資源  <br />
                            2. zustand : 狀態管理，使用持久化中間件，取代localStorage，實現未登錄保留購物車紀錄功能，還有解決localStorage在手機端失效的問題<br />
                            3. Typescript <br />
                            4. UI框架MUI : 統一網站樣式風格
                        </Typography>


                    </Stack>

                    <Stack sx={{ m: "30px" }} spacing={2}>
                        <Typography variant={"h5"} sx={{ fontWeight: "bold" }}>後端</Typography>
                        <Typography component={"p"} sx={{ lineHeight: "40px" }}>
                            1. .Net8 <br />
                            2. Ef Core
                        </Typography>
                    </Stack>

                    <Stack sx={{ m: "30px" }} spacing={2}>
                        <Typography variant={"h5"} sx={{ fontWeight: "bold" }}>中間件</Typography>
                        <Typography component={"p"} sx={{ lineHeight: "40px" }}>
                            1. Redis : 處理用戶保持登陸狀態，、api限流、檢查庫存避免超賣 <br />
                            2. RabbitMQ : 用來模擬支付系統與物流系統服務間解耦、檢查訂單支付狀態，回補redis庫存
                        </Typography>

                    </Stack>

                    <Stack sx={{ m: "30px" }} spacing={2}>
                        <Typography variant={"h5"} sx={{ fontWeight: "bold" }}>資料庫</Typography>
                        <Typography component={"p"} >
                            1. Sqlite : 虛擬機成本關係，所以用Sqlite 作Demo
                        </Typography>
                    </Stack>

                    <Stack sx={{ m: "30px" }} spacing={2}>
                        <Typography variant={"h5"} sx={{ fontWeight: "bold" }}>部屬</Typography>
                        <Typography component={"p"} sx={{ lineHeight: "40px" }}>
                            1. AWS : 使用AWS上面的EC2，作業環境使用Ubuntu，S3 當作圖片服務器<br />
                            2. nginx : 當網站入口<br />
                            3. Docker : 所有服務都是run 在docker 容器內，並使用docker-compose管理，能夠快速部屬<br />
                            4. CI/CD  : 使用Github Action 實現CI/CD，後端通過單元測試後，才會部屬到遠端VM上<br />
                            5. Cloudflare : 使用Cloudflare 作為CDN，加速網站訪問速度，緩存圖片<br />
                        </Typography>
                    </Stack>

                    <Stack sx={{ m: "30px" }} spacing={2}>
                        <Typography variant={"h5"} sx={{ fontWeight: "bold" }}>對接第三方API</Typography>
                        <Typography component={"p"} sx={{ lineHeight: "40px" }}>
                            1. 綠界科技 : 第三方支付測試環境、電子地圖測試環境 <br />
                            2. Google Oauth : 支持使用google openid登入網站
                        </Typography>
                    </Stack>

                    <Stack sx={{ m: "30px" }} spacing={2}>
                        <Typography variant={"h5"} sx={{ fontWeight: "bold" }}>代碼庫網址</Typography>
                        <Typography component={"p"} sx={{ lineHeight: "40px" }}>
                            1. <Link href="https://github.com/austin72905/ecommerce-frontend" target="_blank" rel="noopener noreferrer">前端</Link><br />
                            2. <Link href="https://github.com/austin72905/EcommerceBackend" target="_blank" rel="noopener noreferrer">後端</Link>
                        </Typography>
                    </Stack>

                    

                </Box>



            </Box>




        </>
    );
}