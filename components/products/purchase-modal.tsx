import { Box, Button, Card, CardActions, CardContent, CardHeader, CardMedia, Container, Fade, Grid, IconButton, Modal, Stack, styled, TextField, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { ProductInfomation, ProductVariant } from "@/interfaces";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useAlertMsgStore, useCartStore } from "@/store/store";
import { GridContainer } from "../ui/grid-container";


export default function PurchaseModal({ product, modalOpen, handleModalOpen, handleModalClose }: PurchaseModalProps) {

    const xs = 2;
    const sm = 2;
    const md = 2;
    const lg = 2;
    const columns = 8;

    const contentxs: number = columns - xs;
    const contentsm: number = columns - sm
    const contentmd: number = columns - md
    const contentlg: number = columns - lg


    const addToCart = useCartStore((state) => state.addToCart)

    const alertMsg = useAlertMsgStore(state => state.alertMsg)
    const setAlertMsg = useAlertMsgStore(state => state.setAlertMsg)

    const addProductToCart = () => {
        //console.log("selectVariant:",selectVariant)
        //檢驗是否有正確輸入顏色與尺寸
        if (product.variants) {
            if (!selectVariant) {
                setAlertMsg("請選擇顏色與尺寸")
                return
            }
        }
        addToCart({ ...product }, selectVariant, itemCount)
        setcolorVal("")
        setsizeVal("")
        handleModalClose()
        setAlertMsg("新增購物車成功")
    }

    const [itemCount, setItemCount] = useState<number>(1)

    const handleCountMinus = () => {
        setItemCount(i => {
            if (i - 1 < 0) {
                return 0
            }

            return i - 1
        })
    }

    const handleCountPlus = () => {
        setItemCount(i => {
            if (i + 1 > 10) {
                return 10
            }

            return i + 1
        })
    }

    //顏色與規格
    const groupByColor = product.variants.reduce((acc: any, variant: ProductVariant) => {

        if (!acc[variant.color]) {
            acc[variant.color] = [];
        }
        acc[variant.color].push(variant);
        return acc;
    }, {});

    const setSizeDisabled = (size: string): boolean => {

        const variantOfSelectColor: ProductVariant[] = groupByColor[colorVal]

        if (!variantOfSelectColor) {
            return false
        }
        // 有找到尺寸代表可選，所以要取反
        return !Boolean(variantOfSelectColor.find(v => v.size == size))
    }

    const setColorDisabled = (color: string): boolean => {

        const variantOfSelectSize: ProductVariant[] = groupBySize[sizeVal]

        if (!variantOfSelectSize) {
            return false
        }
        // 有找到顏色代表可選，所以要取反
        return !Boolean(variantOfSelectSize.find(v => v.color == color))
    }


    const groupBySize = product.variants.reduce((acc: any, variant: ProductVariant) => {

        if (!acc[variant.size]) {
            acc[variant.size] = [];
        }
        acc[variant.size].push(variant);
        return acc;
    }, {});



    const colors = product.variants.reduce((acc: string[], variant: ProductVariant) => {
        // 如果acc中沒有該color，則將其加入
        if (!acc.includes(variant.color)) {
            acc.push(variant.color);
        }
        return acc;
    }, []);

    const sizes = product.variants.reduce((acc: string[], variant: ProductVariant) => {
        // 如果acc中沒有該size，則將其加入
        if (!acc.includes(variant.size)) {
            acc.push(variant.size);
        }
        return acc;
    }, []);

    const [colorVal, setcolorVal] = useState("")

    const handleColor = (event: any, newColor: string) => {
        setcolorVal(newColor)
    }

    const [sizeVal, setsizeVal] = useState("")

    const handleSize = (event: any, newSize: string) => {
        setsizeVal(newSize)
    }

    const [selectVariant, setselectVariant] = useState<undefined | ProductVariant>(undefined)

    useEffect(() => {
        //console.log("color:",colorVal,"sizeval:",sizeVal)
        const selectv = product.variants.find(v => v.color === colorVal && v.size === sizeVal)
        //console.log("selectv=",selectv)
        setselectVariant(selectv)

    }, [colorVal, sizeVal])

    const ModalClose = () => {
        handleModalClose()
        setcolorVal("")
        setsizeVal("")
    }

    useEffect(() => {

        if (selectVariant) {
            if (itemCount > selectVariant.stock) {
                setItemCount(1)
            }
        } else {
            if (itemCount > product.stock) {
                setItemCount(1)
            }
        }


    }, [selectVariant])

    return (
        <Modal open={modalOpen}>
            <Fade in={modalOpen}>
                <Box sx={{
                    bgcolor: 'background.paper',
                    bottom: '0px',
                    left: '0px',

                    width: "100%",
                    position: "fixed"
                }}>
                    <Container sx={{
                        px: {
                            md: 5,
                            sm: 0,
                            xs: 0
                        }
                    }}>
                        <Card sx={{ boxShadow: "none" }}>
                            <CardHeader
                                title={<Typography variant='subtitle1' >新增購物車</Typography>}
                                action={<IconButton onClick={ModalClose} sx={{ "&:hover": { backgroundColor: "#d9d9d9" }, border: "0px solid #d9d9d9", backgroundColor: "white", boxShadow: "none", width: "30px", height: "30px" }}>
                                    <ClearOutlinedIcon />
                                </IconButton>}
                            />


                            <Grid sx={{ my: 1 }} container columns={8} rowSpacing={3} alignItems={"center"} >
                                <Grid item xs={8} md={3} sx={{ border: "0px solid black" }}>

                                    <Box sx={{ maxHeight: "300px", maxWidth: "200px", border: "0px solid black", position: "relative", left: "50%", transform: 'translateX(-50%)', }}>
                                        {product.coverImg &&
                                            <Box
                                                sx={{
                                                    position: 'relative',
                                                    width: '100%',
                                                    height: 0,
                                                    paddingBottom: '120%', // 这是根据宽高比计算的
                                                    overflow: "hidden"
                                                }}
                                            >
                                                <Image
                                                    src={product.coverImg}
                                                    alt="product information"
                                                    fill
                                                    style={{ objectFit: "cover" }}
                                                />
                                            </Box>
                                        }

                                    </Box>




                                </Grid>
                                <Grid item xs={8} md={5}>
                                    <CardContent sx={{ p: 0 }}>
                                        <Grid container alignItems={"center"} columns={columns} rowSpacing={2} sx={{ px: 1, width: "100%" }} >
                                            <Grid item xs={columns} sx={{ px: 0 }}>
                                                <Typography variant='h5' sx={{ fontWeight: "bold", mx: 0 }}>{product.title}</Typography>
                                            </Grid>
                                            {/*售價 */}
                                            <Grid item xs={columns}>
                                                <GridContainer
                                                    xs={xs} sm={sm} md={md} lg={lg} columns={columns}
                                                    alignItems="center"
                                                    title={<Typography variant='body2'>售價</Typography>}
                                                    content={
                                                        <Stack direction={"row"} sx={{ alignItems: "center" }} spacing={1}>
                                                            <Typography variant='subtitle1' sx={{ textDecoration: "line-through", color: "red" }}>${product.price}</Typography>
                                                            <Typography sx={{ fontWeight: "bold", fontSize: "24px" }}>${product.price}</Typography>
                                                        </Stack>
                                                    }
                                                />
                                            </Grid>

                                            {/*顏色 */}
                                            <Grid item xs={columns}>
                                                <GridContainer
                                                    title={<Typography variant='body2'>顏色</Typography>}
                                                    content={
                                                        <ToggleButtonGroup
                                                            value={colorVal}
                                                            onChange={handleColor}
                                                            exclusive
                                                            sx={{ border: "0px solid", width: "100%" }}
                                                        >

                                                            <Grid container columns={8} spacing={1}>
                                                                {
                                                                    product.variants
                                                                        ?
                                                                        colors.map((c: string) => (

                                                                            <Grid key={c} item xs={2} sm={2.5} md={2} lg={1}>
                                                                                <ToggleButton color="primary" disabled={setColorDisabled(c)} fullWidth size="small" disableRipple value={c}>{c}</ToggleButton>
                                                                            </Grid>

                                                                        ))
                                                                        :
                                                                        <Grid item xs={2} sm={2.5} md={2} lg={1}>
                                                                            <Stack alignItems={"center"} sx={{ border: "1px solid #d9d9d9", p: 0.5, borderRadius: "4px" }}>
                                                                                <Typography sx={{ color: "#AFAFAF" }} variant='caption'>標準</Typography>
                                                                            </Stack>
                                                                        </Grid>

                                                                }

                                                            </Grid>
                                                        </ToggleButtonGroup>
                                                    }
                                                    columns={columns}
                                                    xs={xs} sm={sm} md={md} lg={lg}
                                                    alignItems="center"
                                                />

                                            </Grid>
                                            {/*規格 */}
                                            <Grid item xs={columns}>
                                                <GridContainer
                                                    title={<Typography variant='body2'>規格</Typography>}
                                                    content={
                                                        <ToggleButtonGroup
                                                            value={sizeVal}
                                                            onChange={handleSize}
                                                            exclusive
                                                            sx={{ border: "0px solid", width: "100%" }}
                                                        >
                                                            <Grid container columns={8} spacing={1}>
                                                                {
                                                                    product.variants
                                                                        ?
                                                                        sizes.map((s, index) => (
                                                                            <Grid key={s} item xs={2} sm={2.5} md={2} lg={1}>

                                                                                <ToggleButton color="primary" disabled={setSizeDisabled(s)} fullWidth size="small" disableRipple value={s}>{s}</ToggleButton>
                                                                            </Grid>

                                                                        ))
                                                                        :

                                                                        <Grid item xs={2} sm={2.5} md={2} lg={1}>
                                                                            <Stack alignItems={"center"} sx={{ border: "1px solid #d9d9d9", p: 0.5, borderRadius: "4px" }}>
                                                                                <Typography sx={{ color: "#AFAFAF" }} variant='caption'>標準</Typography>
                                                                            </Stack>
                                                                        </Grid>

                                                                }
                                                            </Grid>
                                                        </ToggleButtonGroup>
                                                    }
                                                    columns={columns}
                                                    xs={xs} sm={sm} md={md} lg={lg}
                                                    alignItems="center"
                                                />


                                            </Grid>
                                        </Grid>
                                    </CardContent>
                                </Grid>

                            </Grid>

                            <CardActions sx={{ px: 1, my: 1 }}>
                                <Box sx={{ display: "flex", alignItems: "center", width: "50%" }}>
                                    <RemoveIcon onClick={handleCountMinus} sx={{ "&:hover": { cursor: "pointer" }, color: "#AFAFAF", border: "solid 1px", height: "30px", width: "30px", borderRadius: "4px" }} />
                                    <TextFieldWrapper value={itemCount} size='small' inputProps={{ style: { textAlign: "center" } }} ></TextFieldWrapper>
                                    <AddIcon onClick={handleCountPlus} sx={{ "&:hover": { cursor: "pointer" }, color: "#AFAFAF", border: "solid 1px", height: "30px", width: "30px", borderRadius: "4px" }} />
                                </Box>
                                <Button variant="outlined" disableRipple sx={{ flexGrow: 1 }} onClick={addProductToCart}>加入購物車</Button>
                            </CardActions>

                        </Card>


                    </Container>

                </Box>

            </Fade>

        </Modal>
    )
}

interface PurchaseModalProps {
    product: ProductInfomation;
    handleModalOpen: () => void;
    handleModalClose: () => void;
    modalOpen: boolean
}


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
        width: "100%",
        '& .MuiOutlinedInput-root': {
            '& fieldset': {
                border: 'none',
            }
        },

    })