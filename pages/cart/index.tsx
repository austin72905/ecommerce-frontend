import React, { useState, useContext } from 'react'
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import styled from '@mui/system/styled';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import IconButton from '@mui/material/IconButton';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';



import ProductImage from '../../assets/朋朋衛生紙商品圖.jpg'
import { useRouter } from 'next/router';
import { useCartStore } from '@/store/store';
import { it } from 'node:test';
import { ProductInfomationCount } from '@/interfaces';

export default function Cart() {

    const router = useRouter();

    const toCheckout = () => {
        router.push("/checkout")
    }

    const cartContent =useCartStore((state)=>state.cartContent)

    const removeFromCart=useCartStore((state)=>state.removeFromCart)
    
    const plusProductCount=useCartStore((state)=>state.plusProductCount)
    
    const minusProductCount=useCartStore((state)=>state.minusProductCount)

    const countTotalPrice=useCartStore((state)=>state.countTotalPrice)
    

    const addToCheckOutList=()=>{
        //setCheckOutContent([...cartContent])
        //setCartContent([])
        toCheckout()
    }

    // const addProductCount = (product: ProductInfomation) => {
    //     //console.log("product",product)
    //     setCartContent((prev: ProductInfomationCount[]) => {

    //         let newList = prev.map(ele => {

    //             if (ele.productId === product.productId && ele.selectSize === product.selectSize) {

    //                 if (ele.count + 1 > 10) {
    //                     ele.count = 10
    //                 } else {
    //                     ele.count += 1;
    //                 }

    //             }
    //             //console.log("ele.count",ele.count)
    //             return ele
    //         })

    //         //console.log("prev",prev)
    //         return newList
    //     })
    // }

    // const minusProductCount = (product: ProductInfomation) => {
    //     //console.log("product",product)
    //     setCartContent((prev: ProductInfomationCount[]) => {
    //         prev.forEach(ele => {

    //             if (ele.productId === product.productId && ele.selectSize === product.selectSize) {

    //                 if (ele.count - 1 < 1) {
    //                     ele.count = 1
    //                 } else {
    //                     ele.count -= 1
    //                 }


    //             }
    //             //console.log("ele.count",ele.count)
    //             return ele
    //         })

    //         return [...prev]
    //     })
    // }

    // const countTotalPirce = () => {
    //     let totalPrice: number = 0
    //     cartContent.forEach((element: ProductInfomationCount) => {
    //         totalPrice += element.price * element.count
    //     });
    //     return totalPrice
    // }

    // const removeFromCart = (product: ProductInfomationCount) => {
    //     setCartContent((prev: ProductInfomationCount[]) => {
    //         //避免同id 的 商品一起被清理掉，只過濾掉同id 且 同規格的商品
    //         let newList = prev.filter(ele => {
    //             if (ele.productId === product.productId && ele.selectSize === product.selectSize) {
    //                 return false
    //             }
    //             return true
    //         })
    //         return newList
    //     })
    // }
    // //ele.productId !== product.productId ||(ele.productId===product.productId &&ele.selectSize!==product.selectSize)


    // const handleFavoriteChecked=(event: React.ChangeEvent<HTMLInputElement>,product:ProductInfomation)=>{

  
    //     //是打勾的
    //     if(event.target.checked){
    //       addToCollectionList(product)
    //     }else{
    //       removeFromCollectionList(product.productId)
    //     }
    // }


    return (
        <Container sx={{ border: "0px solid" }} maxWidth='xl'>
            <Grid container columns={8} sx={{ border: "0px solid" }} spacing={3}>
                <Grid item xs={8} sx={{ my: "15px" }}>
                    <Typography variant='h6' sx={{ fontWeight: "bold" }}>購物車</Typography>

                </Grid>
                <Grid item xs={8}>

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
                                    cartContent.length>0 &&
                                    cartContent.map((item: ProductInfomationCount, index: number) =>
                                    (
                                        <TableRow key={index}>
                                            <TableCell style={{ width: "50%" }} >
                                                <Stack spacing={"20px"} direction={"row"} alignItems="center">
                                                    <Box sx={{ my: "5px" }}>
                                                        <img src={item.product.coverImg.src} style={{ width: "100px", height: "100px", padding: 0, margin: 0 }} />
                                                    </Box>
                                                    <Stack spacing={"2px"}>
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


                                                </Stack>

                                            </TableCell>
                                            <TableCell align='center'>${item.product.price}</TableCell>
                                            <TableCell align='center'>
                                                {/*數量框 */}
                                                <Box sx={{ display: "flex", marginLeft: "30px", border: "0px solid" }}>
                                                    <RemoveIcon onClick={() => { minusProductCount(item.product.productId)  }} sx={{ ":hover": { cursor: "pointer" }, color: "#AFAFAF", border: "solid 1px", height: "30px", width: "30px", borderTopLeftRadius: "4px", borderBottomLeftRadius: "4px" }} />
                                                    <TextFieldWrapper value={item.count} size='small' inputProps={{ style: { textAlign: "center", height: "15px" } }} ></TextFieldWrapper>
                                                    <AddIcon onClick={() => { plusProductCount(item.product.productId) }} sx={{ ":hover": { cursor: "pointer" }, color: "#AFAFAF", border: "solid 1px", height: "30px", width: "30px", borderTopRightRadius: "4px", borderBottomRightRadius: "4px" }} />
                                                </Box>
                                            </TableCell>
                                            <TableCell align='center'>${item.product.price * item.count}</TableCell>
                                            <TableCell sx={{ border: "0px solid" }} align='center'>
                                                <Stack sx={{ border: "0px solid" }} alignItems="center">
                                                    <Checkbox onChange={(e)=>{}} icon={<FavoriteBorderIcon />} checkedIcon={<FavoriteIcon sx={{ color: "red" }} />} />
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
                </Grid>
                <Grid item xs={8}>
                    <Paper sx={{ border: "1px solid #d9d9d9", boxShadow: 'none' }} >
                        <Grid container columns={8}>
                            <Grid item xs={4} sx={{ borderBottom: "1px solid #d9d9d9" }}></Grid>
                            <Grid item xs={4} sx={{ borderBottom: "1px solid #d9d9d9" }}>
                                <Stack direction={"row"} justifyContent={"space-between"}>
                                    <Typography sx={{ my: "5px" }}>
                                        目前無使用優惠券
                                    </Typography>
                                    <Typography sx={{ marginRight: "30px", my: "5px", color: "#3E8FB2" }}>
                                        輸入優惠碼
                                    </Typography>
                                </Stack>
                            </Grid>
                            <Grid item xs={4}></Grid>
                            <Grid item xs={4}>
                                <Stack sx={{ my: "20px" }} direction={"row"} justifyContent={"space-between"} alignItems={"center"}>
                                    <Stack spacing={"5px"} direction={"row"} justifyContent={"space-between"} alignItems={"center"}>
                                        <Typography >
                                            總金額
                                        </Typography>
                                        <Stack direction={"row"}>
                                            <Typography>
                                                (
                                            </Typography>
                                            <Typography sx={{ color: "red", fontWeight: "bold" }} >
                                                {cartContent.length}
                                            </Typography>
                                            <Typography>
                                                個商品)
                                            </Typography>
                                        </Stack>

                                        <Typography >
                                            :
                                        </Typography>
                                        <Typography variant='h6' sx={{ color: "red", fontWeight: "bold" }} >
                                            ${countTotalPrice()}
                                        </Typography>
                                    </Stack>


                                    <Button onClick={addToCheckOutList} variant='contained' sx={{ marginRight: "30px", my: "5px" }}>
                                        前往結帳
                                    </Button>
                                </Stack>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
            </Grid>
        </Container>

    )
}

export interface ProductData {
    name: string;
    price: number;
}




// const fakeDataList: () => ProductInfomation[] = () => {
//     let list: ProductInfomation[] = []
//     for (let index = 0; index < 5; index++) {

//         list.push(fakeProductInfomation)

//     }
//     return list
// }


const TextFieldWrapper = styled(TextField)(
    {
        /*修改 focus 時外框的顏色  */
        "& .MuiOutlinedInput-root.Mui-focused": {
            "& > fieldset": {
                borderColor: "#AFAFAF"
            }
        },
        /*修改外框的弧度 */
        '& fieldset': { borderRadius: "0px" },
        maxWidth: "50px",
        height: "30px"

    })

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: "#d9d9d9",
    }

}));