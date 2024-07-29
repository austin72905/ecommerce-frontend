import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";

import Slider from "react-slick";
import Banner1 from '/public/images/草寫3.jpg'
import Banner2 from '/public/images/暖男專屬優惠1.jpg'
import Banner3 from '/public/images/熱銷推薦2.jpg'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Box, Typography } from "@mui/material";
import Container from '@mui/material/Container';


const inter = Inter({ subsets: ["latin"] });

export default function Home() {


  const settings = {
    dots: true,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    pauseOnHover: true,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
    appendDots: (dots: any) => (
      <div
        style={{
          position: 'absolute',
          bottom: '15px',
          width: '100%',
          display: 'flex',
          justifyContent: 'center'
        }}
      >
        <ul style={{ margin: '0px' }}>{dots}</ul>
      </div>
    )



  }

  return (
    <>


      <Box sx={{
        mx: {
          md: 5,
          sm: 0,
          xs: 0
        }
      }}>
        <Slider {...settings}>
          <Image src={Banner1} alt="banner" />
          <Image src={Banner2} alt="banner" />
          <Image src={Banner3} alt="banner" />

        </Slider>
      </Box>


      <Box sx={{ textAlign: "center" }}>
        <Box sx={{ my: 2 }}>
          <Typography variant="h4" >好男友商店</Typography>
        </Box>

        <Box sx={{ my: 2 }}>
          <Typography variant="subtitle1" >好男友商店是一個創建於2021年的項目，起初是女友為了向大家證明我是好男友而開立了粉絲專頁，後來陸續開始販售一些相關周邊商品</Typography>
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


