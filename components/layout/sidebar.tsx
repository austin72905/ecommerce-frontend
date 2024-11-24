import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { Collapse, Drawer, IconButton, List, ListItemButton, ListItemText, Stack, SxProps, Theme } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import Link from "next/link";
import { Fragment, useState } from "react";
import NavLink from "../navLink";
import { routes } from "@/routes/routes";
import { UrlObject } from "url";

function SideNavBar({ open, setOpen }: SideNavBarProps) {


    return (
        <Drawer
            PaperProps={{
                sx: { backgroundColor: "#61D1BD" }
            }}
            open={open} onClose={() => setOpen(false)}>
            <Stack direction="row-reverse">
                <IconButton disableRipple onClick={() => setOpen(false)}>
                    <CloseIcon sx={{ color: "white" }} />
                </IconButton>
            </Stack>
            <nav>
                <List sx={{ width: "200px" }}>

                    {routes.map((route,index) => (
                        <Fragment key={index}>
                            {route.nestedRoute && (
                                <NestedLink
                                    href={route.nestedRoute.href}
                                    title={route.nestedRoute.title}
                                    setOpen={setOpen}
                                >
                                    {route.innerRoutes && route.innerRoutes.map((innerRoute) => (
                                        <NavLink
                                            href={innerRoute.href}
                                            setOpen={setOpen}
                                            sx={{ pl: 4 }}
                                            key={innerRoute.title}
                                        >
                                            {innerRoute.title}
                                        </NavLink>
                                    ))}

                                </NestedLink>

                            )}

                            {route.singleRoute && (
                                <NavLink
                                    href={route.singleRoute.href}
                                    setOpen={setOpen}
                                    key={route.singleRoute.title}
                                >
                                    {route.singleRoute.title}
                                </NavLink>
                            )}
                        </Fragment>

                    ))}

                </List>
            </nav>

        </Drawer>
    )
}

const useOpenState = (initState = false) => {
    const [open, setOpen] = useState<boolean>(initState)

    // typescript 編譯時會把他當作  字面量
    return [open, setOpen] as const;
}

interface SideNavBarProps {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
}


interface NestedLinkProps {
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    title: string;
    href: string | UrlObject;
    sx?: SxProps<Theme>;
    children?: React.ReactNode;
}

const NestedLink = ({ setOpen, children, title, href, sx }: NestedLinkProps) => {


    const [expandOpen, setExpandOpen] = useState<boolean>(false)

    const handleExpandClick = () => {
        setExpandOpen(op => {
            return !op
        });
    };

    return (
        <>
            <ListItemButton sx={{ ...sx }} disableRipple onClick={handleExpandClick}>
                <ListItemText
                    sx={{ color: "white" }}
                    primary={
                        <Link
                            passHref
                            href={href}
                            style={{ color: 'inherit', textDecoration: "none" }}
                            onClick={() => setOpen(false)}>
                            {title}
                        </Link>
                    } />

                {expandOpen ? <ExpandLess sx={{ color: "white" }} /> : <ExpandMore sx={{ color: "white" }} />}
            </ListItemButton >
            {/*內層 nav */}
            <Collapse in={expandOpen} timeout="auto" unmountOnExit>
                <List >
                    {children}
                </List>
            </Collapse>
        </>
    )
}

/*
    <NestedLink href>  -- NavLink + 可以展開 + 本身就有功能
        <Collapse>
            <NavLink href/>
        <Collapse>
    </NestedLink>
    

    [
        {nestedHref:"",hrefs:[ href href]}
        
    ]
  
 */





export default SideNavBar;

export { useOpenState }





// #region 備用代碼

