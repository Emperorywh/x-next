/**
 * 用户信息
 */
export interface User {
    id: string;
    username: string;
    password?: string;
    email: string | null;
    emailVerified: Date | null;
    phoneNumber: string | null;
    phoneVerified: Date | null;
    name: string | null;
    bio: string | null;
    image: string | null;
    coverImage: string | null;
    location: string | null;
    website: string | null;
    birthDate: Date | null;
    verified: boolean;
    protected: boolean;
    followersCount: number;
    followingCount: number;
    postsCount: number;
    likesCount: number;
    createdAt: Date | null;
    updatedAt: Date | null;
}

/**
 * 登录响应类型
 */
export interface LoginResponse {
    user: User;
    token: string;
    refreshToken: string;
}

/**
 * 注册响应类型
 */
export interface RegisterResponse {
    user: User;
}