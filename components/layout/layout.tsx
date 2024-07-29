import { ReactNode } from "react"
import MainHeader from "./main-header";
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { orange } from '@mui/material/colors';

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
    return (
        <ThemeProvider theme={customTheme}>
            <MainHeader />
            <Toolbar />
            <Container>
                {children}
            </Container>

        </ThemeProvider>

    )
}


