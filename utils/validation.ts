
const validateNameBase = (username: string): string | null => {
    const regex = /^[^/$.@&#]+$/;
    if (!regex.test(username)) {
        return '無效的用戶帳號';
    }

    return null
}

const validateEmailBase = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return '無效的電子郵件地址';
    }

    return null
}

const validatePasswordBase = (password: string): string | null => {
    if (password.length < 6) {
        return '密碼長度不能少於 6 個字符';
    }
    return null;
};

const validatePhoneNumberBase = (phoneNumber: string): string | null => {

    const regex = /^\d+$/.test(phoneNumber);

    if (phoneNumber.length !== 10 || !regex) {
        return '手機號碼不合法';
    }
    return null;
};

const validateAddressBase = (address: string): string | null => {

    const regex = /^[^/$.@&#]+$/.test(address);

    if (address.length > 25 || !regex) {
        return '地址不合法 or 地址不可超過25字';
    }
    return null;
};

const validateName = checkInputPurify(validateNameBase)
const validateEmail = checkInputPurify(validateEmailBase)
const validatePassword = checkInputPurify(validatePasswordBase)
const validatePhoneNumber = checkInputPurify(validatePhoneNumberBase)
const validateAddress = checkInputPurify(validateAddressBase)

function checkInputPurify<T extends (...args: any[]) => any>(fn: T): T {
    return ((...args: Parameters<T>): ReturnType<T> => {
        console.log("打印用戶輸入...");

        //const sanitizedArgs = args.map(arg => DOMPurify.sanitize(arg));

        return fn(...args);
    }) as T;
}


export interface ValidationErrors {
    username?: string;
    email?: string;
    password?: string;
    phoneNumber?: string;
    shippingAddress?: string;
}


export { validateName, validateEmail, validatePassword, validatePhoneNumber, validateAddress }