import { ProductInfomation, ProductInfomationCount } from '@/interfaces';
import { PersonalInfomation } from '@/pages/user/account';
import { userInfo } from 'os';
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
    },
}))


interface CartState {
    cartContent: ProductInfomationCount[] | never[]; //可能是空數組
    addToCart: (product: ProductInfomation, count: number) => void;
    removeFromCart: (productId: string) => void;
    plusProductCount: (productId: string) => void;
    minusProductCount: (productId: string) => void;
    countTotalPrice: () => number;
}

const useSubscribeListStore = create<SubscribeListState>((set, get) => ({
    subscribeList: [],
    subscribeIdList: () => {
        const state = get()
        let idList = []
        return state.subscribeList.map(item => item.productId)
    },
    addToList: (product: ProductInfomation) => set((state) => {

        let subscribeList = [...state.subscribeList];

        if (subscribeList.length === 0) {
            subscribeList.push(product)

            return {
                subscribeList: subscribeList
            }
        }

        // 加入購物車
        // 比較carcontent 裡面是否已經有ProductId? 
        const item = subscribeList.find(item => item.productId === product.productId);

        if (item) {
            return {}
        } else {
            subscribeList.push(product)
        }


        return {
            subscribeList: subscribeList,
        }
    }),
    removeFromList: (productId) => set((state) => {
        let subscribeList = [...state.subscribeList].filter(item => item.productId !== productId);

        return {
            subscribeList: subscribeList,
        }
    }),
}))


interface SubscribeListState {
    subscribeList: ProductInfomation[] | never[]; //可能是空數組
    subscribeIdList: () => string[];
    addToList: (product: ProductInfomation) => void;
    removeFromList: (productId: string) => void;
}

const useAlertMsgStore = create<AlertMsgStoreState>((set, get) => ({
    alertMsg: "",
    setAlertMsg: (msg) => set((state) => {

        return {
            alertMsg: msg
        }

    })
}))


interface AlertMsgStoreState {
    alertMsg: string;
    setAlertMsg: (msg: string) => void
}


const userUserInfoStore =create<UserInfoStore>((set, get)=>({
    userInfo:null,
    setUserInfo:(info) => set((state)=>{

        
        return {
            userInfo:info
        }
    })
}))

interface UserInfoStore{
    userInfo:PersonalInfomation | null;
    setUserInfo:(info:PersonalInfomation|null) =>void
}

export { useCartStore, useSubscribeListStore, useAlertMsgStore,userUserInfoStore }
