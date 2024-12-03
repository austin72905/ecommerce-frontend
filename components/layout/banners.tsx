import { Box } from "@mui/material";
import Image from "next/image";
import Slider from "react-slick";
import Banner1 from '/public/images/草寫3.jpg'
import Banner2 from '/public/images/暖男專屬優惠1.jpg'
import Banner3 from '/public/images/熱銷推薦2.jpg'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";


export default function Banners() {

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

    return <>
        <Box sx={{
            mx: {
                md: 2,
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

    </>
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