// <NestedLink
//     href={{
//         pathname: "/products",
//         query: { kind: "pants" }
//     }}
//     title="褲子"
//     setOpen={setOpen}
// >
//     <NavLink
//         href={{
//             pathname: "/products",
//             query: { tag: "jeans" }
//         }}
//         setOpen={setOpen}
//         sx={{ pl: 4 }}
//     >
//         牛仔褲
//     </NavLink>
//     <NavLink
//         href={{
//             pathname: "/products",
//             query: { tag: "shorts" }
//         }}
//         setOpen={setOpen}
//         sx={{ pl: 4 }}
//     >
//         短褲
//     </NavLink>
// </NestedLink>


// <NestedLink
//     href={{
//         pathname: "/products",
//         query: { kind: "coats" }
//     }}
//     title="外套"
//     setOpen={setOpen}
// >
//     <NavLink
//         href={{
//             pathname: "/products",
//             query: { tag: "windcoat" }
//         }}
//         setOpen={setOpen}
//         sx={{ pl: 4 }}
//     >
//         風衣
//     </NavLink>
//     <NavLink
//         href={{
//             pathname: "/products",
//             query: { tag: "knitting" }
//         }}
//         setOpen={setOpen}
//         sx={{ pl: 4 }}
//     >
//         針織
//     </NavLink>

// </NestedLink>



// {/*單一層 */}
// <Link passHref href={{
//     pathname: "/products",
//     query: { tag: "accessories" }
// }}
//     style={{ color: 'inherit', textDecoration: "none" }}>
//     <ListItemButton disableRipple onClick={() => setOpen(false)}>
//         <ListItemText sx={{ color: "white" }} primary={
//             "配件"
//         } />


//     </ListItemButton >
// </Link>

// <Link passHref href={{
//     pathname: "/products",
//     query: { tag: "new-arrival" }
// }}
//     style={{ color: 'inherit', textDecoration: "none" }}>
//     <ListItemButton disableRipple onClick={() => setOpen(false)}>
//         <ListItemText sx={{ color: "white" }} primary={
//             "新品上市"
//         } />


//     </ListItemButton >
// </Link>

// <Link passHref href={{
//     pathname: "/products",
//     query: { tag: "limit-time-offer" }
// }}
//     style={{ color: 'inherit', textDecoration: "none" }}>
//     <ListItemButton disableRipple onClick={() => setOpen(false)}>
//         <ListItemText sx={{ color: "white" }} primary={
//             "本月優惠"
//         } />


//     </ListItemButton >
// </Link>


// #endregion



//#region
// {/*有分類的， btn 包 text 包lnk */}
// <ListItemButton disableRipple onClick={handleTopClick}>

// <ListItemText
//     sx={{ color: "white" }}
//     primary={
//         <Link
//             passHref
//             href={{
//                 pathname: "/products",
//                 query: { kind: "clothes" }

//             }}
//             style={{ color: 'inherit', textDecoration: "none" }}
//             onClick={() => setOpen(false)}>
//             上衣
//         </Link>
//     } />

// {topOpen ? <ExpandLess sx={{ color: "white" }} /> : <ExpandMore sx={{ color: "white" }} />}



// </ListItemButton >


// <Collapse in={topOpen} timeout="auto" unmountOnExit>
// <List>

//     <Link passHref href={{
//         pathname: "/products",
//         query: { tag: "shirt" }
//     }}
//         style={{ color: 'inherit', textDecoration: "none" }}>
//         <ListItemButton sx={{ pl: 4 }} disableRipple onClick={() => setOpen(false)}>
//             <ListItemText sx={{ color: "white" }} primary={
//                 "襯衫"
//             } />

//         </ListItemButton >
//     </Link>

//     <Link passHref href={{
//         pathname: "/products",
//         query: { tag: "t-shirt" }
//     }}
//         style={{ color: 'inherit', textDecoration: "none" }}>
//         <ListItemButton sx={{ pl: 4 }} disableRipple onClick={() => setOpen(false)}>
//             <ListItemText sx={{ color: "white" }} primary={
//                 "T恤"
//             } />

//         </ListItemButton >
//     </Link>
// </List>
// </Collapse>
//#endregion