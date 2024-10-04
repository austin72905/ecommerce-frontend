import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req:NextApiRequest, res:NextApiResponse) {
    
    if (req.method === 'POST') {
      // 從 POST 請求中獲取參數
      const { LogisticsSubType,CVSStoreName, CVSAddress } = req.body;
  
      // 在這裡處理邏輯，如保存數據到數據庫等
      //console.log('Received POST data:', LogisticsSubType,CVSStoreName, CVSAddress);
  

        // http://localhost:3000 之後可以去掉，因為ngrok 關係，重定向會跑到ngrok domain 而不是3000
      res.redirect(302,`http://localhost:3000/checkout?LogisticsSubType=${LogisticsSubType}&CVSStoreName=${encodeURIComponent(CVSStoreName)}&CVSAddress=${encodeURIComponent(CVSAddress)}`)
    } else {
      // 如果請求方法不是 POST，返回 405 錯誤
      res.status(405).end(); // Method Not Allowed
    }
  }