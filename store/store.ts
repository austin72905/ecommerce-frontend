import { ProductInfomation, ProductInfomationCount, ProductVariant } from '@/interfaces';
import { PersonalInfomation } from '@/pages/user/account';
import { create } from 'zustand'
import { persist, StorageValue } from 'zustand/middleware';
import { PersistStorage } from 'zustand/middleware';




// 實現 PersistStorage接口，getItem、setItem、removeItem 方法都要實現，實現細節看個人
const cartStorage: PersistStorage<ProductInfomationCount[]> = {
    getItem: (name) => {
        const item = localStorage.getItem(name);
        return item ? (JSON.parse(item) as StorageValue<ProductInfomationCount[]>) : null;
    },

    setItem: (name, value) => {
        localStorage.setItem(name, JSON.stringify(value));
    },

    removeItem: (name) => {
        localStorage.removeItem(name);
    },
}


const useCartStore = create<CartState, [['zustand/persist', ProductInfomationCount[]]]>(

    persist(
        (set, get) => ({
            cartContent: [],
            addToCart: (product, selectedVariant, count) => set((state) => {
                //console.log("selectedVariant in store:",selectedVariant)
                let cartcontent = [...state.cartContent];

                if (cartcontent.length === 0) {
                    cartcontent.push({
                        product: product,
                        count: count,
                        selectedVariant: selectedVariant
                    })

                    return {
                        cartContent: cartcontent
                    }
                }

                // 加入購物車
                // 比較carcontent 裡面是否已經有ProductId? 
                const item = cartcontent.find(item => item.product.productId === product.productId && item.selectedVariant?.variantID === selectedVariant?.variantID);

                // 有就 count +1 , 沒有就push product count :1
                if (item) {
                    cartcontent.forEach(item => {
                        if (item.product.productId === product.productId && item.selectedVariant?.variantID === selectedVariant?.variantID)
                            item.count += count;
                    })
                }
                else {
                    cartcontent.push({
                        product: product,
                        count: count,
                        selectedVariant: selectedVariant
                    })
                }

                return {
                    cartContent: cartcontent
                }
            }),
            removeFromCart: (productId, variantID) => set((state) => {
                let cartcontent = state.cartContent.filter(item => {

                    //不是要被刪除的productId 就返回 true
                    if (item.product.productId !== productId) {
                        return true
                    }

                    // 剩下要驗證被選重的id，以及選中的variantId
                    if (item.selectedVariant?.variantID === variantID) {
                        return false
                    }

                    return true
                });

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
                    return {
                        cartContent: cartcontent
                    }
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
                    if (item.product.productId === productId && item.count < 10) {
                        if (item.selectedVariant) {
                            //如果比選擇的variant 庫存少就可以+1
                            if (item.count < item.selectedVariant.stock) {
                                item.count += 1;
                            }
                        }

                    }

                })

                return {
                    cartContent: cartcontent
                }
            }),
            countTotalPrice: () => {
                const state = get()
                let totalPrice = 0;
                state.cartContent.forEach(item => {
                    if (item.selectedVariant) {
                        if (item.selectedVariant.discountPrice)
                            totalPrice += item.selectedVariant.discountPrice * item.count
                        else
                            totalPrice += item.selectedVariant.price * item.count

                    }

                })
                return totalPrice
            },
            // 新增初始化 cartContent 的函數
            initializeCart: (initialCart: ProductInfomationCount[]) => set(() => ({ cartContent: initialCart }))

        })
        ,
        {
            name: "cart-storage",
            storage: cartStorage
        }
    )



)


interface CartState {
    cartContent: ProductInfomationCount[]; //可能是空數組
    addToCart: (product: ProductInfomation, selectedVariant: ProductVariant | undefined, count: number) => void;
    removeFromCart: (productId: number, variantID: number | undefined) => void;
    plusProductCount: (productId: number) => void;
    minusProductCount: (productId: number) => void;
    countTotalPrice: () => number;
    initializeCart: (initialCart: ProductInfomationCount[]) => void;
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

        // 加入喜愛清單
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
    clearSubscribeIdList: () => set((state) => {
        return {
            subscribeList: []
        }
    })
}))


interface SubscribeListState {
    subscribeList: ProductInfomation[] | never[]; //可能是空數組
    subscribeIdList: () => number[];
    addToList: (product: ProductInfomation) => void;
    removeFromList: (productId: number) => void;
    clearSubscribeIdList: () => void;
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

const useAlertErrorMsgStore = create<AlertErrorMsgStoreState>((set, get) => ({
    alerErrortMsg: "",
    setAlertErrorMsg: (msg) => set((state) => {

        return {
            alerErrortMsg: msg
        }

    })
}))


interface AlertErrorMsgStoreState {
    alerErrortMsg: string;
    setAlertErrorMsg: (msg: string) => void
}


const userUserInfoStore = create<UserInfoStore>((set, get) => ({
    userInfo: null,
    setUserInfo: (info) => set((state) => {


        return {
            userInfo: info
        }
    })
}))

interface UserInfoStore {
    userInfo: PersonalInfomation | null;
    setUserInfo: (info: PersonalInfomation | null) => void
}


const useCsrfTokenStore = create<CsrfTokenStore>((set, get) => ({
    csrfToken: null,
    setCsrfToken: (token) => set((state) => {
        return {
            csrfToken: token
        }
    })
}))


interface CsrfTokenStore {
    csrfToken: string | null;
    setCsrfToken: (token: string | null) => void
}

const useFirstVisitProductPageStore = create<FirstVisitProductPageStore>((set, get) => ({
    hasVisited: false,
    sethasVisited: () => set((state) => {
        return {
            hasVisited: true
        }
    })
}))

interface FirstVisitProductPageStore {
    hasVisited: boolean;
    sethasVisited: () => void
}



export { useCartStore, useSubscribeListStore, useAlertMsgStore, useAlertErrorMsgStore, userUserInfoStore, useCsrfTokenStore,useFirstVisitProductPageStore }
