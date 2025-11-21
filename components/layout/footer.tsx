import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Container from '@mui/material/Container';
import Icon from '@mui/material/Icon';
import Divider from '@mui/material/Divider';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { alpha } from '@mui/material';

export default function Footer() {
  // npm install @svgr/webpack  svg 要另外下載套件

  const instagramImageBlack = '/images/instagram-gray.svg';
  const instagramImage = '/images/Instagram_logo_2016.svg'
  const [instgramIsHover, setInstgramIsHover] = useState(instagramImageBlack)

  return (
    <Box sx={{ 
      mt: 6, 
      background: 'linear-gradient(135deg, #2C3E50 0%, #34495E 50%, #2C3E50 100%)',
      position: 'relative',
      overflow: 'hidden',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '2px',
        background: 'linear-gradient(90deg, transparent 0%, #E67E22 20%, #F39C12 50%, #E67E22 80%, transparent 100%)',
        boxShadow: '0 2px 8px rgba(230, 126, 34, 0.3)'
      },
      '&::after': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'radial-gradient(circle at 30% 20%, rgba(230, 126, 34, 0.1) 0%, transparent 50%)',
        pointerEvents: 'none'
      }
    }}>
      <Container sx={{ py: { xs: 4, sm: 6 }, position: 'relative', zIndex: 1 }}>
        <Container maxWidth='xl'>
          <footer>
            {/* 主要內容區域 */}
            <Box sx={{
              textAlign: 'center',
              mb: { xs: 3, sm: 4 }
            }}>
              {/* 品牌標題 */}
              <Typography 
                variant="h4" 
                sx={{
                  mb: 2,
                  fontWeight: 700,
                  background: 'linear-gradient(45deg, #E67E22, #F39C12, #E67E22)',
                  backgroundSize: '200% auto',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  color: 'transparent',
                  letterSpacing: { xs: 1, sm: 2 },
                  fontSize: { xs: '1.75rem', sm: '2.125rem' },
                  animation: 'gradient 3s ease infinite',
                  '@keyframes gradient': {
                    '0%, 100%': {
                      backgroundPosition: '0% center'
                    },
                    '50%': {
                      backgroundPosition: '100% center'
                    }
                  }
                }}
              >
                DEMO 線上商店
              </Typography>
              
              {/* 品牌描述 */}
              <Typography 
                variant="h6" 
                sx={{
                  color: 'rgba(255,255,255,0.85)',
                  fontWeight: 400,
                  mb: 3,
                  maxWidth: 600,
                  mx: 'auto',
                  lineHeight: 1.7,
                  fontSize: { xs: '0.95rem', sm: '1.25rem' },
                  px: 2
                }}
              >
                致力於為您提供最優質的服飾與最完美的購物體驗
              </Typography>
            </Box>

            {/* 社交媒體和聯繫方式 */}
            <Stack 
              direction="row" 
              alignItems="center" 
              justifyContent="center" 
              spacing={2}
              sx={{ mb: 4 }}
            >
              <Typography 
                variant="h6" 
                sx={{ 
                  color: 'white',
                  fontWeight: 600,
                  fontSize: { xs: '1rem', sm: '1.1rem' }
                }}
              >
                關於我們
              </Typography>
              
              {/* Instagram 漸變按鈕 */}
              <IconButton
                sx={{ 
                  background: 'linear-gradient(45deg, #405DE6, #5851DB, #833AB4, #C13584, #E1306C, #FD1D1D, #F56040, #F77737, #FCAF45, #FFDC80)',
                  width: { xs: 44, sm: 50 },
                  height: { xs: 44, sm: 50 },
                  border: '2px solid transparent',
                  borderRadius: { xs: '12px', sm: '16px' },
                  position: 'relative',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-3px) scale(1.05)',
                    boxShadow: '0 10px 25px rgba(225, 48, 108, 0.4)'
                  },
                  '&:before': {
                    content: '""',
                    position: 'absolute',
                    inset: 0,
                    padding: '2px',
                    background: 'linear-gradient(45deg, #405DE6, #5851DB, #833AB4, #C13584, #E1306C, #FD1D1D)',
                    borderRadius: 'inherit',
                    mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                    maskComposite: 'subtract'
                  }
                }}
                onMouseEnter={() => setInstgramIsHover(instagramImage)}
                onMouseLeave={() => setInstgramIsHover(instagramImageBlack)}
                onTouchStart={() => setInstgramIsHover(instagramImage)}
                onTouchEnd={() => setInstgramIsHover(instagramImageBlack)}
              >
                <Icon sx={{ zIndex: 1 }}>
                  <Image 
                    src={instgramIsHover} 
                    width={28} 
                    height={28} 
                    style={{ 
                      width: "28px", 
                      height: "28px",
                      filter: instgramIsHover === instagramImage ? 'brightness(0) invert(1)' : 'none'
                    }} 
                    alt='instagram' 
                  />
                </Icon>
              </IconButton>
            </Stack>
          </footer>
          
          {/* 裝飾性分隔線 */}
          <Box sx={{
            height: '1px',
            background: 'linear-gradient(90deg, transparent 0%, rgba(230, 126, 34, 0.3) 20%, rgba(230, 126, 34, 0.6) 50%, rgba(230, 126, 34, 0.3) 80%, transparent 100%)',
            mb: { xs: 2, sm: 3 },
            boxShadow: '0 1px 3px rgba(230, 126, 34, 0.2)'
          }} />
          
          <footer>
            {/* 版權資訊 */}
            <Stack 
              direction={{ xs: "column", sm: "row" }} 
              justifyContent="center" 
              alignItems="center"
              spacing={{ xs: 1, sm: 2 }}
              sx={{ mb: { xs: 2, sm: 3 } }}
            >
              <Stack 
                direction="row" 
                alignItems="center" 
                spacing={1}
                flexWrap="wrap"
                justifyContent="center"
              >
                <Typography 
                  sx={{ 
                    color: "rgba(255,255,255,0.75)", 
                    fontWeight: 500,
                    fontSize: { xs: '0.85rem', sm: '0.9rem' }
                  }}
                >
                  © 2023
                </Typography>
                <Typography 
                  sx={{ 
                    color: "#E67E22", 
                    fontWeight: 700,
                    fontSize: { xs: '0.85rem', sm: '0.9rem' },
                    textShadow: '0 0 10px rgba(230, 126, 34, 0.3)'
                  }}
                >
                  DEMO Shop
                </Typography>
                <Typography 
                  sx={{ 
                    color: "rgba(255,255,255,0.75)", 
                    fontWeight: 500,
                    fontSize: { xs: '0.85rem', sm: '0.9rem' }
                  }}
                >
                  All Rights Reserved.
                </Typography>
              </Stack>
            </Stack>
            
            {/* 政策連結 */}
            <Stack 
              direction="row" 
              justifyContent="center" 
              spacing={{ xs: 2, sm: 3 }}
              sx={{ mb: 2 }}
            >
              <Link href={"/privacy-policy"}>
                <Typography 
                  variant="body2"
                  sx={{
                    color: 'rgba(255,255,255,0.75)',
                    textDecoration: 'none',
                    transition: 'all 0.3s ease',
                    fontSize: { xs: '0.85rem', sm: '0.9rem' },
                    position: 'relative',
                    '&:hover': {
                      color: '#E67E22',
                      textDecoration: 'underline',
                      transform: 'translateY(-1px)'
                    },
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      bottom: -2,
                      left: 0,
                      width: 0,
                      height: '2px',
                      background: '#E67E22',
                      transition: 'width 0.3s ease'
                    },
                    '&:hover::after': {
                      width: '100%'
                    }
                  }}
                >
                  隱私權政策
                </Typography>
              </Link>
            </Stack>

            {/* 底部裝飾 */}
            <Box sx={{
              height: { xs: 40, sm: 60 },
              background: 'linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.15) 50%, rgba(0,0,0,0.3) 100%)',
              mx: { xs: -2, sm: -6 },
              mt: 3,
              borderTop: '1px solid rgba(255,255,255,0.08)',
              position: 'relative',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: '50%',
                transform: 'translateX(-50%)',
                width: '60%',
                height: '1px',
                background: 'linear-gradient(90deg, transparent, rgba(230, 126, 34, 0.3), transparent)'
              }
            }} />
          </footer>
        </Container>
      </Container>
    </Box>
  )
}