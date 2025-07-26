import { Box, Typography, Button, Container, alpha, IconButton } from "@mui/material";
import Image from "next/image";
import Slider from "react-slick";
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";
import Banner1 from '/public/images/草寫3.jpg'
import Banner2 from '/public/images/暖男專屬優惠1.jpg'
import Banner3 from '/public/images/熱銷推薦2.jpg'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

interface BannerSlide {
    image: any;
    title: string;
    subtitle: string;
    description: string;
    ctaText: string;
    ctaLink: string;
}

const bannerData: BannerSlide[] = [
    {
        image: Banner1,
        title: "新季時尚",
        subtitle: "探索最新服飾系列",
        description: "精選優質面料，展現個人風格",
        ctaText: "立即瀏覽",
        ctaLink: "/products?tag=new-arrival"
    },
    {
        image: Banner2,
        title: "暖男專屬優惠",
        subtitle: "限時特價活動",
        description: "精選男裝系列，溫暖你的每一天",
        ctaText: "搶購優惠",
        ctaLink: "/products?tag=discount"
    },
    {
        image: Banner3,
        title: "熱銷推薦",
        subtitle: "人氣商品精選",
        description: "最受歡迎的商品，不容錯過",
        ctaText: "查看詳情",
        ctaLink: "/products?tag=popular"
    }
];

export default function Banners() {

    const settings = {
        dots: true,
        infinite: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 5000,
        pauseOnHover: true,
        fade: true, // 淡入淡出動畫
        speed: 800,
        nextArrow: <ModernNextArrow />,
        prevArrow: <ModernPrevArrow />,
        appendDots: (dots: any) => (
            <div
                style={{
                    position: 'absolute',
                    bottom: '20px',
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    zIndex: 2
                }}
            >
                <ul 
                    style={{ 
                        margin: '0px',
                        display: 'flex',
                        gap: '12px',
                        listStyle: 'none',
                        padding: 0
                    }}
                >
                    {dots}
                </ul>
            </div>
        ),
        customPaging: (i: number) => (
            <div
                style={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(255, 255, 255, 0.5)',
                    border: '2px solid rgba(255, 255, 255, 0.8)',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                }}
            />
        )
    };

    return (
        <Box sx={{
            mx: {
                md: 2,
                sm: 0,
                xs: 0
            },
            mb: 4,
            borderRadius: 3,
            overflow: 'hidden',
            position: 'relative',
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
        }}>
            <Slider {...settings}>
                {bannerData.map((slide, index) => (
                    <Box key={index} sx={{ position: 'relative', height: { xs: '300px', sm: '400px', md: '500px' } }}>
                        {/* 背景圖片 */}
                        <Box sx={{ 
                            position: 'relative', 
                            width: '100%', 
                            height: '100%',
                            overflow: 'hidden'
                        }}>
                            <Image 
                                src={slide.image} 
                                alt={slide.title}
                                fill
                                style={{ 
                                    objectFit: 'cover',
                                    filter: 'brightness(0.7)'
                                }}
                                priority={index === 0}
                            />
                        </Box>
                        
                        {/* 漸變覆蓋層 */}
                        <Box sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: 'linear-gradient(135deg, rgba(44, 62, 80, 0.8) 0%, rgba(52, 73, 94, 0.6) 50%, rgba(230, 126, 34, 0.4) 100%)',
                            zIndex: 1
                        }} />
                        
                        {/* 內容覆蓋層 */}
                        <Container sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            display: 'flex',
                            alignItems: 'center',
                            zIndex: 2,
                            px: { xs: 3, sm: 4, md: 6 }
                        }}>
                            <Box sx={{
                                maxWidth: { xs: '100%', md: '50%' },
                                color: 'white',
                                textAlign: { xs: 'center', md: 'left' }
                            }}>
                                <Typography 
                                    variant="overline" 
                                    sx={{
                                        fontSize: { xs: '0.8rem', sm: '0.9rem' },
                                        fontWeight: 600,
                                        letterSpacing: 2,
                                        color: '#E67E22',
                                        mb: 1,
                                        display: 'block'
                                    }}
                                >
                                    {slide.subtitle}
                                </Typography>
                                
                                <Typography 
                                    variant="h2" 
                                    sx={{
                                        fontSize: { xs: '2rem', sm: '2.5rem', md: '3.5rem' },
                                        fontWeight: 700,
                                        mb: 2,
                                        lineHeight: 1.2,
                                        textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
                                    }}
                                >
                                    {slide.title}
                                </Typography>
                                
                                <Typography 
                                    variant="h6" 
                                    sx={{
                                        fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' },
                                        fontWeight: 400,
                                        mb: 4,
                                        opacity: 0.9,
                                        lineHeight: 1.5
                                    }}
                                >
                                    {slide.description}
                                </Typography>
                                
                                <Button
                                    variant="contained"
                                    size="large"
                                    sx={{
                                        backgroundColor: '#E67E22',
                                        color: 'white',
                                        px: 4,
                                        py: 1.5,
                                        fontSize: '1.1rem',
                                        fontWeight: 600,
                                        borderRadius: 3,
                                        textTransform: 'none',
                                        boxShadow: '0 8px 25px rgba(230, 126, 34, 0.4)',
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            backgroundColor: '#D35400',
                                            transform: 'translateY(-2px)',
                                            boxShadow: '0 12px 30px rgba(230, 126, 34, 0.5)'
                                        }
                                    }}
                                    onClick={() => window.location.href = slide.ctaLink}
                                >
                                    {slide.ctaText}
                                </Button>
                            </Box>
                        </Container>
                    </Box>
                ))}
            </Slider>
            
            {/* 自定義 CSS 覆蓋 */}
            <style jsx global>{`
                .slick-dots li button:before {
                    display: none;
                }
                .slick-dots li {
                    margin: 0 4px;
                }
                .slick-dots li div {
                    background-color: rgba(255, 255, 255, 0.5) !important;
                    border: 2px solid rgba(255, 255, 255, 0.8) !important;
                    transition: all 0.3s ease !important;
                }
                .slick-dots li.slick-active div {
                    background-color: #E67E22 !important;
                    border-color: #E67E22 !important;
                    transform: scale(1.2);
                }
            `}</style>
        </Box>
    );
}

// 現代化導航箭頭
function ModernNextArrow(props: any) {
    const { onClick } = props;
    return (
        <IconButton
            onClick={onClick}
            sx={{
                position: 'absolute',
                right: '20px',
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 2,
                backgroundColor: alpha('#FFFFFF', 0.9),
                backdropFilter: 'blur(10px)',
                color: '#2C3E50',
                width: 50,
                height: 50,
                transition: 'all 0.3s ease',
                '&:hover': {
                    backgroundColor: '#E67E22',
                    color: 'white',
                    transform: 'translateY(-50%) scale(1.1)'
                }
            }}
        >
            <ArrowForwardIos />
        </IconButton>
    );
}

function ModernPrevArrow(props: any) {
    const { onClick } = props;
    return (
        <IconButton
            onClick={onClick}
            sx={{
                position: 'absolute',
                left: '20px',
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 2,
                backgroundColor: alpha('#FFFFFF', 0.9),
                backdropFilter: 'blur(10px)',
                color: '#2C3E50',
                width: 50,
                height: 50,
                transition: 'all 0.3s ease',
                '&:hover': {
                    backgroundColor: '#E67E22',
                    color: 'white',
                    transform: 'translateY(-50%) scale(1.1)'
                }
            }}
        >
            <ArrowBackIos />
        </IconButton>
    );
}


