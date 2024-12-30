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


const customTheme = createTheme({
    palette: {
        primary: {
            main: "#61D1BD",
            contrastText: "white"
        },
        secondary: {
            main: orange[500]
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
            <MainHeader />
            <Toolbar />
            <Box sx={{ minHeight: "80vh" }}>
                <Container sx={{
                    px: {
                        md: 5,
                        sm: 0,
                        xs: 0
                    }
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
        </ThemeProvider>

    )
}


