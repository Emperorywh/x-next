/**
 * 认证模块 - 类型定义
 */

import { ResponseData } from "../../client";

export interface User {
	id: string;
	username: string;
	email: string;
	emailVerified: Date | null;
	phoneNumber: string;
	phoneVerified: Date | null;
	name: string | null;
	bio: string | null;
	image: string | null;
	coverImage: string | null;
	location: string | null;
	website: string | null;
	birthDate: Date;
	verified: boolean;
	protected: boolean;
	followersCount: number;
	followingCount: number;
	postsCount: number;
	likesCount: number;
	createdAt: Date;
	updatedAt: Date;
}

/**
 * 用户注册请求
 */
export interface RegisterRequest {
	username: string;
	email: string;
	phoneNumber?: string;
	password: string;
	birthDate: string;
	code: string;
}


/**
 * 注册响应
 */
export interface RegisterResponse extends ResponseData<User> {
	
}


/**
 * 用户登录请求
 */
export interface LoginRequest {
	username?: string;
	email?: string;
	phoneNumber?: string;
	password: string;
}

export interface LoginResponse extends ResponseData<User> {

}
