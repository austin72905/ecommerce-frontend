/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https', // 協議
        hostname: 'lh3.googleusercontent.com', // 允許的域名
      },
      {
        protocol: 'http', // 協議，根據你的使用情況選擇
        hostname: 'localhost', // 允許本地測試圖片
      },
      {
        protocol: 'https', // 協議
        hostname: 'ponggoodbf.com', // 你的圖片服務器域名
      },
    ],
  },
};

export default nextConfig;
