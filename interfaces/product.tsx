

export interface ProductInfomation {
    productId: number;
    title: string;
    price: number;
    stock: number;
    color?: string[];
    size?: string[];
    selectSize?: string;
    selectColor?: string;
    howToWash?: string;
    features?: string;
    material?: string[];
    colorDescription?: string[];
    images?: any[];
    coverImg?: any;
    variants:ProductVariant[];
}


export interface ProductInfomationCount{
    count: number
    product : ProductInfomation
}



export interface Size {
    xs: string;
    s: string;
    m: string;
    l: string;
    xl: string;
    xxl: string;
    xxxl: string;
}


export interface ProductVariant{
    variantID:number;
    color:string;
    size:string;
    stock:number;
    sku:string;
    price:number;
}