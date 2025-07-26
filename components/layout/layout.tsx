import { ReactNode, useEffect } from "react"
import MainHeader from "./main-header";
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { orange } from '@mui/material/colors';
import Footer from "./footer";
import { Box } from "@mui/material";
import GoToTopButton from "./speed-dial-group";
import AlertMsg from "../msg/alert-msg";
import AlertErrorMsg from "../msg/alert-error-msg";
import Banners from "./banners";
import { useRouter } from "next/router";
import NotifyModal from "../notify/notify-modal";
import { useFirstVisitProductPageStore } from "@/store/store";

interface LayoutProps {
    children: ReactNode
}

// 現代化主題配色方案
const customTheme = createTheme({
    palette: {
        primary: {
            main: "#2C3E50", // 深藍灰色主色調
            contrastText: "white"
        },
        secondary: {
            main: "#E67E22", // 溫暖橙色強調色
            contrastText: "white"
        },
        background: {
            default: "#FAFAFA", // 清新白色背景
            paper: "#FFFFFF"
        }
    },
    typography: {
        fontFamily: [
            '"Noto Sans TC"',
            '"PingFang TC"',
            '"Microsoft JhengHei"',
            'Arial',
            'sans-serif'
        ].join(','),
        h1: {
            fontWeight: 700,
            letterSpacing: '0.02em'
        },
        h2: {
            fontWeight: 600,
            letterSpacing: '0.01em'
        },
        h3: {
            fontWeight: 600
        },
        h4: {
            fontWeight: 500
        },
        h5: {
            fontWeight: 500
        },
        h6: {
            fontWeight: 500
        }
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 12,
                    textTransform: 'none',
                    fontWeight: 500,
                    padding: '10px 24px',
                    transition: 'all 0.3s ease-in-out',
                    '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
                    }
                }
            }
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 16,
                    transition: 'all 0.3s ease-in-out',
                    '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.12)'
                    }
                }
            }
        }
    }
})

export default function Layout({ children }: LayoutProps) {


    const hasVisited=useFirstVisitProductPageStore((state) => state.hasVisited);
    const sethasVisited=useFirstVisitProductPageStore((state) => state.sethasVisited);

    const handleScrollTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    }

    const router=useRouter()



    return (
        <ThemeProvider theme={customTheme}>
            <Box sx={{ backgroundColor: 'background.default', minHeight: '100vh' }}>
                <MainHeader />
                <Toolbar />
                <Box sx={{ minHeight: "80vh" }}>
                    <Container sx={{
                        px: {
                            md: 5,
                            sm: 2,
                            xs: 1
                        },
                        py: 3
                    }}>
                        {router.pathname==="/products" && <Banners />  }
                        
                        {children}
                    </Container>
                </Box>
                { !hasVisited  && <NotifyModal/>}
                
                <GoToTopButton handleScrollTop={handleScrollTop} />
                
                <AlertMsg />
                <AlertErrorMsg />

                <Footer />
            </Box>
        </ThemeProvider>

    )
}


