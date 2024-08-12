import { ProductInfomationCount } from "@/interfaces";
import { Box, Card, CardActions, CardContent, CardMedia, IconButton, Paper, Stack, styled, Table, TableBody, TableCell, tableCellClasses, TableContainer, TableHead, TableRow, TextField, Typography } from "@mui/material";
import Image from "next/image";

import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { useRouter } from "next/router";

interface TableViewCartContentProps {
    cartContent: ProductInfomationCount[] | never[];
    plusProductCount: (productId: string) => void;
    minusProductCount: (productId: string) => void;
    removeFromCart: (productId: string) => void;
}

const DefaultScreenCartContent = ({ cartContent, plusProductCount, minusProductCount, removeFromCart }: TableViewCartContentProps) => {
    //console.log(cartContent)
    if (cartContent.length === 0) {
        return <p style={{textAlign:"center"}}>購物車內沒有商品</p>
    }

    const router = useRouter()

    const goToProductDetail = (productId: string) => {
        router.push(`/products/${productId}`)
    }


    return (
        <TableContainer component={Paper} sx={{ maxHeight: "480px", border: "1px solid #d9d9d9", boxShadow: 'none' }}>

            <Table stickyHeader size="small">
                <TableHead>
                    <TableRow>
                        <StyledTableCell style={{ width: "50%" }}>
                            <Typography variant='body2' sx={{ fontWeight: "bold" }}>商品</Typography>

                        </StyledTableCell>
                        <StyledTableCell align='center'>
                            <Typography variant='body2' sx={{ fontWeight: "bold" }}>價格</Typography>
                        </StyledTableCell>
                        <StyledTableCell align='center'>
                            <Typography variant='body2' sx={{ fontWeight: "bold" }}>數量</Typography>
                        </StyledTableCell>
                        <StyledTableCell align='center'>
                            <Typography variant='body2' sx={{ fontWeight: "bold" }}>總計</Typography>
                        </StyledTableCell>
                        <StyledTableCell align='center'></StyledTableCell>

                    </TableRow>
                </TableHead>
                <TableBody>
                    {
                        cartContent.length > 0 &&
                        cartContent.map((item: ProductInfomationCount, index: number) =>
                        (
                            <TableRow key={index}>
                                <TableCell style={{ width: "50%" }} >
                                    <Stack spacing={"20px"} direction={"row"} alignItems="center">
                                        <Box sx={{ my: "5px" }}>
                                            <img src={item.product.coverImg.src} style={{ width: "100px", height: "100px", padding: 0, margin: 0 }} />
                                        </Box>
                                        <Stack spacing={"2px"}>
                                            <Typography  sx={{ '&:hover': { cursor: "pointer" } }} onClick={()=>{goToProductDetail(item.product.productId)}}>
                                                {item.product.title}
                                            </Typography>
                                            <Typography variant='caption'>
                                                規格 : {item.product.selectSize ? item.product.selectSize : "標準"}
                                            </Typography>
                                            <Typography variant='caption'>
                                                顏色 : {item.product.selectColor ? item.product.selectColor : "標準"}
                                            </Typography>
                                        </Stack>


                                    </Stack>

                                </TableCell>
                                <TableCell align='center'>${item.product.price}</TableCell>
                                <TableCell align='center'>
                                    {/*數量框 */}
                                    <Box sx={{ display: "flex",  border: "0px solid",justifyContent:"center" }}>
                                        <RemoveIcon onClick={() => { minusProductCount(item.product.productId) }} sx={{ ":hover": { cursor: "pointer" }, color: "#AFAFAF", border: "solid 1px", height: "30px", width: "30px", borderTopLeftRadius: "4px", borderBottomLeftRadius: "4px" }} />
                                        <TextFieldWrapper value={item.count} size='small' inputProps={{ style: { textAlign: "center", height: "15px" } }} ></TextFieldWrapper>
                                        <AddIcon onClick={() => { plusProductCount(item.product.productId) }} sx={{ ":hover": { cursor: "pointer" }, color: "#AFAFAF", border: "solid 1px", height: "30px", width: "30px", borderTopRightRadius: "4px", borderBottomRightRadius: "4px" }} />
                                    </Box>
                                </TableCell>
                                <TableCell align='center'>${item.product.price * item.count}</TableCell>
                                <TableCell sx={{ border: "0px solid" }} align='center'>
                                    <Stack sx={{ border: "0px solid" }} alignItems="center">

                                        <IconButton onClick={() => { removeFromCart(item.product.productId) }}>
                                            <DeleteOutlineOutlinedIcon />
                                        </IconButton>
                                    </Stack>
                                </TableCell>
                            </TableRow>

                        ))
                    }

                </TableBody>
            </Table>
        </TableContainer >
    )
}

