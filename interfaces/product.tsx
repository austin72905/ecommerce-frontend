

export interface ProductInfomation {
    productId: string;
    title: string;
    price: number;
    stock: number;
    color?: string[];
    size?: string[];
    selectSize?: string;
    howToWash?: string;
    features?: string;
    material?: string[];
    colorDescription?: string[];
    images?: any[];
    coverImg?: any;
}


export interface ProductInfomationCount extends ProductInfomation {
    count: number
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