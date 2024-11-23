import { ApiResponse } from "@/interfaces/api/response";
import type { NextApiRequest, NextApiResponse } from "next";

export default async  function handler(req: NextApiRequest, res: NextApiResponse) {

    if (req.method === 'POST') {
        // 使用 req.body 直接作為轉發的數據
        const data = req.body as Data;

        console.log("reqBody:",data)

        // 將 Data 對象轉換為 URLSearchParams 格式
        const formData = new URLSearchParams();
        Object.entries(data).forEach(([key, value]) => {
            formData.append(key, value.toString());
        });

        const apiUrl =process.env.NEXT_PUBLIC_BACKEND_URL

        try {
            // 發送 POST 請求到目標 URL
            const response = await fetch(`${apiUrl}/Payment/ECPayReturn`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded", // 使用 form-data 格式
                },
                body: formData.toString(),
            });

            // 確認請求是否成功
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // 解析返回的結果
            const result = await response.json() as ApiResponse;
            console.log("api from return:",result)
            // 將結果返回給前端
            res.status(200).json(result.data);

        } catch (error) {
            console.error("Error sending data:", error);
            res.status(500).json({ message: "Error sending data" });
        }
        
    } else {
        // 如果請求方法不是 POST，返回 405 錯誤
        res.status(405).end(); // Method Not Allowed
    }
}


type Data = {
    MerchantTradeNo: string;
    MerchantID: string;
    RtnCode: number;
    RtnMsg: string;
    TradeNo: string;
    TradeAmt: number;
    PaymentDate: string;
    PaymentType: string;
    PaymentTypeChargeFee: string;
    PlatformID: string;
    TradeDate: string;
    SimulatePaid: string;
    CheckMacValue: string;
};

