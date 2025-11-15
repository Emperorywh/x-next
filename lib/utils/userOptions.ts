import { User } from "../api/user/user.types";

/**
 * 获取登录用户的信息
 */
export function getLoginUserLocalStorageInfo(): null | User {
    let result = null;
    try {
        const storage = localStorage.getItem("LOGIN_USER");
        if (storage) {
            return JSON.parse(storage);
        }
        return result;
    } catch (error) {
        return result;
    }
}