interface SmallScreenViewCartContentProps {
    cartContent: ProductInfomationCount[] | never[];
    plusProductCount: (productId: string) => void;
    minusProductCount: (productId: string) => void;
    removeFromCart: (productId: string) => void;
}

const SmallScreenViewCartContent = ({ cartContent, plusProductCount, minusProductCount, removeFromCart }: SmallScreenViewCartContentProps) => {
    
    if (cartContent.length === 0) {
        return <p style={{textAlign:"center"}}>購物車內沒有商品</p>
    }
    return (
        <Stack spacing={1}>
            {
                cartContent.length > 0 &&
                cartContent.map((item: ProductInfomationCount, index: number) => (


                    <Card key={index} sx={{ border: "1px solid #d9d9d9", boxShadow: "none" }}>
                        <Stack direction={"row"} spacing={1} sx={{ border: "0px solid black" }}>

                            <CardMedia
                                sx={{
                                    position: 'relative',
                                    width: '100%',
                                    height: '100%',
                                    maxWidth: '130px',
                                    border: '0px solid black',
                                    overflow: 'hidden',
                                }}
                            >
                                <Box
                                    sx={{
                                        width: '100%',
                                        height: 0,
                                        paddingBottom: '120%',
                                        position: 'relative',
                                    }}
                                >
                                    <Image
                                        src={item.product.coverImg}
                                        alt="product information5"
                                        layout="fill"
                                        style={{ objectFit: 'cover' }}
                                    />
                                </Box>
                            </CardMedia>
                            <Stack flexGrow={1} sx={{ border: "0px solid black" }}>
                                <CardContent >
                                    <Stack>
                                        <Typography >
                                            {item.product.title}
                                        </Typography>
                                        <Typography variant='caption'>
                                            規格 : {item.product.selectSize ? item.product.selectSize : "標準"}
                                        </Typography>
                                        <Typography variant='caption'>
                                            顏色 : {item.product.selectColor ? item.product.selectColor : "標準"}
                                        </Typography>
                                    </Stack>

                                </CardContent>
                                <CardActions sx={{ justifyContent: "space-between" }}>

                                    {/*數量框 */}
                                    <Box sx={{ display: "flex", border: "0px solid", alignItems: "center" }}>
                                        <RemoveIcon onClick={() => { minusProductCount(item.product.productId) }} sx={{ ":hover": { cursor: "pointer" }, color: "#AFAFAF", border: "solid 1px", height: "25px", width: "25px", borderTopLeftRadius: "4px", borderBottomLeftRadius: "4px" }} />
                                        <TextFieldWrapper value={item.count} size='small' inputProps={{ style: { textAlign: "center" } }} ></TextFieldWrapper>
                                        <AddIcon onClick={() => { plusProductCount(item.product.productId) }} sx={{ ":hover": { cursor: "pointer" }, color: "#AFAFAF", border: "solid 1px", height: "25px", width: "25px", borderTopRightRadius: "4px", borderBottomRightRadius: "4px" }} />
                                    </Box>

                                    <IconButton onClick={() => { removeFromCart(item.product.productId) }}>
                                        <DeleteOutlineOutlinedIcon />
                                    </IconButton>
                                </CardActions>


                            </Stack>


                        </Stack>
                    </Card>


                ))
            }
        </Stack>

    )
}

export { DefaultScreenCartContent, SmallScreenViewCartContent }




const TextFieldWrapper = styled(TextField)(
    {
        /*修改 focus 時外框的顏色  */
        "& .MuiOutlinedInput-root.Mui-focused": {
            "& > fieldset": {
                borderColor: "white",

            }
        },
        /*修改外框的弧度 */
        '& fieldset': { borderRadius: "0px" },
        maxWidth: "70px",
        '& .MuiOutlinedInput-root': {
            '& fieldset': {
                border: 'none',
            }
        },

    })

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: "#d9d9d9",
    }

}));