import { ProductInfomation, ProductInfomationCount } from '@/interfaces';
import { create } from 'zustand'

const useCartStore = create<CartState>((set, get) => ({
    cartContent: [],
    addToCart: (product, count) => set((state) => {

        let cartcontent = [...state.cartContent];

        if (cartcontent.length === 0) {
            cartcontent.push({
                product: product,
                count: count
            })

            return {
                cartContent: cartcontent
            }
        }

        // 加入購物車
        // 比較carcontent 裡面是否已經有ProductId? 
        const item = cartcontent.find(item => item.product.productId === product.productId);

        // 有就 count +1 , 沒有就push product count :1
        if (item) {
            cartcontent.forEach(item => {
                if (item.product.productId === product.productId)
                    item.count += count;
            })
        }
        else {
            cartcontent.push({
                product: product,
                count: count
            })
        }

        return {
            cartContent: cartcontent
        }
    }),
    removeFromCart: (productId) => set((state) => {
        let cartcontent = [...state.cartContent].filter(item => item.product.productId !== productId);

        return {
            cartContent: cartcontent
        }
    }),
    minusProductCount: (productId) => set((state) => {
        let cartcontent = [...state.cartContent];

        // count = 1 刪除  count > 1 減 1
        const item = cartcontent.find(item => item.product.productId === productId);

        if (item?.count === 1) {
            //cartcontent = cartcontent.filter(item => item.product.productId !== productId);
            return {}
        } else {
            cartcontent.forEach(item => {
                if (item.product.productId === productId)
                    item.count -= 1;
            })
        }

        return {
            cartContent: cartcontent
        }
    }),
    plusProductCount: (productId) => set((state) => {
        let cartcontent = [...state.cartContent];

        cartcontent.forEach(item => {
            if (item.product.productId === productId)
                item.count += 1;
        })

        return {
            cartContent: cartcontent
        }
    }),
    countTotalPrice: () => {
        const state = get()
        let totalPrice = 0;
        state.cartContent.forEach(item => {
            totalPrice += item.product.price * item.count
        })
        return totalPrice
    }
}))


interface CartState {
    cartContent: ProductInfomationCount[] | never[]; //可能是空數組
    addToCart: (product: ProductInfomation, count: number) => void;
    removeFromCart: (productId: string) => void;
    plusProductCount: (productId: string) => void;
    minusProductCount: (productId: string) => void;
    countTotalPrice: () => number;
}


export { useCartStore }