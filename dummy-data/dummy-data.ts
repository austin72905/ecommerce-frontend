import ProductImage from '/public/images/朋朋衛生紙商品圖.jpg'
import ProductImage1 from '/public/images/coat1.jpg'
import ProductImage2 from '/public/images/coat2.jpg'
import ProductImage3 from '/public/images/coat3.jpg'
import ProductImage4 from '/public/images/coat4.jpg'
import ProductImage5 from '/public/images/coat5.jpg'
import { ProductInfomation, ProductInfomationCount } from '@/interfaces'


const imgList = [ 
    ProductImage,
    ProductImage1,
    ProductImage2,
    ProductImage3,
    ProductImage4,
    ProductImage5
]


const getProdcctById = (productId: string | undefined): ProductInfomation | null => {
    
    const result =fakeProducts.find(product => product.productId === productId)
    if(!result){
        return null
    }
    return result
}

const getProducts = (): ProductInfomation[] => {
    return fakeProducts;
}

export { getProdcctById, getProducts,fakeProducts }

const fakeProducts: ProductInfomation[] = [
    {
        title: "超時尚流蘇几皮外套",
        productId: "26790367",
        stock: 60,
        price: 100,
        size: ["S", "M", "L", "XL", "2XL", "3XL"],
        color: ["black", "wheat", "brown"],
        colorDescription: ["黑色", "白色", "深藍色", "灰色", "深灰色", "紅色"],
        material: ["聚酯纖維", "聚氨酯纖維"],
        howToWash: "洗衣機（水溫40度）, 不可乾洗, 不可烘乾。本商品會在流汗或淋雨弄濕時，或因摩擦而染色到其他衣物上，敬請注意。",
        features: "其實我也不知道要說什麼...a 其實我也不知道要說什麼...a 其實我也不知道要說什麼...a",
        images: imgList,
        coverImg:ProductImage1

    },
    {
        title: "紫色格紋大衣",
        productId: "26790368",
        stock: 5,
        price: 598,
        size: ["S", "M", "L", "XL", "2XL"],
        color: ["black", "wheat", "purple"],
        colorDescription: ["黑色", "米色", "子色"],
        material: ["聚酯纖維", "聚氨酯纖維"],
        howToWash: "洗衣機（水溫40度）, 不可乾洗, 不可烘乾。本商品會在流汗或淋雨弄濕時，或因摩擦而染色到其他衣物上，敬請注意。",
        features: "其實我也不知道要說什麼...a 其實我也不知道要說什麼...a 其實我也不知道要說什麼...a",
        images: imgList,
        coverImg:ProductImage4

    },
    {
        title: "超質感綠色皮衣",
        productId: "13790367",
        stock: 18,
        price: 179,
        size: ["S", "M", "L", "XL", "2XL", "3XL"],
        color: ["black", "wheat", "brown"],
        colorDescription: ["黑色", "白色", "深藍色", "灰色", "深灰色", "紅色"],
        material: ["聚酯纖維", "聚氨酯纖維"],
        howToWash: "洗衣機（水溫40度）, 不可乾洗, 不可烘乾。本商品會在流汗或淋雨弄濕時，或因摩擦而染色到其他衣物上，敬請注意。",
        features: "其實我也不知道要說什麼...a 其實我也不知道要說什麼...a 其實我也不知道要說什麼...a",
        images: imgList,
        coverImg:ProductImage3

    },
    {
        title: "海島風情黑色短袖襯衫",
        productId: "33790012",
        stock: 60,
        price: 100,
        size: ["S", "M", "L", "XL"],
        color: ["black"],
        colorDescription: ["黑色"],
        material: ["聚酯纖維", "聚氨酯纖維"],
        howToWash: "洗衣機（水溫40度）, 不可乾洗, 不可烘乾。本商品會在流汗或淋雨弄濕時，或因摩擦而染色到其他衣物上，敬請注意。",
        features: "其實我也不知道要說什麼...a 其實我也不知道要說什麼...a 其實我也不知道要說什麼...a",
        images: imgList,
        coverImg:ProductImage

    },
    {
        title: "帥氣單寧",
        productId: "34690012",
        stock: 60,
        price: 799,
        size: ["S", "M", "L", "XL"],
        color: ["black","blue"],
        colorDescription: ["藍色"],
        material: ["聚酯纖維", "聚氨酯纖維"],
        howToWash: "洗衣機（水溫40度）, 不可乾洗, 不可烘乾。本商品會在流汗或淋雨弄濕時，或因摩擦而染色到其他衣物上，敬請注意。",
        features: "其實我也不知道要說什麼...a 其實我也不知道要說什麼...a 其實我也不知道要說什麼...a",
        images: imgList,
        coverImg:ProductImage5

    }
]



