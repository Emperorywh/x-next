/**
 * 认证模块 - 类型定义
 */

export interface User {
	id: string;
	username: string;
	name: string;
	email: string;
	phoneNumber?: string;
	avatar?: string;
	verified: boolean;
	createdAt: string;
	updatedAt: string;
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
export interface RegisterResponse {
	user: User;
	message: string;
}
