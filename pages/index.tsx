
import { Inter } from "next/font/google";


import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Box, Typography } from "@mui/material";


const inter = Inter({ subsets: ["latin"] });

export default function Home() {

  return (
    <>
      <Box sx={{ textAlign: "center" }}>
        <Box sx={{ my: 2 }}>
          <Typography variant="h4" >Demo商店</Typography>
        </Box>

        <Box sx={{ my: 2 }}>
          {/* <Typography variant="subtitle1" >好男友商店是一個創建於2021年的項目，起初是女友為了向大家證明我是好男友而開立了粉絲專頁，後來陸續開始販售一些相關周邊商品</Typography> */}
          <Typography variant="subtitle1" >Demo 線上商店，以下是介紹</Typography>
        </Box>

      </Box>




    </>
  );
}


function SampleNextArrow(props: any) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, display: "block", right: "10px" }}
      onClick={onClick}
    />
  );
}



function SamplePrevArrow(props: any) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, display: "block", left: 10, zIndex: 1 }}
      onClick={onClick}
    />
  );
}

// 首頁直接跳轉 新品上市
export async function getServerSideProps() {
  return {
    redirect: {
      destination: '/products?tag=new-arrival',
      permanent: true,
    },
  };
}