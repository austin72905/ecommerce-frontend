/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['lh3.googleusercontent.com','localhost'], // 允許的圖像域名
  },
};

export default nextConfig;
