

export interface ProductInfomation {
    productId: number;
    title: string;
    price?: number;
    discountPrice?: number;
    stock?: number;
    howToWash?: string;
    features?: string;
    material?: string[];
    colorDescription?: string[];
    images?: any[];
    coverImg?: any;
    variants:ProductVariant[];

}

export interface ProductBasic {
    productId: number;
    title: string;
    howToWash?: string;
    features?: string;
    material?: string[];
    colorDescription?: string[];
    coverImg?: any;

}

export interface ProductDynamic {
   variants:ProductVariant[];
   isFavorite?:boolean;
   productId:number;
}


export interface ProductInfomationCount{
    count: number
    product : ProductInfomation
    selectedVariant?:ProductVariant;
}


export interface ProductInfomationFavorite{
    product:ProductInfomation;
    isFavorite?:boolean;
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
    discountPrice?: number;
}