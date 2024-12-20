import { ProductInfomationCount } from "@/interfaces";
import { Box, Card, CardActions, CardContent, CardMedia, IconButton, Paper, Stack, styled, Table, TableBody, TableCell, tableCellClasses, TableContainer, TableHead, TableRow, TextField, Typography } from "@mui/material";
import Image from "next/image";

import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { useRouter } from "next/router";

interface TableViewCartContentProps {
    cartContent: ProductInfomationCount[] | never[];
    plusProductCount: (productId: number) => void;
    minusProductCount: (productId: number) => void;
    removeFromCart: (productId: number, variantID: number | undefined) => void;
}

const DefaultScreenCartContent = ({ cartContent, plusProductCount, minusProductCount, removeFromCart }: TableViewCartContentProps) => {


    const router = useRouter()

    const goToProductDetail = (productId: number) => {
        router.push(`/products/${productId}`)
    }

    //console.log("cartContent:",cartContent)

    const showPrice = (item: ProductInfomationCount) => {
        if (item.selectedVariant) {
            if (item.selectedVariant.discountPrice)
                return item.selectedVariant.discountPrice
            else
                return item.selectedVariant.price
        } 

        return 0
    }
    //總計
    const showItemTotalPrice = (item: ProductInfomationCount) => {
        return showPrice(item) * item.count
    }


    //console.log(cartContent)
    if (cartContent.length === 0) {
        return <p style={{ textAlign: "center" }}>購物車內沒有商品</p>
    }


    return (
        <TableContainer component={Paper} sx={{ maxHeight: "540px", border: "1px solid #d9d9d9", boxShadow: 'none' }}>

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
                            <TableRow key={`${item.product.productId}-${item.selectedVariant?.variantID}`}>
                                <TableCell style={{ width: "50%" }} >
                                    <Stack spacing={"20px"} direction={"row"} alignItems="center">
                                        <Box sx={{ my: "5px" }}>
                                            <img src={item.product.coverImg} style={{ width: "130px", height: "150px", padding: 0, margin: 0 }} />
                                        </Box>
                                        <Stack spacing={"2px"}>
                                            <Typography sx={{ '&:hover': { cursor: "pointer" } }} onClick={() => { goToProductDetail(item.product.productId) }}>
                                                {item.product.title}
                                            </Typography>
                                            <Typography variant='caption'>
                                                規格 : {item.selectedVariant ? item.selectedVariant.size : "標準"}
                                            </Typography>
                                            <Typography variant='caption'>
                                                顏色 : {item.selectedVariant ? item.selectedVariant.color : "標準"}
                                            </Typography>
                                        </Stack>


                                    </Stack>

                                </TableCell>
                                <TableCell align='center'>${showPrice(item)}</TableCell>
                                <TableCell align='center'>
                                    {/*數量框 */}
                                    <Box sx={{ display: "flex", border: "0px solid", justifyContent: "center" }}>
                                        <RemoveIcon onClick={() => { minusProductCount(item.product.productId) }} sx={{ ":hover": { cursor: "pointer" }, color: "#AFAFAF", border: "solid 1px", height: "30px", width: "30px", borderTopLeftRadius: "4px", borderBottomLeftRadius: "4px" }} />
                                        <TextFieldWrapper value={item.count} size='small' inputProps={{ style: { textAlign: "center", height: "15px" } }} ></TextFieldWrapper>
                                        <AddIcon onClick={() => { plusProductCount(item.product.productId) }} sx={{ ":hover": { cursor: "pointer" }, color: "#AFAFAF", border: "solid 1px", height: "30px", width: "30px", borderTopRightRadius: "4px", borderBottomRightRadius: "4px" }} />
                                    </Box>
                                </TableCell>
                                <TableCell align='center'>${showItemTotalPrice(item)}</TableCell>
                                <TableCell sx={{ border: "0px solid" }} align='center'>
                                    <Stack sx={{ border: "0px solid" }} alignItems="center">

                                        <IconButton onClick={() => { removeFromCart(item.product.productId, item.selectedVariant?.variantID) }}>
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
    plusProductCount: (productId: number) => void;
    minusProductCount: (productId: number) => void;
    removeFromCart: (productId: number, variantID: number | undefined) => void;
}

const SmallScreenViewCartContent = ({ cartContent, plusProductCount, minusProductCount, removeFromCart }: SmallScreenViewCartContentProps) => {

    if (cartContent.length === 0) {
        return <p style={{ textAlign: "center" }}>購物車內沒有商品</p>
    }


    //console.log("cartContent:",cartContent)
    return (
        <Stack spacing={1}>
            {
                cartContent.length > 0 &&
                cartContent.map((item: ProductInfomationCount, index: number) => (


                    <Card key={`${item.product.productId}-${item.selectedVariant?.variantID}`} sx={{ border: "1px solid #d9d9d9", boxShadow: "none" }}>
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
                                        paddingBottom: '140%',
                                        position: 'relative',
                                    }}
                                >
                                    <Image
                                        src={item.product.coverImg}
                                        alt="product information5"
                                        layout="fill"
                                        style={{ objectFit: 'cover' }}
                                        loading={"eager"}
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
                                            規格 : {item.selectedVariant ? item.selectedVariant.size : "標準"}
                                        </Typography>
                                        <Typography variant='caption'>
                                            顏色 : {item.selectedVariant ? item.selectedVariant.color : "標準"}
                                        </Typography>
                                        {/*價格 */}
                                        <Typography variant='subtitle2' sx={{ mt: 1 }}>
                                            {
                                                item.selectedVariant ?

                                                    item.selectedVariant?.discountPrice ?
                                                        <>
                                                            ${item.selectedVariant.discountPrice}
                                                        </>
                                                        :
                                                        <>
                                                            ${item.selectedVariant?.price}
                                                        </>
                                                    :
                                                    <>
                                                        {
                                                            item.product.discountPrice ?
                                                                <>
                                                                    ${item.product.discountPrice}
                                                                </>
                                                                :
                                                                <>
                                                                    ${item.product.price}
                                                                </>
                                                        }

                                                    </>

                                            }

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

                                    <IconButton onClick={() => { removeFromCart(item.product.productId, item.selectedVariant?.variantID) }}>
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